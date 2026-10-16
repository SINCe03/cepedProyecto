import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function ContactoScreen() {
  const [nombreCompleto, setNombreCompleto] = useState('Cargando...');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [asunto, setAsunto] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [listaInstitutos, setListaInstitutos] = useState([]);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Cargar datos de identidad del usuario automáticamente sin mostrarlos como inputs repetitivos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setEmailUsuario(user.email || 'Correo no disponible');
          
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNombreCompleto(`${data.nombre || ''} ${data.apellido || ''}`.trim() || 'Usuario CEPED');
          } else {
            setNombreCompleto(user.displayName || 'Usuario CEPED');
          }
        }

        // Cargar lista de institutos afiliados de Firestore
        const querySnapshot = await getDocs(collection(db, 'institutos'));
        const institutos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListaInstitutos(institutos);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const handleEnviar = () => {
    if (!mensaje.trim()) {
      Alert.alert('Atención', 'Por favor escribe el mensaje o consulta que deseas enviar.');
      return;
    }
    if (!aceptaTerminos) {
      Alert.alert('Aviso', 'Debes aceptar el uso de tus datos para continuar.');
      return;
    }

    Alert.alert('¡Enviado!', 'Tu mensaje ha sido enviado correctamente al equipo.');
    
    // Limpiar campos de consulta (los datos personales se mantienen porque son fijos del usuario)
    setAsunto('');
    setInstitucion('');
    setMensaje('');
    setAceptaTerminos(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Cabecera institucional */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Centro de Soporte</Text>
          <Text style={styles.headerSubtitle}>Estamos para ayudarte.</Text>
        </View>

        <View style={styles.cardContainer}>
          
          {/* Tarjeta de Identidad Automática (Evita repetir inputs) */}
          <View style={styles.userInfoBox}>
            <FontAwesome name="user-circle" size={28} color="#1a2e40" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{nombreCompleto}</Text>
              <Text style={styles.userEmail}>{emailUsuario}</Text>
            </View>
          </View>
          <Text style={styles.infoNote}>Tus datos personales se adjuntarán automáticamente a la solicitud.</Text>

          {/* Selector de Institución Afiliada */}
          <Text style={styles.label}>Institución u organización</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={institucion}
              onValueChange={(itemValue) => setInstitucion(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona una institución (Opcional)..." value="" color="#999" />
              {listaInstitutos.map((inst) => (
                <Picker.Item key={inst.id} label={inst.nombre || inst.titulo} value={inst.nombre || inst.titulo} />
              ))}
            </Picker>
          </View>

          {/* Asunto */}
          <Text style={styles.label}>Asunto de la consulta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Informacion de cursos, carreras, etc."
            placeholderTextColor="#999"
            value={asunto}
            onChangeText={setAsunto}
          />

          {/* Mensaje principal */}
          <Text style={styles.label}>Mensaje o Solicitud *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe aquí en detalle lo que necesitas..."
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={5}
            maxLength={1000}
            value={mensaje}
            onChangeText={setMensaje}
          />
          <Text style={styles.counterText}>Máximo 1,000 caracteres.</Text>

          {/* Términos */}
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAceptaTerminos(!aceptaTerminos)} activeOpacity={0.8}>
            <FontAwesome name={aceptaTerminos ? "check-square-o" : "square-o"} size={20} color="#1a2e40" style={{ marginRight: 10 }} />
            <Text style={styles.checkboxText}>Acepto que CEPED utilice mis datos para responder esta solicitud.</Text>
          </TouchableOpacity>

          {/* Botón de Enviar */}
          <TouchableOpacity style={styles.submitButton} onPress={handleEnviar} activeOpacity={0.8}>
            <FontAwesome name="paper-plane" size={14} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.submitButtonText}>Enviar Consulta</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  scrollContainer: { flexGrow: 1, paddingBottom: 40 },
  header: { backgroundColor: '#1a2e40', paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerBrand: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', letterSpacing: 1.5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 5 },
  headerSubtitle: { fontSize: 13, color: '#b0bec5', marginTop: 2 },
  cardContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginHorizontal: 16, marginTop: -15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  userInfoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f4f8', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#d9e2ec' },
  userName: { fontSize: 14, fontWeight: 'bold', color: '#1a2e40' },
  userEmail: { fontSize: 12, color: '#627d98', marginTop: 2 },
  infoNote: { fontSize: 11, color: '#829ab1', marginBottom: 15, marginTop: 4, fontStyle: 'italic' },
  label: { fontSize: 13, fontWeight: '600', color: '#37474f', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#cfd8dc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, backgroundColor: '#fafafa', color: '#263238' },
  textArea: { height: 100, textAlignVertical: 'top' },
  counterText: { fontSize: 10, color: '#90a4ae', marginTop: 4, marginBottom: 8, textAlign: 'right' },
  pickerContainer: { borderWidth: 1, borderColor: '#cfd8dc', borderRadius: 8, backgroundColor: '#fafafa', overflow: 'hidden', justifyContent: 'center', height: 150},
  picker: { width: '100%', color: '#263238' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  checkboxText: { fontSize: 11, color: '#546e7a', flex: 1, lineHeight: 16 },
  submitButton: { backgroundColor: '#1a2e40', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 8, marginTop: 5 },
  submitButtonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 }
});