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

  // Ref ile güncel rengi takip et (Track current color with ref)
  const selectedColorRef = useRef(selectedColor);
  selectedColorRef.current = selectedColor;

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
    setColoredParts((prev) => ({
      ...prev,
      [partId]: selectedColor,
    }));
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
  // Gökkuşağı yayları - yarım daire şeklinde (Rainbow arcs - semicircle shape)
  const rainbowArcs = [
    { id: 'arc1', color: coloredParts['arc1'] || '#FFFFFF', size: 280 }, // En dış (Outermost)
    { id: 'arc2', color: coloredParts['arc2'] || '#FFFFFF', size: 240 },
    { id: 'arc3', color: coloredParts['arc3'] || '#FFFFFF', size: 200 },
    { id: 'arc4', color: coloredParts['arc4'] || '#FFFFFF', size: 160 },
    { id: 'arc5', color: coloredParts['arc5'] || '#FFFFFF', size: 120 },
    { id: 'arc6', color: coloredParts['arc6'] || '#FFFFFF', size: 80 },
    { id: 'arc7', color: coloredParts['arc7'] || '#FFFFFF', size: 40 }, // En iç (Innermost)
  ];

  return (
    <View style={templateStyles.rainbowContainer}>
      {/* Gökkuşağı yayları (Rainbow arcs) */}
      {rainbowArcs.map((arc, index) => (
        <TouchableOpacity
          key={arc.id}
          activeOpacity={1}
          style={[
            templateStyles.rainbowArc,
            {
              width: arc.size,
              height: arc.size / 2,
              borderRadius: arc.size,
              backgroundColor: arc.color,
              borderWidth: 4,
              borderColor: '#333',
              borderBottomWidth: 0,
              overflow: 'hidden',
            },
          ]}
          onPress={() => onPartPress(arc.id)}
          onLongPress={() => onPartPress(arc.id)}
          onPressIn={() => onPartPress(arc.id)}
        />
      ))}

      {/* Sol bulut (Left cloud) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[templateStyles.cloud, { left: 10, bottom: 10 }]}
        onPress={() => onPartPress('cloud1')}
        onLongPress={() => onPartPress('cloud1')}
        onPressIn={() => onPartPress('cloud1')}
      >
        <View style={[templateStyles.cloudCircle, { backgroundColor: coloredParts['cloud1'] || '#FFFFFF' }]} />
        <View style={[templateStyles.cloudCircle, { backgroundColor: coloredParts['cloud1'] || '#FFFFFF', left: 20 }]} />
        <View style={[templateStyles.cloudCircle, { backgroundColor: coloredParts['cloud1'] || '#FFFFFF', left: 40 }]} />
      </TouchableOpacity>

      {/* Sağ bulut (Right cloud) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[templateStyles.cloud, { right: 10, bottom: 10 }]}
        onPress={() => onPartPress('cloud2')}
        onLongPress={() => onPartPress('cloud2')}
        onPressIn={() => onPartPress('cloud2')}
      >
        <View style={[templateStyles.cloudCircle, { backgroundColor: coloredParts['cloud2'] || '#FFFFFF' }]} />
        <View style={[templateStyles.cloudCircle, { backgroundColor: coloredParts['cloud2'] || '#FFFFFF', left: 20 }]} />
        <View style={[templateStyles.cloudCircle, { backgroundColor: coloredParts['cloud2'] || '#FFFFFF', left: 40 }]} />
      </TouchableOpacity>
    </View>
  );
};

// Güneş şablonu (Sun template)
const SunTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  return (
    <View style={templateStyles.sunContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={[templateStyles.sunCircle, { backgroundColor: coloredParts['sun'] || '#FFFFFF' }]}
        onPress={() => onPartPress('sun')}
        onLongPress={() => onPartPress('sun')}
        onPressIn={() => onPartPress('sun')}
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

  return (
    <View style={templateStyles.flowerContainer}>
      {/* Yapraklar (Petals) */}
      {petalPositions.map((pos, i) => (
        <TouchableOpacity
          key={`petal${i}`}
          activeOpacity={1}
          style={[
            templateStyles.petal,
            { top: pos.top, left: pos.left, backgroundColor: coloredParts[`petal${i}`] || '#FFFFFF' },
          ]}
          onPress={() => onPartPress(`petal${i}`)}
          onLongPress={() => onPartPress(`petal${i}`)}
          onPressIn={() => onPartPress(`petal${i}`)}
        />
      ))}
      {/* Merkez (Center) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[templateStyles.flowerCenter, { backgroundColor: coloredParts['center'] || '#FFFFFF' }]}
        onPress={() => onPartPress('center')}
        onLongPress={() => onPartPress('center')}
        onPressIn={() => onPartPress('center')}
      />
      {/* Gövde (Stem) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[templateStyles.stem, { backgroundColor: coloredParts['stem'] || '#FFFFFF' }]}
        onPress={() => onPartPress('stem')}
        onLongPress={() => onPartPress('stem')}
        onPressIn={() => onPartPress('stem')}
      />
    </View>
  );
};

// Kalp şablonu (Heart template)
const HeartTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  return (
    <View style={templateStyles.heartContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={[templateStyles.heart, { backgroundColor: coloredParts['heart'] || '#FFFFFF' }]}
        onPress={() => onPartPress('heart')}
        onLongPress={() => onPartPress('heart')}
        onPressIn={() => onPartPress('heart')}
      >
        <Text style={templateStyles.heartText}>❤️</Text>
      </TouchableOpacity>
    </View>
  );
};

// Yıldız şablonu (Star template)
const StarTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  return (
    <View style={templateStyles.starContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={[templateStyles.star, { backgroundColor: coloredParts['star'] || '#FFFFFF' }]}
        onPress={() => onPartPress('star')}
        onLongPress={() => onPartPress('star')}
        onPressIn={() => onPartPress('star')}
      >
        <Text style={templateStyles.starText}>⭐</Text>
      </TouchableOpacity>
    </View>
  );
};

// Kelebek şablonu (Butterfly template)
const ButterflyTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  return (
    <View style={templateStyles.butterflyContainer}>
      {/* Sol üst kanat (Left top wing) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[
          templateStyles.wing,
          templateStyles.leftTopWing,
          { backgroundColor: coloredParts['leftTop'] || '#FFFFFF' },
        ]}
        onPress={() => onPartPress('leftTop')}
        onLongPress={() => onPartPress('leftTop')}
        onPressIn={() => onPartPress('leftTop')}
      />
      {/* Sağ üst kanat (Right top wing) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[
          templateStyles.wing,
          templateStyles.rightTopWing,
          { backgroundColor: coloredParts['rightTop'] || '#FFFFFF' },
        ]}
        onPress={() => onPartPress('rightTop')}
        onLongPress={() => onPartPress('rightTop')}
        onPressIn={() => onPartPress('rightTop')}
      />
      {/* Sol alt kanat (Left bottom wing) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[
          templateStyles.wing,
          templateStyles.leftBottomWing,
          { backgroundColor: coloredParts['leftBottom'] || '#FFFFFF' },
        ]}
        onPress={() => onPartPress('leftBottom')}
        onLongPress={() => onPartPress('leftBottom')}
        onPressIn={() => onPartPress('leftBottom')}
      />
      {/* Sağ alt kanat (Right bottom wing) */}
      <TouchableOpacity
        activeOpacity={1}
        style={[
          templateStyles.wing,
          templateStyles.rightBottomWing,
          { backgroundColor: coloredParts['rightBottom'] || '#FFFFFF' },
        ]}
        onPress={() => onPartPress('rightBottom')}
        onLongPress={() => onPartPress('rightBottom')}
        onPressIn={() => onPartPress('rightBottom')}
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
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingBottom: 20,
  },
  rainbowArc: {
    position: 'absolute',
    bottom: 0,
  },
  cloud: {
    position: 'absolute',
    width: 70,
    height: 40,
    flexDirection: 'row',
  },
  cloudCircle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
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
