import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ProfilScreen({ navigation }: any) {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [vehicule, setVehicule] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const uid = auth().currentUser?.uid;
  const email = auth().currentUser?.email;

  useEffect(() => {
    if (!uid) return;
    firestore().collection('chauffeurs').doc(uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        setNom(data?.nom || '');
        setTelephone(data?.telephone || '');
        setVehicule(data?.vehicule || '');
      }
      setLoading(false);
    });
  }, [uid]);

  const handleSave = async () => {
    if (!nom) { Alert.alert('Erreur', 'Le nom est requis.'); return; }
    setSaving(true);
    try {
      await firestore().collection('chauffeurs').doc(uid).set({
        uid, nom, email, telephone, vehicule,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      Alert.alert('Succès', 'Profil mis à jour !');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter', style: 'destructive',
        onPress: async () => {
          await auth().signOut();
          navigation.replace('Login');
        }
      }
    ]);
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#FF0000" />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mon Profil</Text>
      </View>

      {/* AVATAR */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{nom ? nom[0].toUpperCase() : '?'}</Text>
        </View>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      {/* FORMULAIRE */}
      <View style={styles.form}>
        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Votre nom"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={telephone}
          onChangeText={setTelephone}
          placeholder="+237 6XX XXX XXX"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Véhicule</Text>
        <TextInput
          style={styles.input}
          value={vehicule}
          onChangeText={setVehicule}
          placeholder="Ex: Toyota Corolla - Blanc"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.saveBtnText}>ENREGISTRER</Text>
          }
        </TouchableOpacity>
      </View>

      {/* DÉCONNEXION */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FF0000', padding: 20, paddingTop: 50, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  backText: { color: '#FFF', fontSize: 16 },
  title: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  avatarContainer: { alignItems: 'center', padding: 30, backgroundColor: '#FF0000', paddingBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#FF0000' },
  emailText: { color: '#FFF', fontSize: 14, opacity: 0.9 },
  form: { padding: 25 },
  label: { fontSize: 13, color: '#666', marginBottom: 6, marginTop: 10, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#DDD', borderRadius: 12,
    padding: 15, fontSize: 16, color: '#000', backgroundColor: '#F9F9F9'
  },
  saveBtn: { backgroundColor: '#FF0000', padding: 18, borderRadius: 25, alignItems: 'center', marginTop: 25, elevation: 3 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { margin: 25, padding: 18, borderRadius: 25, alignItems: 'center', borderWidth: 2, borderColor: '#FF0000' },
  logoutText: { color: '#FF0000', fontWeight: 'bold', fontSize: 16 },
});
