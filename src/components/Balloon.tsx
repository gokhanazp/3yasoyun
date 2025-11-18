// Balon komponenti (Balloon component)
// Gerçek balon görünümü için SVG benzeri tasarım

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface BalloonProps {
  color: string;
  size?: number;
  style?: ViewStyle;
}

export const Balloon: React.FC<BalloonProps> = ({ 
  color, 
  size = 100,
  style 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size * 1.2 }, style]}>
      {/* Balon gövdesi (Balloon body) */}
      <View
        style={[
          styles.balloonBody,
          {
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: size / 2,
          },
        ]}
      >
        {/* Işık efekti (Light effect) */}
        <View
          style={[
            styles.highlight,
            {
              width: size * 0.3,
              height: size * 0.4,
              borderRadius: size * 0.15,
              top: size * 0.15,
              left: size * 0.2,
            },
          ]}
        />
      </View>

      {/* Balon düğümü (Balloon knot) */}
      <View
        style={[
          styles.knot,
          {
            width: size * 0.15,
            height: size * 0.2,
            backgroundColor: color,
            top: size * 0.95,
            left: size * 0.425,
          },
        ]}
      />

      {/* Balon ipi (Balloon string) */}
      <View
        style={[
          styles.string,
          {
            width: 2,
            height: size * 0.3,
            top: size * 1.1,
            left: size * 0.49,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  balloonBody: {
    position: 'absolute',
    top: 0,
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
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ rotate: '-45deg' }],
  },
  knot: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.8,
  },
  string: {
    position: 'absolute',
    backgroundColor: '#666',
    opacity: 0.6,
  },
});

