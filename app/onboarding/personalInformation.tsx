import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground, Button, Platform, ScrollView, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Modal import removed, switching to inline dropdown
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

type HeightOption = { label: string; value: number };
const heightOptions: HeightOption[] = [];
for (let ft = 4; ft <= 7; ft++) {
  for (let inch = 0; inch < 12; inch++) {
    heightOptions.push({ label: `${ft} ft ${inch} in`, value: ft * 12 + inch });
  }
}

const activityLevels = [
  { label: 'Sedentary (little or no exercise)', value: 1.2 },
  { label: 'Light Exercise (1-3 days/week)', value: 1.375 },
  { label: 'Moderate Exercise (3-5 days/week)', value: 1.55 },
  { label: 'Heavy Exercise (6-7 days/week)', value: 1.725 },
  { label: 'Athlete (very hard exercise & physical job)', value: 1.9 },
];

import { useLocalSearchParams } from 'expo-router';

export default function PersonalInformation() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState(heightOptions[0].value);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(activityLevels[0].value);
  const [heightDropdownOpen, setHeightDropdownOpen] = useState(false);
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);
  const scrollRef = useRef(null);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ goal?: string }>();
  const goal = params.goal || '';
  const { setUserProfile } = useUser();

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <Text style={[styles.title, { color: '#fff' }]}>Personal Information</Text>
          <Text style={[styles.subtitle, { color: '#fff' }]}>Let's get to know you.</Text>
          <View style={{ width: '100%', marginBottom: 12 }}>
            <TextInput
              style={[styles.input, { color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }]}
              placeholder="Weight (lbs)"
              placeholderTextColor="#E5E7EB"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <View style={{ width: '100%', marginBottom: 12 }}>
            <Text style={{ color: '#fff', marginBottom: 4 }}>Height</Text>
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                  padding: 14,
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  setHeightDropdownOpen((open) => !open);
                  setActivityDropdownOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>
                  {heightOptions.find((h) => h.value === height)?.label || 'Select height'}
                </Text>
                <Ionicons name={heightDropdownOpen ? 'chevron-up' : 'chevron-down'} size={22} color="#fff" />
              </TouchableOpacity>
              {heightDropdownOpen && (
                <TouchableOpacity
                  style={{ position: 'absolute', top: 54, left: 0, right: 0, bottom: 0, zIndex: 1 }}
                  activeOpacity={1}
                  onPress={() => setHeightDropdownOpen(false)}
                >
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                </TouchableOpacity>
              )}
              {heightDropdownOpen && (
                <View style={{
                  backgroundColor: '#23232b',
                  borderRadius: 12,
                  marginTop: 4,
                  padding: 4,
                  maxHeight: 220,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                  zIndex: 10,
                  opacity: heightDropdownOpen ? 1 : 0,
                  transform: [{ translateY: heightDropdownOpen ? 0 : -10 }],
                  // transition removed; not supported in React Native
                }}>
                  <ScrollView>
                    {heightOptions.map((h) => (
                      <TouchableOpacity
                        key={h.value}
                        style={{
                          padding: 12,
                          backgroundColor: height === h.value ? '#6B46C1' : 'transparent',
                          borderRadius: 8,
                          marginBottom: 2,
                        }}
                        onPress={() => {
                          setHeight(h.value);
                          setHeightDropdownOpen(false);
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: height === h.value ? 'bold' : 'normal', fontSize: 16 }}>{h.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          <TextInput
            style={[styles.input, { color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }]}
            placeholder="Age"
            placeholderTextColor="#E5E7EB"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <TouchableOpacity
            style={[styles.activityButton, gender === 'male' ? styles.activityButtonSelected : styles.activityButtonUnselected, { flex: 1, marginRight: 4 }]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.activityText, gender === 'male' ? styles.activityTextSelected : styles.activityTextUnselected]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.activityButton, gender === 'female' ? styles.activityButtonSelected : styles.activityButtonUnselected, { flex: 1, marginLeft: 4 }]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.activityText, gender === 'female' ? styles.activityTextSelected : styles.activityTextUnselected]}>Female</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.activityLabel, { color: '#fff' }]}>Activity level</Text>
        <View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              padding: 14,
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 16,
            }}
            onPress={() => {
              setActivityDropdownOpen((open) => !open);
              setHeightDropdownOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {activityLevels.find((a) => a.value === activity)?.label || 'Select activity'}
            </Text>
            <Ionicons name={activityDropdownOpen ? 'chevron-up' : 'chevron-down'} size={22} color="#fff" />
          </TouchableOpacity>
          {activityDropdownOpen && (
            <TouchableOpacity
              style={{ position: 'absolute', top: 54, left: 0, right: 0, bottom: 0, zIndex: 1 }}
              activeOpacity={1}
              onPress={() => setActivityDropdownOpen(false)}
            >
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </TouchableOpacity>
          )}
          {activityDropdownOpen && (
            <View style={{
              backgroundColor: '#23232b',
              borderRadius: 12,
              marginTop: 4,
              padding: 4,
              maxHeight: 220,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              zIndex: 10,
              opacity: activityDropdownOpen ? 1 : 0,
              transform: [{ translateY: activityDropdownOpen ? 0 : -10 }],
              // transition removed; not supported in React Native
            }}>
              <ScrollView>
                {activityLevels.map((a) => (
                  <TouchableOpacity
                    key={a.value}
                    style={{
                      padding: 12,
                      backgroundColor: activity === a.value ? '#6B46C1' : 'transparent',
                      borderRadius: 8,
                      marginBottom: 2,
                    }}
                    onPress={() => {
                      setActivity(a.value);
                      setActivityDropdownOpen(false);
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: activity === a.value ? 'bold' : 'normal', fontSize: 16 }}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        {/* Modal for activity dropdown removed, keep only the inline dropdown for height */}
          <TouchableOpacity style={[styles.continueButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]} onPress={() => {
            // Calculate TDEE
            const wLbs = parseFloat(weight);
            const hInches = typeof height === 'number' ? height : 0;
            const a = parseInt(age, 10);
            const w = wLbs * 0.453592;
            const h = hInches * 2.54;
            let bmr = gender === 'male'
              ? 10 * w + 6.25 * h - 5 * a + 5
              : 10 * w + 6.25 * h - 5 * a - 161;
            const tdee = Math.round(bmr * activity);
            
            // Calculate height in feet and inches
            const heightFeet = Math.floor(hInches / 12);
            const heightInches = hInches % 12;
            
            // Save user profile
            setUserProfile({
              weight: wLbs,
              height: hInches,
              age: a,
              gender,
              activityLevel: activity,
              nutritionGoal: goal,
              tdee,
              heightFeet,
              heightInches
            });
            
            router.push({ pathname: '/onboarding/macroResults', params: { tdee: tdee.toString(), goal } });
          }}>
            <Text style={[styles.continueButtonText, { color: '#fff' }]}>Calculate TDEE</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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