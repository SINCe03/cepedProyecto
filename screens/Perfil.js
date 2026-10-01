import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';

export default function Perfil() {
    const user = auth.currentUser;
    const [cargando, setCargando] = useState(true);
    const [editando, setEditando] = useState(false);

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rol, setRol] = useState('usuario');

    useEffect(() => {
    const cargarDatos = async () => {
        try {
        const snap = await getDoc(doc(db, 'usuarios', user.uid));
        if (snap.exists()) {
            const data = snap.data();
            setNombre(data.nombre ?? '');
            setApellido(data.apellido ?? '');
            setTelefono(data.telefono ?? '');
            setRol(data.rol ?? 'usuario');
        }
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
    } finally {
        setCargando(false);
    }
    };
    cargarDatos();
}, []);

    const iniciales = (nombre || user?.email || '?').trim().charAt(0).toUpperCase();

    const handleGuardar = async () => {
    if (!nombre.trim() || !apellido.trim()) {
        Alert.alert("Error", "El nombre y el apellido no pueden estar vacíos.");
        return;
    }
    try {
        await setDoc(doc(db, 'usuarios', user.uid), {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        email: user.email,
        rol: rol,
    }, { merge: true});
        await updateProfile(user, { displayName: `${nombre.trim()} ${apellido.trim()}` });
        setEditando(false);
        Alert.alert("Listo", "Tus datos se guardaron correctamente.");
    } catch (error) {
        console.error('Error al guardar el perfil:', error);
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

    if (cargando) {
    return (
        <View style={styles.center}>
        <ActivityIndicator size="large" color="rgb(41, 61, 85)" />
        </View>
    );
}

    return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
        <Text style={styles.name}>{nombre} {apellido}</Text>
        <Text style={styles.roleTag}>{rol === 'admin' ? 'Administrador' : 'Usuario'}</Text>

        {!editando ? (
            <>
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                <FontAwesome name="user" size={16} color="#8A8078" style={styles.icon} />
                <Text style={styles.infoText}>{nombre} {apellido}</Text>
                </View>
                <View style={styles.infoRow}>
                <FontAwesome name="envelope" size={16} color="#8A8078" style={styles.icon} />
                <Text style={styles.infoText}>{user?.email}</Text>
                </View>
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <FontAwesome name="phone" size={16} color="#8A8078" style={styles.icon} />
                <Text style={styles.infoText}>{telefono || 'Sin teléfono cargado'}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
                <FontAwesome name="pencil" size={14} color="#fff" />
                <Text style={styles.buttonText}>  Editar perfil</Text>
            </TouchableOpacity>
            </>
        ) : (
            <>
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputContainer}>
                <FontAwesome name="user" size={18} color="#8A8078" style={styles.icon} />
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Tu nombre" />
            </View>

            <Text style={styles.label}>Apellido</Text>
            <View style={styles.inputContainer}>
                <FontAwesome name="user" size={18} color="#8A8078" style={styles.icon} />
                <TextInput style={styles.input} value={apellido} onChangeText={setApellido} placeholder="Tu apellido" />
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
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditando(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FA' },
    container: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 50, backgroundColor: '#F4F6FA' },
    avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgb(41, 61, 85)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
},
    avatarText: { color: '#D2AE6D', fontSize: 32, fontWeight: 'bold' },
    name: { fontSize: 19, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginTop: 4 },
    roleTag: { fontSize: 12, fontWeight: 'bold', color: '#D2AE6D', textTransform: 'uppercase', marginBottom: 20, marginTop: 2 },
    infoCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED', width: '100%', padding: 6, marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F0F2F7' },
    infoText: { fontSize: 15, color: '#1A2233' },
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
    flexDirection: 'row', backgroundColor: 'rgb(41, 61, 85)', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10,
},
    buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    cancelButton: {
    borderWidth: 1.5, borderColor: '#DDE2ED', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10,
},
    cancelText: { color: '#5B6579', fontSize: 15, fontWeight: 'bold' },
    logoutButton: {
    borderWidth: 1.5, borderColor: '#B3261E', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 20,
},
    logoutText: { color: '#B3261E', fontSize: 15, fontWeight: 'bold' },
});