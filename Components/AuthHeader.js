import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';

export default function AuthHeader({ title, subtitle, onBack }) {
return (
    <View style={styles.wrapper}>
    <View style={styles.waveBox}>
        <Svg height="100%" width="100%" viewBox="0 0 400 175" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
            <Path d="M0,0 L400,0 L400,100 C300,174 100,54 0,114 Z" fill="rgb(210, 174, 109)" />
            <Path d="M0,0 L400,0 L400,100 C300,160 100,40 0,100 Z" fill="rgb(41, 61, 85)" />
        </Svg>

        {!!onBack && (
    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <FontAwesome name="arrow-left" size={18} color="#fff" />
    </TouchableOpacity>
    )}
    </View>

    <View style={styles.logoBadge}>
        <Image source={require('../assets/LOGOCEPED.png')} style={styles.logo} resizeMode="contain" />
    </View>

        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

    <View style={styles.accentBar}>
    <View style={[styles.accentSeg, { backgroundColor: 'rgb(41, 61, 85)' }]} />
    <View style={[styles.accentSeg, { backgroundColor: 'rgb(210, 174, 109)' }]} />
    <View style={[styles.accentSeg, { backgroundColor: 'rgb(41, 61, 85)' }]} />
    </View>
    </View>
);
}

const styles = StyleSheet.create({
    wrapper: { alignItems: 'center', marginBottom: 14 },
    waveBox: { width: '100%', height: 150 },
    backBtn: {
    position: 'absolute', top: 50, left: 20,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
},
    logoBadge: {
    width: 92, height: 92, borderRadius: 46, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginTop: -50,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
},
    logo: { width: 70, height: 70 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1A2233', marginTop: 14 },
    subtitle: { fontSize: 13, color: '#5B6579', marginTop: 4 },
    accentBar: { flexDirection: 'row', width: 60, height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 10 },
    accentSeg: { flex: 1 },
});