import React, { useRef } from 'react';
import { Pressable, Animated, Text, StyleSheet, ActivityIndicator } from 'react-native';

const VARIANTS = {
    primary: { bg: 'rgb(41, 61, 85)', border: 'rgb(41, 61, 85)', text: '#fff' },
    gold: { bg: 'rgb(210, 174, 109)', border: 'rgb(210, 174, 109)', text: '#fff' },
    outline: { bg: 'transparent', border: '#DDE2ED', text: '#5B6579' },
    danger: { bg: 'transparent', border: '#B3261E', text: '#B3261E' },
};

export default function Button({ title, onPress, variant = 'primary', icon, loading = false, disabled = false, style }) {
    const scale = useRef(new Animated.Value(1)).current;
    const colors = VARIANTS[variant] ?? VARIANTS.primary;
    const isDisabled = disabled || loading;

    const pressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 60, bounciness: 6 }).start();
};
    const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }).start();
};
    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale }] }, style]}>
        <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={isDisabled}
        style={[
        styles.base,
        { backgroundColor: colors.bg, borderColor: colors.border },
        isDisabled && styles.disabled,
        ]}
    >
        {loading ? (
        <ActivityIndicator color={colors.text} />
        ) : (
        <>
        {icon}
        <Text style={[styles.text, { color: colors.text }, icon && { marginLeft: 8 }]}>{title}</Text>
        </>
        )}
        </Pressable>
    </Animated.View>
);
}

    const styles = StyleSheet.create({
    wrapper: { width: '100%', marginTop: 24 },
    base: {
    flexDirection: 'row', height: 50, borderRadius: 25, borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center', width: '100%',
},
    disabled: { opacity: 0.6 },
    text: { fontSize: 15, fontWeight: 'bold' },
});