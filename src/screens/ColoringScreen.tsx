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
import Svg, { G, Path, Ellipse } from 'react-native-svg';

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
  { id: 'rabbit', name: 'Tavşan', emoji: '🐰', parts: 10 },
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
            {selectedTemplate === 'rabbit' && (
              <RabbitTemplate coloredParts={coloredParts} onPartPress={handlePartPress} />
            )}
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

// Tavşan şablonu (Rabbit template)
const RabbitTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  return (
    <View style={templateStyles.rabbitContainer}>
      <Svg width="300" height="400" viewBox="0 0 500 500">
        {/* Gövde (Body) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('body')} onLongPress={() => onPartPress('body')} onPressIn={() => onPartPress('body')}>
          <Path
            d="M270.067,409.577c41.724-4.832,33.425-40.804,17.901-73.821c-0.238-0.506-0.351-1.058-0.33-1.616 c0.689-18.722-1.152-38.658-3.958-55.407c-12.036-0.59-26.952-1.879-45.361-6.017c-14.104,16.617-28.205,33.24-42.097,50.389 c-18.813,13.318-40.38,29.124-24.535,64.668l23.967,19.94c2.767-6.835,7.546-15.418,12.942-20.55 c7.564-7.193,14.634-8.772,23.002-9.826c4.344,4.177,7.753,8.89,11.601,17.342"
            fill={coloredParts['body'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Kafa (Head) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('head')} onLongPress={() => onPartPress('head')} onPressIn={() => onPartPress('head')}>
          <Path
            d="M331.93,252.796c1.908,33.464-31.872,41.215-74.852,33.282c-41.287-7.621-69.207-26.906-59.484-55.653 c6.857-20.275,39.969-75.196,82.083-67.423C322.655,170.933,330.99,236.304,331.93,252.796z"
            fill={coloredParts['head'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Sol kulak (Left ear) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('leftEar')} onLongPress={() => onPartPress('leftEar')} onPressIn={() => onPartPress('leftEar')}>
          <Path
            d="M264.151,163.616c-6.07-48.696-13.618-82.382-49.176-111.48c-4.994-8.909-9.828-13.397-13.197-12.83 c-5.093,0.856-5.609,7.363-5.889,11.937c-2.546,41.685,11.951,100.025,40.702,127.027"
            fill={coloredParts['leftEar'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Sağ kulak (Right ear) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('rightEar')} onLongPress={() => onPartPress('rightEar')} onPressIn={() => onPartPress('rightEar')}>
          <Path
            d="M282.513,167.573c5.567-48.756,12.767-82.518,48.023-111.981c4.901-8.96,9.689-13.497,13.064-12.966 c5.101,0.804,5.685,7.305,6.012,11.875c2.977,41.656-14.125,101.2-42.595,128.497"
            fill={coloredParts['rightEar'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Sol ayak (Left foot) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('leftFoot')} onLongPress={() => onPartPress('leftFoot')} onPressIn={() => onPartPress('leftFoot')}>
          <Path
            d="M126.53,424.166c1.439-8.196,3.113-28.331-5.495-37.066c-6.49-6.586-33.753-0.995-37.204,9.883 c-1.688,5.321,3.359,23.063,9.973,31.997C105.395,430.026,113.787,427.343,126.53,424.166z"
            fill={coloredParts['leftFoot'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Sağ ayak (Right foot) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('rightFoot')} onLongPress={() => onPartPress('rightFoot')} onPressIn={() => onPartPress('rightFoot')}>
          <Path
            d="M343.561,421.674c-0.464-9.451,0.23-32.393,9.723-40.959c7.157-6.459,33.356,3.888,35.489,16.661 c1.043,6.247-4.749,21.338-12.302,30.425C364.935,427.259,355.742,427.146,343.561,421.674z"
            fill={coloredParts['rightFoot'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Sol el (Left hand) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('leftHand')} onLongPress={() => onPartPress('leftHand')} onPressIn={() => onPartPress('leftHand')}>
          <Path
            d="M184.074,281.842c-17.617-16.694,18.001-44.101,32.754-30.979c20.759,18.463,43.038,95.586,31.328,99.56 C238.297,353.769,209.284,305.733,184.074,281.842z"
            fill={coloredParts['leftHand'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Sağ el (Right hand) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('rightHand')} onLongPress={() => onPartPress('rightHand')} onPressIn={() => onPartPress('rightHand')}>
          <Path
            d="M276.149,284.165c24.046-1.644,50.833-11.055,76.394-21.693c12.353-5.142,17.971,10.784,9.024,22.436 c-22.354,29.111-64.513,40.183-86.988,45.924C274.689,318.067,274.798,298.748,276.149,284.165z"
            fill={coloredParts['rightHand'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Burun (Nose) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('nose')} onLongPress={() => onPartPress('nose')} onPressIn={() => onPartPress('nose')}>
          <Path
            d="M255.21,235.961c0.6-3.252,5.437-5.085,10.802-4.095c5.366,0.99,9.229,4.429,8.629,7.681 c-0.6,3.252-10.802,4.095-10.802,4.095S254.61,239.213,255.21,235.961z"
            fill={coloredParts['nose'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Kuyruk (Tail) */}
        <TouchableOpacity activeOpacity={1} onPress={() => onPartPress('tail')} onLongPress={() => onPartPress('tail')} onPressIn={() => onPartPress('tail')}>
          <Path
            d="M187.725,326.509c-12.829-2.399-22.501-21.037-11.857-32.345c9.343-9.926,35.83-12.578,41.119-1.812 C222.122,302.804,201.704,329.123,187.725,326.509z"
            fill={coloredParts['tail'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
          />
        </TouchableOpacity>

        {/* Sol göz (Left eye) - siyah */}
        <Path
          d="M218.19,232.573c-0.503-7.014,3.855-13.043,9.736-13.465c5.881-0.422,11.056,4.922,11.56,11.936 c0.504,7.014-3.855,13.043-9.736,13.465C223.869,244.932,218.693,239.588,218.19,232.573z"
          fill="#000000"
        />
        <Path
          d="M221.867,228.464c0.653-3.129,2.986-5.289,5.211-4.825c2.225,0.464,3.5,3.377,2.847,6.507 s-2.986,5.289-5.211,4.825C222.488,234.506,221.214,231.593,221.867,228.464z"
          fill="#FFFFFF"
        />

        {/* Sağ göz (Right eye) - siyah */}
        <Ellipse
          transform="matrix(0.3848 -0.923 0.923 0.3848 -40.2374 430.5812)"
          cx="302.872"
          cy="245.474"
          rx="12.733"
          ry="10.675"
          fill="#000000"
        />
        <Path
          d="M298.151,239.35c1.991-2.501,5.046-3.38,6.825-1.965c1.778,1.416,1.606,4.591-0.385,7.092 c-1.991,2.501-5.047,3.381-6.825,1.965C295.988,245.026,296.16,241.851,298.151,239.35z"
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
};

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
  // Tavşan (Rabbit)
  rabbitContainer: {
    width: 300,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
