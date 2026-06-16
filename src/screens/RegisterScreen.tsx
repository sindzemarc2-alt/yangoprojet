import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function RegisterScreen({ navigation }: any) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nom || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      // Crée le profil chauffeur dans Firestore
      await firestore().collection('chauffeurs').doc(user.uid).set({
        uid: user.uid,
        nom,
        email,
        statut: 'actif',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Inscription échouée', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Yango Chauffeur</Text>
      <Text style={styles.subtitle}>Créer votre compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        placeholderTextColor="#999"
        value={nom}
        onChangeText={setNom}
      />
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

      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.btnText}>S'INSCRIRE</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
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
    borderRadius: 25, alignItems: 'center', elevation: 3, marginBottom: 20
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  linkText: { color: '#FF0000', textAlign: 'center', fontSize: 15 },
});
