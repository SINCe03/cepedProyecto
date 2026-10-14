import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import AuthHeader from '../Components/AuthHeader';
import Toast from 'react-native-toast-message';
import FormInput from '../Components/FormInput';
import { Mail, Lock } from 'lucide-react-native';
import Button from '../Components/Button'
import BubbleDecor from '../Components/BubbleDecor';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
    Toast.show({ type: 'error', text1: 'Faltan datos', text2: 'Por favor ingresá ambos campos.' });
    return;
  }

    try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const snap = await getDoc(doc(db, 'usuarios', credential.user.uid));
    const rol = snap.exists() ? snap.data().rol : 'usuario';
    // El observador de Firebase detecta la sesión; guardamos el rol para usarlo en la navegación.
    global.rolUsuario = rol;
    } catch (error) {
      console.error('Error de inicio de sesión:', error.code, error.message);
      let errorMessage = "Hubo un problema al iniciar sesión.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          errorMessage = "La contraseña es incorrecta.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No se encontró un usuario con este correo.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
        case 'auth/invalid-api-key':
          errorMessage = "La clave API de Firebase no es válida. Revisa el archivo .env.";
          break;
      }
        Toast.show({ type: 'error', text1: 'No pudimos iniciar sesión', text2: errorMessage });
    }
  };

  return (
    <View style={styles.screen}>
    <BubbleDecor />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AuthHeader title="Iniciar sesión" subtitle="Accedé a tu cuenta para continuar" />

      <View style={styles.form}>
      <FormInput Icon={Mail} label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"  />
      <FormInput Icon={Lock} label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity onPress={() => navigation.navigate('RecuperarContrasena')} style={styles.forgotWrap}>
        <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      <Button title="Ingresar" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>¿No tienes cuenta aún? Regístrate</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
}

  const styles = StyleSheet.create({
    screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
    container: {
    flexGrow: 1,
  },
    form: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
    logo: {
    width: '85%',
    height: 100,
    marginBottom: 20,
  },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
    label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
    inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgb(210, 174, 109)',
    marginBottom: 20,
    width: '100%',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 4,
  },
  forgotText: {
    color: 'rgb(41, 61, 85)',
    fontSize: 13,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    backgroundColor: 'rgb(41, 61, 85)',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    color: 'rgb(41, 61, 85)',
    fontWeight: 'bold',
  },
});
