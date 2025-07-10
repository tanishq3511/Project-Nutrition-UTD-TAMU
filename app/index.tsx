import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/onboarding/welcomeFirst');
      });
    }, 2000); // 2 seconds splash
    return () => clearTimeout(timer);
  }, [router, fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.appName}><Text style={{fontWeight: 'bold'}}>Smart</Text>Bite</Text>
      <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 32 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    borderRadius: 24,
  },
  appName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 