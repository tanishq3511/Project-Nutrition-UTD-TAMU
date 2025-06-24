import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setInfo('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError('Please verify your email before logging in.');
        setInfo('A verification email was sent to your address.');
        return;
      }
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#3B2F87', '#6B46C1', '#8B5CF6']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {info ? <Text style={styles.infoText}>{info}</Text> : null}
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/signup')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#E5E7EB',
    fontSize: 16,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 24,
  },
  linkText: {
    color: '#E5E7EB',
    fontSize: 15,
  },
  linkHighlight: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    color: '#34D399',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
}); 