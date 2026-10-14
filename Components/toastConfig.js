import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
    uccess: (props) => (
    <BaseToast
        {...props}
        style={{ borderLeftColor: 'rgb(210, 174, 109)', backgroundColor: '#fff' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 15, fontWeight: 'bold', color: 'rgb(41, 61, 85)' }}
        text2Style={{ fontSize: 13, color: '#5B6579' }}
    />
),
    error: (props) => (
    <ErrorToast
        {...props}
        style={{ borderLeftColor: '#B3261E', backgroundColor: '#fff' }}
        text1Style={{ fontSize: 15, fontWeight: 'bold', color: '#B3261E' }}
        text2Style={{ fontSize: 13, color: '#5B6579' }}
    />
),
};