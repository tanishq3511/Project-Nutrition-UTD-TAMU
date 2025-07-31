import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const dietaryOptions = [
  'High protein',
  'Low carb',
  'Low sodium',
  'High fiber',
];

const restrictionsOptions = [
  'Vegan / Vegetarian',
  'Gluten-free / Dairy-free / Nut free',
];

export default function Preferences() {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<boolean[]>([false, true]);
  const [optional, setOptional] = useState(false);
  const [macros, setMacros] = useState('');
  const router = useRouter();

  const toggleDietary = (option: string) => {
    setSelectedDietary(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const toggleRestriction = (idx: number) => {
    setSelectedRestrictions(prev => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Preferences & Restrictions</Text>
        <Text style={styles.subtitle}>How should we tailor your meals?</Text>
        <Text style={styles.sectionLabel}>Restrictions</Text>
        {restrictionsOptions.map((option, idx) => (
          <TouchableOpacity
            key={option}
            style={styles.checkboxRow}
            onPress={() => toggleRestriction(idx)}
          >
            <View style={[styles.checkbox, selectedRestrictions[idx] ? styles.checkboxChecked : styles.checkboxUnchecked]}>
              {selectedRestrictions[idx] && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setOptional(o => !o)}>
          <View style={[styles.checkbox, optional ? styles.checkboxChecked : styles.checkboxUnchecked]}>
            {optional && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Optional</Text>
        </TouchableOpacity>
        {optional && (
          <TextInput
            style={[styles.optionalInput, { color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }]}
            placeholder="Set target macros (e.g., '140g protein')"
            placeholderTextColor="#E5E7EB"
            value={macros}
            onChangeText={setMacros}
          />
        )}
        <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/onboarding/nutritionGoal')}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  sectionLabel: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  dietaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  dietaryPill: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  dietaryPillSelected: {
    backgroundColor: '#6B46C1',
  },
  dietaryPillUnselected: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dietaryPillText: {
    fontSize: 15,
  },
  dietaryPillTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dietaryPillTextUnselected: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#6B46C1',
    backgroundColor: '#6B46C1',
  },
  checkboxUnchecked: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#fff',
  },
  optionalInput: {
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
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