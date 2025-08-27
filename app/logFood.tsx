import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, ScrollView, ActivityIndicator, Modal, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMealContext } from '../contexts/MealContext';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export default function LogFoodScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Array<{
    food_id: string;
    serving_id: string;
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  }>>([]);
  const { addMeal } = useMealContext();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const getApiBase = () => {
    const hostUri = (Constants as any)?.expoConfig?.hostUri || (Constants as any)?.manifest?.hostUri;
    if (hostUri) {
      const host = String(hostUri).split(':')[0];
      return `http://${host}:4000`;
    }
    if (Platform.OS === 'android') return 'http://10.0.2.2:4000';
    return 'http://localhost:4000';
  };

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setError('');
    setLoading(true);
    try {
      const url = `${getApiBase()}/api/food-search?q=${encodeURIComponent(trimmed)}&limit=3`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Failed to fetch');
      const data = await resp.json();
      setResults(Array.isArray(data.items) ? data.items : []);
    } catch (e: any) {
      setError('Unable to search right now.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDiary = (item: { name: string; calories: number; carbs: number; protein: number; fat: number }) => {
    addMeal({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: item.name,
      calories: Math.round(item.calories),
      protein: Math.round(item.protein),
      carbs: Math.round(item.carbs),
      fats: Math.round(item.fat),
    });
    setConfirmText(`Added to diary: ${item.name}`);
    setConfirmVisible(true);
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      style={StyleSheet.absoluteFill}
      resizeMode="contain"
      imageStyle={{ transform: [{ scale: 4.8 }, { translateX: 90 }] }}
    >
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Log Personal Food</Text>
        <Text style={styles.subtitle}>Search for a menu item to log it to your diary.</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Results</Text>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#8B5CF6" />
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Error</Text>
              <Text style={styles.emptyStateSubtext}>{error}</Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No results yet</Text>
              <Text style={styles.emptyStateSubtext}>Start typing to search menu items</Text>
            </View>
          ) : (
            <View style={styles.resultsList}>
              {results.map((item) => (
                <View key={`${item.food_id}-${item.serving_id}`} style={styles.mealCard}>
                  <View style={styles.mealCardInfo}>
                    <Text style={styles.mealCardName}>{item.name}</Text>
                    <Text style={styles.mealCardCalories}>{Math.round(item.calories)} calories</Text>
                  </View>
                  <View style={styles.mealCardMacros}>
                    <Text style={styles.mealCardMacroText}>P: {Math.round(item.protein)}g</Text>
                    <Text style={styles.mealCardMacroText}>C: {Math.round(item.carbs)}g</Text>
                    <Text style={styles.mealCardMacroText}>F: {Math.round(item.fat)}g</Text>
                  </View>
                  <TouchableOpacity style={styles.addButton} onPress={() => handleAddToDiary(item)}>
                    <Text style={styles.addButtonText}>Add to Diary</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Powered by FatSecret */}
        <View style={styles.poweredByContainer}>
          <Image 
            source={require('../assets/images/powered_by_fatsecret_2x.png')} 
            style={styles.poweredByImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      <Modal
        visible={confirmVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" style={styles.successIcon} />
            <TouchableOpacity style={styles.confirmCloseButton} onPress={() => setConfirmVisible(false)}>
              <Text style={styles.confirmCloseButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.confirmTitle}>Success</Text>
            <Text style={styles.confirmMessage}>{confirmText}</Text>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  mealCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 4,
  },
  mealCardInfo: {
    marginBottom: 8,
  },
  mealCardName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealCardCalories: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  mealCardMacros: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  mealCardMacroText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  addButton: {
    backgroundColor: '#3B2F87',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmModalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    width: '80%',
    maxWidth: 380,
    position: 'relative',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 8,
  },
  confirmCloseButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
  confirmCloseButtonText: {
    fontSize: 22,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  confirmMessage: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  poweredByContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  poweredByImage: {
    width: 150,
    height: 30,
    opacity: 0.7,
  },
});


