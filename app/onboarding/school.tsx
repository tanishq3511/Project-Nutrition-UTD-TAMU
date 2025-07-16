import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const schools = [
  { name: 'UT Dallas', value: 'utd' },
  { name: 'Texas A&M', value: 'tamu' },
];

export default function School() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Your School</Text>
        <Text style={styles.subtitle}>Which university do you attend?</Text>
        <View style={styles.schoolsRow}>
          {schools.map(school => (
            <TouchableOpacity
              key={school.value}
              style={[
                styles.schoolPill,
                selected === school.value ? styles.schoolPillSelected : styles.schoolPillUnselected,
              ]}
              onPress={() => setSelected(school.value)}
            >
              <Text
                style={[
                  styles.schoolPillText,
                  selected === school.value ? styles.schoolPillTextSelected : styles.schoolPillTextUnselected,
                ]}
              >
                {school.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, !selected && { opacity: 0.5 }]}
          onPress={() => selected && router.push('/onboarding/ready')}
          disabled={!selected}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 120,
  },
  backButton: {
    position: 'absolute',
    top: 66,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'left',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'left',
  },
  schoolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  schoolPill: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginRight: 16,
    marginBottom: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  schoolPillSelected: {
    backgroundColor: '#6B46C1',
  },
  schoolPillUnselected: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  schoolPillText: {
    fontSize: 18,
  },
  schoolPillTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  schoolPillTextUnselected: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 