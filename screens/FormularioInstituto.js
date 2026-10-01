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
    const [guardando, setGuardando] = useState(false);

    const handleGuardar = async () => {
    if (!nombre.trim()) {
        Alert.alert("Error", "El nombre del instituto es obligatorio.");
        return;
    }
    setGuardando(true);
    try {
        if (editando) {
        await updateDoc(doc(db, 'institutos', instituto.id), {
            nombre: nombre.trim(),
            localidad,
        });
    } else {
        await addDoc(collection(db, 'institutos'), {
            nombre: nombre.trim(),
            localidad,
        });
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

        <Text style={styles.label}>Nombre del instituto</Text>
        <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder="Ej: CEDSa"
            value={nombre}
            onChangeText={setNombre}
        />
        </View>

        <Text style={styles.label}>Localidad</Text>
        <View style={styles.pickerContainer}>
            <Picker selectedValue={localidad} onValueChange={setLocalidad}>
            {LOCALIDADES.map((loc) => (
            <Picker.Item key={loc} label={loc} value={loc} />
            ))}
            </Picker>
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
    input: { fontSize: 15 },
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
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
},
    cancelText: { color: '#5B6579', fontSize: 15, fontWeight: 'bold' },
});