import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function PersonalInformation() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState('');

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={[styles.title, { color: '#fff' }]}>Personal Information</Text>
        <Text style={[styles.subtitle, { color: '#fff' }]}>Let's get to know you.</Text>
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }]}
          placeholder="Weight (lbs/kg)"
          placeholderTextColor="#E5E7EB"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }]}
          placeholder="Height"
          placeholderTextColor="#E5E7EB"
          value={height}
          onChangeText={setHeight}
        />
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }]}
          placeholder="Age"
          placeholderTextColor="#E5E7EB"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }]}
          placeholder="Gender"
          placeholderTextColor="#E5E7EB"
          value={gender}
          onChangeText={setGender}
        />
        <Text style={[styles.activityLabel, { color: '#fff' }]}>Activity level</Text>
        <View style={styles.activityRow}>
          <TouchableOpacity
            style={[styles.activityButton, activity === 'Low' ? styles.activityButtonSelected : styles.activityButtonUnselected]}
            onPress={() => setActivity('Low')}
          >
            <Text style={[styles.activityText, activity === 'Low' ? styles.activityTextSelected : styles.activityTextUnselected]}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.activityButton, activity === 'Moderate' ? styles.activityButtonSelected : styles.activityButtonUnselected]}
            onPress={() => setActivity('Moderate')}
          >
            <Text style={[styles.activityText, activity === 'Moderate' ? styles.activityTextSelected : styles.activityTextUnselected]}>Moderate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.activityButton, activity === 'High' ? styles.activityButtonSelected : styles.activityButtonUnselected]}
            onPress={() => setActivity('High')}
          >
            <Text style={[styles.activityText, activity === 'High' ? styles.activityTextSelected : styles.activityTextUnselected]}>High</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]} onPress={() => {
          const { push } = require('expo-router').useRouter();
          push('/onboarding/nutritionGoal');
        }}>
          <Text style={[styles.continueButtonText, { color: '#fff' }]}>Continue</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    color: '#222',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityLabel: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  activityButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityButtonSelected: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  activityButtonUnselected: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activityText: {
    color: '#222',
    fontSize: 16,
  },
  activityTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activityTextUnselected: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: '#217a2c',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 