import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Connexion échouée', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Yango Chauffeur</Text>
      <Text style={styles.subtitle}>Connectez-vous pour commencer</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.btnText}>SE CONNECTER</Text>
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{color: '#FF0000', textAlign: 'center', marginTop: 20, fontSize: 15}}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', padding: 30 },
  title: { fontSize: 28, fontWeight: '900', color: '#FF0000', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: {
    borderWidth: 1, borderColor: '#DDD', borderRadius: 12,
    padding: 15, fontSize: 16, color: '#000',
    marginBottom: 15, backgroundColor: '#F9F9F9'
  },
  btn: {
    backgroundColor: '#FF0000', padding: 18,
    borderRadius: 25, alignItems: 'center', elevation: 3
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
});
