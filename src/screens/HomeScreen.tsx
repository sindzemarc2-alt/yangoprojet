import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🚗📞</Text>
      <Text style={styles.title}>Yango+Secours</Text>

      <TouchableOpacity style={styles.btnDriver} onPress={() => navigation.navigate('ChauffeurDashboard')}>
        <Text style={styles.btnTextWhite}>Accès Chauffeur</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnRecruit} onPress={() => navigation.navigate('Recrutement')}>
        <Text style={styles.btnTextBlack}>Recrutement</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: '900', color: '#000', marginBottom: 50 },
  btnDriver: { backgroundColor: '#000', padding: 15, borderRadius: 25, width: '80%', alignItems: 'center', marginBottom: 15 },
  btnRecruit: { backgroundColor: '#FFF', padding: 15, borderRadius: 25, width: '80%', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  btnTextWhite: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  btnTextBlack: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});