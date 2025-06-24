import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    setError('');
    setInfo('');
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setInfo('Signup successful! Please check your email to verify your account before logging in.');
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#9CA3AF"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {info ? <Text style={styles.infoText}>{info}</Text> : null}
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
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