import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Alert } from 'react-native';import { FontAwesome } from '@expo/vector-icons';
import FormInput from '../Components/FormInput';
import { User, Mail, Phone } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import Button from '../Components/Button';

export default function Perfil() {
    const user = auth.currentUser;
    const [cargando, setCargando] = useState(true);
    const [editando, setEditando] = useState(false);
    const [subiendoFoto, setSubiendoFoto] = useState(false);

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rol, setRol] = useState('usuario');
    const [foto, setFoto] = useState(null);

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
            setFoto(data.foto ?? null);
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

    const procesarYGuardarFoto = async (uri) => {
    setSubiendoFoto(true);
    try {
        const resultado = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
);
        const base64 = `data:image/jpeg;base64,${resultado.base64}`;
        await updateDoc(doc(db, 'usuarios', user.uid), { foto: base64 });
        setFoto(base64);
        Toast.show({ type: 'success', text1: 'Foto actualizada' });
    } catch (error) {
        console.error('Error al guardar la foto:', error);
        Toast.show({ type: 'error', text1: 'No se pudo guardar la foto', text2: 'Probá con otra imagen.' });
    } finally {
        setSubiendoFoto(false);
    }
};

    const elegirDeGaleria = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
        Toast.show({ type: 'error', text1: 'Permiso necesario', text2: 'Activá el acceso a tus fotos para cambiar el avatar.' });
        return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    });
    if (!resultado.canceled) {
        procesarYGuardarFoto(resultado.assets[0].uri);
    }
};

    const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
        Toast.show({ type: 'error', text1: 'Permiso necesario', text2: 'Activá el acceso a la cámara para tomar una foto.' });
        return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    });
    if (!resultado.canceled) {
        procesarYGuardarFoto(resultado.assets[0].uri);
    }
};

    const handleCambiarFoto = () => {
    Alert.alert("Foto de perfil", "¿De dónde la querés?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Tomar foto", onPress: tomarFoto },
        { text: "Elegir de la galería", onPress: elegirDeGaleria },
    ]);
};

const handleGuardar = async () => {
    if (!nombre.trim() || !apellido.trim()) {
        Toast.show({ type: 'error', text1: 'Faltan datos', text2: 'El nombre y el apellido no pueden estar vacíos.' });
        return;
    }
    try {
        await updateDoc(doc(db, 'usuarios', user.uid), {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
    });
        await updateProfile(user, { displayName: `${nombre.trim()} ${apellido.trim()}` });
        setEditando(false);
        Toast.show({ type: 'success', text1: 'Perfil actualizado' });
    } catch (error) {
        console.error('Error al guardar el perfil:', error);
        Toast.show({ type: 'error', text1: 'No se pudo guardar', text2: 'Intentá de nuevo en un momento.' });
    }
};

    const handleLogOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        Toast.show({ type: 'error', text1: 'No se pudo cerrar sesión' });
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
        <TouchableOpacity style={styles.avatarWrap} onPress={handleCambiarFoto} disabled={subiendoFoto}>
        <View style={styles.avatar}>
            {foto ? (
            <Image source={{ uri: foto }} style={styles.avatarImg} />
            ) : (
            <Text style={styles.avatarText}>{iniciales}</Text>
            )}
            {subiendoFoto && (
            <View style={styles.avatarLoading}>
            <ActivityIndicator color="#fff" />
            </View>
            )}
        </View>
        <View style={styles.cameraBadge}>
        <FontAwesome name="camera" size={13} color="#fff" />
        </View>
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Cambiar foto</Text>

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

        <Button title="Editar perfil" onPress={() => setEditando(true)} icon={<FontAwesome name="pencil" size={14} color="#fff" />} />
        </>
        ) : (
        <>
        <FormInput Icon={User} label="Nombre" value={nombre} onChangeText={setNombre} />
        <FormInput Icon={User} label="Apellido" value={apellido} onChangeText={setApellido} />
        <FormInput Icon={Mail} label="Correo electrónico" value={user?.email ?? ''} editable={false} />
        <FormInput Icon={Phone} label="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />

        <Button title="Guardar cambios" onPress={handleGuardar} />
        <Button title="Cancelar" onPress={() => setEditando(false)} variant="outline" />
        </>
        )}

        <Button title="Cerrar sesión" onPress={handleLogOut} variant="danger" />
    </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FA' },
    container: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 50, backgroundColor: '#F4F6FA' },
    avatarWrap: { position: 'relative' },
    avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgb(41, 61, 85)',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
},
    avatarImg: { width: 84, height: 84 },
    avatarText: { color: '#D2AE6D', fontSize: 32, fontWeight: 'bold' },
    avatarLoading: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', borderRadius: 42,
},
    cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgb(210, 174, 109)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F4F6FA',
},
    changePhotoText: { fontSize: 12, color: '#5B6579', marginTop: 8 },
    name: { fontSize: 19, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginTop: 14 },
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
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 28,
},
    buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    cancelButton: {
    borderWidth: 1.5, borderColor: '#DDE2ED', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 12,
},
    cancelText: { color: '#5B6579', fontSize: 15, fontWeight: 'bold' },
    logoutButton: {
    borderWidth: 1.5, borderColor: '#B3261E', borderRadius: 10, height: 48,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 20,
},
    logoutText: { color: '#B3261E', fontSize: 15, fontWeight: 'bold' },
});