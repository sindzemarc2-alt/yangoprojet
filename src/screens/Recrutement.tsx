import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, Alert, SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';

export default function Recrutement({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '', phone: '', email: '', 
    experience: '', ancien: '', formation: false
  });

  const nextStep = () => {
    if (step === 1 && (!formData.nom || !formData.phone)) {
      return Alert.alert('Attention', 'Veuillez remplir vos informations de contact.');
    }
    setStep(step + 1);
  };

  const submitApplication = () => {
    if (!accepted) return Alert.alert('Erreur', 'Vous devez accepter notre Charte de Sécurité et de Service.');
    Alert.alert('Candidature transmise', 'Yango+Secours a bien reçu votre dossier. Nos services vous contacteront pour une évaluation.');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.headerTitle}>Recrutement</Text>
          <Text style={styles.stepIndicator}>Étape {step} sur 4</Text>

          {/* ÉTAPE 1 : Identité */}
          {step === 1 && (
            <View>
              <Text style={styles.label}>Informations de Contact</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Nom et Prénoms (ex: Jean Essomba)" 
                placeholderTextColor="#888"
                onChangeText={(t) => setFormData({...formData, nom: t})} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Téléphone WhatsApp (ex: 677000000)" 
                placeholderTextColor="#888"
                keyboardType="phone-pad" 
                onChangeText={(t) => setFormData({...formData, phone: t})} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Adresse Email (ex: chauffeur@exemple.com)" 
                placeholderTextColor="#888"
                keyboardType="email-address" 
                onChangeText={(t) => setFormData({...formData, email: t})} 
              />
            </View>
          )}

          {/* ÉTAPE 2 : Expérience */}
          {step === 2 && (
            <View>
              <Text style={styles.label}>Profil Professionnel</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre d'années de conduite (ex: 5)" 
                placeholderTextColor="#888"
                keyboardType="numeric" 
                onChangeText={(t) => setFormData({...formData, experience: t})} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Type de transport déjà exercé (ex: Taxi, Privé)" 
                placeholderTextColor="#888"
                onChangeText={(t) => setFormData({...formData, ancien: t})} 
              />
            </View>
          )}

          {/* ÉTAPE 3 : Formation */}
          {step === 3 && (
            <View>
              <Text style={styles.label}>Engagement Formation</Text>
              <Text style={styles.helper}>Yango+Secours exige une formation de 2 jours sur nos standards de sécurité et de relation client. Êtes-vous disponible ?</Text>
              <TouchableOpacity style={styles.checkbox} onPress={() => setFormData({...formData, formation: !formData.formation})}>
                 <Text>{formData.formation ? "✅ Oui, je suis disponible" : "⬜ Non précisé"}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ÉTAPE 4 : Charte */}
          {step === 4 && (
            <View>
              <Text style={styles.label}>Charte de Sécurité & Intégrité</Text>
              <Text style={styles.disclaimer}>
                En soumettant cette candidature, vous certifiez votre volonté de respecter strictement nos standards.
                Tout candidat est soumis à un contrôle de moralité. La sécurité de nos clients et la qualité
                de votre service sont nos seules priorités.
              </Text>
              <TouchableOpacity style={styles.checkbox} onPress={() => setAccepted(!accepted)}>
                <Text style={{fontWeight: 'bold'}}>{accepted ? "✅ J'accepte la Charte" : "⬜ J'accepte la Charte"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Pied de page navigation - Sorti du ScrollView pour garantir la réactivité tactile */}
        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backBtnText}>Retour</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.nextBtn, { flex: step > 1 ? 0.7 : 1 }]} 
            onPress={step === 4 ? submitApplication : nextStep}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>{step === 4 ? 'Envoyer Dossier' : 'Suivant'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { padding: 20, paddingBottom: 100, flexGrow: 1 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#FF0000', marginTop: 20 },
  stepIndicator: { fontSize: 16, color: '#FF0000', marginBottom: 30, fontWeight: '600' },
  label: { fontSize: 22, fontWeight: '800', marginBottom: 20, color: '#FF0000' },
  input: { 
    backgroundColor: '#F5F5F5', padding: 18, borderRadius: 12, marginBottom: 15, 
    borderWidth: 1, borderColor: '#DDD', color: '#888' 
  },
  disclaimer: { fontSize: 14, color: '#333', marginBottom: 20, lineHeight: 22, backgroundColor: '#fff', padding: 15, borderRadius: 10 },
  checkbox: { padding: 18, backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center', marginBottom: 20, borderWidth: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
  backBtn: { padding: 20, backgroundColor: '#EEE', borderRadius: 12, justifyContent: 'center', marginRight: 10 },
  backBtnText: { color: '#FF0000', fontWeight: 'bold' },
  nextBtn: { padding: 20, backgroundColor: '#FF0000', borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  helper: { color: '#000', fontSize: 16, marginBottom: 20, lineHeight: 22 }
});