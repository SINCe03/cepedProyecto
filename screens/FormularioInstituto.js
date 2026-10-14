import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormInput from '../Components/FormInput';
import { Building2, MapPin, FileText, Phone, Mail, Globe } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';
import Button from '../Components/Button';

const LOCALIDADES = [
    'Salta Capital',
    'Vaqueros',
    'San Lorenzo',
    'Cerrillos',
    'La Caldera',
    'Rosario de Lerma',
    'Chicoana',
    'Cafayate',
    'Orán',
    'Tartagal',
    'Metán',
    'General Güemes',
];

const CARRERAS_DISPONIBLES = [
    'Analista de Sistemas',
    'Administración de Empresas',
    'Contador Público',
    'Abogacía',
    'Martillero y Corredor Público',
    'Profesorado en Educación',
    'Psicología',
    'Recursos Humanos',
    'Marketing Digital',
    'Diseño Gráfico',
];

export default function FormularioInstituto({ route, navigation }) {
    const instituto = route.params?.instituto;
    const editando = !!instituto;

    const [nombre, setNombre] = useState(instituto?.nombre ?? '');
    const [localidad, setLocalidad] = useState(instituto?.localidad ?? LOCALIDADES[0]);
    const [direccion, setDireccion] = useState(instituto?.direccion ?? '');
    const [descripcion, setDescripcion] = useState(instituto?.descripcion ?? '');
    const [carreras, setCarreras] = useState(() => {
    if (Array.isArray(instituto?.carreras)) return instituto.carreras;
    if (typeof instituto?.carreras === 'string' && instituto.carreras.trim()) {
        return instituto.carreras.split(',').map((c) => c.trim());
    }
    return [];
});
    const [telefono, setTelefono] = useState(instituto?.telefono ?? '');
    const [email, setEmail] = useState(instituto?.email ?? '');
    const [sitioWeb, setSitioWeb] = useState(instituto?.sitioWeb ?? '');
    const [guardando, setGuardando] = useState(false);

    const toggleCarrera = (carrera) => {
    setCarreras((prev) =>
        prev.includes(carrera) ? prev.filter((c) => c !== carrera) : [...prev, carrera]
    );
};

    const handleGuardar = async () => {
    if (!nombre.trim()) {
        Toast.show({ type: 'error', text1: 'Falta el nombre', text2: 'El nombre del instituto es obligatorio.' });
        return;
    }
    setGuardando(true);
    const datos = {
        nombre: nombre.trim(),
        localidad,
        direccion: direccion.trim(),
        descripcion: descripcion.trim(),
        carreras,
        telefono: telefono.trim(),
        email: email.trim(),
        sitioWeb: sitioWeb.trim(),
    };
    try {
    if (editando) {
        await updateDoc(doc(db, 'institutos', instituto.id), datos);
    } else {
        await addDoc(collection(db, 'institutos'), datos);
    }
        navigation.goBack();
        Toast.show({ type: 'success', text1: editando ? 'Cambios guardados' : 'Instituto agregado' });
    } catch (error) {
        console.error('Error al guardar el instituto:', error);
        Toast.show({ type: 'error', text1: 'No se pudo guardar', text2: 'Intentá de nuevo.' });
    } finally {
        setGuardando(false);
    }
};

    return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{editando ? 'Editar afiliado' : 'Agregar nuevo afiliado'}</Text>

        <FormInput Icon={Building2} label="Nombre del instituto *" value={nombre} onChangeText={setNombre} />

        <Text style={styles.label}>Localidad</Text>
        <View style={styles.pickerContainer}>
        <Picker selectedValue={localidad} onValueChange={setLocalidad}>
            {LOCALIDADES.map((loc) => (
        <Picker.Item key={loc} label={loc} value={loc} />
            ))}
        </Picker>
        </View>

        <Text style={styles.label}>Dirección</Text>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Ej: Av. Belgrano 123" value={direccion} onChangeText={setDireccion} />
        </View>

        <FormInput Icon={MapPin} label="Dirección" value={direccion} onChangeText={setDireccion} />
        <FormInput Icon={FileText} label="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />

        <Text style={styles.label}>Carreras / cursos a distancia</Text>
        <View style={styles.chipsWrap}>
            {CARRERAS_DISPONIBLES.map((carrera) => {
            const selected = carreras.includes(carrera);
            return (
        <TouchableOpacity
            key={carrera}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => toggleCarrera(carrera)}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{carrera}</Text>
        </TouchableOpacity>
            );
        })}
        </View>

        <FormInput Icon={Phone} label="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        <FormInput Icon={Mail} label="Email de contacto" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <FormInput Icon={Globe} label="Sitio web" value={sitioWeb} onChangeText={setSitioWeb} autoCapitalize="none" />

        <Button title="Guardar" onPress={handleGuardar} loading={guardando} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" />
    </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 24, paddingTop: 30, backgroundColor: '#F4F6FA' },
    title: { fontSize: 20, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginBottom: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginTop: 12, marginBottom: 6 },
    inputContainer: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDE2ED', borderRadius: 10,
    paddingHorizontal: 12, height: 46, justifyContent: 'center',
},
    inputMultiline: { height: undefined, paddingVertical: 10 },
    input: { fontSize: 15 },
    multiline: { textAlignVertical: 'top' },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
    chip: {
    borderWidth: 1, borderColor: '#DDE2ED', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#fff',
},
    chipSelected: { backgroundColor: 'rgb(41, 61, 85)', borderColor: 'rgb(41, 61, 85)' },
    chipText: { fontSize: 13, color: '#1A2233' },
    chipTextSelected: { color: '#fff', fontWeight: 'bold' },
    pickerContainer: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDE2ED', borderRadius: 10,
    overflow: 'hidden',
},
    button: {
    backgroundColor: 'rgb(41, 61, 85)', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', marginTop: 28,
},
    buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    cancelButton: {
    borderWidth: 1.5, borderColor: '#DDE2ED', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 20,
},
    cancelText: { color: '#5B6579', fontSize: 15, fontWeight: 'bold' },
});