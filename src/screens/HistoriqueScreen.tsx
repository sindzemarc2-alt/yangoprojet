import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function HistoriqueScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = auth().currentUser?.uid;

  useEffect(() => {
    const unsub = firestore()
      .collection('courses')
      .where('driverId', '==', uid)
      .onSnapshot(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCourses(data);
        setLoading(false);
      });
    return unsub;
  }, []);

  const statusColor = (s: string) => s === 'termine' ? '#2ecc71' : s === 'acceptee' ? '#f39c12' : '#e74c3c';
  const statusLabel = (s: string) => s === 'termine' ? 'Terminée' : s === 'acceptee' ? 'En cours' : 'En attente';

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF0000" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Historique des courses</Text></View>
      {courses.length === 0
        ? <View style={styles.center}><Text style={styles.empty}>Aucune course pour l'instant</Text></View>
        : <FlatList
            data={courses}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.client}>{item.clientName || 'Client'}</Text>
                  <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
                    <Text style={styles.badgeText}>{statusLabel(item.status)}</Text>
                  </View>
                </View>
                <Text style={styles.pickup}>📍 {item.pickup || 'Non défini'}</Text>
                <Text style={styles.amount}>{item.amount || item.price || '0'} FCFA</Text>
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  client: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  pickup: { color: '#666', fontSize: 14 },
  amount: { color: '#FF0000', fontWeight: 'bold', fontSize: 16, marginTop: 5 },
});
