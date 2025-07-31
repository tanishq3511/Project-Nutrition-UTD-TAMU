import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={[styles.appName, { color: '#fff' }]}><Text style={{fontWeight: 'bold'}}>Smart</Text>Bite</Text>
        <Text style={[styles.welcomeTitle, { color: '#fff' }]}>Welcome to SmartBite!</Text>
        <Text style={[styles.subtitle, { color: '#fff' }]}>Helping Aggies and Comets thrive and nourish their well-being.</Text>
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Text style={[styles.featureIcon, { color: '#fff' }]}>✔️</Text>
            <Text style={[styles.featureText, { color: '#fff' }]}>Personalized meal plans</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={[styles.featureIcon, { color: '#fff' }]}>🏫</Text>
            <Text style={[styles.featureText, { color: '#fff' }]}>Campus dining recommend-
ations</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={[styles.featureIcon, { color: '#fff' }]}>📊</Text>
            <Text style={[styles.featureText, { color: '#fff' }]}>Nutrition tracking</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={[styles.featureIcon, { color: '#fff' }]}>🤖</Text>
            <Text style={[styles.featureText, { color: '#fff' }]}>AI NutriBot for support</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.transparentButton} onPress={() => router.push('/onboarding/school')}>
          <Text style={styles.transparentButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#217a2c',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    fontSize: 16,
    color: '#222',
    flexShrink: 1,
  },
  transparentButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 0,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  transparentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 