import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function Ready() {
  const router = useRouter();
  // Replace 'Anish' with dynamic name if available
  const userName = 'Anish';
  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: '#fff' }]}>Welcome, {userName}!</Text>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={[styles.brand, { color: '#fff' }]}><Text style={{fontWeight: 'bold'}}>Smart</Text> <Text style={{color: '#B7EFC5', fontWeight: 'bold'}}>Bite</Text></Text>
        <Text style={[styles.subtitle, { color: '#fff' }]}>Based on your input, your SmartBite dashboard is ready.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/dashboard')}>
          <Text style={styles.buttonText}>Open Dashboard</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#fff',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 