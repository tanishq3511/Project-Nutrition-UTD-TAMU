import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import ChatBot from '../../components/ChatBot';
import { useChat } from '../../contexts/ChatContext';

export default function MoreScreen() {
  const [showChatBot, setShowChatBot] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { setUnreadStatus } = useChat();

  if (showChatBot) {
    return <ChatBot onClose={() => {
      setShowChatBot(false);
      setUnreadStatus(false);
    }} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>More Options</Text>
        
        {/* Chatbot Section */}
        <View style={[styles.section, { backgroundColor: colors.background === '#fff' ? '#f8f9fa' : '#2a2a2a' }]}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setShowChatBot(true);
              setUnreadStatus(false);
            }}
          >
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.tint }]}>
                <IconSymbol name="message.circle.fill" size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  AI Nutrition Assistant
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.tabIconDefault }]}>
                  Get personalized nutrition and fitness advice
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.tabIconDefault} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Other Options */}
        <View style={[styles.section, { backgroundColor: colors.background === '#fff' ? '#f8f9fa' : '#2a2a2a' }]}>
          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF6B6B' }]}>
                <IconSymbol name="person.circle.fill" size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  Profile Settings
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.tabIconDefault }]}>
                  Manage your personal information
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.tabIconDefault} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#4ECDC4' }]}>
                <IconSymbol name="bell.fill" size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  Notifications
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.tabIconDefault }]}>
                  Customize your notification preferences
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.tabIconDefault} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#45B7D1' }]}>
                <IconSymbol name="gear" size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  App Settings
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.tabIconDefault }]}>
                  Configure app preferences and appearance
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.tabIconDefault} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#96CEB4' }]}>
                <IconSymbol name="questionmark.circle.fill" size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  Help & Support
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.tabIconDefault }]}>
                  Get help and contact support
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.tabIconDefault} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 