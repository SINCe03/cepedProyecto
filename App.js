import React from 'react';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Navigation from './navigation/Navigation';
import { toastConfig } from './Components/toastConfig';

export default function App() {
  return (
    <>
      <Navigation />
      <Toast config={toastConfig} />
    </>
  );
}