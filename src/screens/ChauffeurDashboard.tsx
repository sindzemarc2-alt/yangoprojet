import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChauffeurDashboard({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(true);
  const [timer, setTimer] = useState(14400); // 4 heures en secondes

  useEffect(() => {
    if (isOnline && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isOnline, timer]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // Carte Leaflet avec style "Voyager" (Clair, Lisible, Gratuit, sans API)
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>body, #map { height: 100vh; margin: 0; background: #FFF; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Position initiale sur Yaoundé avec un zoom de 14
          var map = L.map('map').setView([3.8480, 11.5021], 14);
          
          // Style "Voyager" gratuit pour une lisibilité claire
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(map);

          // VRAI MARQUEUR MA POSITION (JAUNE)
          var marker = L.marker([3.8480, 11.5021], {
            // Personnalisation de l'icône pour la rendre plus grosse et visible (jaune Yango)
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: "<div style='background-color:#FFD700; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #FFF; box-shadow: 0 0 10px rgba(0,0,0,0.5);'></div>",
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          }).addTo(map);

          // Affiche automatiquement un popup au-dessus du marqueur
          marker.bindPopup("<b style='color:#000;'>Vous êtes ici</b>").openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.statusValue, { color: isOnline ? '#2ecc71' : '#e74c3c' }]}>
            {isOnline ? '● En ligne' : '○ Hors ligne'}
          </Text>
          <Text style={styles.weatherText}>Yaoundé: 26°C, Averses</Text>
        </View>
        <View style={styles.soldeContainer}>
          <Text style={styles.soldeLabel}>Revenus</Text>
          <Text style={styles.soldeValue}>25 000 FCFA</Text>
        </View>
      </View>

      {/* COMPTE À REBOURS */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Temps avant pause obligatoire</Text>
        <Text style={styles.timerValue}>{formatTime(timer)}</Text>
      </View>

      {/* CARTE GÉOGRAPHIQUE */}
      <View style={styles.mapContainer}>
        <WebView 
          originWhitelist={['*']}
          source={{ html: leafletHtml }} 
        />
      </View>

      {/* BOUTON SOS */}
      <TouchableOpacity 
        style={styles.sosButton} 
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 25, backgroundColor: '#000', flexDirection: 'row', justifyContent: 'space-between' },
  statusValue: { fontSize: 16, fontWeight: 'bold' },
  weatherText: { color: '#FFD700', fontSize: 14, marginTop: 5 },
  soldeContainer: { alignItems: 'flex-end' },
  soldeLabel: { color: '#AAA', fontSize: 12 },
  soldeValue: { color: '#FFD700', fontSize: 20, fontWeight: 'bold' },
  timerContainer: { padding: 20, backgroundColor: '#F8F8F8', alignItems: 'center' },
  timerLabel: { color: '#555', fontSize: 14 },
  timerValue: { fontSize: 24, fontWeight: '900', color: '#000', marginTop: 5 },
  mapContainer: { flex: 1 },
  sosButton: { 
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#FF0000', 
    width: 70, height: 70, borderRadius: 35, justifyContent: 'center', 
    alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 
  },
  sosText: { color: '#FFF', fontWeight: '900', fontSize: 18 }
});