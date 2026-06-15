import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    setTimeout(() => { navigation.replace('Home'); }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yango+Secours</Text>
      <ActivityIndicator size="large" color="#FF0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 36, fontWeight: '900', color: '#FF0000', marginBottom: 20 }
});