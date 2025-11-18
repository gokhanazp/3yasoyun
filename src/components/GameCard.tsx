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
    borderRadius: 25,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 130,
    // Daha güçlü gölge efekti (Stronger shadow effect)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    // Beyaz kenarlık (White border)
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    // İç gölge efekti (Inner shadow effect)
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  icon: {
    fontSize: 52,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

