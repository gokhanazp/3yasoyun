// Hayvan sesleri oyunu ekranı (Animal sounds game screen)
// Çocuklar hayvanlara dokunarak seslerini dinler

import React, { useState, useEffect, useRef } from 'react';
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
import { ANIMALS } from '../constants/gameData';
import { COLORS } from '../constants/colors';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { FloatingStars } from '../components/FloatingStars';
import {
  playSound,
  initializeAudio,
  askAnimalQuestion,
  speakCorrectAnswer,
  speakWrongAnswer,
  speakSuccess
} from '../utils/soundManager';

type AnimalSoundsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AnimalSounds'
>;

interface AnimalSoundsScreenProps {
  navigation: AnimalSoundsScreenNavigationProp;
}

export const AnimalSoundsScreen: React.FC<AnimalSoundsScreenProps> = ({
  navigation,
}) => {
  const [targetAnimal, setTargetAnimal] = useState<typeof ANIMALS[0] | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedValues] = useState(
    ANIMALS.map(() => new Animated.Value(1))
  );

  // Ses sistemini başlat (Initialize audio)
  useEffect(() => {
    initializeAudio();
    console.log('⚠️ Oyunu başlatmak için herhangi bir hayvana tıklayın!');
  }, []);

  // Yeni soru sor (Ask new question)
  const askNewQuestion = () => {
    // Rastgele bir hayvan seç (Select random animal)
    const randomIndex = Math.floor(Math.random() * ANIMALS.length);
    const animal = ANIMALS[randomIndex];
    setTargetAnimal(animal);
    setShowFeedback(null);

    // 1 saniye sonra soruyu sor (Ask question after 1 second)
    setTimeout(() => {
      console.log('🎯 Asking question for:', animal.name);
      askAnimalQuestion(animal.name);
    }, 1000);
  };

  // Hayvana tıklandığında (When animal is pressed)
  const handleAnimalPress = (animal: typeof ANIMALS[0], index: number) => {
    // Eğer oyun başlamamışsa, başlat (If game not started, start it)
    if (!targetAnimal) {
      console.log('🎮 Oyun başlatılıyor...');
      askNewQuestion();
      return;
    }

    if (showFeedback) return; // Soru yoksa veya feedback gösteriliyorsa tıklamayı engelle

    setAttempts(attempts + 1);

    // Hayvan sesini çal (Play animal sound)
    const soundMap: { [key: string]: 'dog' | 'cat' | 'cow' | 'sheep' | 'bird' | 'lion' | 'elephant' | 'frog' } = {
      'Dog': 'dog',
      'Cat': 'cat',
      'Cow': 'cow',
      'Sheep': 'sheep',
      'Bird': 'bird',
      'Lion': 'lion',
      'Elephant': 'elephant',
      'Frog': 'frog',
    };

    const soundType = soundMap[animal.nameEn];

    // Doğru mu kontrol et (Check if correct)
    if (animal.id === targetAnimal.id) {
      // DOĞRU CEVAP! (CORRECT ANSWER!)
      setShowFeedback('correct');
      setScore(score + 1);
      setShowConfetti(true); // Konfeti göster!

      // Hayvan seslerini tanımla (Define animal sounds)
      const animalSounds: { [key: string]: string } = {
        'Köpek': 'hav hav',
        'Kedi': 'miyav',
        'İnek': 'möö',
        'Koyun': 'mee',
        'Kuş': 'cik cik',
        'Aslan': 'kükreme',
        'Fil': 'böğürme',
        'Kurbağa': 'vırak vırak',
      };

      // Önce hayvan sesini çal, sonra konuş (Play animal sound first, then speak)
      if (soundType) {
        playSound(soundType);
        // Ses çaldıktan sonra konuş (Speak after sound)
        setTimeout(() => {
          speakCorrectAnswer(animal.name, animalSounds[animal.name] || '');
        }, 1200);
      } else {
        // Ses yoksa direkt konuş (If no sound, speak immediately)
        setTimeout(() => {
          speakCorrectAnswer(animal.name, animalSounds[animal.name] || '');
        }, 600);
      }

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
        Animated.spring(animatedValues[index], {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // 4 saniye sonra yeni soru (New question after 4 seconds)
      setTimeout(() => {
        askNewQuestion();
      }, 4000);

    } else {
      // YANLIŞ CEVAP! (WRONG ANSWER!)
      setShowFeedback('wrong');
      speakWrongAnswer();

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

      // 1.5 saniye sonra feedback'i temizle (Clear feedback after 1.5 seconds)
      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Orman temalı gradyan arkaplan (Forest themed gradient background) */}
      <View style={styles.backgroundGradient}>
        <LinearGradient
          colors={['#87CEEB', '#90EE90', '#228B22']}
          style={styles.gradient}
        />
      </View>

      {/* Orman dekorasyonları (Forest decorations) */}
      <View style={styles.forestDecoration} pointerEvents="none">
        {/* Ağaçlar (Trees) */}
        <Text style={[styles.tree, { left: 20, bottom: 0 }]}>🌲</Text>
        <Text style={[styles.tree, { left: 80, bottom: 0 }]}>🌳</Text>
        <Text style={[styles.tree, { right: 80, bottom: 0 }]}>🌲</Text>
        <Text style={[styles.tree, { right: 20, bottom: 0 }]}>🌳</Text>

        {/* Bulutlar (Clouds) */}
        <Text style={[styles.cloud, { left: 30, top: 50 }]}>☁️</Text>
        <Text style={[styles.cloud, { right: 50, top: 80 }]}>☁️</Text>
        <Text style={[styles.cloud, { left: '40%', top: 100 }]}>☁️</Text>

        {/* Güneş (Sun) */}
        <Text style={styles.sun}>☀️</Text>

        {/* Çiçekler (Flowers) */}
        <Text style={[styles.flower, { left: 50, bottom: 60 }]}>🌸</Text>
        <Text style={[styles.flower, { right: 60, bottom: 70 }]}>🌼</Text>
        <Text style={[styles.flower, { left: '45%', bottom: 65 }]}>🌺</Text>
      </View>

      {/* Yüzen kelebekler (Floating butterflies) */}
      {/* <FloatingStars count={8} emoji="🦋" /> */}

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
            <Text style={styles.titleEmoji}>🐶</Text>
            <Text style={styles.titleText}>Hayvan Sesleri</Text>
          </View>

          {/* Skor ve Speaker (Score and Speaker) */}
          {gameStarted && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          )}
        </View>

      {/* Soru gösterimi (Question display) */}
      {targetAnimal ? (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {targetAnimal.name}i bul! 🎯
          </Text>
        </View>
      ) : (
        <View style={styles.startContainer}>
          <Text style={styles.startText}>
            👆 Başlamak için bir hayvana tıkla!
          </Text>
        </View>
      )}

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

      {/* Hayvan kartları (Animal cards) */}
      <View style={styles.animalsContainer}>
        {ANIMALS.map((animal, index) => (
          <Animated.View
            key={animal.id}
            style={{
              transform: [{ scale: animatedValues[index] }],
            }}
          >
            <TouchableOpacity
              style={[
                styles.animalCard,
                targetAnimal?.id === animal.id && showFeedback === 'correct' && styles.correctCard,
                showFeedback === 'wrong' && styles.disabledCard,
              ]}
              onPress={() => handleAnimalPress(animal, index)}
              activeOpacity={0.8}
              disabled={showFeedback !== null}
            >
              <Text style={styles.animalEmoji}>{animal.emoji}</Text>
              <Text style={styles.animalName}>{animal.name}</Text>
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
            color={COLORS.green}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  forestDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  tree: {
    position: 'absolute',
    fontSize: 80,
    opacity: 0.7,
  },
  cloud: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.6,
  },
  sun: {
    position: 'absolute',
    top: 30,
    right: 30,
    fontSize: 50,
    opacity: 0.9,
  },
  flower: {
    position: 'absolute',
    fontSize: 30,
    opacity: 0.8,
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
    backgroundColor: COLORS.green, // Yeşil arka plan (Green background)
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // Beyaz yazı (White text)
  },
  speakerButton: {
    padding: 10,
    backgroundColor: COLORS.blue,
    borderRadius: 50,
  },
  speakerIcon: {
    fontSize: 28,
  },
  questionContainer: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FF6B6B',
  },
  questionText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  feedbackContainer: {
    alignItems: 'center',
    paddingVertical: 15,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  startContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  startText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  animalsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  animalCard: {
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4ECDC4',
    // Gölge efekti (Shadow effect)
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  correctCard: {
    borderColor: '#4CAF50',
    borderWidth: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    transform: [{ scale: 1.05 }],
  },
  disabledCard: {
    opacity: 0.4,
  },
  animalEmoji: {
    fontSize: 48,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  animalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bottomContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

