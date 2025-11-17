// Oyun butonu bileşeni (Game button component)
// Büyük, kolay tıklanabilir butonlar için

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { playClickSound } from '../utils/soundManager';

interface GameButtonProps {
  title: string;              // Buton metni (Button text)
  onPress: () => void;        // Tıklama fonksiyonu (Press handler)
  color?: string;             // Buton rengi (Button color)
  icon?: string;              // Emoji icon (opsiyonel)
  style?: ViewStyle;          // Ek stil (Additional style)
  textStyle?: TextStyle;      // Metin stili (Text style)
  disabled?: boolean;         // Devre dışı mı? (Is disabled?)
}

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  color = COLORS.primary,
  icon,
  style,
  textStyle,
  disabled = false,
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
        style={[
          styles.button,
          { backgroundColor: color },
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minWidth: 150,
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
  disabled: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 32,
    marginRight: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

