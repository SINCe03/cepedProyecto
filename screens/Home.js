import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function Home() {
  return(
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/LOGOCEPED.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Bienvenido a CePED</Text>
      <Text style={styles.mission}>
        Nucleamos a institutos privados de educación a distancia de Salta. Promovemos, coordinamos, representamos y defendemos los intereses comunes de los mismos, fomentando la calidad y el reconocimiento de la educación a distancia como una opción educativa válida.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#F4F6FA',
  },
  logo: {
    width: '80%',
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgb(41, 61, 85)',
    marginBottom: 16,
    textAlign: 'center',
  },
  mission: {
    fontSize: 15,
    color: '#5B6579',
    textAlign: 'center',
    lineHeight: 22,
  },
});