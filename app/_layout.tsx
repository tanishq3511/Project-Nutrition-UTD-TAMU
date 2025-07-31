import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Platform } from 'react-native';

import { useColorScheme } from '../hooks/useColorScheme';
import { MealProvider } from '../contexts/MealContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <MealProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="personalInformation" options={{ headerShown: false }} />
          <Stack.Screen name="nutritionGoal" options={{ headerShown: false }} />
          <Stack.Screen name="preferences" options={{ headerShown: false }} />
          <Stack.Screen name="ready" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/welcomeFirst" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/school" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/personalInformation" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/macroResults" options={{ headerShown: false }} />

          <Stack.Screen name="onboarding/nutritionGoal" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/preferences" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/ready" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </MealProvider>
  );
}
