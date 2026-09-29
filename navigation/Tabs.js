import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Home from '../screens/Home';
import Institutos from '../screens/Institutos';
import Perfil from '../screens/Perfil';

const Tab = createBottomTabNavigator();

export default function Tabs({ isAdmin }) {
return (
    <Tab.Navigator
        screenOptions={{
        tabBarActiveTintColor: 'rgb(41, 61, 85)',
        tabBarInactiveTintColor: '#8A8078',
        headerStyle: { backgroundColor: 'rgb(41, 61, 85)' },
        headerTintColor: '#fff',
    }}
    >
        <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
            tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
    />
        <Tab.Screen
        name="Afiliados"
        component={Institutos}
        initialParams={{ isAdmin }}
        options={{
            title: 'Institutos afiliados',
            tabBarIcon: ({ color, size }) => <FontAwesome name="building" size={size} color={color} />,
        }}
    />
        <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
            tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
    />
    </Tab.Navigator>
);
}