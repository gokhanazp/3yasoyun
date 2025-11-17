// Oyun kartı bileşeni (Game card component)
// Ana menüdeki oyun kartları için

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { playClickSound } from '../utils/soundManager';

interface GameCardProps {
  title: string;              // Oyun başlığı (Game title)
  description: string;        // Oyun açıklaması (Game description)
  icon: string;               // Emoji icon
  color: string;              // Kart rengi (Card color)
  onPress: () => void;        // Tıklama fonksiyonu (Press handler)
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
}) => {
  // Animasyon için scale değeri (Scale value for animation)
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  // Basma animasyonu (Press animation)
  const handlePressIn = () => {
    // Tıklama sesi çal (Play click sound)
    playClickSound();

    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  // Bırakma animasyonu (Release animation)
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 120,
    // Gölge efekti (Shadow effect)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 48,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

