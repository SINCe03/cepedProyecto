import React, { useRef, useState } from 'react';
import { View, TextInput, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export default function FormInput({
    Icon,
    label,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    multiline,
    editable = true,
}) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const anim = useRef(new Animated.Value(value || !editable ? 1 : 0)).current;

    const animateTo = (toValue) => {
    Animated.timing(anim, { toValue, duration: 150, useNativeDriver: false }).start();
};

    const handleFocus = () => { setFocused(true); animateTo(1); };
    const handleBlur = () => { setFocused(false); if (!value) animateTo(0); };

    const iconColor = focused ? 'rgb(41, 61, 85)' : '#8A8078';

    const labelStyle = {
    fontSize: anim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] }),
    color: focused ? 'rgb(210, 174, 109)' : '#8A8078',
    transform: [{
    translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -19] }),
    }],
};

    return (
    <View style={[
        styles.box,
        multiline && styles.boxMultiline,
        focused && styles.boxFocused,
        !editable && styles.boxDisabled,
]}>
    {Icon && <Icon size={19} color={iconColor} strokeWidth={2} style={[styles.icon, multiline && styles.iconMultiline]} />}
        <View style={{ flex: 1 }}>
        <View style={styles.labelWrap} pointerEvents="none">
        <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
        </View>
    {editable ? (
        <TextInput
            style={[styles.input, multiline && styles.inputMultiline]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
    />
) : (
    <Text style={[styles.input, styles.inputDisabledText]}>{value}</Text>
    )}
    </View>
    {secureTextEntry && (
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        {showPassword ? <EyeOff size={19} color="#8A8078" /> : <Eye size={19} color="#8A8078" />}
    </TouchableOpacity>
)}
    </View>
);
}

const styles = StyleSheet.create({
    box: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#DDE2ED', borderRadius: 12,
    backgroundColor: '#fff', paddingHorizontal: 14, height: 56,
    width: '100%', marginTop: 16,
},
    boxMultiline: { height: undefined, minHeight: 90, alignItems: 'flex-start', paddingVertical: 10 },
    boxFocused: { borderColor: 'rgb(210, 174, 109)' },
    boxDisabled: { backgroundColor: '#ECEFF4' },
    icon: { marginRight: 10 },
    iconMultiline: { marginTop: 18 },
    labelWrap: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    justifyContent: 'center',
},
    label: {},
    input: { fontSize: 15, color: '#1A2233', height: 56 },
    inputMultiline: { height: undefined, minHeight: 70, textAlignVertical: 'top' },
    inputDisabledText: { color: '#5B6579', lineHeight: 56 },
});