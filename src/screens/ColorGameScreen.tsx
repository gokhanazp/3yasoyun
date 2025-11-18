// Renk öğrenme oyunu ekranı (Color learning game screen)
// Soru-cevap formatında renk öğrenme oyunu

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, LEARNING_COLORS } from '../constants/colors';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { playColorSound, initializeAudio, speakTurkish, stopSpeaking } from '../utils/soundManager';

const { width } = Dimensions.get('window');
const BALLOON_SIZE = width * 0.28; // Balon boyutu ekran genişliğinin %28'i (daha küçük)

type ColorGameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ColorGame'
>;

interface ColorGameScreenProps {
  navigation: ColorGameScreenNavigationProp;
}

export const ColorGameScreen: React.FC<ColorGameScreenProps> = ({ navigation }) => {
  const [targetColor, setTargetColor] = useState<typeof LEARNING_COLORS[0] | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [animatedValues] = useState(
    LEARNING_COLORS.map(() => new Animated.Value(1))
  );

  // Ses sistemini başlat (Initialize audio system)
  useEffect(() => {
    initializeAudio();

    // Cleanup: Ekrandan çıkınca sesi durdur (Stop speech when leaving screen)
    return () => {
      console.log('🧹 ColorGameScreen cleanup - stopping speech');
      stopSpeaking();
    };
  }, []);

  // Türkçe dilbilgisi için yardımcı fonksiyon (Helper function for Turkish grammar)
  const getAccusativeSuffix = (word: string): string => {
    // Ünlü harfler (Vowels)
    const backVowels = ['a', 'ı', 'o', 'u']; // Kalın ünlüler (Back vowels)
    const frontVowels = ['e', 'i', 'ö', 'ü']; // İnce ünlüler (Front vowels)

    // Kelimenin son ünlüsünü bul (Find last vowel in word)
    let lastVowel = '';
    for (let i = word.length - 1; i >= 0; i--) {
      const char = word[i].toLowerCase();
      if ([...backVowels, ...frontVowels].includes(char)) {
        lastVowel = char;
        break;
      }
    }

    // Büyük ünlü uyumu (Vowel harmony)
    if (backVowels.includes(lastVowel)) {
      return 'yı'; // Kalın ünlü (Back vowel)
    } else {
      return 'yi'; // İnce ünlü (Front vowel)
    }
  };

  // Yeni soru sor (Ask new question)
  const askNewQuestion = () => {
    // Rastgele renk seç (Select random color)
    const randomColor = LEARNING_COLORS[Math.floor(Math.random() * LEARNING_COLORS.length)];
    setTargetColor(randomColor);
    setShowFeedback(null);

    console.log('🎯 Asking question for:', randomColor.name);

    // Soruyu sor (Ask question)
    setTimeout(() => {
      const suffix = getAccusativeSuffix(randomColor.name);
      speakTurkish(`${randomColor.name}${suffix} bul`);
    }, 500);
  };

  // Oyunu başlat (Start game)
  const startGame = () => {
    console.log('🎮 Oyun başlatılıyor...');
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    askNewQuestion();
  };

  // Renk balonuna tıklandığında (When color balloon is pressed)
  const handleColorPress = (color: typeof LEARNING_COLORS[0], index: number) => {
    if (!gameStarted || !targetColor) {
      // Oyun başlamadıysa, sadece rengi göster ve sesini çal
      speakTurkish(color.name);
      playColorSound(color.name); // Türkçe isim gönder

      // Animasyon
      Animated.sequence([
        Animated.timing(animatedValues[index], {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    // Doğru mu kontrol et (Check if correct)
    if (color.name === targetColor.name) {
      // DOĞRU CEVAP! (CORRECT ANSWER!)
      console.log('✅ Doğru cevap!');
      setShowFeedback('correct');
      setScore(score + 1);
      setAttempts(attempts + 1);
      setShowConfetti(true);

      // Renk sesini çal (Play color sound)
      playColorSound(color.name); // Türkçe isim gönder

      // Aferin mesajı (Success message)
      setTimeout(() => {
        speakTurkish(`Aferin! Bu ${color.name}!`);
      }, 600);

      // Konfeti'yi gizle (Hide confetti)
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      // Büyüme animasyonu (Scale up animation)
      Animated.sequence([
        Animated.timing(animatedValues[index], {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Yeni soru sor (Ask new question)
      setTimeout(() => {
        askNewQuestion();
      }, 3000);
    } else {
      // YANLIŞ CEVAP! (WRONG ANSWER!)
      console.log('❌ Yanlış cevap!');
      setShowFeedback('wrong');
      setAttempts(attempts + 1);

      // Tekrar dene mesajı (Try again message)
      setTimeout(() => {
        speakTurkish('Tekrar dene!');
      }, 300);

      // Sallama animasyonu (Shake animation)
      Animated.sequence([
        Animated.timing(animatedValues[index], {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Feedback'i temizle (Clear feedback)
      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Arka plan gradient (Background gradient) */}
      <LinearGradient
        colors={['#FFE5E5', '#E5F3FF', '#FFF9E5', '#E5FFE5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Arka plan balonları (Background balloons) */}
      <View style={styles.backgroundBalloons}>
        <View style={[styles.bgBalloon, { backgroundColor: '#FFB3BA', top: '10%', left: '5%' }]} />
        <View style={[styles.bgBalloon, { backgroundColor: '#BAE1FF', top: '20%', right: '10%' }]} />
        <View style={[styles.bgBalloon, { backgroundColor: '#FFFFBA', top: '60%', left: '10%' }]} />
        <View style={[styles.bgBalloon, { backgroundColor: '#BAFFC9', top: '70%', right: '5%' }]} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Konfeti efekti (Confetti effect) */}
        {showConfetti && <Confetti count={40} />}

        {/* Başlık (Header) */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleEmoji}>🎨</Text>
            <Text style={styles.titleText}>Renkler</Text>
          </View>

          {/* Skor (Score) */}
          {gameStarted && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>🎯 {score}/{attempts}</Text>
            </View>
          )}
        </View>

        {/* Oyun başlamadıysa başlat butonu (Start button if game not started) */}
        {!gameStarted ? (
          <View style={styles.topSection}>
            <Text style={styles.instructionText}>
              🎨 Renkleri öğrenmeye hazır mısın?
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startGame}
            >
              <Text style={styles.startButtonText}>🎮 Oyunu Başlat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Soru gösterimi (Question display) */
          targetColor && (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {targetColor.name}yı bul! 🎨
              </Text>
            </View>
          )
        )}

        {/* Renk balonları (Color balloons) */}
        <View style={styles.colorsContainer}>
          {LEARNING_COLORS.map((item, index) => (
            <Animated.View
              key={item.nameEn}
              style={{
                transform: [{ scale: animatedValues[index] }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.colorBalloon,
                  showFeedback === 'correct' && item.name === targetColor?.name && styles.correctBalloon,
                  showFeedback === 'wrong' && styles.wrongBalloon,
                ]}
                onPress={() => handleColorPress(item, index)}
                activeOpacity={0.8}
              >
                {/* Balon şekli (Balloon shape) */}
                <View style={[
                  styles.balloonBody,
                  { backgroundColor: item.color },
                  item.name === 'Beyaz' && styles.whiteBalloon, // Beyaz balon için kenarlık
                ]}>
                  <Text style={[
                    styles.colorName,
                    (item.name === 'Beyaz' || item.name === 'Sarı') && styles.darkText, // Beyaz ve sarı için koyu yazı
                  ]}>
                    {item.name}
                  </Text>
                </View>
                {/* Balon ipi (Balloon string) */}
                <View style={styles.balloonString} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Alt buton (Bottom button) */}
        <View style={styles.bottomContainer}>
          <GameButton
            title="Ana Menü"
            icon="🏠"
            onPress={() => navigation.navigate('Home')}
            color={COLORS.primary}
          />
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
  backgroundBalloons: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bgBalloon: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 10,
    flex: 1,
  },
  titleEmoji: {
    fontSize: 32,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  instructionText: {
    fontSize: 24,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  questionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  colorsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  colorBalloon: {
    margin: 5,
    alignItems: 'center',
  },
  balloonBody: {
    width: BALLOON_SIZE,
    height: BALLOON_SIZE * 1.15, // Balon şekli için biraz uzun (Slightly taller for balloon shape)
    borderRadius: BALLOON_SIZE / 2,
    borderBottomLeftRadius: BALLOON_SIZE / 2.5,
    borderBottomRightRadius: BALLOON_SIZE / 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    // Gölge efekti (Shadow effect)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  balloonString: {
    width: 2,
    height: 20,
    backgroundColor: '#999',
    alignSelf: 'center',
  },
  correctBalloon: {
    transform: [{ scale: 1.1 }],
  },
  wrongBalloon: {
    opacity: 0.5,
  },
  colorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  whiteBalloon: {
    borderWidth: 3,
    borderColor: '#CCCCCC',
  },
  darkText: {
    color: '#2C3E50',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
  },
  bottomContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

