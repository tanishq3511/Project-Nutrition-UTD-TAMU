import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const restaurants = [
  { name: 'Dining Hall West', closing: 'Closes in 5 Hours' },
  { name: 'Papa Johns', closing: 'Closes in 3 Hours' },
  { name: 'Einstein Bros Bagels', closing: 'Closes in 5 Hours' },
  { name: 'Einstein Bros Bagels', closing: 'Closes in 5 Hours' },
];

const RestaurantCard = ({ name, closing }: { name: string; closing: string }) => (
  <TouchableOpacity style={styles.restaurantCard}>
    <View style={styles.restaurantInfo}>
      <Text style={styles.restaurantName}>{name}</Text>
      <Text style={styles.closingTime}>{closing}</Text>
    </View>
    <Text style={styles.chevronText}>⌄</Text>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B2F87" />
      <LinearGradient
        colors={['#3B2F87', '#6B46C1', '#8B5CF6']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.menuIcon}>
              {[...Array(3)].map((_, i) => <View key={i} style={styles.menuLine} />)}
            </View>
            <View>
              <Text style={styles.greeting}>Good Afternoon</Text>
              <Text style={styles.name}>Dhivyesh!</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {['🚶', '🚲'].map((icon, i) => (
              <TouchableOpacity key={i} style={styles.iconButton}>
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIconText}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Your order?"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.qrIconText}>📱</Text>
        </View>

        {/* Lunch Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Lunch is served!</Text>
          <Text style={styles.lastUpdated}>Last Updated March 25 2:00 PM</Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {['Dining Hall', 'Restaurants', 'Market'].map((label, i) => (
            <TouchableOpacity key={label} style={[styles.filterButton, i === 0 && styles.activeFilter]}>
              <Text style={i === 0 ? styles.filterTextActive : styles.filterText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Restaurant List */}
        <ScrollView style={styles.restaurantList} showsVerticalScrollIndicator={false}>
          {restaurants.map((r, i) => <RestaurantCard key={i} {...r} />)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B2F87',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: 'white',
    marginVertical: 2,
  },
  greeting: {
    color: '#E5E7EB',
    fontSize: 14,
    opacity: 0.8,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIconText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  qrIconText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastUpdated: {
    color: '#E5E7EB',
    fontSize: 12,
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  filterTextActive: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  restaurantList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  closingTime: {
    color: '#E5E7EB',
    fontSize: 14,
    opacity: 0.8,
  },
  chevronText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DashboardScreen; 