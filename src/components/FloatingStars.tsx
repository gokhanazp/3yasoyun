import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface FloatingStarsProps {
  count?: number; // Yıldız/kelebek sayısı (Number of stars/butterflies)
  emoji?: string; // Gösterilecek emoji (Emoji to display)
}

// Yüzen yıldızlar/kelebekler bileşeni (Floating stars/butterflies component)
export const FloatingStars: React.FC<FloatingStarsProps> = ({ count = 20, emoji = '⭐' }) => {
  const stars = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * width, // Static position (not animated)
      y: Math.random() * height, // Static position (not animated)
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      opacity: new Animated.Value(0.3 + Math.random() * 0.4),
    }))
  ).current;

  useEffect(() => {
    // Her yıldız için sonsuz animasyon (Infinite animation for each star)
    const animations = stars.map((star) => {
      return Animated.loop(
        Animated.sequence([
          // Büyüme ve parıldama (Scale up and shine)
          Animated.parallel([
            Animated.timing(star.scale, {
              toValue: 1.2,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(star.opacity, {
              toValue: 0.8,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
          // Küçülme ve solma (Scale down and fade)
          Animated.parallel([
            Animated.timing(star.scale, {
              toValue: 0.5,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(star.opacity, {
              toValue: 0.3,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((star, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              transform: [{ scale: star.scale }],
              opacity: star.opacity,
            },
          ]}
        >
          {emoji}
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    fontSize: 20,
  },
});

