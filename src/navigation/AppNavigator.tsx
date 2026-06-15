import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ChauffeurDashboard from '../screens/ChauffeurDashboard';
import Recrutement from '../screens/Recrutement';
import SOSScreen from '../screens/SOSScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChauffeurDashboard" component={ChauffeurDashboard} />
        <Stack.Screen name="Recrutement" component={Recrutement} />
        <Stack.Screen name="SOS" component={SOSScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
