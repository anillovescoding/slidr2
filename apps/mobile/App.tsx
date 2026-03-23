import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Library, Settings, Sparkles } from 'lucide-react-native';

import { loadAuth } from './src/lib/pocketbase';
import { useAuthStore } from './src/store/useAuthStore';
import { Theme } from './src/lib/theme';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabBackground() {
  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTransparent: true,
        headerBackground: () => (
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        headerTitleStyle: { 
          fontWeight: '900', 
          color: Theme.colors.foreground, 
          fontSize: 18,
          letterSpacing: -0.5,
        },
        tabBarStyle: { 
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: 85,
          paddingBottom: 25,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => <TabBackground />,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home size={22} color={color} />;
          if (route.name === 'Library') return <Library size={22} color={color} />;
          if (route.name === 'Settings') return <Settings size={22} color={color} />;
          return <Home size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'DASHBOARD' }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'COLLECTIONS' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'PROTOCOL' }} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    loadAuth().finally(() => setBooting(false));
  }, []);

  if (booting) {
    return (
      <View style={styles.loader}>
        <View style={styles.logoBox}>
          <Sparkles size={32} color="#fff" />
        </View>
        <ActivityIndicator color={Theme.colors.primary} style={{ marginTop: 32 }} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: Theme.colors.primary,
        background: Theme.colors.background,
        card: Theme.colors.card,
        text: Theme.colors.foreground,
        border: Theme.colors.glassBorder,
        notification: Theme.colors.accent,
      },
      fonts: Platform.select({
        ios: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
        default: {
          regular: { fontFamily: 'sans-serif', fontWeight: '400' },
          medium: { fontFamily: 'sans-serif-medium', fontWeight: '500' },
          bold: { fontFamily: 'sans-serif', fontWeight: '700' },
          heavy: { fontFamily: 'sans-serif', fontWeight: '900' },
        }
      }) as any
    }}>
      <StatusBar style="light" />
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: { 
    flex: 1, 
    backgroundColor: Theme.colors.background, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  logoBox: { 
    width: 80, 
    height: 80, 
    borderRadius: 24, 
    backgroundColor: Theme.colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: Theme.colors.primary, 
    shadowOpacity: 0.5, 
    shadowRadius: 30, 
    elevation: 20 
  },
});
