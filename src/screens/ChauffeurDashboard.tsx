import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, Alert, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';

export default function ChauffeurDashboard({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(true);
  const [timer, setTimer] = useState(14400); // 4 heures en secondes
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [revenue, setRevenue] = useState<number | null>(null); // Null indique qu'aucune donnée n'est encore chargée

  useEffect(() => {
    // Timer séparé pour éviter de relancer les listeners Firebase chaque seconde
    let interval: any;
    if (isOnline && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isOnline, timer]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
    };

    requestLocationPermission();

    // Suivi GPS du chauffeur (Toutes les 10m ou changement de position)
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDriverLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );

    // Écoute des nouvelles courses sur Firestore
    const unsubscribe = firestore()
      .collection('courses')
      .where('status', '==', 'en_attente')
      .onSnapshot(querySnapshot => {
        if (!isOnline) return;
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            setCurrentOrder({ id: change.doc.id, ...change.doc.data() });
            setShowOrderModal(true);
          }
        });
      }, error => {
        console.log("Erreur Firestore: ", error);
      });

    // Écoute des revenus réels (somme des courses terminées pour ce chauffeur)
    const unsubscribeRevenue = firestore()
      .collection('courses')
      .where('driverId', '==', 'CHAUFFEUR_CONNECTE_ID') 
      .where('status', '==', 'termine')
      .onSnapshot(querySnapshot => {
        let total = 0;
        querySnapshot.forEach(doc => {
          total += doc.data().amount || 0;
        });
        setRevenue(total);
      }, error => console.log("Erreur revenus: ", error));

    return () => {
      unsubscribe();
      unsubscribeRevenue();
      Geolocation.clearWatch(watchId);
    };
  }, [isOnline]);

  const acceptOrder = async () => {
    if (!currentOrder) return;
    
    try {
      // Mise à jour dans Firebase : le client reçoit l'info en temps réel
      await firestore().collection('courses').doc(currentOrder.id).update({
        status: 'acceptee',
        driverId: 'CHAUFFEUR_CONNECTE_ID', // Remplace par l'id réel
      });
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accepter la course.");
    }

    setShowOrderModal(false);
    Alert.alert("Course Acceptée", "L'itinéraire vers le client est affiché sur la carte.");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <TouchableOpacity 
            onPress={() => setIsOnline(!isOnline)}
            style={[styles.statusBadge, { backgroundColor: isOnline ? '#2ecc71' : '#333' }]}
          >
            <Text style={styles.statusValue}>
              {isOnline ? '● EN LIGNE' : '○ HORS LIGNE'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.weatherText}>Yaoundé: 26°C, Nuageux</Text>
        </View>
        <View style={styles.soldeContainer}>
          <Text style={styles.soldeLabel}>Revenus</Text>
          <Text style={styles.soldeValue}>{revenue !== null ? `${revenue} F` : '0 F'}</Text>
        </View>
      </View>

      {/* TIMER */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Temps avant pause obligatoire</Text>
        <Text style={styles.timerValue}>{formatTime(timer)}</Text>
      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          region={driverLocation}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: 3.8480,
            longitude: 11.5021,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {currentOrder && currentOrder.coords && (
            <Marker 
              coordinate={{ latitude: currentOrder.coords.lat, longitude: currentOrder.coords.lng }}
              title="Client"
              description={currentOrder.pickup}
            />
          )}
        </MapView>
      </View>

      {/* MODAL RÉCEPTION COMMANDE */}
      <Modal visible={showOrderModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderBadge}>NOUVELLE COURSE</Text>
              <Text style={styles.orderPrice}>{currentOrder?.price}</Text>
            </View>
            
            <Text style={styles.clientName}>{currentOrder?.clientName}</Text>
            <Text style={styles.pickupPoint}>📍 {currentOrder?.pickup}</Text>
            
            <View style={styles.orderActions}>
              <TouchableOpacity 
                style={styles.declineBtn} 
                onPress={() => setShowOrderModal(false)}
              >
                <Text style={styles.declineText}>Ignorer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={acceptOrder}>
                <Text style={styles.acceptText}>ACCEPTER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* BOUTON SOS */}
      <TouchableOpacity 
        style={styles.sosButton} 
        onPress={() => navigation.navigate('SOS')}
        activeOpacity={0.8}
      >
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 25, backgroundColor: '#FF0000', flexDirection: 'row', justifyContent: 'space-between' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusValue: { fontSize: 13, fontWeight: '900', color: '#FFF' },
  weatherText: { color: '#FFF', fontSize: 14, marginTop: 8, opacity: 0.9 },
  soldeContainer: { alignItems: 'flex-end' },
  soldeLabel: { color: '#FFF', fontSize: 12, opacity: 0.8 },
  soldeValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  timerContainer: { padding: 20, backgroundColor: '#F8F8F8', alignItems: 'center' },
  timerLabel: { color: '#555', fontSize: 14 },
  timerValue: { fontSize: 24, fontWeight: '900', color: '#000', marginTop: 5 },
  mapContainer: { flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  orderCard: { backgroundColor: '#FFF', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderBadge: { backgroundColor: '#FF0000', color: '#FFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, fontWeight: 'bold', fontSize: 12 },
  orderPrice: { fontSize: 24, fontWeight: '900', color: '#2ecc71' },
  clientName: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  pickupPoint: { fontSize: 16, color: '#666', marginTop: 10, marginBottom: 25 },
  orderActions: { flexDirection: 'row', justifyContent: 'space-between' },
  declineBtn: { padding: 18, borderRadius: 15, width: '30%', alignItems: 'center', backgroundColor: '#F5F5F5' },
  declineText: { color: '#666', fontWeight: 'bold' },
  acceptBtn: { padding: 18, borderRadius: 15, width: '65%', alignItems: 'center', backgroundColor: '#FF0000' },
  acceptText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  sosButton: { 
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#FF0000', 
    width: 70, height: 70, borderRadius: 35, justifyContent: 'center', 
    alignItems: 'center', elevation: 10, zIndex: 999, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 
  },
  sosText: { color: '#FFF', fontWeight: '900', fontSize: 18 }
});