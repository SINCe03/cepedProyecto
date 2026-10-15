import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import Toast from 'react-native-toast-message';
import Button from '../Components/Button';

export default function Institutos({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const isAdmin = route.params?.isAdmin ?? false;
    const [institutos, setInstitutos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [refrescando, setRefrescando] = useState(false);

    const handleRefrescar = async () => {
    setRefrescando(true);
    try {
        const snap = await getDocs(collection(db, 'institutos'));
        setInstitutos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
        console.error('Error al refrescar:', error);
    } finally {
        setRefrescando(false);
    }
};

    useEffect(() => {
    const unsub = onSnapshot(
    collection(db, 'institutos'),
    (snapshot) => {
        const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setInstitutos(lista);
        setCargando(false);
    },
        (error) => {
        if (error.code === 'permission-denied') return;
        console.error('Error al leer institutos:', error);
        setCargando(false);
    }
    );
    return unsub;
}, []);

    const filtrados = institutos.filter((i) =>
    (i.localidad ?? '').toLowerCase().includes(busqueda.toLowerCase())
);

    const handleLogOut = async () => {
    try {
        await signOut(auth);
        } catch (error) {
        Toast.show({ type: 'error', text1: 'No se pudo cerrar sesión' });
    }
};

    const handleEliminar = (id, nombre) => {
    Alert.alert(
        "Eliminar",
        `¿Seguro que querés eliminar ${nombre}?`,
        [
        { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: async () => {
        try {
            await deleteDoc(doc(db, 'institutos', id));
            Toast.show({ type: 'success', text1: 'Instituto eliminado' });
        } catch (error) {
            Toast.show({ type: 'error', text1: 'No se pudo eliminar el instituto' });
        }
        }},
    ]
    );
};

    if (cargando) {
    return (
    <View style={styles.center}>
        <ActivityIndicator size="large" color="rgb(41, 61, 85)" />
    </View>
    );
}

    return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
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
        <Button
            title="Agregar nuevo afiliado"
            onPress={() => navigation.getParent()?.navigate('FormularioInstituto')}
            variant="gold"
            icon={<FontAwesome name="plus" size={14} color="#fff" />}
        />
)}

    <FlatList
        style={{ marginTop: 35 }}
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay institutos que coincidan con la búsqueda.</Text>}
        refreshControl={
            <RefreshControl
            refreshing={refrescando}
            onRefresh={handleRefrescar}
            tintColor="rgb(41, 61, 85)"
            colors={['rgb(41, 61, 85)']}
            />
        }
        renderItem={({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <View style={styles.cardRow}>
            <FontAwesome name="map-marker" size={14} color="#8A8078" />
            <Text style={styles.cardSub}>  {item.localidad}</Text>
            </View>
            <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.getParent()?.navigate('DetalleInstituto', { instituto: item })}>    
                <FontAwesome name="eye" size={14} color="rgb(41, 61, 85)" />
                <Text style={styles.actionText}> Ver</Text>
            </TouchableOpacity>
            {isAdmin && (
                <>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.getParent()?.navigate('FormularioInstituto', { instituto: item })}>
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FA' },
    container: { flex: 1, backgroundColor: '#F4F6FA', paddingHorizontal: 16, paddingBottom: 16 },
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
    empty: { textAlign: 'center', color: '#8A8078', marginTop: 30 },
});