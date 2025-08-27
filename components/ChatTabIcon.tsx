import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { useChat } from '../contexts/ChatContext';

interface ChatTabIconProps {
  color: string;
  size: number;
}

export default function ChatTabIcon({ color, size }: ChatTabIconProps) {
  const { hasUnreadMessages } = useChat();

  return (
    <View style={styles.container}>
      <IconSymbol size={size} name="ellipsis.circle" color={color} />
      {hasUnreadMessages && (
        <View style={[styles.badge, { backgroundColor: '#FF3B30' }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
