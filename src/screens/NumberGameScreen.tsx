// Sayı öğrenme oyunu ekranı (Number learning game screen)
// Çocuklar 1'den 10'a kadar sayıları öğrenir

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
import { NUMBERS } from '../constants/gameData';
import { COLORS } from '../constants/colors';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { playNumberSound, initializeAudio, speakTurkish } from '../utils/soundManager';

const { width } = Dimensions.get('window');

type NumberGameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NumberGame'
>;

interface NumberGameScreenProps {
  navigation: NumberGameScreenNavigationProp;
}

export const NumberGameScreen: React.FC<NumberGameScreenProps> = ({
  navigation,
}) => {
  const [targetNumber, setTargetNumber] = useState<typeof NUMBERS[0] | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [foundNumbers, setFoundNumbers] = useState<number[]>([]);
  const [animatedValues] = useState(
    NUMBERS.map(() => new Animated.Value(1))
  );

  // Ses sistemini başlat (Initialize audio system)
  useEffect(() => {
    initializeAudio();
  }, []);

  // Yeni soru sor (Ask new question)
  const askNewQuestion = (currentFoundNumbers: number[] = foundNumbers) => {
    // Bulunmamış sayılardan rastgele seç (Select random unfound number)
    const unfoundNumbers = NUMBERS.filter(n => !currentFoundNumbers.includes(n.value));


    if (unfoundNumbers.length === 0) {
      // Tüm sayılar bulundu! (All numbers found!)
      setTargetNumber(null);
      setGameCompleted(true);
      setShowConfetti(true);
      setTimeout(() => {
        speakTurkish('Tebrikler! Tüm sayıları buldun!');
      }, 500);
      return;
    }

    const randomNumber = unfoundNumbers[Math.floor(Math.random() * unfoundNumbers.length)];
    setTargetNumber(randomNumber);
    setShowFeedback(null);

    // 1 saniye sonra soruyu sor (Ask question after 1 second)
    setTimeout(() => {
      speakTurkish(`${randomNumber.name}yı bul`);
    }, 500);
  };

  // Oyunu başlat (Start game)
  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setAttempts(0);
    setFoundNumbers([]);
    setShowConfetti(false);
    askNewQuestion([]);
  };

  // Sayıya tıklandığında (When number is pressed)
  const handleNumberPress = (number: typeof NUMBERS[0], index: number) => {
    if (!gameStarted || !targetNumber || foundNumbers.includes(number.value) || gameCompleted) return;


    setAttempts(attempts + 1);

    // Animasyon (Animation)
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (number.value === targetNumber.value) {
      // DOĞRU CEVAP! (CORRECT ANSWER!)
      setShowFeedback('correct');
      setScore(score + 1);

      // Yeni found numbers listesi oluştur (Create new found numbers list)
      const newFoundNumbers = [...foundNumbers, number.value];
      setFoundNumbers(newFoundNumbers);

      setShowConfetti(true);
      playNumberSound(number.value);

      setTimeout(() => {
        speakTurkish(`Aferin! Bu ${number.name}!`);
      }, 300);

      // Konfeti ve yeni soru (Confetti and new question)
      setTimeout(() => {
        setShowConfetti(false);
        setShowFeedback(null);
        // Güncellenmiş found numbers listesini gönder (Pass updated found numbers list)
        askNewQuestion(newFoundNumbers);
      }, 2000);
    } else {
      // YANLIŞ CEVAP! (WRONG ANSWER!)
      setShowFeedback('wrong');

      setTimeout(() => {
        speakTurkish('Hayır, bu yanlış');
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
        colors={['#FFF9C4', '#FFE082', '#FFCCBC', '#F8BBD0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Arka plan sayıları (Background numbers) */}
      <View style={styles.backgroundNumbers} pointerEvents="none">
        {/* Büyük soluk sayılar (Large faded numbers) */}
        <Text style={[styles.bgNumber, { left: '5%', top: '10%', fontSize: 100, opacity: 0.1 }]}>1️⃣</Text>
        <Text style={[styles.bgNumber, { right: '10%', top: '15%', fontSize: 90, opacity: 0.08 }]}>2️⃣</Text>
        <Text style={[styles.bgNumber, { left: '15%', top: '40%', fontSize: 110, opacity: 0.09 }]}>3️⃣</Text>
        <Text style={[styles.bgNumber, { right: '5%', top: '50%', fontSize: 95, opacity: 0.11 }]}>4️⃣</Text>
        <Text style={[styles.bgNumber, { left: '10%', bottom: '20%', fontSize: 105, opacity: 0.1 }]}>5️⃣</Text>
        <Text style={[styles.bgNumber, { right: '15%', bottom: '15%', fontSize: 100, opacity: 0.12 }]}>6️⃣</Text>

        {/* Küçük yıldızlar (Small stars) */}
        <Text style={[styles.bgNumber, { left: '20%', top: '25%', fontSize: 30, opacity: 0.2 }]}>⭐</Text>
        <Text style={[styles.bgNumber, { right: '25%', top: '35%', fontSize: 25, opacity: 0.18 }]}>⭐</Text>
        <Text style={[styles.bgNumber, { left: '70%', top: '60%', fontSize: 28, opacity: 0.16 }]}>⭐</Text>
        <Text style={[styles.bgNumber, { right: '60%', bottom: '30%', fontSize: 32, opacity: 0.19 }]}>⭐</Text>
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
            <Text style={styles.titleEmoji}>🔢</Text>
            <Text style={styles.titleText}>Sayılar</Text>
          </View>

          {/* Skor (Score) */}
          {gameStarted && !gameCompleted && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>🎯 {score}/{attempts}</Text>
            </View>
          )}
        </View>

        {/* Oyun başlamadıysa başlat butonu / Oyun başladıysa soru */}
        {!gameStarted ? (
          <View style={styles.topSection}>
            <Text style={styles.instructionText}>
              🔢 Sayıları öğrenmeye hazır mısın?
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>🎮 Oyunu Başlat</Text>
            </TouchableOpacity>
          </View>
        ) : gameCompleted ? (
          <View style={styles.completedContainer}>
            <Text style={styles.completedText}>
              🎉 Tebrikler! Tümünü buldun! 🎉
            </Text>
            <Text style={styles.finalScoreText}>
              Skor: {score}/{attempts}
            </Text>
            <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
              <Text style={styles.playAgainButtonText}>🔄 Tekrar Oyna</Text>
            </TouchableOpacity>
          </View>
        ) : targetNumber ? (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {targetNumber.name}yı bul! 🎯
            </Text>
          </View>
        ) : null}

        {/* Geri bildirim (Feedback) */}
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

        {/* Sayı kartları (Number cards) */}
        <View style={styles.numbersContainer}>
          {NUMBERS.map((number, index) => (
            <Animated.View
              key={number.value}
              style={{
                transform: [{ scale: animatedValues[index] }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.numberCard,
                  foundNumbers.includes(number.value) && styles.foundCard,
                  showFeedback === 'correct' && targetNumber?.value === number.value && styles.correctCard,
                ]}
                onPress={() => handleNumberPress(number, index)}
                activeOpacity={0.8}
                disabled={!gameStarted || foundNumbers.includes(number.value) || gameCompleted}
              >
                <Text style={styles.numberEmoji}>{number.emoji}</Text>
                <Text style={styles.numberName}>{number.name}</Text>
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
            color={COLORS.purple}
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
  backgroundNumbers: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bgNumber: {
    position: 'absolute',
    // Arka plan sayıları için stil (Style for background numbers)
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
    backgroundColor: COLORS.purple, // Mor arka plan (Purple background)
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
    backgroundColor: COLORS.purple,
    paddingHorizontal: 40,
    paddingVertical: 18,
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
    fontSize: 26,
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
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  numberCard: {
    width: width * 0.28,
    height: width * 0.28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  foundCard: {
    opacity: 0.5,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  correctCard: {
    borderColor: '#4CAF50',
    borderWidth: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  numberEmoji: {
    fontSize: 48,
    marginBottom: 5,
  },
  numberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bottomContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

