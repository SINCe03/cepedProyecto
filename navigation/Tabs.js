import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, Building2, UserCircle } from 'lucide-react-native';
import Home from '../screens/Home';
import Institutos from '../screens/Institutos';
import Perfil from '../screens/Perfil';

const Tab = createBottomTabNavigator();

export default function Tabs({ isAdmin }) {
return (
    <Tab.Navigator
        screenOptions={{
        tabBarActiveTintColor: 'rgb(210, 174, 109)',
        tabBarInactiveTintColor: '#9AA3AC',
        headerShown: false,
    }}
    >
        <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
        tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} strokeWidth={2} />,
    }}
    />
        <Tab.Screen
        name="Afiliados"
        component={Institutos}
        initialParams={{ isAdmin }}
        options={{
        title: 'Institutos afiliados',
        tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} strokeWidth={2} />,
    }}
    />
        <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
            tabBarIcon: ({ color, size }) => <UserCircle size={size} color={color} strokeWidth={2} />,
    }}
    />
    </Tab.Navigator>
);
}