import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function BubbleDecor() {
return (
    <View style={styles.wrap} pointerEvents="none">
        <View style={[styles.circle, styles.goldBig]} />
        <View style={[styles.circle, styles.navyBig]} />
        <View style={styles.ring} />
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
    </View>
);
}

const styles = StyleSheet.create({
    wrap: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 230,
    overflow: 'hidden',
},
    circle: { position: 'absolute', borderRadius: 999 },
    goldBig: { width: 170, height: 170, backgroundColor: 'rgb(210, 174, 109)', opacity: 0.28, bottom: -70, left: -50 },
    navyBig: { width: 120, height: 120, backgroundColor: 'rgb(41, 61, 85)', opacity: 0.16, bottom: -40, right: -30 },
    ring: {
    position: 'absolute', width: 58, height: 58, borderRadius: 29,
    borderWidth: 2.5, borderColor: 'rgb(210, 174, 109)', opacity: 0.6,
    bottom: 36, right: 46,
},
    dot: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgb(210, 174, 109)' },
    dot1: { width: 9, height: 9, opacity: 0.5, bottom: 100, left: 40 },
    dot2: { width: 7, height: 7, opacity: 0.4, bottom: 80, left: 64 },
    dot3: { width: 6, height: 6, opacity: 0.35, bottom: 118, left: 58 },
});