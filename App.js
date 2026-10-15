import React from 'react';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Navigation from './navigation/Navigation';
import { toastConfig } from './Components/toastConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
    <SafeAreaProvider>
      <Navigation />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}