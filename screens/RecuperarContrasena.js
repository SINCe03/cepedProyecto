import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import FormInput from '../Components/FormInput';
import { Mail } from 'lucide-react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import AuthHeader from '../Components/AuthHeader';
import Button from '../Components/Button';
import BubbleDecor from '../Components/BubbleDecor';

export default function RecuperarContrasena({ navigation }) {
    const [email, setEmail] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleRecuperar = async () => {
    if (!email.trim()) {
        Alert.alert("Error", "Ingresá tu correo electrónico.");
        return;
    }
    setEnviando(true);
    try {
        await sendPasswordResetEmail(auth, email.trim());
        Alert.alert(
        "Correo enviado",
        "Revisá tu bandeja de entrada (o spam) para restablecer tu contraseña.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
    );
    } catch (error) {
        Alert.alert("Error", "No pudimos enviar el correo. Revisá que esté bien escrito.");
    } finally {
        setEnviando(false);
    }
};

    return (
    <View style={styles.screen}>
    <BubbleDecor />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AuthHeader
            title="Recuperar contraseña"
            subtitle="Te enviamos un enlace para restablecerla"
            onBack={() => navigation.goBack()}
        />

        <View style={styles.form}>
        <Text style={styles.hint}>Revisá tu bandeja o spam.</Text>

        <FormInput Icon={Mail} label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Button title="Recuperar cuenta" onPress={handleRecuperar} loading={enviando} />
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </View>
);
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    container: { flexGrow: 1 },
    form: { paddingHorizontal: 24, paddingBottom: 24 },
    hint: { fontSize: 13, color: '#5B6579', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#DDE2ED', borderRadius: 25,
    paddingHorizontal: 16, height: 50, marginBottom: 24,
},
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15 },
    button: {
    backgroundColor: 'rgb(41, 61, 85)', borderRadius: 25, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 28,
},
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});