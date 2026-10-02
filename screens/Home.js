import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';

export default function Home({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('usuario');
  const [cargando, setCargando] = useState(true);
  const [totalInstitutos, setTotalInstitutos] = useState(0);
  const [totalLocalidades, setTotalLocalidades] = useState(0);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const snap = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
        if (snap.exists()) {
          setNombre(snap.data().nombre ?? '');
          setRol(snap.data().rol ?? 'usuario');
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();

    const unsub = onSnapshot(
    collection(db, 'institutos'),
    (snapshot) => {
      const lista = snapshot.docs.map((d) => d.data());
      setTotalInstitutos(lista.length);
      const localidades = new Set(lista.map((i) => i.localidad).filter(Boolean));
      setTotalLocalidades(localidades.size);
    },
    (error) => {
      if (error.code === 'permission-denied') return;
      console.error('Error al leer institutos:', error);
  }
);
    return unsub;
  }, []);

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="rgb(41, 61, 85)" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/LOGOCEPED.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.greeting}>Hola de nuevo,</Text>
      <Text style={styles.name}>{nombre || 'bienvenido/a'}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalInstitutos}</Text>
          <Text style={styles.statLabel}>Institutos afiliados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalLocalidades}</Text>
          <Text style={styles.statLabel}>Localidades cubiertas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acceso rapido</Text>
      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Afiliados')}>
          <FontAwesome name="building" size={20} color="rgb(41, 61, 85)" />
          <Text style={styles.quickText}>Afiliados</Text>
        </TouchableOpacity>

        {rol === 'admin' && (
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.getParent()?.navigate('FormularioInstituto')}>
            <FontAwesome name="plus-circle" size={20} color="rgb(41, 61, 85)" />
            <Text style={styles.quickText}>Agregar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Perfil')}>
          <FontAwesome name="user" size={20} color="rgb(41, 61, 85)" />
          <Text style={styles.quickText}>Mi perfil</Text>
        </TouchableOpacity>
      </View>

            <View style={styles.missionCard}>
        <Text style={styles.sectionTitle}>Nuestra mision</Text>
        <Text style={styles.mission}>
          Nucleamos a institutos privados de educación a distancia de Salta. Promovemos, coordinamos, representamos y defendemos los intereses comunes de los mismos, fomentando la calidad y el reconocimiento de la educación a distancia como una opción educativa válida.
        </Text>
      </View>

      <View style={styles.missionCard}>
        <Text style={styles.sectionTitle}>Nuestra vision</Text>
        <Text style={styles.mission}>
          Lograr el reconocimiento público de la red como referente del sector, organizando un Congreso Internacional de Educación a Distancia e impulsando la incorporación de todos los institutos privados de la provincia de Salta a la asociación.
        </Text>
      </View>

      <View style={styles.missionCard}>
        <Text style={styles.sectionTitle}>Beneficios de ser socio</Text>
        {[
          'Representación gremial ante autoridades educativas',
          'Acceso a congresos, jornadas y capacitaciones',
          'Intercambio con otras instituciones del sector',
          'Novedades normativas y de buenas prácticas',
        ].map((beneficio) => (
          <View key={beneficio} style={styles.benefitRow}>
            <FontAwesome name="check-circle" size={14} color="#D2AE6D" />
            <Text style={styles.benefitText}>  {beneficio}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FA' },
  container: { flexGrow: 1, padding: 24, paddingTop: 50, backgroundColor: '#F4F6FA' },
  logo: { width: '70%', height: 70, alignSelf: 'center', marginBottom: 16 },
  greeting: { fontSize: 15, color: '#5B6579', textAlign: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', color: 'rgb(41, 61, 85)', textAlign: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED',
    paddingVertical: 16, alignItems: 'center',
  },
  statNumber: { fontSize: 26, fontWeight: 'bold', color: '#D2AE6D' },
  statLabel: { fontSize: 12, color: '#5B6579', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginBottom: 10 },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 26 },
  quickBtn: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED',
    paddingVertical: 16, alignItems: 'center', gap: 6,
  },
  quickText: { fontSize: 12, fontWeight: 'bold', color: 'rgb(41, 61, 85)' },
  missionCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED', padding: 16, marginBottom: 20 },
  mission: { fontSize: 14, color: '#1A2233', lineHeight: 21 },
    benefitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    benefitText: { fontSize: 14, color: '#1A2233' },
});