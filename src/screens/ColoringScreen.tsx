// Boyama oyunu ekranı (Coloring game screen)
// Çocuklar için basit boyama oyunu

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LEARNING_COLORS } from '../constants/colors';
import { speakTurkish } from '../utils/soundManager';

const { width, height } = Dimensions.get('window');

type ColoringScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Coloring'
>;

interface ColoringScreenProps {
  navigation: ColoringScreenNavigationProp;
}

// Boyama şablonları (Coloring templates)
const TEMPLATES = [
  { id: 'rainbow', name: 'Gökkuşağı', emoji: '🌈', parts: 7 },
  { id: 'sun', name: 'Güneş', emoji: '☀️', parts: 1 },
  { id: 'flower', name: 'Çiçek', emoji: '🌸', parts: 5 },
  { id: 'butterfly', name: 'Kelebek', emoji: '🦋', parts: 4 },
  { id: 'heart', name: 'Kalp', emoji: '❤️', parts: 1 },
  { id: 'star', name: 'Yıldız', emoji: '⭐', parts: 1 },
];

export const ColoringScreen: React.FC<ColoringScreenProps> = ({ navigation }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(LEARNING_COLORS[0].color);
  const [coloredParts, setColoredParts] = useState<{ [key: string]: string }>({});

  // Geri butonu (Back button)
  const handleBack = () => {
    navigation.goBack();
  };

  // Şablon seçimi (Template selection)
  const handleTemplateSelect = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setColoredParts({});
    speakTurkish(`${templateName} boyamaya hazır!`);
  };

  // Renk seçimi (Color selection)
  const handleColorSelect = (color: typeof LEARNING_COLORS[0]) => {
    setSelectedColor(color.color);
    speakTurkish(color.name);
  };

  // Bölge boyama (Paint part)
  const handlePartPress = (partId: string) => {
    setColoredParts({
      ...coloredParts,
      [partId]: selectedColor,
    });
  };

  // Temizle (Clear)
  const handleClear = () => {
    setColoredParts({});
    speakTurkish('Temizlendi!');
  };

  return (
    <View style={styles.container}>
      {/* Arka plan (Background) */}
      <LinearGradient
        colors={['#E8F5E9', '#FFF9C4', '#FFE0B2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎨 Boyama Oyunu</Text>
          {selectedTemplate && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>🗑️ Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Şablon seçimi veya boyama alanı (Template selection or coloring area) */}
        {!selectedTemplate ? (
          <ScrollView style={styles.templatesContainer} contentContainerStyle={styles.templatesContent}>
            <Text style={styles.instructionText}>Boyamak istediğin resmi seç! 🎨</Text>
            <View style={styles.templatesGrid}>
              {TEMPLATES.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateCard}
                  onPress={() => handleTemplateSelect(template.id, template.name)}
                >
                  <Text style={styles.templateEmoji}>{template.emoji}</Text>
                  <Text style={styles.templateName}>{template.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.coloringArea}>
            {selectedTemplate === 'rainbow' && (
              <RainbowTemplate coloredParts={coloredParts} onPartPress={handlePartPress} />
            )}
            {selectedTemplate === 'sun' && (
              <SunTemplate coloredParts={coloredParts} onPartPress={handlePartPress} />
            )}
            {selectedTemplate === 'flower' && (
              <FlowerTemplate coloredParts={coloredParts} onPartPress={handlePartPress} />
            )}
            {selectedTemplate === 'heart' && (
              <HeartTemplate coloredParts={coloredParts} onPartPress={handlePartPress} />
            )}
            {selectedTemplate === 'star' && (
              <StarTemplate coloredParts={coloredParts} onPartPress={handlePartPress} />
            )}
            {selectedTemplate === 'butterfly' && (
              <ButterflyTemplate coloredParts={coloredParts} onPartPress={handlePartPress} />
            )}
          </View>
        )}

        {/* Renk paleti (Color palette) */}
        <View style={styles.paletteContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteContent}>
            {LEARNING_COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorCrayon,
                  { backgroundColor: color.color },
                  selectedColor === color.color && styles.selectedCrayon,
                ]}
                onPress={() => handleColorSelect(color)}
              >
                <View style={styles.crayonTip} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FF5722',
    fontWeight: 'bold',
  },
  templatesContainer: {
    flex: 1,
  },
  templatesContent: {
    padding: 20,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  templateEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  coloringArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paletteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 15,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  paletteContent: {
    paddingHorizontal: 10,
  },
  colorCrayon: {
    width: 50,
    height: 120,
    marginHorizontal: 5,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#333',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedCrayon: {
    borderWidth: 5,
    borderColor: '#FFD700',
    transform: [{ scale: 1.1 }],
  },
  crayonTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 22,
    borderRightWidth: 22,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    alignSelf: 'center',
    marginBottom: -3,
  },
});

// Şablon component tipleri (Template component types)
interface TemplateProps {
  coloredParts: { [key: string]: string };
  onPartPress: (partId: string) => void;
}

// Gökkuşağı şablonu (Rainbow template)
const RainbowTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const rainbowParts = [
    { id: 'arc1', color: coloredParts['arc1'] || '#FFFFFF', top: 50, width: 300, height: 150 },
    { id: 'arc2', color: coloredParts['arc2'] || '#FFFFFF', top: 80, width: 270, height: 135 },
    { id: 'arc3', color: coloredParts['arc3'] || '#FFFFFF', top: 110, width: 240, height: 120 },
    { id: 'arc4', color: coloredParts['arc4'] || '#FFFFFF', top: 140, width: 210, height: 105 },
    { id: 'arc5', color: coloredParts['arc5'] || '#FFFFFF', top: 170, width: 180, height: 90 },
    { id: 'arc6', color: coloredParts['arc6'] || '#FFFFFF', top: 200, width: 150, height: 75 },
    { id: 'arc7', color: coloredParts['arc7'] || '#FFFFFF', top: 230, width: 120, height: 60 },
  ];

  // Her bölge için ayrı PanResponder (Separate PanResponder for each part)
  const createPanResponder = (partId: string) => {
    return useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          // Dokunma başladı (Touch started)
          onPartPress(partId);
        },
        onPanResponderMove: () => {
          // Parmak hareket ediyor (Finger moving)
          onPartPress(partId);
        },
      })
    ).current;
  };

  return (
    <View style={templateStyles.rainbowContainer}>
      {rainbowParts.map((part, index) => {
        const panResponder = createPanResponder(part.id);
        return (
          <View
            key={part.id}
            style={[
              templateStyles.rainbowArc,
              {
                backgroundColor: part.color,
                width: part.width,
                height: part.height,
                top: part.top,
              },
            ]}
            {...panResponder.panHandlers}
          />
        );
      })}
      {/* Bulutlar (Clouds) */}
      <View
        style={[templateStyles.cloud, { left: 20, bottom: 20 }]}
        {...createPanResponder('cloud1').panHandlers}
      >
        <View
          style={[templateStyles.cloudPart, { backgroundColor: coloredParts['cloud1'] || '#FFFFFF' }]}
        />
      </View>
      <View
        style={[templateStyles.cloud, { right: 20, bottom: 20 }]}
        {...createPanResponder('cloud2').panHandlers}
      >
        <View
          style={[templateStyles.cloudPart, { backgroundColor: coloredParts['cloud2'] || '#FFFFFF' }]}
        />
      </View>
    </View>
  );
};

// Güneş şablonu (Sun template)
const SunTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPartPress('sun');
      },
      onPanResponderMove: () => {
        onPartPress('sun');
      },
    })
  ).current;

  return (
    <View style={templateStyles.sunContainer}>
      <View
        style={[templateStyles.sunCircle, { backgroundColor: coloredParts['sun'] || '#FFFFFF' }]}
        {...panResponder.panHandlers}
      />
      {[...Array(12)].map((_, i) => (
        <View
          key={i}
          style={[
            templateStyles.sunRay,
            {
              transform: [{ rotate: `${i * 30}deg` }],
              backgroundColor: coloredParts['sun'] || '#FFFFFF',
            },
          ]}
        />
      ))}
    </View>
  );
};

// Çiçek şablonu (Flower template)
const FlowerTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const petalPositions = [
    { top: 50, left: 120 },
    { top: 80, left: 180 },
    { top: 140, left: 180 },
    { top: 170, left: 120 },
    { top: 140, left: 60 },
    { top: 80, left: 60 },
  ];

  const createPanResponder = (partId: string) => {
    return useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          onPartPress(partId);
        },
        onPanResponderMove: () => {
          onPartPress(partId);
        },
      })
    ).current;
  };

  return (
    <View style={templateStyles.flowerContainer}>
      {/* Yapraklar (Petals) */}
      {petalPositions.map((pos, i) => {
        const panResponder = createPanResponder(`petal${i}`);
        return (
          <View
            key={`petal${i}`}
            style={[
              templateStyles.petal,
              { top: pos.top, left: pos.left, backgroundColor: coloredParts[`petal${i}`] || '#FFFFFF' },
            ]}
            {...panResponder.panHandlers}
          />
        );
      })}
      {/* Merkez (Center) */}
      <View
        style={[templateStyles.flowerCenter, { backgroundColor: coloredParts['center'] || '#FFFFFF' }]}
        {...createPanResponder('center').panHandlers}
      />
      {/* Gövde (Stem) */}
      <View
        style={[templateStyles.stem, { backgroundColor: coloredParts['stem'] || '#FFFFFF' }]}
        {...createPanResponder('stem').panHandlers}
      />
    </View>
  );
};

// Kalp şablonu (Heart template)
const HeartTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPartPress('heart');
      },
      onPanResponderMove: () => {
        onPartPress('heart');
      },
    })
  ).current;

  return (
    <View style={templateStyles.heartContainer}>
      <View
        style={[templateStyles.heart, { backgroundColor: coloredParts['heart'] || '#FFFFFF' }]}
        {...panResponder.panHandlers}
      >
        <Text style={templateStyles.heartText}>❤️</Text>
      </View>
    </View>
  );
};

// Yıldız şablonu (Star template)
const StarTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPartPress('star');
      },
      onPanResponderMove: () => {
        onPartPress('star');
      },
    })
  ).current;

  return (
    <View style={templateStyles.starContainer}>
      <View
        style={[templateStyles.star, { backgroundColor: coloredParts['star'] || '#FFFFFF' }]}
        {...panResponder.panHandlers}
      >
        <Text style={templateStyles.starText}>⭐</Text>
      </View>
    </View>
  );
};

// Kelebek şablonu (Butterfly template)
const ButterflyTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const createPanResponder = (partId: string) => {
    return useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          onPartPress(partId);
        },
        onPanResponderMove: () => {
          onPartPress(partId);
        },
      })
    ).current;
  };

  return (
    <View style={templateStyles.butterflyContainer}>
      {/* Sol üst kanat (Left top wing) */}
      <View
        style={[
          templateStyles.wing,
          templateStyles.leftTopWing,
          { backgroundColor: coloredParts['leftTop'] || '#FFFFFF' },
        ]}
        {...createPanResponder('leftTop').panHandlers}
      />
      {/* Sağ üst kanat (Right top wing) */}
      <View
        style={[
          templateStyles.wing,
          templateStyles.rightTopWing,
          { backgroundColor: coloredParts['rightTop'] || '#FFFFFF' },
        ]}
        {...createPanResponder('rightTop').panHandlers}
      />
      {/* Sol alt kanat (Left bottom wing) */}
      <View
        style={[
          templateStyles.wing,
          templateStyles.leftBottomWing,
          { backgroundColor: coloredParts['leftBottom'] || '#FFFFFF' },
        ]}
        {...createPanResponder('leftBottom').panHandlers}
      />
      {/* Sağ alt kanat (Right bottom wing) */}
      <View
        style={[
          templateStyles.wing,
          templateStyles.rightBottomWing,
          { backgroundColor: coloredParts['rightBottom'] || '#FFFFFF' },
        ]}
        {...createPanResponder('rightBottom').panHandlers}
      />
      {/* Gövde (Body) */}
      <View style={templateStyles.butterflyBody} />
    </View>
  );
};

// Şablon stilleri (Template styles)
const templateStyles = StyleSheet.create({
  // Gökkuşağı (Rainbow)
  rainbowContainer: {
    width: 300,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rainbowArc: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 4,
    borderColor: '#333',
  },
  cloud: {
    position: 'absolute',
    width: 80,
    height: 50,
  },
  cloudPart: {
    width: 80,
    height: 50,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#333',
  },
  // Güneş (Sun)
  sunContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sunCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#333',
    zIndex: 10,
  },
  sunRay: {
    position: 'absolute',
    width: 15,
    height: 60,
    borderRadius: 10,
    top: 20,
    borderWidth: 2,
    borderColor: '#333',
  },
  // Çiçek (Flower)
  flowerContainer: {
    width: 300,
    height: 400,
    position: 'relative',
  },
  petal: {
    position: 'absolute',
    width: 60,
    height: 80,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#333',
  },
  flowerCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 110,
    left: 120,
    borderWidth: 3,
    borderColor: '#333',
    zIndex: 10,
  },
  stem: {
    position: 'absolute',
    width: 15,
    height: 150,
    top: 170,
    left: 142,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#333',
  },
  // Kalp (Heart)
  heartContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: {
    fontSize: 120,
  },
  // Yıldız (Star)
  starContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    fontSize: 120,
  },
  // Kelebek (Butterfly)
  butterflyContainer: {
    width: 300,
    height: 300,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wing: {
    position: 'absolute',
    width: 100,
    height: 120,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#333',
  },
  leftTopWing: {
    top: 50,
    left: 30,
  },
  rightTopWing: {
    top: 50,
    right: 30,
  },
  leftBottomWing: {
    bottom: 50,
    left: 40,
    width: 80,
    height: 100,
  },
  rightBottomWing: {
    bottom: 50,
    right: 40,
    width: 80,
    height: 100,
  },
  butterflyBody: {
    width: 20,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 10,
    zIndex: 10,
  },
});
