import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AuthHeader from '../Components/AuthHeader';
import Toast from 'react-native-toast-message';
import FormInput from '../Components/FormInput';
import { User, Mail, Lock } from 'lucide-react-native';
import Button from '../Components/Button';
import BubbleDecor from '../Components/BubbleDecor';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Faltan datos', text2: 'Todos los campos son obligatorios.' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Revisá la contraseña', text2: 'Las contraseñas no coinciden.' });
      return;
    }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\s\S]{8,}$/;
    if (!passwordRegex.test(password)) {

      Toast.show({
      type: 'error',
      text1: 'Contraseña débil',
      text2: 'Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial.',
      });
      return;
    }

    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      console.error('Error de registro:', error.code, error.message);
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está en uso.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          errorMessage = "La contraseña es demasiado débil.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
        case 'auth/invalid-api-key':
          errorMessage = "La clave API de Firebase no es válida. Revisa el archivo .env.";
          break;
      }
      Toast.show({ type: 'error', text1: 'No pudimos registrarte', text2: errorMessage });
      return;
    }

    try {
      await updateProfile(credential.user, { displayName: `${firstName.trim()} ${lastName.trim()}` });
    } catch (error) {
      console.error('No se pudo guardar el nombre:', error);
    }

    try {
      await setDoc(doc(db, 'usuarios', credential.user.uid), {
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        email: email.trim(),
        rol: 'usuario',
        fechaAlta: new Date().toISOString(),
      });
      Toast.show({ type: 'success', text1: '¡Bienvenido/a!', text2: 'Tu cuenta se creó correctamente.' });
    } catch (error) {
      console.error('Error al guardar el rol:', error);
      Toast.show({ type: 'error', text1: 'Cuenta creada', text2: 'Hubo un problema al guardar tus datos.' });
    }
    // Firebase inicia la sesión y el navegador muestra Home.
  };

      return (
    <View style={styles.screen}>
    <BubbleDecor />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AuthHeader title="Crear cuenta" subtitle="Completá tus datos para registrarte" />

      <View style={styles.form}>
      <FormInput Icon={User} label="Nombre" value={firstName} onChangeText={setFirstName} />
      <FormInput Icon={User} label="Apellido" value={lastName} onChangeText={setLastName} />
      <FormInput Icon={Mail} label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <FormInput Icon={Lock} label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <FormInput Icon={Lock} label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <Button title="Registrarse" onPress={handleSignUp} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signUpText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  icon: {
    marginRight: 10,
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
    marginTop: 10,
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
