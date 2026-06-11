import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function SOSScreen() {

  // Vérification automatique des permissions au chargement
  useEffect(() => {
    check(PERMISSIONS.ANDROID.CAMERA).then((result) => {
      if (result !== RESULTS.GRANTED) {
        request(PERMISSIONS.ANDROID.CAMERA);
      }
    });
  }, []);

  const handleRecordVideo = () => {
    launchCamera({ mediaType: 'video', videoQuality: 'medium' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert("Erreur", "Impossible d'accéder à la caméra.");
      } else {
        Alert.alert("Succès", "Vidéo enregistrée avec succès.");
      }
    });
  };

  const guides = [
    { title: 'Malaise Cardiaque', info: 'Asseoir la victime, desserrer les habits, alerter immédiat.' },
    { title: 'AVC', info: 'Parler, lever les bras, observer visage, ne pas faire boire.' },
    { title: 'Hémorragie', info: 'Surélever les jambes, couvrir, compression directe.' },
    { title: 'Perte Connaissance', info: 'Position latérale, vérifier respiration, ne pas secouer.' },
    { title: 'Étouffement', info: '5 claques dans le dos, Heimlich si échec, surveiller.' },
    { title: 'Brûlures Graves', info: 'Arroser à l\'eau, ne pas percer cloques, couvrir tissu propre.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>YAOUNDÉ SECOURS</Text>
      <Text style={styles.subTitle}>Guide SOS Chauffeur</Text>

      {/* SECTION GUIDES - Gardée intacte */}
      <View style={styles.grid}>
        {guides.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title.toUpperCase()}</Text>
            <Text style={styles.cardInfo}>{item.info}</Text>
          </View>
        ))}
      </View>

      {/* SECTION VIDÉO - Ajoutée sans supprimer le reste */}
      <View style={styles.videoSection}>
        <Text style={styles.videoTitle}>📸 PREUVE VIDÉO</Text>
        <TouchableOpacity style={styles.recordBtn} onPress={handleRecordVideo}>
          <Text style={styles.recordBtnText}>FILMER LA SCÈNE</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION HÔPITAL - Gardée intacte */}
      <View style={styles.hospitalCard}>
        <Text style={styles.hTitle}>HÔPITAL LE PLUS PROCHE</Text>
        <Text style={styles.hName}>Hôpital Central de Yaoundé</Text>
        <Text style={styles.hDist}>À 2.1 km de votre position</Text>
      </View>

      <TouchableOpacity style={styles.sosButton} onPress={() => Alert.alert("ALERTE", "Position transmise.")}>
        <Text style={styles.sosButtonText}>LANCER L'ALERTE SOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: '900', textAlign: 'center', marginTop: 20 },
  subTitle: { color: '#AAA', textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#111', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  cardTitle: { color: '#FFD700', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  cardInfo: { color: '#FFF', fontSize: 11 },
  videoSection: { backgroundColor: '#111', padding: 20, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#FFD700' },
  videoTitle: { color: '#FFD700', fontWeight: 'bold', marginBottom: 10 },
  recordBtn: { backgroundColor: '#FF0000', padding: 15, borderRadius: 10, alignItems: 'center' },
  recordBtnText: { color: '#FFF', fontWeight: 'bold' },
  hospitalCard: { backgroundColor: '#FFD700', padding: 15, borderRadius: 10, marginBottom: 30 },
  hTitle: { fontSize: 10, fontWeight: 'bold' },
  hName: { fontSize: 18, fontWeight: '900', marginTop: 5 },
  hDist: { fontSize: 12, marginTop: 5 },
  sosButton: { backgroundColor: '#FF0000', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 50 },
  sosButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});