import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

const datosIniciales = [
{ id: '1', nombre: 'CEDSa', localidad: 'SALTA - Capital' },
{ id: '2', nombre: 'teclab', localidad: 'SALTA - Capital' },
{ id: '3', nombre: 'ITSalta', localidad: 'SALTA - Capital' },
];

export default function Institutos({ route }) {
const isAdmin = route.params?.isAdmin ?? false;
const [institutos, setInstitutos] = useState(datosIniciales);
const [busqueda, setBusqueda] = useState('');

const filtrados = institutos.filter((i) =>
    i.localidad.toLowerCase().includes(busqueda.toLowerCase())
);

const handleLogOut = async () => {
    try {
    await signOut(auth);
    } catch (error) {
    Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
};

const handleEliminar = (id, nombre) => {
    Alert.alert(
    "Eliminar",
    `¿Seguro que querés eliminar ${nombre}?`,
    [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => {
        setInstitutos((prev) => prev.filter((i) => i.id !== id));
        }},
    ]
    );
};

return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.title}>Institutos afiliados</Text>
        <TouchableOpacity onPress={handleLogOut}>
        <FontAwesome name="sign-out" size={22} color="rgb(41, 61, 85)" />
        </TouchableOpacity>
    </View>

    <View style={styles.searchBox}>
        <FontAwesome name="search" size={16} color="#8A8078" style={{ marginRight: 8 }} />
        <TextInput
            style={styles.searchInput}
            placeholder="Buscar por localidad..."
            value={busqueda}
            onChangeText={setBusqueda}
        />
    </View>

        {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("Próximamente", "Acá va el formulario de alta.")}>
            <FontAwesome name="plus" size={14} color="#fff" />
            <Text style={styles.addButtonText}>  Agregar nuevo afiliado</Text>
        </TouchableOpacity>
    )}

    <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <View style={styles.cardRow}>
                <FontAwesome name="map-marker" size={14} color="#8A8078" />
                <Text style={styles.cardSub}>  {item.localidad}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert(item.nombre, item.localidad)}>
                <FontAwesome name="eye" size={14} color="rgb(41, 61, 85)" />
                <Text style={styles.actionText}> Ver</Text>
                </TouchableOpacity>
                {isAdmin && (
                <>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Próximamente", "Acá va el formulario de edición.")}>
                    <FontAwesome name="pencil" size={14} color="rgb(41, 61, 85)" />
                    <Text style={styles.actionText}> Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleEliminar(item.id, item.nombre)}>
                    <FontAwesome name="trash" size={14} color="#B3261E" />
                    <Text style={[styles.actionText, { color: '#B3261E' }]}> Eliminar</Text>
                    </TouchableOpacity>
                </>
            )}
            </View>
            </View>
        )}
        />
    </View>
);
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6FA', padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    title: { fontSize: 20, fontWeight: 'bold', color: 'rgb(41, 61, 85)' },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#DDE2ED', paddingHorizontal: 14, height: 42, marginBottom: 12 },
    searchInput: { flex: 1 },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D2AE6D', borderRadius: 10, paddingVertical: 10, marginBottom: 14 },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
    card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#DDE2ED' },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A2233' },
    cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    cardSub: { fontSize: 13, color: '#5B6579' },
    actions: { flexDirection: 'row', marginTop: 10, gap: 16 },
    actionBtn: { flexDirection: 'row', alignItems: 'center' },
    actionText: { fontSize: 13, color: 'rgb(41, 61, 85)' },
});