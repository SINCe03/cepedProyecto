import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell, Search, Users, Plus, UserCircle, CalendarDays,
  Clock, ChevronRight, GraduationCap, TrendingUp, Building2,
} from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { collection, onSnapshot, doc, getDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const formatFecha = (timestamp) => {
  if (!timestamp?.toDate) return '';
  const d = timestamp.toDate();
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

export default function Home({ navigation }) {
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState(null);
  const [rol, setRol] = useState('usuario');
  const [cargando, setCargando] = useState(true);
  const [totalInstitutos, setTotalInstitutos] = useState(0);
  const [totalLocalidades, setTotalLocalidades] = useState(0);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const snap = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
        if (snap.exists()) {
          setNombre(snap.data().nombre ?? '');
          setRol(snap.data().rol ?? 'usuario');
          setFoto(snap.data().foto ?? null);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();

      const unsubInstitutos = onSnapshot(
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

    const qEventos = query(
      collection(db, 'eventos'),
      where('fecha', '>=', Timestamp.now()),
      orderBy('fecha'),
      limit(3)
    );
    const unsubEventos = onSnapshot(
      qEventos,
      (snapshot) => {
      setEventos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        if (error.code === 'permission-denied') return;
        console.error('Error al leer eventos:', error);
      }
    );

    return () => {
      unsubInstitutos();
      unsubEventos();
    };
  }, []);

  const avisoProximamente = () => {
    Toast.show({ type: 'success', text1: 'Próximamente', text2: 'Esta sección todavía está en construcción.' });
  };

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="rgb(41, 61, 85)" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Image source={require('../assets/logo.jpg')} style={styles.headerLogo} resizeMode="contain" />
          </View>
          <View>
            <Text style={styles.headerTitle}>CePED</Text>
            <Text style={styles.headerSubtitle}>Gestión educativa</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={avisoProximamente} style={styles.bellBtn}>
            <Bell size={18} color="rgb(41, 61, 85)" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.avatarBtn}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarInitial}>{(nombre || '?').trim().charAt(0).toUpperCase()}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

        <LinearGradient
        colors={['rgb(41, 61, 85)', 'rgb(58, 86, 120)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <GraduationCap size={120} color="rgba(255,255,255,0.10)" style={styles.bannerIconBig} />
        <Building2 size={60} color="rgba(255,255,255,0.08)" style={styles.bannerIconSmall} />
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>BIENVENIDO</Text>
        </View>
        <Text style={styles.bannerTitle}>Gestión de Institutos Afiliados</Text>
        <Text style={styles.bannerSubtitle}>Explorá los institutos, sus carreras y mantenete al día con los próximos eventos.</Text>
      </LinearGradient>

      <Text style={styles.greeting}>Hola de nuevo,</Text>
      <Text style={styles.name}>{nombre || 'bienvenido/a'}</Text>

      <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate('Afiliados')}>
        <Search size={18} color="#8A8078" />
        <Text style={styles.searchPlaceholder}>Buscar institutos o localidades...</Text>
      </TouchableOpacity>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Resumen</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statIconBox}>
            <Building2 size={16} color="rgb(41, 61, 85)" />
          </View>
          <Text style={styles.statNumber}>{totalInstitutos}</Text>
          <Text style={styles.statLabel}>Institutos afiliados</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: '#F3E9CF' }]}>
            <TrendingUp size={16} color="rgb(210, 174, 109)" />
          </View>
          <Text style={styles.statNumber}>{totalLocalidades}</Text>
          <Text style={styles.statLabel}>Localidades cubiertas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acceso rápido</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Afiliados')}>
          <Users size={20} color="rgb(41, 61, 85)" />
          <Text style={styles.quickText}>Afiliados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickBtn} onPress={avisoProximamente}>
          <CalendarDays size={20} color="rgb(41, 61, 85)" />
          <Text style={styles.quickText}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Perfil')}>
          <UserCircle size={20} color="rgb(41, 61, 85)" />
          <Text style={styles.quickText}>Mi perfil</Text>
        </TouchableOpacity>

        {rol === 'admin' && (
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.getParent()?.navigate('FormularioInstituto')}>
            <Plus size={20} color="rgb(41, 61, 85)" />
            <Text style={styles.quickText}>Agregar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Perfil')}>
          <FontAwesome name="user" size={20} color="rgb(41, 61, 85)" />
          <Text style={styles.quickText}>Mi perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Contacto')}>
          <FontAwesome name="envelope" size={20} color="rgb(41, 61, 85)" />
          <Text style={styles.quickText}>Contacto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Próximos eventos</Text>
      </View>
      {eventos.length === 0 ? (
        <Text style={styles.emptyEventos}>No hay eventos próximos cargados.</Text>
      ) : (
        <View style={styles.eventsCard}>
          {eventos.map((evento, index) => (
            <View key={evento.id} style={[styles.eventRow, index === eventos.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.eventTimeBox}>
                <Clock size={14} color="rgb(41, 61, 85)" />
                <Text style={styles.eventTime}>{evento.hora || formatFecha(evento.fecha)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventCategoria}>{(evento.categoria || '').toUpperCase()}</Text>
                <Text style={styles.eventTitulo}>{evento.titulo}</Text>
              </View>
              <ChevronRight size={18} color="#C9CFDA" />
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={avisoProximamente}>
        <Text style={styles.calendarLink}>Consultar calendario completo</Text>
      </TouchableOpacity>

      <View style={styles.missionCard}>
        <Text style={styles.sectionTitle}>Nuestra misión</Text>
        <Text style={styles.mission}>
          Nucleamos a institutos privados de educación a distancia de Salta. Promovemos, coordinamos, representamos y defendemos los intereses comunes de los mismos, fomentando la calidad y el reconocimiento de la educación a distancia como una opción educativa válida.
        </Text>
      </View>

      <View style={styles.missionCard}>
        <Text style={styles.sectionTitle}>Nuestra visión</Text>
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
            <Text style={styles.benefitDot}>•</Text>
            <Text style={styles.benefitText}>{beneficio}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FA' },
  container: { flexGrow: 1, padding: 20, backgroundColor: '#F4F6FA' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoBadge: {
  width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', marginRight: 10,
  justifyContent: 'center', alignItems: 'center',
  shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  headerLogo: { width: 36, height: 36 },
  headerTitle: { fontSize: 15, fontWeight: 'bold', color: 'rgb(41, 61, 85)' },
  headerSubtitle: { fontSize: 11, color: '#8A8078' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDE2ED', justifyContent: 'center', alignItems: 'center' },
  avatarBtn: {
  width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgb(41, 61, 85)',
  justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  avatarImg: { width: 38, height: 38 },
  avatarInitial: { color: 'rgb(210, 174, 109)', fontWeight: 'bold', fontSize: 15 },

  banner: {
  borderRadius: 18, padding: 20, marginBottom: 20,
  overflow: 'hidden', position: 'relative',
  },
  bannerIconBig: { position: 'absolute', right: -15, top: -15 },
  bannerIconSmall: { position: 'absolute', right: 70, bottom: -10 },
  bannerBadge: { backgroundColor: 'rgb(210, 174, 109)', alignSelf: 'flex-start', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, marginBottom: 10 },
  bannerBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 6, maxWidth: '85%' },
  bannerSubtitle: { color: '#C9D3EA', fontSize: 13, lineHeight: 18, maxWidth: '90%' },

  greeting: { fontSize: 14, color: '#5B6579' },
  name: { fontSize: 19, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginBottom: 16 },

  searchBox: {
  flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25,
  borderWidth: 1, borderColor: '#DDE2ED', paddingHorizontal: 16, height: 48, marginBottom: 22,
  },
  searchPlaceholder: { marginLeft: 10, color: '#8A8078', fontSize: 14 },

  sectionHead: { marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: 'rgb(41, 61, 85)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED', padding: 14 },
  statIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#E7ECF3', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: 'rgb(41, 61, 85)' },
  statLabel: { fontSize: 11, color: '#5B6579', marginTop: 2 },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 26 },
  quickBtn: {
  width: '47%', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED',
  paddingVertical: 18, alignItems: 'center', gap: 8,
  },
  quickText: { fontSize: 12, fontWeight: 'bold', color: 'rgb(41, 61, 85)' },

  emptyEventos: { fontSize: 13, color: '#8A8078', marginBottom: 10 },
  eventsCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED', paddingHorizontal: 6 },
  eventRow: {
  flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8,
  borderBottomWidth: 1, borderBottomColor: '#F0F2F7', gap: 12,
  },
  eventTimeBox: { alignItems: 'center', width: 54 },
  eventTime: { fontSize: 11, color: 'rgb(41, 61, 85)', fontWeight: 'bold', marginTop: 2 },
  eventCategoria: { fontSize: 10, fontWeight: 'bold', color: 'rgb(210, 174, 109)', letterSpacing: 0.4 },
  eventTitulo: { fontSize: 14, color: '#1A2233', fontWeight: '600', marginTop: 2 },
  calendarLink: { textAlign: 'center', color: 'rgb(41, 61, 85)', fontWeight: 'bold', fontSize: 13, marginTop: 14, marginBottom: 26 },

  missionCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED', padding: 16, marginBottom: 14 },
  mission: { fontSize: 14, color: '#1A2233', lineHeight: 21 },
  benefitRow: { flexDirection: 'row', paddingVertical: 4, gap: 8 },
  benefitDot: { color: 'rgb(210, 174, 109)', fontSize: 16, lineHeight: 20 },
  benefitText: { fontSize: 14, color: '#1A2233', flex: 1 },
});