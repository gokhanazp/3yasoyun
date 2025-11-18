// Şekil eşleştirme oyunu ekranı (Shape matching game screen)
// Çocuklar şekilleri tanır ve eşleştirir

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
import { COLORS } from '../constants/colors';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { playClickSound, initializeAudio, speakTurkish } from '../utils/soundManager';

const { width } = Dimensions.get('window');

type ShapeMatchingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ShapeMatching'
>;

interface ShapeMatchingScreenProps {
  navigation: ShapeMatchingScreenNavigationProp;
}

// Şekil verileri (Shape data)
const SHAPES = [
  { id: '1', name: 'Yıldız', nameEn: 'Star', emoji: '⭐', color: '#FFD700', shadow: '☆' },
  { id: '2', name: 'Daire', nameEn: 'Circle', emoji: '🔵', color: '#4A90E2', shadow: '⚪' },
  { id: '3', name: 'Kare', nameEn: 'Square', emoji: '🟥', color: '#FF6B6B', shadow: '⬜' },
  { id: '4', name: 'Üçgen', nameEn: 'Triangle', emoji: '🔺', color: '#FF9F43', shadow: '△' },
  { id: '5', name: 'Kalp', nameEn: 'Heart', emoji: '❤️', color: '#FF6B9D', shadow: '🤍' },
  { id: '6', name: 'Elmas', nameEn: 'Diamond', emoji: '💎', color: '#A55EEA', shadow: '◇' },
];

export const ShapeMatchingScreen: React.FC<ShapeMatchingScreenProps> = ({
  navigation,
}) => {
  const [targetShape, setTargetShape] = useState<typeof SHAPES[0] | null>(null);
  const [selectedSourceShape, setSelectedSourceShape] = useState<string | null>(null);
  const [matchedShapes, setMatchedShapes] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [animatedValues] = useState(
    // Sol ve sağ şekiller için animasyon değerleri (Animation values for left and right shapes)
    [...SHAPES, ...SHAPES].map(() => new Animated.Value(1))
  );

  // Ses sistemini başlat (Initialize audio system)
  useEffect(() => {
    initializeAudio();
  }, []);

  // Yeni soru sor (Ask new question)
  const askNewQuestion = (currentMatchedShapes: string[] = matchedShapes) => {
    // Eşleşmemiş şekillerden rastgele seç (Select random unmatched shape)
    const unmatchedShapes = SHAPES.filter(s => !currentMatchedShapes.includes(s.id));

    console.log('🎯 askNewQuestion called');
    console.log('📊 Matched shapes:', currentMatchedShapes);
    console.log('📊 Unmatched shapes:', unmatchedShapes.map(s => s.name));

    if (unmatchedShapes.length === 0) {
      // Tüm şekiller eşleşti! (All shapes matched!)
      console.log('🎉 GAME COMPLETED!');
      setTargetShape(null);
      setGameCompleted(true);
      setShowConfetti(true);
      setTimeout(() => {
        speakTurkish('Tebrikler! Tüm şekilleri eşleştirdin!');
      }, 500);
      return;
    }

    const randomShape = unmatchedShapes[Math.floor(Math.random() * unmatchedShapes.length)];
    console.log('🎯 New target shape:', randomShape.name);
    setTargetShape(randomShape);
    setSelectedSourceShape(null);
    setShowFeedback(null);

    // 1 saniye sonra soruyu sor (Ask question after 1 second)
    setTimeout(() => {
      // Türkçe dilbilgisi için doğru ek (Correct suffix for Turkish grammar)
      const suffix = ['Kalp', 'Elmas'].includes(randomShape.name) ? 'i' :
                     randomShape.name === 'Yıldız' ? 'ı' :
                     randomShape.name === 'Daire' ? 'yi' :
                     randomShape.name === 'Kare' ? 'yi' :
                     randomShape.name === 'Üçgen' ? 'i' : 'ı';
      speakTurkish(`${randomShape.name}${suffix} eşleştir`);
    }, 500);
  };

  // Oyunu başlat (Start game)
  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setAttempts(0);
    setMatchedShapes([]);
    setShowConfetti(false);
    askNewQuestion();
  };

  // Sol taraftaki şekle tıklandığında (When source shape is pressed)
  const handleSourceShapePress = (shape: typeof SHAPES[0], index: number) => {
    if (!gameStarted || !targetShape || matchedShapes.includes(shape.id) || gameCompleted) return;

    setSelectedSourceShape(shape.id);
    playClickSound();

    // Animasyon (Animation)
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
  };

  // Sağ taraftaki hedefe tıklandığında (When target shape is pressed)
  const handleTargetShapePress = (shape: typeof SHAPES[0], index: number) => {
    if (!gameStarted || !targetShape || !selectedSourceShape || matchedShapes.includes(shape.id) || gameCompleted) return;

    console.log('🎯 Target pressed:', shape.name);
    console.log('🎯 Selected source:', selectedSourceShape);
    console.log('🎯 Target shape ID:', shape.id);
    console.log('🎯 Match?', selectedSourceShape === shape.id);

    setAttempts(attempts + 1);

    if (selectedSourceShape === shape.id) {
      // DOĞRU EŞLEŞME! (CORRECT MATCH!)
      console.log('✅ CORRECT MATCH!');
      setShowFeedback('correct');
      setScore(score + 1);

      // Yeni matched shapes listesi oluştur (Create new matched shapes list)
      const newMatchedShapes = [...matchedShapes, shape.id];
      setMatchedShapes(newMatchedShapes);
      console.log('📊 New matched shapes:', newMatchedShapes);

      setShowConfetti(true);
      playClickSound();

      setTimeout(() => {
        speakTurkish(`Aferin! Bu ${shape.name}!`);
      }, 300);

      // Animasyon (Animation)
      Animated.sequence([
        Animated.timing(animatedValues[index + SHAPES.length], {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[index + SHAPES.length], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Konfeti ve yeni soru (Confetti and new question)
      setTimeout(() => {
        setShowConfetti(false);
        setShowFeedback(null);
        setSelectedSourceShape(null);
        // Güncellenmiş matched shapes listesini gönder (Pass updated matched shapes list)
        askNewQuestion(newMatchedShapes);
      }, 2000);
    } else {
      // YANLIŞ EŞLEŞME! (WRONG MATCH!)
      console.log('❌ WRONG MATCH!');
      setShowFeedback('wrong');
      setSelectedSourceShape(null);

      setTimeout(() => {
        speakTurkish('Tekrar dene!');
      }, 300);

      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Arka plan gradient (Background gradient) */}
      <LinearGradient
        colors={['#E3F2FD', '#F3E5F5', '#FFF9C4', '#E1F5FE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Arka plan şekilleri (Background shapes) */}
      <View style={styles.backgroundShapes} pointerEvents="none">
        {/* Büyük soluk şekiller (Large faded shapes) */}
        <Text style={[styles.bgShape, { left: '5%', top: '10%', fontSize: 80, opacity: 0.15 }]}>⭐</Text>
        <Text style={[styles.bgShape, { right: '10%', top: '15%', fontSize: 70, opacity: 0.12 }]}>🔵</Text>
        <Text style={[styles.bgShape, { left: '15%', top: '40%', fontSize: 90, opacity: 0.1 }]}>🟥</Text>
        <Text style={[styles.bgShape, { right: '5%', top: '50%', fontSize: 75, opacity: 0.13 }]}>🔺</Text>
        <Text style={[styles.bgShape, { left: '10%', bottom: '20%', fontSize: 85, opacity: 0.11 }]}>❤️</Text>
        <Text style={[styles.bgShape, { right: '15%', bottom: '15%', fontSize: 80, opacity: 0.14 }]}>💎</Text>

        {/* Küçük yıldızlar (Small stars) */}
        <Text style={[styles.bgShape, { left: '20%', top: '25%', fontSize: 30, opacity: 0.2 }]}>✨</Text>
        <Text style={[styles.bgShape, { right: '25%', top: '35%', fontSize: 25, opacity: 0.18 }]}>✨</Text>
        <Text style={[styles.bgShape, { left: '70%', top: '60%', fontSize: 28, opacity: 0.16 }]}>✨</Text>
        <Text style={[styles.bgShape, { right: '60%', bottom: '30%', fontSize: 32, opacity: 0.19 }]}>✨</Text>

        {/* Parlama efektleri (Sparkle effects) */}
        <Text style={[styles.bgShape, { left: '40%', top: '20%', fontSize: 35, opacity: 0.15 }]}>💫</Text>
        <Text style={[styles.bgShape, { right: '40%', bottom: '40%', fontSize: 30, opacity: 0.17 }]}>💫</Text>
      </View>

      {/* Konfeti efekti (Confetti effect) */}
      {showConfetti && <Confetti count={40} />}

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Başlık (Header) */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleEmoji}>🔷</Text>
            <Text style={styles.titleText}>Şekil Eşleştir</Text>
          </View>
          {gameStarted && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>🎯 {score}/{attempts}</Text>
            </View>
          )}
        </View>

        {/* Oyun başlamadıysa başlat butonu / Oyun başladıysa soru */}
        {!gameStarted ? (
          <View style={styles.topSection}>
            <Text style={styles.instructionText}>
              🔷 Şekilleri eşleştirmeye hazır mısın?
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>🎮 Oyunu Başlat</Text>
            </TouchableOpacity>
          </View>
        ) : gameCompleted ? (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>
              🎉 Tebrikler! Tümünü eşleştirdin! 🎉
            </Text>
            <Text style={styles.finalScoreText}>
              Skor: {score}/{attempts}
            </Text>
            <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
              <Text style={styles.playAgainButtonText}>🔄 Tekrar Oyna</Text>
            </TouchableOpacity>
          </View>
        ) : targetShape ? (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {targetShape.name}
              {['Kalp', 'Elmas'].includes(targetShape.name) ? 'i' :
               targetShape.name === 'Yıldız' ? 'ı' :
               targetShape.name === 'Daire' ? 'yi' :
               targetShape.name === 'Kare' ? 'yi' :
               targetShape.name === 'Üçgen' ? 'i' : 'ı'} eşleştir! 🎯
            </Text>
          </View>
        ) : null}

        {/* Feedback gösterimi (Feedback display) */}
        {showFeedback && (
          <View style={[
            styles.feedbackContainer,
            showFeedback === 'correct' ? styles.correctFeedback : styles.wrongFeedback
          ]}>
            <Text style={styles.feedbackText}>
              {showFeedback === 'correct' ? '✅ Aferin!' : '❌ Tekrar dene!'}
            </Text>
          </View>
        )}

        {/* Şekiller - Sol ve Sağ (Shapes - Left and Right) */}
        <View style={styles.gameArea}>
          {/* Sol taraf - Renkli şekiller (Left side - Colored shapes) */}
          <View style={styles.sourceColumn}>
            <Text style={styles.columnTitle}>Şekiller</Text>
            <View style={styles.shapesColumn}>
              {SHAPES.map((shape, index) => (
                <Animated.View
                  key={`source-${shape.id}`}
                  style={{
                    transform: [{ scale: animatedValues[index] }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.sourceShape,
                      { backgroundColor: shape.color },
                      selectedSourceShape === shape.id && styles.selectedSourceShape,
                      matchedShapes.includes(shape.id) && styles.matchedShape,
                    ]}
                    onPress={() => handleSourceShapePress(shape, index)}
                    activeOpacity={0.8}
                    disabled={!gameStarted || matchedShapes.includes(shape.id)}
                  >
                    <Text style={styles.shapeEmoji}>{shape.emoji}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Sağ taraf - Gri gölge şekiller (Right side - Gray shadow shapes) */}
          <View style={styles.targetColumn}>
            <Text style={styles.columnTitle}>Hedefler</Text>
            <View style={styles.shapesColumn}>
              {SHAPES.map((shape, index) => (
                <Animated.View
                  key={`target-${shape.id}`}
                  style={{
                    transform: [{ scale: animatedValues[index + SHAPES.length] }],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.targetShape,
                      matchedShapes.includes(shape.id) && styles.matchedTargetShape,
                      matchedShapes.includes(shape.id) && { backgroundColor: shape.color },
                    ]}
                    onPress={() => handleTargetShapePress(shape, index)}
                    activeOpacity={0.8}
                    disabled={!gameStarted || !selectedSourceShape || matchedShapes.includes(shape.id)}
                  >
                    <Text style={styles.shapeEmoji}>
                      {matchedShapes.includes(shape.id) ? shape.emoji : shape.shadow}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>

        {/* Alt buton (Bottom button) */}
        <View style={styles.bottomContainer}>
          <GameButton
            title="Ana Menü"
            icon="🏠"
            onPress={() => navigation.navigate('Home')}
            color={COLORS.blue}
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
  backgroundShapes: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bgShape: {
    position: 'absolute',
    // Arka plan şekilleri için stil (Style for background shapes)
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Geri solda, başlık sağda (Back left, title right)
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Beyaz arka plan (White background)
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    backgroundColor: COLORS.blue, // Mavi arka plan (Blue background)
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Beyaz yazı (White text)
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  completedText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  playAgainButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  playAgainButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  questionContainer: {
    alignItems: 'center',
    paddingVertical: 15,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  feedbackContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  correctFeedback: {
    backgroundColor: '#4CAF50',
  },
  wrongFeedback: {
    backgroundColor: '#FF5252',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Hafif beyaz arka plan (Light white background)
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  sourceColumn: {
    flex: 1,
    alignItems: 'center',
  },
  targetColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  shapesColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceShape: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: 15,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  selectedSourceShape: {
    borderWidth: 4,
    borderColor: '#FFD700',
    transform: [{ scale: 1.1 }],
  },
  matchedShape: {
    opacity: 0.3,
  },
  targetShape: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: 15,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderWidth: 3,
    borderColor: '#BDBDBD',
    borderStyle: 'dashed',
  },
  matchedTargetShape: {
    borderStyle: 'solid',
    borderColor: '#4CAF50',
    borderWidth: 4,
  },
  shapeEmoji: {
    fontSize: 40,
  },
  bottomContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

