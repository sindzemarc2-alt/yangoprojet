import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function CommandesScreen() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = auth().currentUser?.uid;

  useEffect(() => {
    const unsub = firestore()
      .collection('courses')
      .where('status', '==', 'en_attente')
      .onSnapshot(snap => {
        setCommandes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
    return unsub;
  }, []);

  const accepter = async (id: string) => {
    try {
      await firestore().collection('courses').doc(id).update({ status: 'acceptee', driverId: uid });
      Alert.alert('✅', 'Course acceptée !');
    } catch { Alert.alert('Erreur', 'Impossible d\'accepter.'); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF0000" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Commandes disponibles</Text></View>
      {commandes.length === 0
        ? <View style={styles.center}><Text style={styles.empty}>Aucune commande en attente</Text></View>
        : <FlatList
            data={commandes}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.client}>{item.clientName || 'Client'}</Text>
                <Text style={styles.pickup}>📍 {item.pickup || 'Non défini'}</Text>
                <Text style={styles.price}>{item.price || '0'} FCFA</Text>
                <TouchableOpacity style={styles.acceptBtn} onPress={() => accepter(item.id)}>
                  <Text style={styles.acceptText}>ACCEPTER</Text>
                </TouchableOpacity>
              </View>
            )}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FF0000', padding: 20, paddingTop: 50 },
  title: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  empty: { color: '#999', fontSize: 16 },
  card: { backgroundColor: '#FFF', margin: 10, padding: 15, borderRadius: 12, elevation: 2 },
  client: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  pickup: { color: '#666', fontSize: 14, marginBottom: 5 },
  price: { color: '#FF0000', fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  acceptBtn: { backgroundColor: '#FF0000', padding: 12, borderRadius: 20, alignItems: 'center' },
  acceptText: { color: '#FFF', fontWeight: 'bold' },
});
