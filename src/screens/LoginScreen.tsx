import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';

// Traduit les codes d'erreur Firebase en messages clairs et compréhensibles
const getErrorMessage = (code: string) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Mot de passe incorrect. Vérifiez et réessayez.';
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cet email.';
    case 'auth/invalid-email':
      return "Format d'email invalide.";
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez dans quelques minutes.';
    case 'auth/network-request-failed':
      return 'Problème de connexion internet.';
    default:
      return "Une erreur s'est produite. Réessayez.";
  }
};

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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
      Alert.alert('Connexion échouée', getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email requis', "Entrez votre email dans le champ ci-dessus, puis appuyez sur 'Mot de passe oublié'.");
      return;
    }
    setResetLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Email envoyé',
        `Un lien de réinitialisation a été envoyé à ${email}. Vérifiez votre boîte mail (et vos spams).`
      );
    } catch (error: any) {
      Alert.alert('Erreur', getErrorMessage(error.code));
    } finally {
      setResetLoading(false);
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

      <TouchableOpacity onPress={handleForgotPassword} disabled={resetLoading} style={styles.forgotBtn}>
        {resetLoading
          ? <ActivityIndicator color="#FF0000" size="small" />
          : <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        }
      </TouchableOpacity>

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
  forgotBtn: { alignItems: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#FF0000', fontSize: 14, fontWeight: '600' },
  btn: {
    backgroundColor: '#FF0000', padding: 18,
    borderRadius: 25, alignItems: 'center', elevation: 3
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
});
