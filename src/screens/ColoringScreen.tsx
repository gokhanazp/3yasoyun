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
import Svg, { G, Path, Ellipse, Rect, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

type ColoringScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Coloring'
>;

interface ColoringScreenProps {
  navigation: ColoringScreenNavigationProp;
}

// Boyama şablonları (Coloring templates) - Sadece hayvan şablonları
const TEMPLATES = [
  {
    id: 'rabbit',
    name: 'Tavşan',
    emoji: '🐰',
    parts: 34,
    bgColor: '#FFE5E5', // Açık pembe (Light pink)
    nameColor: '#FF6B9D', // Pembe (Pink)
  },
  {
    id: 'dog',
    name: 'Köpek',
    emoji: '🐶',
    parts: 12,
    bgColor: '#E3F2FD', // Açık mavi (Light blue)
    nameColor: '#42A5F5', // Mavi (Blue)
  },
  {
    id: 'leon',
    name: 'Aslan',
    emoji: '🦁',
    parts: 37,
    bgColor: '#FFF9E6', // Açık sarı (Light yellow)
    nameColor: '#FFA726', // Turuncu (Orange)
  },
];

export const ColoringScreen: React.FC<ColoringScreenProps> = ({ navigation }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(LEARNING_COLORS[0].color);
  const [coloredParts, setColoredParts] = useState<{ [key: string]: string }>({});
  const [isPainting, setIsPainting] = useState<boolean>(false); // Boyama modunu takip et (Track painting mode)

  // Ref ile güncel rengi takip et (Track current color with ref)
  const selectedColorRef = useRef(selectedColor);
  selectedColorRef.current = selectedColor;

  // Ref ile boyama modunu takip et (Track painting mode with ref)
  const isPaintingRef = useRef(isPainting);
  isPaintingRef.current = isPainting;

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

  // Bölge boyama (Paint part) - Kalem gibi sürekli boyama için
  const handlePartPress = (partId: string) => {
    // Boyama modu aktifse veya ilk tıklamada boya
    setColoredParts((prev) => ({
      ...prev,
      [partId]: selectedColorRef.current,
    }));
  };

  // Boyama başlat (Start painting)
  const handlePaintStart = (partId: string) => {
    setIsPainting(true);
    // İlk parçayı hemen boya
    handlePartPress(partId);
  };

  // Boyama bitir (End painting)
  const handlePaintEnd = () => {
    setIsPainting(false);
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
            <Text style={styles.instructionText}>Boyamak istediğin hayvanı seç! 🎨</Text>
            <View style={styles.templatesGrid}>
              {TEMPLATES.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateCard}
                  onPress={() => handleTemplateSelect(template.id, template.name)}
                  activeOpacity={0.85}
                >
                  {/* SVG Önizleme - Gerçek SVG dosyaları (SVG Preview - Real SVG files) */}
                  <View style={[styles.templatePreview, { backgroundColor: template.bgColor }]}>
                    <View style={styles.svgPreviewWrapper}>
                      {template.id === 'rabbit' && (
                        <RabbitTemplate
                          coloredParts={{}}
                          onPartPress={() => {}}
                          onPaintStart={() => {}}
                          onPaintEnd={() => {}}
                        />
                      )}
                      {template.id === 'dog' && (
                        <DogTemplate
                          coloredParts={{}}
                          onPartPress={() => {}}
                        />
                      )}
                      {template.id === 'leon' && (
                        <LeonTemplate
                          coloredParts={{}}
                          onPartPress={() => {}}
                        />
                      )}
                    </View>
                  </View>

                  {/* Alt kısım - İsim (Bottom section - Name) */}
                  <View style={[styles.templateFooter, { backgroundColor: template.nameColor }]}>
                    <Text style={styles.templateName}>{template.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.coloringArea}>
            {selectedTemplate === 'rabbit' && (
              <RabbitTemplate
                coloredParts={coloredParts}
                onPartPress={handlePartPress}
                onPaintStart={handlePaintStart}
                onPaintEnd={handlePaintEnd}
              />
            )}
            {selectedTemplate === 'dog' && (
              <DogTemplate
                coloredParts={coloredParts}
                onPartPress={handlePartPress}
              />
            )}
            {selectedTemplate === 'leon' && (
              <LeonTemplate
                coloredParts={coloredParts}
                onPartPress={handlePartPress}
              />
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
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  templateCard: {
    width: width - 40, // Tam genişlik (Full width)
    height: 200, // Sabit yükseklik (Fixed height)
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    flexDirection: 'row', // Yatay düzen (Horizontal layout)
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFD54F', // Sarı kenarlık (Yellow border)
  },
  templatePreview: {
    width: '60%', // Sol taraf - SVG önizleme (Left side - SVG preview)
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    overflow: 'hidden', // Taşan kısımları gizle (Hide overflow)
  },
  svgPreviewWrapper: {
    width: 140, // Sabit genişlik (Fixed width)
    height: 140, // Sabit yükseklik (Fixed height)
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.4 }], // SVG'yi küçült (Scale down SVG)
  },
  templateFooter: {
    width: '40%', // Sağ taraf - İsim (Right side - Name)
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  templateName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
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
  onPaintStart?: (partId: string) => void; // Boyama başlangıcı (Paint start)
  onPaintEnd?: () => void; // Boyama bitişi (Paint end)
}

// Tavşan şablonu (Rabbit template) - Kalem gibi sürükle-boya sistemi
const RabbitTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress, onPaintStart, onPaintEnd }) => {
  const screenWidth = Dimensions.get('window').width;
  const svgWidth = screenWidth - 40; // 20px padding her yandan (20px padding each side)
  const svgHeight = svgWidth; // 1:1 aspect ratio (500x500 viewBox)

  // Parça tıklama handler'ı (Part click handler)
  const createPartHandlers = (partId: string) => ({
    onPress: () => {
      onPartPress(partId);
    },
  });

  return (
    <View style={templateStyles.rabbitContainer}>
      <Svg width={svgWidth} height={svgHeight} viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
        {/* Zemin (Ground) - Alt kısım */}
        <G {...createPartHandlers('ground')}>
          <Path
            d="M259.825,399.306c-65.553-0.941-145.717,8.499-192.051,25.277c-19.432,7.036-30.034,20.697-12.695,27.83 c16.324,6.716,34.465-2.269,50.961,2.33c24.04,6.703,33.729,20.012,70.791,24.959c26.052,3.477,133.476,2.481,164.191-7.941 c38.352-13.014,43.242-13.854,84.043-10.404c9.027,0.763,22.438-6.228,19.706-14.866 C434.856,415.143,309.742,400.139,259.825,399.306z"
            fill={coloredParts['ground'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 1 (Grass 1) */}
        <G {...createPartHandlers('grass1')}>
          <Path
            d="M77.896,398.396c0,0,1.396-7.396,4.396-8.896s6.5,3.5,3.5,8.5L77.896,398.396z"
            fill={coloredParts['grass1'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 2 (Grass 2) */}
        <G {...createPartHandlers('grass2')}>
          <Path
            d="M86.896,398.896c0,0-0.104-7.896,2.896-9.396s7,3,4.5,8.5L86.896,398.896z"
            fill={coloredParts['grass2'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 3 (Grass 3) */}
        <G {...createPartHandlers('grass3')}>
          <Path
            d="M95.396,398.396c0,0-1.896-7.396,1.104-8.896s6.5,3.5,3.5,8.5L95.396,398.396z"
            fill={coloredParts['grass3'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 4 (Grass 4) */}
        <G {...createPartHandlers('grass4')}>
          <Path
            d="M104.396,398.896c0,0-0.604-7.896,2.396-9.396s7,3,4.5,8.5L104.396,398.896z"
            fill={coloredParts['grass4'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 5 (Grass 5) */}
        <G {...createPartHandlers('grass5')}>
          <Path
            d="M388.896,398.396c0,0,1.396-7.396,4.396-8.896s6.5,3.5,3.5,8.5L388.896,398.396z"
            fill={coloredParts['grass5'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 6 (Grass 6) */}
        <G {...createPartHandlers('grass6')}>
          <Path
            d="M397.896,398.896c0,0-0.104-7.896,2.896-9.396s7,3,4.5,8.5L397.896,398.896z"
            fill={coloredParts['grass6'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 7 (Grass 7) */}
        <G {...createPartHandlers('grass7')}>
          <Path
            d="M406.396,398.396c0,0-1.896-7.396,1.104-8.896s6.5,3.5,3.5,8.5L406.396,398.396z"
            fill={coloredParts['grass7'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Çimen 8 (Grass 8) */}
        <G {...createPartHandlers('grass8')}>
          <Path
            d="M415.396,398.896c0,0-0.604-7.896,2.396-9.396s7,3,4.5,8.5L415.396,398.896z"
            fill={coloredParts['grass8'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sağ ayak (Right foot) */}
        <G {...createPartHandlers('rightFoot')}>
          <Path
            d="M343.561,421.674c-0.464-9.451,0.23-32.393,9.723-40.959c7.157-6.459,33.356,3.888,35.489,16.661 c1.043,6.247-4.749,21.338-12.302,30.425C364.935,427.259,355.742,427.146,343.561,421.674z"
            fill={coloredParts['rightFoot'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ayak içi detaylar (Foot inner details) */}
          <Path
            d="M387.281,404.648c-4.058-7.13-10.572-12.272-17.729-13.994"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M360.558,411.328c-4.863-2.401-10.29-3.206-15.509-2.301"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sağ ayak parmakları (Right foot toes) */}
        <G {...createPartHandlers('rightFootToes')}>
          <Path
            d="M332.609,423.149c2.75-3.194,6.652-4.975,10.519-4.802c3.867,0.173,7.641,2.299,10.176,5.729 c5.053-4.675,13.259-3.582,17.29,2.304c3.103-2.646,7.35-3.331,10.946-1.764c3.596,1.566,6.434,5.337,7.314,9.719"
            fill={coloredParts['rightFootToes'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol ayak (Left foot) */}
        <G {...createPartHandlers('leftFoot')}>
          <Path
            d="M126.53,424.166c1.439-8.196,3.113-28.331-5.495-37.066c-6.49-6.586-33.753-0.995-37.204,9.883 c-1.688,5.321,3.359,23.063,9.973,31.997C105.395,430.026,113.787,427.343,126.53,424.166z"
            fill={coloredParts['leftFoot'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ayak içi detaylar (Foot inner details) */}
          <Path
            d="M84.572,403.533c4.793-5.695,11.837-9.329,19.171-9.892"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M110.603,412.889c5.11-1.457,10.619-1.446,15.745,0.032"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol ayak parmakları (Left foot toes) */}
        <G {...createPartHandlers('leftFootToes')}>
          <Path
            d="M138.286,423.221c-2.959-2.625-6.989-3.931-10.862-3.521c-3.874,0.41-7.535,2.529-9.871,5.713 c-5.363-3.774-13.54-2.266-17.228,3.175c-3.28-2.12-7.588-2.439-11.105-0.823c-3.516,1.616-6.135,5.12-6.75,9.03"
            fill={coloredParts['leftFootToes'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Bulut 1 (Cloud 1) - Sol alt */}
        <G {...createPartHandlers('cloud1')}>
          <Path
            d="M178.01,162.467c0,0-131.284,0-132.231-0.494c-1.152-6.181,0.759-12.822,5.054-17.561c4.294-4.739,10.885-7.48,17.427-7.247 c1.261-13.441,13.995-24.997,28.058-25.463s27.598,10.219,29.825,23.544c5.504-2.432,12.843,0.349,15.128,5.732 c6.788-6.505,18.359-7.775,26.504-2.907C175.92,142.937,179.831,153.458,178.01,162.467z"
            fill={coloredParts['cloud1'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Bulut 2 (Cloud 2) - Üst */}
        <G {...createPartHandlers('cloud2')}>
          <Path
            d="M238.638,59.618c0,0,68.395,0,68.089-0.228c1.465-3.344,0.507-7.537-2.279-9.973c-2.786-2.436-7.197-2.938-10.492-1.193 c-1.067-6.745-8.044-12.098-15.081-11.569c-7.036,0.528-13.075,6.858-13.052,13.682c-1.651-2.06-4.646-3.009-7.238-2.293 c-2.591,0.716-4.616,3.052-4.891,5.644c-2.542-2.558-6.705-3.469-10.138-2.216C240.124,52.723,237.62,56.066,238.638,59.618z"
            fill={coloredParts['cloud2'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Bulut 3 (Cloud 3) - Sol orta */}
        <G {...createPartHandlers('cloud3')}>
          <Path
            d="M151.316,292.521c0,0-57.492,0-57.234-0.192c-1.231-2.811-0.426-6.336,1.916-8.383c2.342-2.047,6.05-2.469,8.819-1.003 c0.897-5.67,6.762-10.169,12.677-9.725c5.915,0.444,10.991,5.765,10.972,11.501c1.387-1.731,3.906-2.529,6.084-1.927 c2.178,0.602,3.88,2.566,4.112,4.744c2.137-2.151,5.636-2.916,8.522-1.863C150.068,286.726,152.173,289.535,151.316,292.521z"
            fill={coloredParts['cloud3'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Bulut 4 (Cloud 4) - Sağ */}
        <G {...createPartHandlers('cloud4')}>
          <Path
            d="M454.674,200.984c0,0-114.64,0-114.878-0.587c3.823-10.812,18.698-15.87,28.32-9.631c-4.651-10.964,2.693-25.266,14.313-27.874 c11.62-2.609,24.373,7.182,24.854,19.081c3.087-2.214,8.102-0.699,9.448,2.853c5.99-5.33,15.138-6.796,22.494-3.606 C446.583,184.411,451.763,192.092,454.674,200.984z"
            fill={coloredParts['cloud4'] || '#FFFFFF'}
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sağ el (Right hand) */}
        <G {...createPartHandlers('rightHand')}>
          <Path
            d="M276.149,284.165c24.046-1.644,50.833-11.055,76.394-21.693c12.353-5.142,17.971,10.784,9.024,22.436 c-22.354,29.111-64.513,40.183-86.988,45.924C274.689,318.067,274.798,298.748,276.149,284.165z"
            fill={coloredParts['rightHand'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sağ el parmak detayları (Right hand finger details) */}
          <Path
            d="M339.695,280.91c-1.269-2.976,0.803-6.747,4.628-8.421s7.955-0.619,9.224,2.357c1.269,2.976-0.803,6.747-4.628,8.421 C345.094,284.942,340.964,283.887,339.695,280.91z"
            fill={coloredParts['rightHand'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M354.501,267.372c2.129-1.442,4.855-2.318,7.647-2.457"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M358.324,275.579c1.687-1.942,3.993-3.323,6.485-3.886"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Gövde (Body) */}
        <G {...createPartHandlers('body')}>
          <Path
            d="M270.067,409.577c41.724-4.832,33.425-40.804,17.901-73.821c-0.238-0.506-0.351-1.058-0.33-1.616 c0.689-18.722-1.152-38.658-3.958-55.407c-12.036-0.59-26.952-1.879-45.361-6.017c-14.104,16.617-28.205,33.24-42.097,50.389 c-18.813,13.318-40.38,29.124-24.535,64.668l23.967,19.94c2.767-6.835,7.546-15.418,12.942-20.55 c7.564-7.193,14.634-8.772,23.002-9.826c4.344,4.177,7.753,8.89,11.601,17.342"
            fill={coloredParts['body'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gövde alt detayları (Body bottom details) */}
          <Path
            d="M256.733,389.828c-5.823-0.275-11.704,1.489-16.477,5.085c-2.757,2.077-3.676,5.785-2.201,8.895 c4.104,8.652,10.425,18.658,17.607,26.201c2.423,2.545,5.645,4.186,9.122,4.764c16.668,2.771,39.266,2.62,40.334-0.468 c2.869-8.299-2.851-18.806-20.156-19.628c-4.026-3.537-6.997-8.113-8.495-13.085"
            fill={coloredParts['body'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M287.493,436.45c1.388-4.621-0.846-10.057-5.093-12.39"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M299.728,435.992c0.671-4.931-1.377-10.144-5.234-13.318"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol kol (Left arm) */}
        <G {...createPartHandlers('leftArm')}>
          <Path
            d="M184.074,281.842c-17.617-16.694,18.001-44.101,32.754-30.979c20.759,18.463,43.038,95.586,31.328,99.56 C238.297,353.769,209.284,305.733,184.074,281.842z"
            fill={coloredParts['leftArm'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sol kol detayları (Left arm details) */}
          <Path
            d="M223.262,257.927c-5.732-0.342-11.552,2.483-14.83,7.197"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M192.979,263.572c-4.923,4.337-8.307,10.388-9.425,16.853"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M225.934,287.136c3.328-2.129,7.319-3.206,11.266-3.041"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M216.383,318.548c2.157-6.531,8.804-11.297,15.682-11.244"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M249.091,329.792c-3.926-1.759-8.86-0.97-12.042,1.924"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol pençe (Left paw) */}
        <G {...createPartHandlers('leftPaw')}>
          <Path
            d="M187.725,326.509c-12.829-2.399-22.501-21.037-11.857-32.345c9.343-9.926,35.83-12.578,41.119-1.812 C222.122,302.804,201.704,329.123,187.725,326.509z"
            fill={coloredParts['leftPaw'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sol pençe detayları (Left paw details) */}
          <Path
            d="M196.555,291.837c4.905-2.64,10.536-3.913,16.1-3.638"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M205.031,302.494c4.71-1.792,8.911-4.898,12.006-8.874"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol el parmaklar (Left hand fingers) */}
        <G {...createPartHandlers('leftHand')}>
          <Path
            d="M192.045,255.512c-2.26-8.84-4.52-17.681-6.78-26.521c-0.567-2.219-1.16-4.495-2.449-6.331 c-1.288-1.836-3.449-3.157-5.578-2.704c-2.128,0.453-3.779,3.173-2.789,5.21c-0.174-3.79-0.374-7.696-1.914-11.097 c-1.539-3.401-4.777-6.204-8.33-5.885c-3.553,0.319-6.582,4.793-4.906,8.119c-2.025-6.644-6.798-12.242-12.805-15.018 c-1.998-0.923-4.209-1.551-6.368-1.136c-2.159,0.416-4.227,2.086-4.672,4.377c-0.445,2.291,1.256,4.917,3.443,4.792 c-5.917-3.884-13.08-5.595-20.04-4.787c-2.394,0.278-5.209,1.274-5.803,3.768c-0.638,2.681,1.733,4.971,3.884,6.469 c6.951,4.841,14.427,8.832,22.24,11.874c-1.246-1.523-3.599-1.835-5.191-0.69c-1.592,1.145-2.213,3.599-1.371,5.412 c1.021,2.199,3.545,2.971,5.793,3.521c5.703,1.396,11.407,2.791,17.11,4.187c-1.767-0.312-3.626-0.565-5.325,0.078 c-1.699,0.643-3.154,2.469-2.851,4.351c0.357,2.216,2.715,3.244,4.75,3.826c5.623,1.606,11.371,2.735,17.173,3.372 c-1.423-1.598-4.339-0.17-4.691,2.022c-0.351,2.192,1.225,4.287,3.134,5.142c1.909,0.854,4.069,0.761,6.148,0.654 C179.39,258.229,184.921,257.943,192.045,255.512z"
            fill={coloredParts['leftHand'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Sol el detay çizgisi (Left hand detail line) */}
          <Path
            d="M152.518,223.825c14.152,7.004,26.669,17.497,36.24,30.378"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Kuyruk (Tail) */}
        <G {...createPartHandlers('tail')}>
          <Path
            d="M187.725,326.509c-12.829-2.399-22.501-21.037-11.857-32.345c9.343-9.926,35.83-12.578,41.119-1.812 C222.122,302.804,201.704,329.123,187.725,326.509z"
            fill={coloredParts['tail'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Kuyruk detayları (Tail details) */}
          <Path
            d="M196.555,291.837c4.905-2.64,10.536-3.913,16.1-3.638"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M205.031,302.494c4.71-1.792,8.911-4.898,12.006-8.874"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol omuz/koltuk altı (Left shoulder/armpit) */}
        <G {...createPartHandlers('leftShoulder')}>
          <Path
            d="M194.964,405.613c4.132,11.042,0.078,21.059-8.339,18.34c-19.297-6.232-55.477-41.516-51.061-50.737 c3.423-7.148,13.261-8.035,26.36-1.957c5.355,2.485,16.755,10.864,21.447,18.642"
            fill={coloredParts['leftShoulder'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M165.615,406.497c-4.827-3.881-7.593-8.384-6.177-10.057c1.415-1.673,6.476,0.116,11.303,3.997 c4.827,3.881,7.593,8.384,6.178,10.057C175.503,412.168,170.443,410.378,165.615,406.497z"
            fill={coloredParts['leftShoulder'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M153.078,380.717c-2.023-2.256-3.813-4.711-5.133-7.526c-0.878-1.873-0.154-4.176,1.732-5.103 c0.013-0.006,0.026-0.013,0.039-0.019"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M145.495,386.176c-2.805-2.514-5.044-5.624-6.563-9.347c-0.788-1.933-0.707-4.13,0.388-5.915 c0.684-1.115,1.58-2.107,2.638-2.897"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Kafa (Head) */}
        <G {...createPartHandlers('head')}>
          <Path
            d="M331.93,252.796c1.908,33.464-31.872,41.215-74.852,33.282c-41.287-7.621-69.207-26.906-59.484-55.653 c6.857-20.275,39.969-75.196,82.083-67.423C322.655,170.933,330.99,236.304,331.93,252.796z"
            fill={coloredParts['head'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol kulak dış (Left ear outer) */}
        <G {...createPartHandlers('leftEarOuter')}>
          <Path
            d="M264.151,163.616c-6.07-48.696-13.618-82.382-49.176-111.48c-4.994-8.909-9.828-13.397-13.197-12.83 c-5.093,0.856-5.609,7.363-5.889,11.937c-2.546,41.685,11.951,100.025,40.702,127.027"
            fill={coloredParts['leftEarOuter'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sol kulak iç (Left ear inner) */}
        <G {...createPartHandlers('leftEarInner')}>
          <Path
            d="M246.963,175.466c-8.369-20.344-6.142-29.888-8.18-55.297c-1.837-22.902-18.984-50.055-37.007-63.068 C203.34,99.649,218.705,141.582,246.963,175.466z"
            fill={coloredParts['leftEarInner'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sağ kulak dış (Right ear outer) */}
        <G {...createPartHandlers('rightEarOuter')}>
          <Path
            d="M282.513,167.573c5.567-48.756,12.767-82.518,48.023-111.981c4.901-8.96,9.689-13.497,13.064-12.966 c5.101,0.804,5.685,7.305,6.012,11.875c2.977,41.656-14.125,101.2-42.595,128.497"
            fill={coloredParts['rightEarOuter'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Sağ kulak iç (Right ear inner) */}
        <G {...createPartHandlers('rightEarInner')}>
          <Path
            d="M299.822,179.245c8.159-20.43,5.833-29.95,7.609-55.379c1.6-22.919,18.467-50.248,36.354-63.447 C342.661,102.983,327.729,145.072,299.822,179.245z"
            fill={coloredParts['rightEarInner'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

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

        {/* Burun (Nose) */}
        <G {...createPartHandlers('nose')}>
          <Path
            d="M255.21,235.961c0.6-3.252,5.437-5.085,10.802-4.095c5.366,0.99,9.229,4.429,8.629,7.681 c-0.6,3.252-10.802,4.095-10.802,4.095S254.61,239.213,255.21,235.961z"
            fill={coloredParts['nose'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Ağız (Mouth) */}
        <G {...createPartHandlers('mouth')}>
          <Path
            d="M246.676,247.088c-7.867,39.55,30.392,45.919,33.881,5.747"
            fill={coloredParts['mouth'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ağız içi detayları (Mouth inner details) */}
          <Path
            d="M255.049,251.861c-0.387,3.292-0.143,6.657,0.952,10.542c3.391,0.909,6.898,1.382,10.677,1.325 c1.645-2.948,2.919-6.102,3.785-9.365"
            fill={coloredParts['mouth'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M245.76,245.796c1.552,2.572,4.077,4.541,6.95,5.42c2.873,0.879,6.067,0.661,10.199-0.706 c2.342,2.615,5.724,4.272,9.225,4.518c3.502,0.247,7.083-0.919,9.768-3.18"
            fill={coloredParts['mouth'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M264.347,239.776c-0.48,3.57-0.961,7.14-1.442,10.71"
            fill={coloredParts['mouth'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M245.76,279.98c2.447,3.239,6.438,5.707,10.872,6.722c4.433,1.015,9.257,0.566,13.14-1.223"
            fill={coloredParts['mouth'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Kafa üstü tüyler (Head top fur) */}
        <G {...createPartHandlers('headFur')}>
          <Path
            d="M266.262,163.152c3.414-2.234,4.899-6.383,6.787-10c1.888-3.618,5.104-7.294,9.174-7.008c2.379,0.167,4.583,1.854,5.365,4.107 c0.782,2.253,0.099,4.942-1.665,6.548c3.793-1.663,8.785,0.585,10.053,4.528c1.268,3.943-1.477,8.68-5.529,9.54 c2.112,1.57,2.726,4.829,1.329,7.06c-1.397,2.231-4.596,3.103-6.932,1.889"
            fill={coloredParts['headFur'] || '#FFFFFF'}
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Yanak çizgileri (Cheek lines) */}
        <G>
          <Path
            d="M330.492,252.467c-8.767-3.122-19.354-0.138-25.2,7.104c-5.846,7.242-6.53,18.22-1.629,26.132"
            fill="none"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M197.768,227.873c9.415,0.26,18.394,6.53,21.883,15.279s1.286,19.477-5.368,26.144"
            fill="none"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
};

// Köpek şablonu (Dog template) - Orijinal SVG'den alınmış
const DogTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const svgWidth = Math.min(screenWidth - 40, 350);
  const svgHeight = svgWidth * 1.4; // 1.4:1 aspect ratio (231x325)

  return (
    <View style={templateStyles.dogContainer}>
      <Svg width={svgWidth} height={svgHeight} viewBox="0 0 231.073 324.688">
        {/* Kafa (Head) - Ana kafa bölgesi */}
        <G onPress={() => onPartPress('head')}>
          <Path d="M79.035,16.882c0,0-31.289,17.741-25.805,67.094s16.451,52.255,69.029,69.674 c17.096,6.774,29.353,2.903,35.482-7.419c11.935-11.29,22.902-16.451,33.547-44.191c5.161-14.515,0.322-64.836-37.74-86.447 C115.485-6.02,86.132,12.366,79.035,16.882z"
                fill={coloredParts['head'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Sol kulak (Left ear) */}
        <G onPress={() => onPartPress('leftEar')}>
          <Path d="M68.229,56.235c0,0,2.742-14.354,16.289-11.451c7.096,1.129,2.742-6.451-5-6.29 C71.778,38.655,67.1,49.3,68.229,56.235z"
                fill={coloredParts['leftEar'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
          <Path d="M65.195,30.088c0,0-1.253,3.759-12.111,4.385S35.127,43.66,27.402,58.277 C19.676,72.893,14.873,76.651,9.027,82.915c-5.846,6.264-8.352,15.243,1.253,26.309s32.573,25.474,38.628,38.002 c-0.209-5.638-1.462-9.396-1.462-9.396s6.055,4.594,7.517,10.649c7.934-6.682,10.231-31.32,3.55-48.651 C51.831,82.497,51.414,59.738,65.195,30.088z"
                fill={coloredParts['leftEar'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Sağ kulak (Right ear) */}
        <G onPress={() => onPartPress('rightEar')}>
          <Path d="M159.999,37.365c0,0-6.613-8.548-16.451-5.161c-5.967,2.258-5.645-4.677,0-6.451 C149.193,23.978,154.999,27.043,159.999,37.365z"
                fill={coloredParts['rightEar'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
          <Path d="M155.029,16.565c0,0,16.583-1.619,26.582,4.671s26.128,20.16,35.16,25.966 c9.032,5.806,11.827,11.827,9.892,21.719c-1.935,9.892-9.892,21.289-12.473,27.526c-2.581,6.236-4.516,12.903-2.366,18.924 c-2.365-1.29-2.58-4.086-2.58-4.086s-1.29,5.376-0.215,8.172c-8.387-2.58-17.849-9.892-18.279-32.257 c-0.645-8.602-0.43-10.752-7.096-17.203c-6.666-6.451-8.602-25.375-9.892-29.461C172.472,36.451,164.251,22.7,155.029,16.565z"
                fill={coloredParts['rightEar'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Sol göz (Left eye) */}
        <G onPress={() => onPartPress('leftEye')}>
          <Path d="M99.431,79.03c1.022,6.313-3.355,12.082-9.776,12.887c-6.421,0.805-12.454-3.66-13.476-9.973 c-1.022-6.313,3.355-12.082,9.776-12.887S98.41,72.718,99.431,79.03z"
                fill={coloredParts['leftEye'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
          <Path d="M96.976,79.338c0.806,4.979-2.647,9.53-7.711,10.165c-5.065,0.635-9.824-2.887-10.63-7.866s2.647-9.53,7.712-10.165 S96.17,74.359,96.976,79.338z"
                fill="#000000" />
        </G>

        {/* Sağ göz (Right eye) */}
        <G onPress={() => onPartPress('rightEye')}>
          <Path d="M165.479,64.216c1.022,6.313-3.355,12.082-9.776,12.887c-6.421,0.805-12.454-3.66-13.476-9.973 c-1.022-6.313,3.356-12.082,9.777-12.887C158.424,53.438,164.457,57.903,165.479,64.216z"
                fill={coloredParts['rightEye'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
          <Path d="M163.023,64.524c0.806,4.979-2.647,9.53-7.711,10.165c-5.065,0.635-9.824-2.887-10.63-7.866 c-0.806-4.979,2.647-9.53,7.712-10.165C157.458,56.023,162.218,59.544,163.023,64.524z"
                fill="#000000" />
        </G>

        {/* Burun (Nose) */}
        <G onPress={() => onPartPress('nose')}>
          <Path d="M115.168,102.612c0,0,5.707,8.491,18.931,11.136c8.352,1.81,14.199-9.326,16.008-16.286 c1.81-6.96-3.619-9.744-18.374-7.378C116.978,92.45,110.574,97.74,115.168,102.612z"
                fill={coloredParts['nose'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Ağız (Mouth) */}
        <G onPress={() => onPartPress('mouth')}>
          <Path d="M134.215,162.447c-42.502,1.133-50.814-18.89-50.814-18.89 c-1.133,5.667,0.944,9.823,0.944,9.823s14.734,27.39,45.714,27.957c25.879-0.567,41.18-19.834,40.046-36.269 C166.517,149.035,156.695,161.313,134.215,162.447z"
                fill={coloredParts['mouth'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
          <Path d="M174.073,128.067c0,0-20.212,29.09-94.449,5.856c0,0,2.645,6.611,3.778,9.634 c0,0,8.312,20.023,50.814,18.89c22.479-1.133,32.302-13.412,35.891-17.379C175.773,139.779,174.073,128.067,174.073,128.067z"
                fill={coloredParts['mouth'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Gövde (Body) */}
        <G onPress={() => onPartPress('body')}>
          <Path d="M86.29,149.407c0,0-14.697,16.958-24.307,38.439c-5.37,13.567-5.37,22.611-14.415,28.829 c-9.045,6.218-27.982,30.808-11.023,56.811c3.957,5.088,5.936,7.914,6.218,10.458c-9.61-0.565-18.654,4.805-18.089,13.001 c0.848,8.197,4.805,13.284,9.045,11.871c7.914,4.805,10.74,1.131,10.74,1.131c8.479,3.392,24.59,2.261,23.177-14.415 c8.197,0.848,13.284-1.696,13.284-1.696s-3.109-41.266-3.392-66.138C77.246,202.826,86.29,149.407,86.29,149.407z"
                fill={coloredParts['body'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
          <Path d="M145.631,251.749c0.712,5.876,2.315,30.271,0.805,42.727 c-1.198,11.977,7.665,16.528,20.361,17.007c12.456,0.24,20.84-1.916,22.517-4.312c8.623,3.114,11.498-13.175,5.988-20.6 c-0.24-7.186-4.312-8.623-14.612-9.821c-3.354-13.175-1.677-25.391-0.719-46.231c0.958-20.84,0.479-28.026,0.479-28.026 s3.833-7.186,3.593-14.372c1.677,2.156,1.677,2.156,1.677,2.156s-0.479-8.384-1.198-12.217c1.916,2.875,1.916,2.875,1.916,2.875 s-9.342-26.11-17.726-32.817c-33.296,24.912-84.195,1.5-84.195,1.5s-0.806,10.161-5.161,17.096 c-4.355,6.935-10.483,18.709-7.258,32.095c1.935,6.935,3.064,8.709,0.161,13.87c-2.903,5.161-7.258,15.322-1.613,28.225 c5.645,12.902,8.254,32.298,8.064,48.008c-0.187,15.465-1.404,23.746,8.581,27.642c10.229,1.948,13.638,2.435,15.1,0.731 c14.125,5.114,20.214-0.487,20.214-0.487c10.959,0.974,12.177-11.203,11.69-15.83c-0.487-4.627-4.537-11.895-20.124-13.843 c0,0-1.678-2.845-1.605-4.887C118.477,280.704,135.671,268.132,145.631,251.749z"
                fill={coloredParts['body'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Sol ön bacak (Left front leg) */}
        <G onPress={() => onPartPress('leftFrontLeg')}>
          <Path d="M132.247,187.658h-10.101c-1.822,0-3.304-1.482-3.304-3.304V161.13 c0-1.822,1.482-3.305,3.304-3.305h10.101c1.822,0,3.304,1.483,3.304,3.305v23.224 C135.551,186.175,134.068,187.658,132.247,187.658z"
                fill={coloredParts['leftFrontLeg'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Sağ ön pençe (Right front paw) */}
        <G onPress={() => onPartPress('rightFrontPaw')}>
          <Path d="M108.633,285.144c0,0,10.607,4.518,18.661,1.768c4.714,5.893,15.518,9.822,22.001,7.661 c6.482-2.161-2.161-48.716-2.161-48.716S110.205,277.287,108.633,285.144z"
                fill={coloredParts['rightFrontPaw'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Dil (Tongue) */}
        <G onPress={() => onPartPress('tongue')}>
          <Path d="M89.895,115.372c0,0,7.245,17.246,31.867,15.946c13.164-0.894,16.733-4.979,16.518-9.925 c-0.215-4.516-4.18-7.645-4.18-7.645s3.873,0.849,6.988-1.61c-2.022,4.535-2.791,9.168-1.093,11.421 c3.231,4.286,16.779,0.415,23.876-7.542c7.096-7.957,6.451-16.128,7.527-17.311c1.075-1.183,7.311-0.645,6.344,9.462 c-1.505-4.946-4.408-5.484-4.408-5.484s-4.623,9.354-9.354,17.096c-4.731,7.742-5.054,22.58-20.859,26.558 c-15.806,3.978-26.827-7.204-32.794-11.72c-5.967-4.516-18.87-15.483-21.934-14.354c-3.064,1.129-3.064,8.548-3.064,8.548 S80.917,117.898,89.895,115.372z"
                fill={coloredParts['tongue'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Sol arka bacak (Left back leg) */}
        <G onPress={() => onPartPress('leftBackLeg')}>
          <Path d="M47.587,218.941c0,0-16.927-10.54-18.684-38.646c-0.16-10.22-2.875-19.003-7.346-4.152 s-2.395,44.235,13.893,57.01L47.587,218.941z"
                fill={coloredParts['leftBackLeg'] || '#FFFFFF'}
                stroke="#000000"
                strokeWidth="1" />
        </G>

        {/* Detay çizgileri (Detail lines) - Boyanmaz, sadece görsel detay */}
        {/* Kafa detay çizgileri */}
        <Path d="M164.423,91.538c-1.958-1.781-4.256-3.161-6.516-4.472c-2.288-1.327-4.657-2.496-7.126-3.403 c-4.832-1.774-9.921-2.719-15.036-2.854c-9.951-0.264-20.179,2.601-28.068,9.137c-4.668,3.867-8.161,8.931-11.262,14.199 c-0.103,0.174,0.074,0.142,0.146,0.026c2.861-4.66,6.313-9.015,10.379-12.604c3.748-3.309,7.891-5.923,12.548-7.474 c9.479-3.156,19.846-2.89,29.345,0.026c2.691,0.826,5.34,1.854,7.878,3.107c2.633,1.3,4.978,3.016,7.395,4.696 C164.242,92.016,164.547,91.651,164.423,91.538z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M105.64,86.436c-2.159,1.442-4.325,2.787-6.754,3.735c-2.397,0.935-4.904,1.579-7.429,2.057 c-4.959,0.938-10.041,1.117-14.962,2.268c-1.351,0.316-2.676,0.724-3.962,1.245c-1.156,0.468-2.261,1.011-3.119,1.938 c-0.1,0.108-0.073,0.269,0.081,0.138c0.931-0.791,2.138-1.223,3.277-1.621c1.19-0.417,2.415-0.744,3.644-1.021 c2.498-0.562,5.049-0.856,7.589-1.156c4.91-0.579,9.852-1.244,14.489-3.047c2.557-0.995,5.101-2.269,7.22-4.03 C105.921,86.769,106.066,86.151,105.64,86.436z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M174.585,72.76c-1.992,0.171-3.961,0.62-5.857,1.251c-1.926,0.641-3.749,1.551-5.683,2.169 c-2.047,0.653-4.152,1.151-6.242,1.645c-2.093,0.495-4.206,0.929-6.345,1.163c-2.398,0.263-4.744,0.129-7.142-0.025 c-0.235-0.015-0.762,0.554-0.424,0.658c1.953,0.602,4.113,0.565,6.131,0.412c2.098-0.158,4.174-0.529,6.225-0.989 c2.101-0.471,4.197-1,6.269-1.586c2.045-0.578,3.918-1.509,5.877-2.311c2.279-0.933,4.644-1.582,7.049-2.095 C174.535,73.033,174.749,72.746,174.585,72.76z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M137.206,126.598c-0.267-0.243-0.894,0.508-0.686,0.789c3.258,4.409,5.043,9.518,4.477,15.042 c-0.063,0.62,1.021-0.19,1.08-0.559C142.946,136.488,141.316,130.342,137.206,126.598z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />

        {/* Gövde detay çizgileri */}
        <Path d="M113.316,285.31c-1.263-4.001-1.158-5.896-2.076-14.872c-0.514-5.029-1.297-10.028-1.853-15.051 c-1.1-9.924-2.113-19.867-3.829-29.708c-0.965-5.536-2.22-10.977-3.965-16.321c-0.084-0.259-0.63,0.275-0.572,0.509 c2.446,9.957,4.173,20.077,5.408,30.251c1.22,10.055,2.14,20.142,3.431,30.189c0.349,2.715,0.721,5.431,1.169,8.132 c0.423,2.551,0.978,5.077,2.214,7.372C113.622,286.513,113.521,285.959,113.316,285.31z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M158.902,218.957c-2.53,5.947-4.235,12.239-6.611,18.254c-1.178,2.981-2.452,5.926-3.866,8.803 c-1.397,2.842-3.014,5.563-4.459,8.378c-0.348,0.678,0.479,0.56,0.768,0.181c3.843-5.054,6.392-11.207,8.685-17.09 c1.188-3.047,2.266-6.133,3.29-9.238c1.027-3.112,2.104-6.251,2.757-9.467C159.557,218.325,158.977,218.781,158.902,218.957z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M70.358,264.501c1.819-8.6,1.188-17.842-1.508-26.193c-1.563-4.843-3.861-9.165-6.833-13.278 c-0.112-0.155-0.577,0.319-0.448,0.515c4.955,7.482,8.034,16.601,8.597,25.549c0.284,4.516-0.04,9.047-0.91,13.486 c-0.963,4.912-3.083,9.453-4.243,14.302c-1.223,5.114-1.403,10.93,0.945,15.758c0.169,0.347,0.844-0.357,0.741-0.653 c-1.741-5-1.946-10.156-0.724-15.306C67.12,273.853,69.328,269.372,70.358,264.501z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />

        {/* Ayak detay çizgileri */}
        <Path d="M189.912,292.56c-1.961-4.845-6.306-8.425-11.622-8.632c-0.186-0.007-0.573,0.492-0.351,0.525 c4.654,0.676,8.71,4.06,10.619,8.296c1.061,2.354,1.54,4.937,1.522,7.513c-0.009,1.316-0.134,2.637-0.423,3.922 c-0.293,1.305-0.869,2.428-1.406,3.637c-0.183,0.412,0.203,0.504,0.473,0.233c1.806-1.814,2.236-4.656,2.413-7.113 C191.34,298.112,190.979,295.199,189.912,292.56z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M196.116,287.044c-1.129-2.165-3.592-3.442-5.766-4.334c-2.585-1.061-5.34-1.813-7.786-3.188 c-0.14-0.079-0.462,0.279-0.338,0.389c2.024,1.793,4.496,2.609,6.928,3.685c1.161,0.514,2.307,1.074,3.353,1.797 c1.034,0.716,1.889,1.607,2.714,2.55C195.499,288.262,196.283,287.366,196.116,287.044z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M104.353,302.93c-1.206-4.047-3.77-7.471-7.373-9.669c-0.139-0.085-0.462,0.283-0.338,0.389 c2.934,2.509,5.3,5.839,6.43,9.547c0.632,2.075,0.865,4.255,0.723,6.418c-0.15,2.292-0.942,4.294-1.555,6.474 c-0.232,0.825,0.87,0.179,1.057-0.127C105.554,312.257,105.558,306.976,104.353,302.93z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M124.474,297.012c-1.265-2.532-3.197-4.751-5.673-6.155c-2.921-1.656-6.136-1.776-9.401-1.492 c-0.057,0.005-0.17,0.182-0.108,0.181c2.96-0.013,6.137,0.435,8.738,1.925c2.258,1.293,4.098,3.297,5.307,5.593 c2.745,5.212,2.662,12.61-0.597,17.586c-0.429,0.656,0.224,0.807,0.641,0.314c1.984-2.338,2.661-5.29,2.857-8.294 C126.452,303.384,125.956,299.977,124.474,297.012z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M58.267,288.653c-4.14-5.235-11.453-5.646-17.616-5.089c-0.25,0.023-0.785,0.786-0.449,0.801 c3.36,0.157,6.73,0.008,10.035,0.771c2.768,0.639,5.612,1.934,7.616,3.992C57.992,289.27,58.396,288.816,58.267,288.653z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M35.546,288.404c-2.857,2.199-4.981,5.381-5.654,8.95c-0.346,1.833-0.307,3.715,0.101,5.535 c0.223,0.997,0.564,1.971,1.013,2.889c0.395,0.806,0.866,1.777,1.621,2.298c0.329,0.227,0.959-0.508,0.82-0.825 c-0.328-0.751-0.887-1.369-1.285-2.084c-0.394-0.708-0.72-1.455-0.973-2.224c-0.544-1.654-0.745-3.412-0.583-5.146 c0.333-3.553,2.225-6.76,4.99-8.97C35.783,288.677,35.899,288.132,35.546,288.404z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
        <Path d="M47.935,290.502c-3.154,1.957-5.417,5.212-6.173,8.851c-0.74,3.564-0.036,8.639,3.066,10.982 c0.185,0.14,0.606-0.34,0.513-0.521c-0.782-1.519-1.704-2.94-2.235-4.579c-0.552-1.706-0.768-3.553-0.584-5.34 c0.372-3.618,2.43-6.875,5.392-8.946C48.101,290.818,48.326,290.26,47.935,290.502z"
              fill="none"
              stroke="#000000"
              strokeWidth="1" />
      </Svg>
    </View>
  );
};

// Aslan şablonu (Leon/Lion template) - Orijinal SVG'den alınmış
const LeonTemplate: React.FC<TemplateProps> = ({ coloredParts, onPartPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const svgWidth = Math.min(screenWidth - 40, 350);
  const svgHeight = svgWidth * 1.15; // 140x161.666 aspect ratio

  return (
    <View style={templateStyles.leonContainer}>
      <Svg width={svgWidth} height={svgHeight} viewBox="0 0 140 161.666">
        {/* ARKA PLAN KATMANI - Yelek en arkada */}

        {/* Yelek (Mane) - Aslan yelesi - EN ARKADA - BEYAZ DOLGU */}
        <G onPress={() => onPartPress('mane')}>
          <Path d="M131.072,45.179c-0.182,0.324-0.375,0.597-0.578,0.834c-0.014,0.002-0.025,0.005-0.039,0.012 c-4.146,1.994-4.82-2.806-6.893-5.121c1.084-0.58,1.961-1.476,2.496-2.542c0.738-0.917,1.025-2.065,0.863-3.421 c-0.025-0.209-0.352-0.213-0.338,0.006c0.01,0.111,0.008,0.217,0,0.319c-0.066-0.081-0.223-0.059-0.215,0.07 c0.012,0.176,0.016,0.342,0.008,0.501c-0.059-0.011-0.119,0.008-0.149,0.076c-0.217,0.492-0.447,0.876-0.689,1.162 c-0.459,0.318-1.021,0.535-1.592,0.696c-1.416-0.175-3.006-1.969-4.418-3.354c0.141-1.031,0.451-2.048,0.676-3.062 c0.438-2.014,0.158-3.884-0.648-5.765c-1.174-2.736-3.699-4.83-6.549-5.659c-1.271-1.418-3.021-2.267-4.98-2.688 c0.684-0.118,1.367-0.206,2.043-0.283c0.131-0.016,0.188-0.182,0.063-0.257c-0.18-0.11-0.369-0.206-0.564-0.294 c-2.201-1.313-5.238-1.536-7.703-1.483c-0.922,0.02-2.252,0.198-3.498,0.602c0.389-0.627,0.695-1.36,1.109-1.893 c0.939-1.21,2.232-2.262,3.717-2.691c0.154-0.045,0.082-0.264-0.07-0.235c-0.346,0.067-0.674,0.146-0.994,0.236 c-0.047-0.076-0.111-0.14-0.193-0.167c-2.166-0.749-5.371,0.42-7.514,2.186c-0.01-0.074-0.02-0.151-0.033-0.219 c-0.379-2.207-1.779-3.678-3.848-4.376c-0.121-0.042-0.203,0.158-0.082,0.211c0.258,0.116,0.492,0.262,0.713,0.425 c-0.037,0.034-0.061,0.08-0.059,0.13c0.088,1.341,0.131,2.385-0.174,3.593c-0.117-0.196-0.232-0.383-0.34-0.543 c-1.414-2.1-3.375-2.841-5.822-2.537c-0.174,0.019-0.18,0.278,0.004,0.273c0.207-0.004,0.41,0.01,0.603,0.029 c0.01,0.048,0.033,0.09,0.088,0.117c1.594,0.734,2.32,2.526,2.43,4.166c0.008,0.12,0.004,0.235,0,0.353 c-0.299-0.406-0.652-0.775-1.057-1.099c-1.111-0.882-2.484-1.345-3.857-1.619c-1.607-0.324-2.896-0.023-4.471,0.124 c-0.15,0.014-0.16,0.177-0.061,0.244c-0.154,0.074-0.143,0.338,0.068,0.33c1.924-0.073,3.045,1.51,3.387,3.212 c-3.234-1.237-7.336-0.181-10.168,1.933c-2.248,1.677-4.182,3.924-6.803,5.041c-2.918,1.245-6.934,0.129-7.623-3.244 c-0.037-0.176-0.322-0.17-0.354,0.006c-0.088,0.496-0.107,0.979-0.072,1.443c-0.088-0.008-0.184,0.047-0.189,0.17 c-0.059,1.76,0.635,3.161,1.822,4.414c-0.676-0.051-1.346-0.021-1.973,0.093c-1.324,0.245-2.525,1.051-3.633,1.776 c-1.564,1.02-2.902,1.9-4.689,2.541c-0.215,0.075-0.123,0.396,0.096,0.336c0.4-0.107,0.797-0.225,1.193-0.344 c1.33-0.258,2.664-0.234,3.981,0.035c-1.711,0.096-3.289,0.688-4.731,1.75c-3.637,2.686-4.644,7.177-6.654,10.941 c-0.1,0.186,0.158,0.397,0.303,0.227c0.277-0.322,0.545-0.651,0.814-0.982c0.053-0.008,0.102-0.037,0.143-0.092 c0.881-1.266,1.912-1.836,3.066-2.045c-0.975,0.816-1.766,1.836-2.213,2.843c-1.4,3.16-1.139,6.913-2.162,10.224 c-0.385,0.594-0.811,1.164-1.344,1.66c-0.172,0.157,0.08,0.386,0.25,0.244c0.949-0.775,1.717-1.693,2.59-2.48 c-1.111,1.832-1.6,3.82-1.051,5.984c0.514,2.024,2.029,3.942,3.461,5.404c1.838,1.879,3.639,3.566,2.635,6.434 c-0.004,0.012-0.004,0.021-0.004,0.033c-0.103,0.15-0.203,0.297-0.307,0.432c-0.115,0.151,0.084,0.359,0.221,0.212 c0.877-0.947,1.953-2.403,2.709-3.991c0.131,1.574-0.318,3.213-1.51,4.285c-0.07,0.06-0.059,0.149-0.016,0.217 c-0.107,0.061-0.215,0.122-0.322,0.18c-0.137,0.07-0.035,0.309,0.111,0.248c0.811-0.338,1.559-0.76,2.213-1.265 c-0.143,0.825-0.203,1.665-0.176,2.515c0.074,2.168,1.102,4.084,2.531,5.66c1.572,1.737,3.935,2.666,5.592,4.283 c0.082,0.146,0.154,0.293,0.221,0.447c0.06,0.149,0.244,0.117,0.273-0.011c0.106-0.01,0.203-0.134,0.133-0.245 c-0.078-0.117-0.154-0.229-0.232-0.342c-0.416-1.838-1.305-3.496-1.266-5.445c0.004-0.262,0.037-0.516,0.088-0.761 c0.193,2.563,1.545,5.065,3.811,6.532c1.951,1.265,4.203,1.819,6.361,2.623c2.256,0.843,6.598,3.865,3.93,6.658 c-0.094,0.102,0.051,0.237,0.154,0.149c0.24-0.208,0.455-0.419,0.641-0.636c0.004-0.004,0.012-0.005,0.016-0.01 c0.727-0.721,1.223-1.41,1.543-2.136c0.012,0.159,0.027,0.315,0.041,0.474c0.129,1.619-0.381,2.748-1.734,3.424 c-0.322,0.061-0.646,0.111-0.975,0.144c-0.131,0.015-0.125,0.185,0.002,0.198c0.09,0.01,0.185,0.021,0.275,0.031 c0,0.063,0.037,0.123,0.115,0.123c0.211-0.004,0.416-0.02,0.613-0.045c2.303,0.229,4.543,0.289,6.82-0.408 c2.486-0.763,4.705-2.096,6.67-3.782c0.875-0.754,1.691-1.649,2.313-2.651c-0.111,1.343-0.686,2.839-1.604,3.614 c-0.406,0.165-0.799,0.354-1.168,0.601c-0.059,0.039-0.057,0.141,0.021,0.154c2.473,0.448,5.752-0.729,8.033-1.611 c2.809-1.09,5.412-2.713,7.846-4.465c1.939-1.396,3.605-3.213,4.732-5.296c-0.033,0.301-0.078,0.599-0.129,0.89 c-0.35,2.029-1.568,4.709-3.436,5.754c-0.053,0.028-0.055,0.076-0.037,0.115c-0.227,0.051-0.455,0.094-0.697,0.124 c-0.135,0.013-0.135,0.226,0.004,0.212c2.049-0.176,3.611-0.443,5.398-1.582c1.785-1.141,2.91-2.8,3.863-4.654 c0.129-0.252,0.256-0.507,0.383-0.766c-0.012,1.1-0.088,2.184-0.613,3.193c-0.064,0.122,0.111,0.22,0.186,0.105 c0.979-1.515,1.404-3.42,1.354-5.257c0.172-0.367,0.346-0.733,0.525-1.098c-0.102,1.491,0.287,2.84,0.389,4.349 c0.012,0.148,0.219,0.142,0.23-0.003c0.332-4.054,2.74-6.925,4.816-10.171c0.731-1.146,1.18-2.741,1.238-4.334 c0.25,0.82,0.402,1.686,0.338,2.492c-0.072,0.119-0.146,0.238-0.225,0.352c-0.07,0.095,0.055,0.207,0.145,0.176 c-0.105,0.498-0.305,0.967-0.643,1.367c-0.08,0.095,0.029,0.261,0.141,0.18c1.477-1.102,2.106-2.387,2.139-3.994 c1.355-2.529,1.848-5.199,1.703-8.335c-0.051-1.052-0.203-2.523-0.533-4.02c1.117,1.493,2.012,3.086,1.775,4.837 c-0.107,0.279-0.221,0.556-0.346,0.822c-0.057,0.127-0.031,0.242,0.029,0.331c-0.098,0.229-0.213,0.46-0.35,0.694 c-0.065,0.113,0.101,0.201,0.172,0.1c0.147-0.215,0.279-0.428,0.399-0.639c0.117,0.021,0.244-0.021,0.322-0.163 c2.092-3.727,2.471-8.844,0.613-12.809c2.145,0.176,3.871-1.258,4.818-3.191C131.371,45.155,131.156,45.03,131.072,45.179z"
                fill={coloredParts['mane'] || '#FFFFFF'}
                stroke="#161616"
                strokeWidth="0.25" />
        </G>

        {/* ORTA KATMAN - Bacaklar, gövde, kollar */}

        {/* Sol bacak (Left leg) */}
        <G onPress={() => onPartPress('leftLeg')}>
          <Path d="M53.076,118.324c-3.525,0.406-6.742,1.847-10.363,1.874c-4.082,0.035-7.428-2.16-9.69-5.442 c-3.963-5.751-3.414-13.468-1.758-19.896c1.164-4.512,3.453-8.584,4.057-13.273c0.539-4.17-1.219-8.525-6.084-8.332 c-0.463,0.018-0.535,0.666-0.096,0.796c2.617,0.774,4.156,1.865,4.24,4.759c0.07,2.468-0.832,4.973-1.68,7.252 c-0.828,2.212-1.793,4.367-2.672,6.56c-1.127,2.812-1.631,5.851-1.902,8.854c-0.611,6.786,1.205,13.869,6.356,18.562 c2.703,2.467,6.268,3.41,9.854,3.376c3.385-0.031,7.5-0.824,10.529-2.338C55.156,120.431,54.531,118.157,53.076,118.324z"
                fill={coloredParts['leftLeg'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ bacak (Right leg) */}
        <G onPress={() => onPartPress('rightLeg')}>
          <Path d="M101.682,96.187c4.285-3.997,9.918-7.008,14.582-1.865c8.846,9.76-0.182,34.234-7.307,43.437 c-5.027,6.496-8.227,8.06-14.619,8.593C101.939,131.129,103.586,113.358,101.682,96.187z"
                fill={coloredParts['rightLeg'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ kol iç detay (Right arm inner detail) */}
        <G onPress={() => onPartPress('rightArmInner')}>
          <Path d="M97.549,79.312c0,0,7.895-1.152,9.785,14.27c1.891,15.424,1.418,32.695-5.053,46.038 c-6.467,13.341-12.717-0.763-10.598-4.424c2.121-3.658,8.834-25.509,4.994-36.628C92.84,87.446,97.549,79.312,97.549,79.312z"
                fill={coloredParts['rightArmInner'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Gövde (Body) - Ana gövde */}
        <G onPress={() => onPartPress('body')}>
          <Path d="M101.133,98.147c-6.121-2.783-23.643-9.119-31.215,5.494c0,0-3.033-4.198-7.1-7.534 c-0.816,17.257,1.951,34.889,10.5,49.6c2.674,0.054,5.885-0.105,10.025-0.221c4.744-0.133,8.463-0.102,11.549-0.401 C103.334,131.201,103.947,114.144,101.133,98.147z"
                fill={coloredParts['body'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol kol (Left arm) - Ana kol */}
        <G onPress={() => onPartPress('leftArm')}>
          <Path d="M62.818,96.107c-4.529-3.718-10.342-6.368-14.67-0.938c-8.213,10.299,2.346,34.154,10.037,42.887 c5.43,6.165,8.721,7.522,15.133,7.651C64.769,130.996,62.002,113.364,62.818,96.107z"
                fill={coloredParts['leftArm'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol kol iç detay (Left arm inner detail) */}
        <G onPress={() => onPartPress('leftArmInner')}>
          <Path d="M65.877,79.003c0,0-7.953-0.649-8.863,14.861c-0.914,15.514,0.648,32.721,7.949,45.626 c7.301,12.906,12.646-1.563,10.299-5.083c-2.346-3.52-10.428-24.9-7.299-36.24C71.09,86.825,65.877,79.003,65.877,79.003z"
                fill={coloredParts['leftArmInner'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol el parmak 1 (Left hand finger 1) */}
        <G onPress={() => onPartPress('leftFinger1')}>
          <Path d="M47.887,140.403c0,0-3.26-3.127-4.953,1.303c-1.697,4.434,3.258,8.735,6.908,6.778 L47.887,140.403z"
                fill={coloredParts['leftFinger1'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol el parmak 2 (Left hand finger 2) */}
        <G onPress={() => onPartPress('leftFinger2')}>
          <Path d="M53.494,137.273c0,0-2.48-2.736-5.086-0.781c-2.607,1.956-4.043,7.3-0.783,10.951 C50.887,151.094,58.574,150.049,53.494,137.273z"
                fill={coloredParts['leftFinger2'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol el parmak 3 (Left hand finger 3) */}
        <G onPress={() => onPartPress('leftFinger3')}>
          <Path d="M59.488,137.665c0,0-1.303-4.039-4.953-3.387c-3.649,0.65-4.041,4.952-4.434,7.428 c-0.389,2.477,0.131,8.212,4.822,8.345C59.619,150.179,60.922,148.094,59.488,137.665z"
                fill={coloredParts['leftFinger3'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol el parmak 4 (Left hand finger 4) */}
        <G onPress={() => onPartPress('leftFinger4')}>
          <Path d="M63.92,136.231c0,0-3.26-4.433-5.734,0.523c-2.478,4.952-2.348,14.729,2.867,15.771 C66.268,153.57,70.699,150.962,63.92,136.231z"
                fill={coloredParts['leftFinger4'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol el parmak 5 (Left hand finger 5) */}
        <G onPress={() => onPartPress('leftFinger5')}>
          <Path d="M70.699,134.929c-1.1-2.325-3.912-5.996-7.563-2.086c-3.648,3.911-1.172,20.466,5.477,19.683 C75.262,151.745,76.566,147.311,70.699,134.929z"
                fill={coloredParts['leftFinger5'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol el parmak 6 (Left hand finger 6) */}
        <G onPress={() => onPartPress('leftFinger6')}>
          <Path d="M81.389,142.619c-1.348-10.091-5.215-12.645-9.516-11.473 c-4.303,1.175-2.348,12.776-1.564,14.471c0.781,1.695,2.215,7.953,7.559,5.997C83.213,149.659,81.648,144.574,81.389,142.619z"
                fill={coloredParts['leftFinger6'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ kol (Right arm) - Ana kol */}
        <G onPress={() => onPartPress('rightArm')}>
          <Path d="M101.682,96.187c4.285-3.997,9.918-7.008,14.582-1.865c8.846,9.76-0.182,34.234-7.307,43.437 c-5.027,6.496-8.227,8.06-14.619,8.593C101.939,131.129,103.586,113.358,101.682,96.187z"
                fill={coloredParts['rightArm'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ kol iç detay (Right arm inner detail) */}
        <G onPress={() => onPartPress('rightArmInner')}>
          <Path d="M97.549,79.312c0,0,7.895-1.152,9.785,14.27c1.891,15.424,1.418,32.695-5.053,46.038 c-6.467,13.341-12.717-0.763-10.598-4.424c2.121-3.658,8.834-25.509,4.994-36.628C92.84,87.446,97.549,79.312,97.549,79.312z"
                fill={coloredParts['rightArmInner'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ el parmak 1 (Right hand finger 1) */}
        <G onPress={() => onPartPress('rightFinger1')}>
          <Path d="M119.383,139.448c0,0,3.055-3.327,5.025,0.988c1.973,4.316-2.697,8.924-6.467,7.203 L119.383,139.448z"
                fill={coloredParts['rightFinger1'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ el parmak 2 (Right hand finger 2) */}
        <G onPress={() => onPartPress('rightFinger2')}>
          <Path d="M113.592,136.681c0,0,2.297-2.887,5.023-1.101c2.727,1.786,4.496,7.027,1.473,10.878 C117.066,150.307,109.324,149.751,113.592,136.681z"
                fill={coloredParts['rightFinger2'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ el parmak 3 (Right hand finger 3) */}
        <G onPress={() => onPartPress('rightFinger3')}>
          <Path d="M107.633,137.452c0,0,1.045-4.117,4.729-3.696c3.684,0.418,4.346,4.688,4.895,7.134 c0.545,2.448,0.387,8.207-4.289,8.632C108.293,149.949,106.861,147.948,107.633,137.452z"
                fill={coloredParts['rightFinger3'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ el parmak 4 (Right hand finger 4) */}
        <G onPress={() => onPartPress('rightFinger4')}>
          <Path d="M103.117,136.3c0,0,2.973-4.63,5.758,0.157c2.785,4.786,3.271,14.554-1.865,15.924 C101.873,153.753,97.285,151.431,103.117,136.3z"
                fill={coloredParts['rightFinger4'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ el parmak 5 (Right hand finger 5) */}
        <G onPress={() => onPartPress('rightFinger5')}>
          <Path d="M96.269,135.428c0.953-2.39,3.524-6.232,7.414-2.56c3.891,3.673,2.465,20.352-4.221,19.989 C92.779,152.498,91.197,148.157,96.269,135.428z"
                fill={coloredParts['rightFinger5'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ el parmak 6 (Right hand finger 6) */}
        <G onPress={() => onPartPress('rightFinger6')}>
          <Path d="M86.088,143.778c0.705-10.154,4.404-12.948,8.773-12.05c4.365,0.9,3.148,12.602,2.475,14.343 c-0.672,1.741-1.709,8.075-7.166,6.462C84.711,150.92,85.953,145.747,86.088,143.778z"
                fill={coloredParts['rightFinger6'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Kafa (Head) - Ana kafa */}
        <G onPress={() => onPartPress('head')}>
          <Path d="M97.834,87.201c-2.373-2.917-5.621-5.294-9.32-6.112c-2.471-0.545-5.703-0.617-8.381,0.197 c-2.547-0.338-5.146-0.314-7.676,0.123c-6.348,1.093-12.162,7.823-10.438,14.143C62.01,95.605,62,95.659,62,95.718 c0,0.658,0.166,1.298,0.375,1.93c0.158,1.24,0.5,2.441,1.064,3.522c0.234,1.229,0.301,2.46,0.135,3.751 c-0.035,0.264,0.271,0.509,0.492,0.275c0.402-0.441,0.711-0.988,0.93-1.599c0.35,1.241,0.891,2.433,1.586,3.528 c0.76,1.196,1.773,2.238,2.807,3.197c1.281,1.19,3.537,2.119,3.16,4.246c-0.037,0.212,0.082,0.388,0.242,0.468 c-0.047,0.084-0.094,0.171-0.152,0.255c-0.076,0.115,0.074,0.236,0.182,0.177c1.713-0.965,2.018-2.672,1.649-4.406 c0.887,1.58,1.269,3.269,0.119,4.91c-0.043,0.063-0.012,0.135,0.039,0.175c-0.127,0.135-0.272,0.262-0.43,0.381 c-0.228,0.175-0.02,0.552,0.238,0.393c1.791-1.107,2.475-2.179,2.914-3.884c0.102,0.398,0.225,0.789,0.367,1.162 c0.465,1.206,1.652,2.531,2.031,3.891c0.023,0.277,0.064,0.557,0.111,0.839c0,0.05,0.002,0.098-0.002,0.144 c-0.002,0.043,0.016,0.072,0.041,0.094c0.023,0.143,0.047,0.284,0.07,0.429c0.021,0.148,0.225,0.087,0.238-0.036 c0.281-2.652,1.932-3.419,3.887-4.801c1.363-0.962,2.48-2.213,3.385-3.608c0.332-0.512,0.629-1.097,0.889-1.724 c0.129,1.885-0.381,3.884-1.826,5.155c-0.008,0.009-0.016,0.019-0.022,0.029c-0.082,0.049-0.166,0.097-0.248,0.139 c-0.143,0.067-0.035,0.305,0.109,0.25c1.553-0.578,2.762-0.84,4.063-2.005c1.539-1.371,2.734-2.902,3.652-4.746 c0.367-0.733,0.66-1.573,0.863-2.46c0.084,0.735,0.06,1.477-0.111,2.179c-0.098,0.393-0.191,0.785-0.275,1.183 c-0.037,0.183,0.174,0.301,0.311,0.175c2.434-2.273,3.797-5.656,4.293-9.076c0.689-1.32,1.16-2.746,1.359-4.143 C101.016,92.717,99.955,89.805,97.834,87.201z"
                fill={coloredParts['head'] || '#FFFFFF'}
                stroke="#161616"
                strokeWidth="0.5" />
        </G>

        {/* Kafa iç detay (Head inner detail) */}
        <G onPress={() => onPartPress('headInner')}>
          <Path d="M104.43,32.239c-0.731-1.291-2.01-2.605-3.822-3.748c-0.158,0.018-0.328,0.002-0.512-0.057 c-2.635-0.836-5.418-0.654-8.133-1.018c-2.17-0.291-4.16-1.198-6.025-2.305c-0.633,0.014-1.279,0.04-1.939,0.086 c-10.213,0.705-13.766,11.469-14.371,13.609c1.715-0.737,4.146-1.348,7.525-1.388c2.115-0.023,4.74,0.065,7.563,0.351 c0.02-0.02,0.041-0.039,0.063-0.057c0,0,4.01-1.467,7.332,1.269c5.947,1.397,11.652,3.926,14.584,8.341 C106.85,42.229,106.506,35.918,104.43,32.239z"
                fill={coloredParts['headInner'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* ÖN PLAN KATMANI - Gözler, burun, ağız EN ÜSTTE */}

        {/* Sol göz kapağı altı (Left eye lower lid) */}
        <G onPress={() => onPartPress('leftEyeLid')}>
          <Path d="M77.152,37.42c-3.379,0.04-5.811,0.65-7.525,1.388c-1.34,0.574-2.242,1.223-2.809,1.73 c2.482-0.79,4.955-0.635,6.52,0.306c1.867,1.119,4.117,2.41,6.188,3.576c1.012-1.646,2.982-4.617,5.189-6.648 C81.893,37.484,79.268,37.396,77.152,37.42z"
                fill={coloredParts['leftEyeLid'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ göz kapağı altı (Right eye lower lid) */}
        <G onPress={() => onPartPress('rightEyeLid')}>
          <Path d="M92.109,38.983L92.109,38.983c0,0,1.246,3.981,1.594,8.199c0.783-0.142,1.695-0.273,2.805-0.375 c3.707-0.35,7.41-0.251,10.182,0.718c0.002-0.065,0.004-0.134,0.004-0.201C103.762,42.909,98.057,40.38,92.109,38.983z"
                fill={coloredParts['rightEyeLid'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Göz arası bölge (Between eyes area) */}
        <G onPress={() => onPartPress('betweenEyes')}>
          <Path d="M92.109,38.983L92.109,38.983c-3.322-2.736-7.332-1.269-7.332-1.269 c-0.021,0.017-0.043,0.037-0.063,0.057c-2.207,2.031-4.178,5.002-5.189,6.648c3.352,1.895,6.23,3.463,6.23,3.463 c3.617,0.803,4.33-0.045,7.947-0.699C93.355,42.965,92.109,38.983,92.109,38.983z"
                fill={coloredParts['betweenEyes'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* ÖN KATMAN - Kafa ve yüz detayları EN ÖNDE */}

        {/* Sol kulak (Left ear) - Yelenin üstünde */}
        <G onPress={() => onPartPress('leftEar')}>
          <Path d="M32.973,68.929c-1.578-3.27-5.205-4.032-8.307-5.017c-0.07-0.023-0.098,0.075-0.045,0.113 c0.129,0.091,0.256,0.185,0.385,0.278c0.01,0.037,0.029,0.067,0.063,0.088c0.73,0.473,1.726,1.576,2.34,2.598 c-1.467-1.453-3.736-2.166-6.01-1.693c-2.084,0.434-3.877,1.513-5.496,2.869c-1.156,0.968-4.818,5.309-6.394,3.268 c-0.096-0.131-0.313-0.012-0.221,0.135c0.027,0.043,0.055,0.081,0.082,0.121c-0.064,0.025-0.115,0.096-0.068,0.164 c0.846,1.289,2.106,1.795,3.492,1.972c-0.895,0.35-1.813,0.548-2.777,0.392c-0.154-0.023-0.215,0.193-0.063,0.236 c0.133,0.037,0.262,0.063,0.391,0.093c0.01,0.06,0.051,0.116,0.131,0.123c3.742,0.259,6.646,3.397,10.283,4.159 c1.715,0.356,3.543,0.156,5.139-0.549c0.955-0.423,1.797-0.987,2.682-1.537c1.109-0.691,1.981-0.559,3.197-0.261 c1.43,0.354,2.24-1.092,1.883-2.154c0.131-0.255,0.236-0.529,0.307-0.818C34.332,71.989,33.615,70.257,32.973,68.929z"
                fill={coloredParts['leftEar'] || '#FFFFFF'}
                stroke="#292929"
                strokeWidth="0.5" />
        </G>

        {/* Sol yanak (Left cheek) - Yelenin üstünde */}
        <G onPress={() => onPartPress('leftCheek')}>
          <Path d="M85.185,47.64c-0.928-0.508-3.217-1.766-5.789-3.221c-2.07-1.166-4.32-2.457-6.187-3.576 c-1.566-0.94-4.039-1.096-6.524-0.306c-3.496,1.118-7.016,4.12-8.043,9.496c-1.545,8.054,6.078,11.454,13.055,12.234 c0.98,0.11,1.953,0.169,2.881,0.181c0.287,0.005,0.566-0.006,0.838-0.021c6.789-0.398,8.057-6.724,8.057-6.724 c-0.096,0.39-0.117,0.825-0.076,1.291c0.068-0.419,0.137-0.849,0.207-1.291C83.984,53.364,84.676,50.023,85.185,47.64z"
                fill={coloredParts['leftCheek'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol yanak kılları (Left cheek hair detail) - Detay çizgisi */}
        <Path d="M85.271,47.614c-3.307-1.813-6.596-3.653-9.857-5.546c-1.158-0.675-2.32-1.574-3.656-1.873 c-1.576-0.354-3.123-0.251-4.688,0.131c-5.74,1.399-9.766,7.892-8.553,13.653c1.074,5.108,6.924,7.277,11.447,8.103 c5.018,0.915,10.404,0.59,12.955-4.448c0.299-0.59,0.559-1.236,0.693-1.888c-0.096-0.028-0.188-0.058-0.281-0.087 c-0.08,0.455-0.096,0.852-0.074,1.308c0.004,0.071,0.268,0.146,0.279,0.071c0.502-3.137,1.125-6.248,1.787-9.354 c0.02-0.085-0.264-0.163-0.279-0.087c-0.664,3.106-1.285,6.217-1.787,9.354c0.094,0.023,0.186,0.049,0.279,0.071 c-0.047-0.432-0.023-0.855,0.076-1.275c0.016-0.087-0.264-0.163-0.281-0.087c-0.67,3.236-3.342,5.758-6.502,6.498 c-3.141,0.735-6.939-0.021-9.98-0.946c-2.785-0.849-5.49-2.356-7.098-4.851c-3.244-5.036,0.303-12.175,4.984-14.864 c1.508-0.867,3.227-1.305,4.953-1.392c2.473-0.124,4.418,1.36,6.451,2.536c2.965,1.713,5.957,3.38,8.959,5.026 C85.178,47.709,85.435,47.706,85.271,47.614z"
              fill="#313131"
              stroke="none" />

        {/* Sağ yanak (Right cheek) - Yelenin üstünde */}
        <G onPress={() => onPartPress('rightCheek')}>
          <Path d="M110.656,50.913c-0.699-1.588-2.102-2.652-3.93-3.325c-0.057-0.02-0.109-0.042-0.168-0.063 c-2.771-0.969-6.475-1.067-10.18-0.718c-1.111,0.102-2.025,0.233-2.807,0.375c-3.615,0.654-4.328,1.502-7.947,0.699 c0,0-0.162-0.09-0.44-0.242c-0.51,2.384-1.201,5.725-1.582,8.063c-0.07,0.442-0.139,0.872-0.207,1.291 c0.285,3.047,3.459,7.464,8.09,9.719c0.916,0.446,1.891,0.804,2.91,1.053c1.752,0.429,3.635,0.531,5.6,0.158 C109.773,66.065,112.412,54.921,110.656,50.913z"
                fill={coloredParts['rightCheek'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ yanak kılları (Right cheek hair detail) - Detay çizgisi */}
        <Path d="M110.795,50.938c-1.814-3.736-6.604-4.295-10.291-4.381c-2.52-0.059-5.068,0.184-7.541,0.654 c-2.42,0.462-5.314,1.701-7.693,0.4c-0.031-0.018-0.209-0.086-0.226-0.014c-0.602,2.823-1.191,5.65-1.65,8.502 c-0.348,2.172,0.896,4.209,2.172,5.892c3.355,4.435,9.006,6.933,14.52,5.999c4.26-0.719,7.668-3.686,9.582-7.463 C111.049,57.797,112.029,53.905,110.795,50.938c-0.033-0.082-0.309-0.117-0.279-0.05c1.643,3.952-0.424,9.193-2.891,12.321 c-1.773,2.251-4.262,3.776-7.022,4.492c-5.07,1.316-10.226-0.863-13.752-4.5c-1.107-1.141-2.021-2.476-2.684-3.921 c-0.738-1.614-0.522-3.009-0.221-4.712c0.311-1.765,0.672-3.52,1.037-5.274c0.066-0.326,0.121-1.563,0.588-1.37 c0.588,0.243,1.344,0.26,1.979,0.324c1.193,0.121,2.357-0.125,3.508-0.412c1.965-0.49,3.92-0.83,5.938-1.008 c4.266-0.377,10.855-0.568,13.346,3.701c0.059,0.12,0.115,0.238,0.174,0.358C110.555,50.97,110.826,51,110.795,50.938z"
              fill="#313131"
              stroke="none" />

        {/* Sağ kulak (Right ear) - Yelenin üstünde */}
        <G onPress={() => onPartPress('rightEar')}>
          <Path d="M64.57,16.783c-0.299,2.948,1.914,4.964,4.051,6.753c0.016,0.252-0.002,0.508-0.1,0.783 c-0.238,0.655-0.715,1.17-1.146,1.742c-0.018,0.023,0.012,0.049,0.037,0.039c0.041-0.014,0.082-0.034,0.125-0.053 c-0.004,0.019,0.014,0.033,0.035,0.021c0.541-0.346,1.215-0.358,1.773-0.672c0.328-0.185,0.678-0.358,1.008-0.552 c-0.273,0.268-0.568,0.521-0.805,0.811c-0.016,0.017-0.002,0.051,0.025,0.037c0.488-0.219,1.1-0.649,1.531-1.152 c-0.053,0.115-0.103,0.215-0.141,0.295c-0.279,0.554-0.682,0.941-1.238,1.295c-0.018,0.014-0.018,0.044,0.008,0.045 c0.121,0.006,0.242-0.012,0.359-0.041c0.002,0,0,0.003,0.002,0c0.959,0.059,2.285-0.744,2.934-1.396 c0.143-0.142,0.295-0.314,0.434-0.5c-0.004,0.045-0.012,0.089-0.018,0.133c-0.096,0.514-0.244,1.187-0.625,1.623 c-0.021,0.023,0.018,0.055,0.037,0.028c0.539-0.595,0.852-1.328,0.934-2.064c0.006-0.046,0.01-0.095,0.012-0.15 c0.141,0.287,0.254,0.583,0.315,0.895c0.102,0.524,0.041,1.063,0.129,1.586c0.002,0.025,0.031,0.03,0.047,0.01 c0.053-0.075,0.098-0.15,0.141-0.228c0.59-0.751,1.479-1.816,1.666-2.797c0.008,0.006,0.018,0.015,0.023,0.021 c0.494,0.484,1.045,0.832,1.738,1.07c0.1,0.031,0.188-0.102,0.086-0.145c-0.629-0.258-1.117-0.805-1.496-1.313 c1.004,0.784,2.385,1.506,3.476,1.232c0.025,0.001,0.047,0.004,0.07,0.006c0.031,0.001,0.055-0.027,0.051-0.048 c0.068-0.024,0.139-0.044,0.205-0.074c0.021-0.013,0.014-0.043-0.01-0.046c-0.232-0.038-0.451-0.078-0.66-0.127 c-0.334-0.222-0.615-0.528-0.852-0.821c0.621,0.335,1.328,0.548,2.014,0.565c0.041,0,0.057-0.046,0.018-0.057 c-0.496-0.125-0.969-0.32-1.399-0.566c0.274,0.078,0.551,0.137,0.816,0.167c0.916,0.108,1.543,0.001,2.252-0.461 c0.096-0.017,0.195-0.033,0.293-0.062c0.033-0.009,0.033-0.057-0.002-0.059c-0.037-0.002-0.07-0.006-0.107-0.01 c0.035-0.025,0.068-0.047,0.104-0.073c0.029-0.022,0.012-0.069-0.025-0.054c-0.104,0.038-0.215,0.072-0.324,0.102 c-0.357-0.041-0.695-0.108-1.027-0.227c0.016,0,0.027,0.003,0.045,0.004c0.027,0.002,0.041-0.039,0.012-0.043 c-0.16-0.014-0.328-0.07-0.488-0.146c-0.027-0.016-0.059-0.031-0.088-0.047c-0.293-0.16-0.555-0.393-0.715-0.608 c-0.094-0.13-0.17-0.282-0.27-0.414c0.934-1.392,1.484-2.885,1.232-4.471c-0.203-1.284-0.748-2.468-1.691-3.409 c-2.018-2.016-5.387-2.952-8.553-2.31C67.607,11.51,64.877,13.733,64.57,16.783z"
                fill={coloredParts['rightEar'] || '#FFFFFF'}
                stroke="#161616"
                strokeWidth="0.5" />
        </G>

        {/* Kafa iç detay (Head inner detail) - İki kulak arasındaki saç - BOYANABİLİR */}
        <G onPress={() => onPartPress('headInner')}>
          <Path d="M104.43,32.239c-0.731-1.291-2.01-2.605-3.822-3.748c-0.158,0.018-0.328,0.002-0.512-0.057 c-2.635-0.836-5.418-0.654-8.133-1.018c-2.17-0.291-4.16-1.198-6.025-2.305c-0.633,0.014-1.279,0.04-1.939,0.086 c-10.213,0.705-13.766,11.469-14.371,13.609c1.715-0.737,4.146-1.348,7.525-1.388c2.115-0.023,4.74,0.065,7.563,0.351 c0.02-0.02,0.041-0.039,0.063-0.057c0,0,4.01-1.467,7.332,1.269c5.947,1.397,11.652,3.926,14.584,8.341 C106.85,42.229,106.506,35.918,104.43,32.239z"
                fill={coloredParts['headInner'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol göz (Left eye) - Dış beyaz */}
        <G onPress={() => onPartPress('leftEye')}>
          <Path d="M74.918,34.255c-1.91,3.25-1.631,6.736,0.623,7.787c2.254,1.054,5.629-0.727,7.539-3.978 c1.908-3.247,1.629-6.734-0.623-7.788C80.201,29.224,76.826,31.007,74.918,34.255z"
                fill={coloredParts['leftEye'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sol göz göz bebeği (Left eye pupil) */}
        <G onPress={() => onPartPress('leftEyePupil')}>
          <Path d="M82.018,37.054c-1.383,2.469-3.813,3.887-5.43,3.168c-1.617-0.719-1.805-3.303-0.424-5.77 c1.381-2.47,3.811-3.888,5.428-3.17C83.209,32.003,83.4,34.586,82.018,37.054z"
                fill={coloredParts['leftEyePupil'] || '#454545'}
                stroke="none" />
        </G>

        {/* Sağ göz (Right eye) - Dış beyaz */}
        <G onPress={() => onPartPress('rightEye')}>
          <Path d="M93.201,39.476c-0.19,3.678,1.713,6.747,4.246,6.852c2.531,0.107,4.74-2.789,4.932-6.468 c0.191-3.679-1.707-6.748-4.24-6.854C95.603,32.901,93.394,35.798,93.201,39.476z"
                fill={coloredParts['rightEye'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Sağ göz göz bebeği (Right eye pupil) */}
        <G onPress={() => onPartPress('rightEyePupil')}>
          <Path d="M100.941,39.343c-0.086,2.766-1.611,4.978-3.412,4.932c-1.799-0.042-3.189-2.322-3.105-5.092 c0.084-2.769,1.609-4.976,3.408-4.934C99.633,34.294,101.023,36.573,100.941,39.343z"
                fill={coloredParts['rightEyePupil'] || '#454545'}
                stroke="none" />
        </G>

        {/* Burun (Nose) */}
        <G onPress={() => onPartPress('nose')}>
          <Path d="M89.334,68.869c1.01-0.704,1.771-1.515,2.283-2.156c-5.342-2.599-8.746-8.077-8.014-11.01 c0,0-1.268,6.325-8.059,6.724c0.18,0.956,0.555,2.374,1.344,3.76C79.158,65.065,83.935,63.806,89.334,68.869z"
                fill={coloredParts['nose'] || '#FFFFFF'}
                stroke="#313131"
                strokeWidth="0.5" />
        </G>

        {/* Ağız (Mouth) */}
        <G onPress={() => onPartPress('mouth')}>
          <Path d="M76.889,66.187c1.016,1.781,2.711,3.499,5.545,4.084c2.959,0.609,5.258-0.257,6.9-1.401 C83.935,63.806,79.158,65.065,76.889,66.187z"
                fill={coloredParts['mouth'] || '#FFFFFF'}
                stroke="#292929"
                strokeWidth="0.5" />
        </G>

        {/* Kafa (Head) - Ana kafa - Alt sakal - SADECE STROKE (ÇİZGİ) - EN ARKADA (yelenin altında) */}
        <Path d="M97.834,87.201c-2.373-2.917-5.621-5.294-9.32-6.112c-2.471-0.545-5.703-0.617-8.381,0.197 c-2.547-0.338-5.146-0.314-7.676,0.123c-6.348,1.093-12.162,7.823-10.438,14.143C62.01,95.605,62,95.659,62,95.718 c0,0.658,0.166,1.298,0.375,1.93c0.158,1.24,0.5,2.441,1.064,3.522c0.234,1.229,0.301,2.46,0.135,3.751 c-0.035,0.264,0.271,0.509,0.492,0.275c0.402-0.441,0.711-0.988,0.93-1.599c0.35,1.241,0.891,2.433,1.586,3.528 c0.76,1.196,1.773,2.238,2.807,3.197c1.281,1.19,3.537,2.119,3.16,4.246c-0.037,0.212,0.082,0.388,0.242,0.468 c-0.047,0.084-0.094,0.171-0.152,0.255c-0.076,0.115,0.074,0.236,0.182,0.177c1.713-0.965,2.018-2.672,1.649-4.406 c0.887,1.58,1.269,3.269,0.119,4.91c-0.043,0.063-0.012,0.135,0.039,0.175c-0.127,0.135-0.272,0.262-0.43,0.381 c-0.228,0.175-0.02,0.552,0.238,0.393c1.791-1.107,2.475-2.179,2.914-3.884c0.102,0.398,0.225,0.789,0.367,1.162 c0.465,1.206,1.652,2.531,2.031,3.891c0.023,0.277,0.064,0.557,0.111,0.839c0,0.05,0.002,0.098-0.002,0.144 c-0.002,0.043,0.016,0.072,0.041,0.094c0.023,0.143,0.047,0.284,0.07,0.429c0.021,0.148,0.225,0.087,0.238-0.036 c0.281-2.652,1.932-3.419,3.887-4.801c1.363-0.962,2.48-2.213,3.385-3.608c0.332-0.512,0.629-1.097,0.889-1.724 c0.129,1.885-0.381,3.884-1.826,5.155c-0.008,0.009-0.016,0.019-0.022,0.029c-0.082,0.049-0.166,0.097-0.248,0.139 c-0.143,0.067-0.035,0.305,0.109,0.25c1.553-0.578,2.762-0.84,4.063-2.005c1.539-1.371,2.734-2.902,3.652-4.746 c0.367-0.733,0.66-1.573,0.863-2.46c0.084,0.735,0.06,1.477-0.111,2.179c-0.098,0.393-0.191,0.785-0.275,1.183 c-0.037,0.183,0.174,0.301,0.311,0.175c2.434-2.273,3.797-5.656,4.293-9.076c0.689-1.32,1.16-2.746,1.359-4.143 C101.016,92.717,99.955,89.805,97.834,87.201z"
              fill="none"
              stroke="#161616"
              strokeWidth="0.5" />

        {/* Detay çizgileri - Burun ve ağız detayları (Detail lines) - Boyanmaz */}
        <Path d="M91.475,66.712c-2.658,3.219-6.648,4.604-10.645,2.971c-2.955-1.207-4.547-4.301-5.137-7.272 c-0.012-0.053-0.115-0.045-0.152-0.043c-1.219,0.056-2.434-0.032-3.645-0.158"
              fill="none"
              stroke="#313131"
              strokeWidth="0.5" />

        {/* Detay çizgileri - Burun ve ağız detayları (Detail lines - Nose and mouth details) - Boyanmaz */}
        <Path d="M91.475,66.712c-2.658,3.219-6.648,4.604-10.645,2.971c-2.955-1.207-4.547-4.301-5.137-7.272 c-0.012-0.053-0.115-0.045-0.152-0.043c-1.219,0.056-2.434-0.032-3.645-0.158c-0.041-0.004-0.25,0.004-0.209,0.088 c0.879,1.78,1.531,3.578,2.002,5.505c0.262,1.062,0.67,2.084,1.164,3.058c1.219,2.393,3.248,4.195,5.836,4.938 c6.061,1.732,10.205-4.387,13.967-8.015c0.031-0.032,0.006-0.06-0.031-0.068c-0.998-0.264-1.945-0.605-2.885-1.044 c-0.07-0.033-0.34,0.04-0.246,0.084c0.635,0.297,1.268,0.551,1.93,0.777c0.967,0.332,0.727,0.445,0.145,1.049 c-0.826,0.852-1.623,1.732-2.451,2.584c-2.135,2.192-4.785,4.678-8.012,4.818c-2.807,0.123-5.361-1.476-7.006-3.632 c-1.361-1.784-1.885-3.853-2.463-5.967c-0.361-1.319-0.92-2.587-1.51-3.818c-0.123-0.261,1.383-0.098,1.605-0.085 c0.295,0.016,1.635-0.211,1.734,0.295c0.51,2.559,1.857,4.92,4.027,6.402c4.076,2.789,9.352,1.064,12.268-2.465 C91.803,66.665,91.533,66.643,91.475,66.712z"
              fill="none"
              stroke="#313131"
              strokeWidth="0.5" />
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
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  // Köpek (Dog)
  dogContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  // Aslan (Leon/Lion)
  leonContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
