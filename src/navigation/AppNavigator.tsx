import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChauffeurDashboard from '../screens/ChauffeurDashboard';
import ProfilScreen from '../screens/ProfilScreen';
import HistoriqueScreen from '../screens/HistoriqueScreen';
import CommandesScreen from '../screens/CommandesScreen';
import GainsScreen from '../screens/GainsScreen';
import Recrutement from '../screens/Recrutement';
import SOSScreen from '../screens/SOSScreen';
import CustomDrawer from './CustomDrawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Navigation avec menu latéral (après connexion)
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280 },
      }}
    >
      <Drawer.Screen name="ChauffeurDashboard" component={ChauffeurDashboard} />
      <Drawer.Screen name="Commandes" component={CommandesScreen} />
      <Drawer.Screen name="Historique" component={HistoriqueScreen} />
      <Drawer.Screen name="Gains" component={GainsScreen} />
      <Drawer.Screen name="Profil" component={ProfilScreen} />
      <Drawer.Screen name="SOS" component={SOSScreen} />
      <Drawer.Screen name="Recrutement" component={Recrutement} />
    </Drawer.Navigator>
  );
}

// Navigation principale (avant connexion)
export default function AppNavigator() {
  const [user, setUser] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
