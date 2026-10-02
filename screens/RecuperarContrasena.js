import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function RecuperarContrasena({ navigation }) {
    const [email, setEmail] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleRecuperar = async () => {
    if (!email.trim()) {
        Alert.alert("Error", "Ingresa tu correo electronico.");
        return;
    }
    setEnviando(true);
    try {
        await sendPasswordResetEmail(auth, email.trim());
        Alert.alert(
        "Correo enviado",
        "Revisa tu bandeja de entrada (o spam) para restablecer tu contraseña.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
    );
    } catch (error) {
        Alert.alert("Error", "No pudimos enviar el correo. Revisa que esté bien escrito.");
    } finally {
    setEnviando(false);
    }
};

    return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="rgb(41, 61, 85)" />
        </TouchableOpacity>

        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
            Ingresá tu correo electronico y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        <Text style={styles.hint}>Revisa tu bandeja o spam.</Text>

        <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={18} color="#8A8078" style={styles.icon} />
        <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#8A8078"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRecuperar} disabled={enviando}>
        <Text style={styles.buttonText}>{enviando ? 'Enviando...' : 'Recuperar Cuenta'}</Text>
        </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 24, paddingTop: 60, backgroundColor: '#F4F6FA' },
    back: { width: 40, height: 40, justifyContent: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: 'rgb(41, 61, 85)', marginBottom: 16 },
    subtitle: { fontSize: 14, color: '#1A2233', lineHeight: 20, marginBottom: 8 },
    hint: { fontSize: 13, color: '#5B6579', fontWeight: 'bold', marginBottom: 28 },
    inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#DDE2ED', borderRadius: 25,
    paddingHorizontal: 16, height: 50, marginBottom: 24,
},
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15 },
    button: {
    backgroundColor: 'rgb(41, 61, 85)', borderRadius: 25, height: 50,
    justifyContent: 'center', alignItems: 'center',
},
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});