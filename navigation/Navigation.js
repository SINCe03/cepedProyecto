import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../src/config/firebaseConfig';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Tabs from './Tabs';

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(undefined);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'usuarios', firebaseUser.uid));
          setRol(snap.exists() ? snap.data().rol : 'usuario');
        } catch (error) {
          console.error('Error al leer el rol:', error);
          setRol('usuario');
        }
      } else {
        setRol(null);
      }
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          Falta configurar Firebase. Copia .env.example como .env y completa los datos de tu proyecto.
        </Text>
      </View>
    );
  }

  if (user === undefined || (user && rol === null)) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
                {user ? (
          <Stack.Screen name="Tabs" options={{ headerShown: false }}>
            {() => <Tabs isAdmin={rol === 'admin'} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Iniciar sesión' }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Registro' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  message: { textAlign: 'center', fontSize: 16 },
});