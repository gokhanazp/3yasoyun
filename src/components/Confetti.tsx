import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ConfettiProps {
  count?: number; // Konfeti sayısı (Number of confetti pieces)
}

// Konfeti bileşeni (Confetti component)
export const Confetti: React.FC<ConfettiProps> = ({ count = 30 }) => {
  const confettiPieces = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * width, // Static number, not Animated.Value
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    // Her konfeti parçası için animasyon (Animation for each confetti piece)
    const animations = confettiPieces.map((piece, index) => {
      return Animated.parallel([
        // Aşağı düşme (Fall down)
        Animated.timing(piece.y, {
          toValue: height + 100,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        // Dönme (Rotation)
        Animated.timing(piece.rotation, {
          toValue: Math.random() * 10,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        // Solma (Fade out)
        Animated.timing(piece.opacity, {
          toValue: 0,
          duration: 2000,
          delay: 500,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, animations).start();
  }, []);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece, index) => {
        const color = colors[index % colors.length];
        const size = 8 + Math.random() * 8;
        
        return (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                left: piece.x,
                width: size,
                height: size,
                backgroundColor: color,
                transform: [
                  { translateY: piece.y },
                  {
                    rotate: piece.rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                opacity: piece.opacity,
              },
            ]}
          />
        );
      })}
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
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 4,
  },
});

