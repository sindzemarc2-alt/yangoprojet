import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Traduit les codes d'erreur Firebase en messages clairs et compréhensibles
const getErrorMessage = (code: string) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Un compte existe déjà avec cet email. Connectez-vous plutôt.';
    case 'auth/invalid-email':
      return "Format d'email invalide.";
    case 'auth/weak-password':
      return 'Mot de passe trop faible (6 caractères minimum).';
    case 'auth/network-request-failed':
      return 'Problème de connexion internet.';
    default:
      return "Une erreur s'est produite. Réessayez.";
  }
};

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
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      await firestore().collection('chauffeurs').doc(user.uid).set({
        uid: user.uid,
        nom,
        email,
        statut: 'actif',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      navigation.replace('Main');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Compte existant',
          'Un compte existe déjà avec cet email.',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        Alert.alert('Inscription échouée', getErrorMessage(error.code));
      }
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
