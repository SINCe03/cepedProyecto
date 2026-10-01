import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';

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

export default function FormularioInstituto({ route, navigation }) {
    const instituto = route.params?.instituto;
    const editando = !!instituto;

    const [nombre, setNombre] = useState(instituto?.nombre ?? '');
    const [localidad, setLocalidad] = useState(instituto?.localidad ?? LOCALIDADES[0]);
    const [direccion, setDireccion] = useState(instituto?.direccion ?? '');
    const [descripcion, setDescripcion] = useState(instituto?.descripcion ?? '');
    const [carreras, setCarreras] = useState(instituto?.carreras ?? '');
    const [telefono, setTelefono] = useState(instituto?.telefono ?? '');
    const [email, setEmail] = useState(instituto?.email ?? '');
    const [sitioWeb, setSitioWeb] = useState(instituto?.sitioWeb ?? '');
    const [guardando, setGuardando] = useState(false);

    const handleGuardar = async () => {
    if (!nombre.trim()) {
        Alert.alert("Error", "El nombre del instituto es obligatorio.");
        return;
    }
    setGuardando(true);
    const datos = {
        nombre: nombre.trim(),
        localidad,
        direccion: direccion.trim(),
        descripcion: descripcion.trim(),
        carreras: carreras.trim(),
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
    } catch (error) {
        console.error('Error al guardar el instituto:', error);
        Alert.alert("Error", "No se pudo guardar el instituto.");
    } finally {
    setGuardando(false);
    }
};

    return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{editando ? 'Editar afiliado' : 'Agregar nuevo afiliado'}</Text>

        <Text style={styles.label}>Nombre del instituto *</Text>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Ej: CEDSa" value={nombre} onChangeText={setNombre} />
        </View>

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

        <Text style={styles.label}>Descripción</Text>
        <View style={[styles.inputContainer, styles.inputMultiline]}>
            <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Breve descripción del instituto"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={3}
        />
        </View>

        <Text style={styles.label}>Carreras / cursos a distancia</Text>
        <View style={[styles.inputContainer, styles.inputMultiline]}>
            <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Ej: Analista de Sistemas, Martillero Público"
            value={carreras}
            onChangeText={setCarreras}
            multiline
            numberOfLines={2}
        />
        </View>

        <Text style={styles.label}>Teléfono</Text>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Ej: 387 555 0123" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        </View>

        <Text style={styles.label}>Email de contacto</Text>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Ej: contacto@instituto.edu.ar" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <Text style={styles.label}>Sitio web</Text>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Ej: https://instituto.edu.ar" value={sitioWeb} onChangeText={setSitioWeb} autoCapitalize="none" />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGuardar} disabled={guardando}>
            <Text style={styles.buttonText}>{guardando ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
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