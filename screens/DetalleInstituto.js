import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function DetalleInstituto({ route }) {
    const { instituto } = route.params;

    const llamar = () => instituto.telefono && Linking.openURL(`tel:${instituto.telefono}`);
    const escribir = () => instituto.email && Linking.openURL(`mailto:${instituto.email}`);
    const abrirWeb = () => {
    if (!instituto.sitioWeb) return;
    const url = instituto.sitioWeb.startsWith('http') ? instituto.sitioWeb : `https://${instituto.sitioWeb}`;
    Linking.openURL(url);
};

    return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.nombre}>{instituto.nombre}</Text>
    <View style={styles.row}>
        <FontAwesome name="map-marker" size={14} color="#8A8078" />
        <Text style={styles.localidad}>  {instituto.localidad}</Text>
    </View>

    {!!instituto.descripcion && (
        <View style={styles.card}>
        <Text style={styles.cardLabel}>Descripción</Text>
        <Text style={styles.cardText}>{instituto.descripcion}</Text>
        </View>
    )}

        {!!instituto.carreras && (
        <View style={styles.card}>
            <Text style={styles.cardLabel}>Carreras / cursos a distancia</Text>
            <Text style={styles.cardText}>{instituto.carreras}</Text>
        </View>
    )}

    {!!instituto.direccion && (
        <View style={styles.card}>
            <Text style={styles.cardLabel}>Dirección</Text>
            <Text style={styles.cardText}>{instituto.direccion}</Text>
        </View>
    )}

    <View style={styles.card}>
        <Text style={styles.cardLabel}>Contacto</Text>

        {!!instituto.telefono && (
        <TouchableOpacity style={styles.contactRow} onPress={llamar}>
            <FontAwesome name="phone" size={16} color="rgb(41, 61, 85)" style={styles.icon} />
            <Text style={styles.contactText}>{instituto.telefono}</Text>
        </TouchableOpacity>
        )}
        {!!instituto.email && (
        <TouchableOpacity style={styles.contactRow} onPress={escribir}>
            <FontAwesome name="envelope" size={16} color="rgb(41, 61, 85)" style={styles.icon} />
            <Text style={styles.contactText}>{instituto.email}</Text>
        </TouchableOpacity>
        )}
        {!!instituto.sitioWeb && (
        <TouchableOpacity style={styles.contactRow} onPress={abrirWeb}>
            <FontAwesome name="globe" size={16} color="rgb(41, 61, 85)" style={styles.icon} />
            <Text style={styles.contactText}>{instituto.sitioWeb}</Text>
        </TouchableOpacity>
        )}
        {!instituto.telefono && !instituto.email && !instituto.sitioWeb && (
        <Text style={styles.cardText}>Sin datos de contacto cargados.</Text>
        )}
    </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 24, backgroundColor: '#F4F6FA', flexGrow: 1 },
    nombre: { fontSize: 22, fontWeight: 'bold', color: 'rgb(41, 61, 85)' },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 16 },
    localidad: { fontSize: 14, color: '#5B6579' },
    card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#DDE2ED', padding: 16, marginBottom: 14 },
    cardLabel: { fontSize: 12, fontWeight: 'bold', color: '#D2AE6D', textTransform: 'uppercase', marginBottom: 6 },
    cardText: { fontSize: 15, color: '#1A2233', lineHeight: 21 },
    contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    icon: { marginRight: 10, width: 18 },
    contactText: { fontSize: 15, color: 'rgb(41, 61, 85)', textDecorationLine: 'underline' },
});