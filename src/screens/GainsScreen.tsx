import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function GainsScreen() {
  const [total, setTotal] = useState(0);
  const [nbCourses, setNbCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const uid = auth().currentUser?.uid;

  useEffect(() => {
    const unsub = firestore()
      .collection('courses')
      .where('driverId', '==', uid)
      .where('status', '==', 'termine')
      .onSnapshot(snap => {
        let sum = 0;
        snap.forEach(doc => { sum += doc.data().amount || 0; });
        setTotal(sum);
        setNbCourses(snap.size);
        setLoading(false);
      });
    return unsub;
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF0000" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Mes Gains</Text></View>
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total gagné</Text>
          <Text style={styles.cardValue}>{total} FCFA</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Courses terminées</Text>
          <Text style={styles.cardValue}>{nbCourses}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Moyenne par course</Text>
          <Text style={styles.cardValue}>{nbCourses > 0 ? Math.round(total / nbCourses) : 0} FCFA</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FF0000', padding: 20, paddingTop: 50 },
  title: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  body: { padding: 20 },
  card: { backgroundColor: '#FFF', padding: 25, borderRadius: 15, marginBottom: 15, elevation: 3, alignItems: 'center' },
  cardLabel: { color: '#666', fontSize: 14, marginBottom: 8 },
  cardValue: { color: '#FF0000', fontSize: 28, fontWeight: '900' },
});
