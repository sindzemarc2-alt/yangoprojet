import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

export default function CustomDrawer(props: any) {
  const user = auth().currentUser;
  const email = user?.email || '';

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter', style: 'destructive',
        onPress: async () => {
          await auth().signOut();
          props.navigation.replace('Login');
        }
      }
    ]);
  };

  const menuItems = [
    { label: '🏠  Accueil',        screen: 'ChauffeurDashboard' },
    { label: '📦  Commandes',      screen: 'Commandes' },
    { label: '📋  Historique',     screen: 'Historique' },
    { label: '💰  Mes Gains',      screen: 'Gains' },
    { label: '👤  Mon Profil',     screen: 'Profil' },
    { label: '🆘  SOS Urgence',    screen: 'SOS' },
    { label: '📝  Recrutement',    screen: 'Recrutement' },
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {email ? email[0].toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.emailText} numberOfLines={1}>{email}</Text>
        <Text style={styles.roleText}>🚗 Chauffeur Yango</Text>
      </View>

      {/* MENU ITEMS */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              props.state?.routeNames[props.state.index] === item.screen && styles.menuItemActive
            ]}
            onPress={() => props.navigation.navigate(item.screen)}
          >
            <Text style={[
              styles.menuText,
              props.state?.routeNames[props.state.index] === item.screen && styles.menuTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DÉCONNEXION */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪  Se déconnecter</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    backgroundColor: '#FF0000',
    padding: 25,
    paddingTop: 50,
    marginBottom: 10,
  },
  avatar: {
    width: 65, height: 65, borderRadius: 33,
    backgroundColor: '#FFF', justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: '900', color: '#FF0000' },
  emailText: { color: '#FFF', fontSize: 13, opacity: 0.9 },
  roleText: { color: '#FFF', fontSize: 12, marginTop: 4, opacity: 0.75 },
  menu: { paddingHorizontal: 10, paddingTop: 10 },
  menuItem: {
    paddingVertical: 14, paddingHorizontal: 15,
    borderRadius: 10, marginBottom: 5,
  },
  menuItemActive: { backgroundColor: '#FFF0F0' },
  menuText: { fontSize: 15, color: '#333', fontWeight: '500' },
  menuTextActive: { color: '#FF0000', fontWeight: '700' },
  logoutBtn: {
    margin: 15, padding: 15, borderRadius: 25,
    borderWidth: 2, borderColor: '#FF0000', alignItems: 'center',
    marginTop: 20,
  },
  logoutText: { color: '#FF0000', fontWeight: 'bold', fontSize: 15 },
});
