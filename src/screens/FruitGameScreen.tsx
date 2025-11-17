// Meyve öğrenme oyunu ekranı (Fruit learning game screen)
// Çocuklar meyveleri tanır ve isimlerini öğrenir

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
import { FRUITS } from '../constants/gameData';
import { COLORS } from '../constants/colors';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { initializeAudio, speakTurkish } from '../utils/soundManager';

const { width } = Dimensions.get('window');

type FruitGameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FruitGame'
>;

interface FruitGameScreenProps {
  navigation: FruitGameScreenNavigationProp;
}

export const FruitGameScreen: React.FC<FruitGameScreenProps> = ({
  navigation,
}) => {
  const [targetFruit, setTargetFruit] = useState<typeof FRUITS[0] | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [foundFruits, setFoundFruits] = useState<string[]>([]);
  const [animatedValues] = useState(
    FRUITS.map(() => new Animated.Value(1))
  );

  // Ses sistemini başlat (Initialize audio system)
  useEffect(() => {
    initializeAudio();
  }, []);

  // Yeni soru sor (Ask new question)
  const askNewQuestion = (currentFoundFruits: string[] = foundFruits) => {
    // Bulunmamış meyvelerden rastgele seç (Select random unfound fruit)
    const unfoundFruits = FRUITS.filter(f => !currentFoundFruits.includes(f.id));
    
    console.log('🎯 askNewQuestion called');
    console.log('📊 Found fruits:', currentFoundFruits);
    console.log('📊 Unfound fruits:', unfoundFruits.map(f => f.name));
    
    if (unfoundFruits.length === 0) {
      // Tüm meyveler bulundu! (All fruits found!)
      console.log('🎉 GAME COMPLETED!');
      setTargetFruit(null);
      setGameCompleted(true);
      setShowConfetti(true);
      setTimeout(() => {
        speakTurkish('Tebrikler! Tüm meyveleri buldun!');
      }, 500);
      return;
    }

    const randomFruit = unfoundFruits[Math.floor(Math.random() * unfoundFruits.length)];
    console.log('🎯 New target fruit:', randomFruit.name);
    setTargetFruit(randomFruit);
    setShowFeedback(null);

    // 1 saniye sonra soruyu sor (Ask question after 1 second)
    setTimeout(() => {
      // Türkçe dilbilgisi için doğru ek (Correct suffix for Turkish grammar)
      const suffix = randomFruit.name === 'Elma' ? 'yı' :
                     randomFruit.name === 'Muz' ? 'u' :
                     randomFruit.name === 'Portakal' ? 'ı' :
                     randomFruit.name === 'Üzüm' ? 'ü' :
                     randomFruit.name === 'Çilek' ? 'i' :
                     randomFruit.name === 'Karpuz' ? 'u' :
                     randomFruit.name === 'Kiraz' ? 'ı' :
                     randomFruit.name === 'Armut' ? 'u' :
                     randomFruit.name === 'Ananas' ? 'ı' :
                     randomFruit.name === 'Şeftali' ? 'yi' :
                     randomFruit.name === 'Limon' ? 'u' :
                     randomFruit.name === 'Kavun' ? 'u' : 'u';
      speakTurkish(`${randomFruit.name}${suffix} bul`);
    }, 500);
  };

  // Oyunu başlat (Start game)
  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setAttempts(0);
    setFoundFruits([]);
    setShowConfetti(false);
    askNewQuestion([]);
  };

  // Meyveye tıklandığında (When fruit is pressed)
  const handleFruitPress = (fruit: typeof FRUITS[0], index: number) => {
    if (!gameStarted || !targetFruit || foundFruits.includes(fruit.id) || gameCompleted) return;

    console.log('🎯 Fruit pressed:', fruit.name);
    console.log('🎯 Target fruit:', targetFruit.name);
    console.log('🎯 Match?', fruit.id === targetFruit.id);

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

    if (fruit.id === targetFruit.id) {
      // DOĞRU CEVAP! (CORRECT ANSWER!)
      console.log('✅ CORRECT!');
      setShowFeedback('correct');
      setScore(score + 1);
      
      // Yeni found fruits listesi oluştur (Create new found fruits list)
      const newFoundFruits = [...foundFruits, fruit.id];
      setFoundFruits(newFoundFruits);
      console.log('📊 New found fruits:', newFoundFruits);

      setShowConfetti(true);

      setTimeout(() => {
        speakTurkish(`Aferin! Bu ${fruit.name}!`);
      }, 300);

      // Konfeti ve yeni soru (Confetti and new question)
      setTimeout(() => {
        setShowConfetti(false);
        setShowFeedback(null);
        // Güncellenmiş found fruits listesini gönder (Pass updated found fruits list)
        askNewQuestion(newFoundFruits);
      }, 2000);
    } else {
      // YANLIŞ CEVAP! (WRONG ANSWER!)
      console.log('❌ WRONG!');
      setShowFeedback('wrong');

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
        colors={['#FFE5E5', '#FFF5E5', '#E8F5E9', '#F3E5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Arka plan meyveleri (Background fruits) */}
      <View style={styles.backgroundFruits} pointerEvents="none">
        {/* Büyük soluk meyveler (Large faded fruits) */}
        <Text style={[styles.bgFruit, { left: '5%', top: '10%', fontSize: 80, opacity: 0.1 }]}>🍎</Text>
        <Text style={[styles.bgFruit, { right: '10%', top: '15%', fontSize: 70, opacity: 0.08 }]}>🍌</Text>
        <Text style={[styles.bgFruit, { left: '15%', top: '40%', fontSize: 90, opacity: 0.09 }]}>🍊</Text>
        <Text style={[styles.bgFruit, { right: '5%', top: '50%', fontSize: 75, opacity: 0.11 }]}>🍇</Text>
        <Text style={[styles.bgFruit, { left: '10%', bottom: '20%', fontSize: 85, opacity: 0.1 }]}>🍓</Text>
        <Text style={[styles.bgFruit, { right: '15%', bottom: '15%', fontSize: 80, opacity: 0.12 }]}>🍉</Text>

        {/* Küçük yıldızlar (Small stars) */}
        <Text style={[styles.bgFruit, { left: '20%', top: '25%', fontSize: 30, opacity: 0.2 }]}>✨</Text>
        <Text style={[styles.bgFruit, { right: '25%', top: '35%', fontSize: 25, opacity: 0.18 }]}>✨</Text>
        <Text style={[styles.bgFruit, { left: '70%', top: '60%', fontSize: 28, opacity: 0.16 }]}>✨</Text>
        <Text style={[styles.bgFruit, { right: '60%', bottom: '30%', fontSize: 32, opacity: 0.19 }]}>✨</Text>
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
            <Text style={styles.titleEmoji}>🍎</Text>
            <Text style={styles.titleText}>Meyveler</Text>
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
              🍎 Meyveleri öğrenmeye hazır mısın?
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
        ) : targetFruit ? (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {targetFruit.name}
              {targetFruit.name === 'Elma' ? 'yı' :
               targetFruit.name === 'Muz' ? 'u' :
               targetFruit.name === 'Portakal' ? 'ı' :
               targetFruit.name === 'Üzüm' ? 'ü' :
               targetFruit.name === 'Çilek' ? 'i' :
               targetFruit.name === 'Karpuz' ? 'u' :
               targetFruit.name === 'Kiraz' ? 'ı' :
               targetFruit.name === 'Armut' ? 'u' :
               targetFruit.name === 'Ananas' ? 'ı' :
               targetFruit.name === 'Şeftali' ? 'yi' :
               targetFruit.name === 'Limon' ? 'u' :
               targetFruit.name === 'Kavun' ? 'u' : 'u'} bul! 🎯
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

        {/* Meyve kartları (Fruit cards) */}
        <View style={styles.fruitsContainer}>
          {FRUITS.map((fruit, index) => (
            <Animated.View
              key={fruit.id}
              style={{
                transform: [{ scale: animatedValues[index] }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.fruitCard,
                  { borderColor: fruit.color },
                  foundFruits.includes(fruit.id) && styles.foundCard,
                  showFeedback === 'correct' && targetFruit?.id === fruit.id && styles.correctCard,
                ]}
                onPress={() => handleFruitPress(fruit, index)}
                activeOpacity={0.8}
                disabled={!gameStarted || foundFruits.includes(fruit.id) || gameCompleted}
              >
                <Text style={styles.fruitEmoji}>{fruit.emoji}</Text>
                <Text style={styles.fruitName}>{fruit.name}</Text>
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
            color={COLORS.orange}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundFruits: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  bgFruit: {
    position: 'absolute',
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
    backgroundColor: COLORS.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  completedText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.success,
    textAlign: 'center',
    marginBottom: 15,
  },
  finalScoreText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  playAgainButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  questionContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.orange,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  feedbackContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 15,
  },
  correctFeedback: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  wrongFeedback: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fruitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  fruitCard: {
    width: width * 0.28,
    height: width * 0.28,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
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
  fruitEmoji: {
    fontSize: 50,
    marginBottom: 5,
  },
  fruitName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});

