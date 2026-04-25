import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

import HomeScreen from '../screens/HomeScreen';
import TrainerHomeScreen from '../screens/TrainerHomeScreen';
import BookingsScreen from '../screens/BookingsScreen';
import TrainerBookingsScreen from '../screens/TrainerBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrainerDetailScreen from '../screens/TrainerDetailScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BecomeTrainerScreen from '../screens/BecomeTrainerScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import HelpScreen from '../screens/HelpScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import RatingsReviewScreen from '../screens/RatingsReviewScreen';
import ChatScreen from '../screens/ChatScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import TrainerEarningsScreen from '../screens/TrainerEarningsScreen';
import PTCalendarScreen from '../screens/PTCalendarScreen';
import ClientProgramScreen from '../screens/ClientProgramScreen';
import SessionTrackerScreen from '../screens/SessionTrackerScreen';
import ClientProgressScreen from '../screens/ClientProgressScreen';
import AddClientScreen from '../screens/AddClientScreen';
import TrainerEditProfileScreen from '../screens/TrainerEditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.dark2, borderTopColor: colors.dark4, borderTopWidth: 0.5, paddingBottom: 20, paddingTop: 10, height: 70 },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text> }} />
      <Tab.Screen name="Bookings" component={BookingsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📅</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function TrainerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.dark2, borderTopColor: colors.dark4, borderTopWidth: 0.5, paddingBottom: 20, paddingTop: 10, height: 70 },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tab.Screen name="Dashboard" component={TrainerHomeScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text> }} />
      <Tab.Screen name="Sessions" component={TrainerBookingsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📅</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function RoleBasedTabs() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setRole('client'); return; }
      const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
setRole(data?.role || 'client');
    } catch {
      setRole('client');
    }
  };

  if (!role) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return role === 'trainer' ? <TrainerTabs /> : <ClientTabs />;
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={RoleBasedTabs} />
      <Stack.Screen name="TrainerDetail" component={TrainerDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BecomeTrainer" component={BecomeTrainerScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="RatingsReview" component={RatingsReviewScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="TrainerEarnings" component={TrainerEarningsScreen} />
      <Stack.Screen name="PTCalendar" component={PTCalendarScreen} />
      <Stack.Screen name="ClientProgram" component={ClientProgramScreen} />
      <Stack.Screen name="SessionTracker" component={SessionTrackerScreen} />
      <Stack.Screen name="ClientProgress" component={ClientProgressScreen} />
      <Stack.Screen name="AddClient" component={AddClientScreen} />
      <Stack.Screen name="TrainerEditProfile" component={TrainerEditProfileScreen} />
    </Stack.Navigator>
  );
}
