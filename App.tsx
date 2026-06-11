import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importation de tous tes écrans
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChauffeurDashboard from './src/screens/ChauffeurDashboard';
import Recrutement from './src/screens/Recrutement';
import SOSScreen from './src/screens/SOSScreen';

const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        {/* Le Stack.Navigator englobe TOUS les écrans */}
        <Stack.Navigator 
          initialRouteName="Splash" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ChauffeurDashboard" component={ChauffeurDashboard} />
          <Stack.Screen name="Recrutement" component={Recrutement} />
          <Stack.Screen name="SOS" component={SOSScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;