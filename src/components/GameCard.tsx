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
  // Animasyon değerleri (Animation values)
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const rotateValue = React.useRef(new Animated.Value(0)).current;
  const bounceValue = React.useRef(new Animated.Value(0)).current;

  // Sürekli zıplama animasyonu (Continuous bounce animation)
  React.useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();

    return () => bounceAnimation.stop();
  }, []);

  // Icon zıplama interpolasyonu (Icon bounce interpolation)
  const iconTranslateY = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  // Icon dönme interpolasyonu (Icon rotation interpolation)
  const iconRotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  // Basma animasyonu (Press animation)
  const handlePressIn = () => {
    // Tıklama sesi çal (Play click sound)
    playClickSound();

    // Kart küçülme (Card scale down)
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    // Icon dönme (Icon rotation)
    Animated.spring(rotateValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Bırakma animasyonu (Release animation)
  const handlePressOut = () => {
    // Kart normale dön (Card scale back)
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Icon normale dön (Icon rotation back)
    Animated.spring(rotateValue, {
      toValue: 0,
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
        {/* Dekoratif yıldızlar (Decorative stars) */}
        <View style={styles.starsContainer}>
          <Text style={[styles.star, styles.star1]}>⭐</Text>
          <Text style={[styles.star, styles.star2]}>✨</Text>
          <Text style={[styles.star, styles.star3]}>⭐</Text>
        </View>

        {/* Icon container - Animasyonlu (Animated icon container) */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { translateY: iconTranslateY },
                { rotate: iconRotate },
              ],
            },
          ]}
        >
          <View style={styles.iconBackground}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        </Animated.View>

        {/* Metin container (Text container) */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Oyna butonu (Play button) */}
          <View style={styles.playButton}>
            <Text style={styles.playButtonText}>OYNA! 🎮</Text>
          </View>
        </View>

        {/* Sağ ok işareti (Right arrow) */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>▶️</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 150,
    position: 'relative',
    overflow: 'visible',
    // Daha güçlü gölge efekti (Stronger shadow effect)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    // Kalın beyaz kenarlık (Thick white border)
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    fontSize: 20,
  },
  star1: {
    top: 10,
    left: 15,
  },
  star2: {
    top: 15,
    right: 20,
  },
  star3: {
    bottom: 15,
    right: 15,
  },
  iconContainer: {
    marginRight: 15,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    // Çift kenarlık efekti (Double border effect)
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    // İç gölge (Inner shadow)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    fontSize: 60,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  description: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  arrowContainer: {
    marginLeft: 5,
  },
  arrow: {
    fontSize: 24,
  },
});

