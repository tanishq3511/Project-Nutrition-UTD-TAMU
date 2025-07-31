import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const options = [
  'Lose weight',
  'Maintain weight',
  'Build muscle / gain weight',
  'Just eat healthier',
];

export default function NutritionGoal() {
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>What's your nutrition goal?</Text>
        <View style={styles.optionsContainer}>
          {options.map((option, idx) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => setSelected(idx)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioOuter, selected === idx ? styles.radioOuterSelected : styles.radioOuterUnselected]}>
                {selected === idx && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push({ pathname: '/onboarding/personalInformation', params: { goal: options[selected] } })}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: 'transparent',
  },
  radioOuterSelected: {
    borderColor: '#6B46C1',
    backgroundColor: '#6B46C1',
  },
  radioOuterUnselected: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 17,
    color: '#fff',
  },
  continueButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 