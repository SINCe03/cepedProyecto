import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Plataform } from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import {signOut, updateprofile} from 'firebase/auth';
import {auth} from '../src/config/firebaseConfig';

export default function Perfil() {
    const user = auth.currentUser;
    const [nombre, setNombre] = useState(user?.displayName ?? '');
    const [telefono, setTelefono] = useState('');

const iniciales = (nombre || user?.email || '?').trim().charAt(0).toUpperCase();

const handleGuardar = async () => {
    if (!nombre.trim()) {
        Alert.alert("Error", "El nombre no puede estar vacío.");
    return;
    }
    try {
    await updateProfile(user, { displayName: nombre.trim() });
        Alert.alert("Listo", "Tus datos se guardaron correctamente.");
    } catch (error) {
        Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
};

const handleLogOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
};

return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
        <Text style={styles.title}>Mi perfil</Text>

        <Text style={styles.label}>Nombre</Text>
        <View style={styles.inputContainer}>
            <FontAwesome name="user" size={18} color="#8A8078" style={styles.icon} />
            <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
        />
        </View>

        <Text style={styles.label}>Correo electrónico</Text>
        <View style={[styles.inputContainer, styles.inputDisabled]}>
            <FontAwesome name="envelope" size={18} color="#8A8078" style={styles.icon} />
            <Text style={styles.inputTextDisabled}>{user?.email}</Text>
        </View>

        <Text style={styles.label}>Teléfono</Text>
        <View style={styles.inputContainer}>
            <FontAwesome name="phone" size={18} color="#8A8078" style={styles.icon} />
            <TextInput
            style={styles.input}
            placeholder="Ej: 387 555 0123"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
        />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 50, backgroundColor: '#F4F6FA' },
    avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgb(41, 61, 85)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
},
    avatarText: { color: '#D2AE6D', fontSize: 30, fontWeight: 'bold' },
    title: { fontSize: 20, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginBottom: 20 },
    label: { alignSelf: 'flex-start', fontSize: 14, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginTop: 12 },
    inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#DDE2ED', borderRadius: 10,
    paddingHorizontal: 12, height: 46, width: '100%', marginTop: 6,
},
    inputDisabled: { backgroundColor: '#ECEFF4' },
    icon: { marginRight: 10 },
    input: { flex: 1, height: 40 },
    inputTextDisabled: { flex: 1, color: '#5B6579' },
    button: {
    backgroundColor: 'rgb(41, 61, 85)', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 24,
},
    buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    logoutButton: {
    borderWidth: 1.5, borderColor: '#B3261E', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 12,
},
    logoutText: { color: '#B3261E', fontSize: 15, fontWeight: 'bold' },
});