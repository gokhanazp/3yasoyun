// Balon patlatma oyunu ekranı (Balloon pop game screen)
// Çocuklar balonlara tıklayarak patlatır ve eğlenir

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
import { COLORS, LEARNING_COLORS } from '../constants/colors';
import { GameButton } from '../components/GameButton';
import { Confetti } from '../components/Confetti';
import { BalloonSvg } from '../components/BalloonSvg';
import { initializeAudio, speakTurkish } from '../utils/soundManager';

const { width, height } = Dimensions.get('window');

type BalloonPopScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BalloonPop'
>;

interface BalloonPopScreenProps {
  navigation: BalloonPopScreenNavigationProp;
}

// Balon renkleri - Renkler oyunu ile aynı renkler (Balloon colors - same as Color game)
const BALLOON_COLORS = LEARNING_COLORS;

// Balon tipi (Balloon type)
interface Balloon {
  id: string;
  x: number;
  y: number;
  colorName: string;
  color: string;
  scale: Animated.Value;
  opacity: Animated.Value;
  translateY: Animated.Value;
}

export const BalloonPopScreen: React.FC<BalloonPopScreenProps> = ({
  navigation,
}) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [targetColor, setTargetColor] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const balloonIdCounter = useRef(0);

  // Ses sistemini başlat (Initialize audio system)
  useEffect(() => {
    initializeAudio();
  }, []);

  // Oyun başladığında balonları oluştur (Create balloons when game starts)
  useEffect(() => {
    if (gameStarted && balloons.length < 3) {
      const interval = setInterval(() => {
        if (balloons.length < 3) {
          createBalloon();
        }
      }, 4000); // Her 4 saniyede bir balon (New balloon every 4 seconds)

      return () => clearInterval(interval);
    }
  }, [gameStarted, balloons.length]);

  // Yeni balon oluştur (Create new balloon)
  const createBalloon = () => {
    const randomColorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    const newBalloon: Balloon = {
      id: `balloon-${balloonIdCounter.current++}`,
      x: Math.random() * (width - 100) + 10, // Rastgele X pozisyonu (Random X position)
      y: height, // Ekranın altından başla (Start from bottom)
      colorName: randomColorObj.name,
      color: randomColorObj.color,
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };

    setBalloons((prev) => [...prev, newBalloon]);

    // Balonu yukarı hareket ettir (Move balloon up)
    Animated.timing(newBalloon.translateY, {
      toValue: -height - 200, // Ekranın üstüne çık (Go above screen)
      duration: 20000, // 20 saniye (20 seconds) - Çok yavaş
      useNativeDriver: true,
    }).start(() => {
      // Balon ekrandan çıktığında kaldır (Remove balloon when it goes off screen)
      setBalloons((prev) => prev.filter((b) => b.id !== newBalloon.id));
    });
  };

  // Yeni renk sor (Ask for new color)
  const askNewColor = (currentBalloons: Balloon[] = balloons) => {
    // Balonları kontrol et (Check balloons)
    console.log('🎯 askNewColor called, balloons count:', currentBalloons.length);

    setTimeout(() => {
      if (currentBalloons.length === 0) {
        console.log('⚠️ No balloons, creating new ones...');
        for (let i = 0; i < 3; i++) {
          setTimeout(() => createBalloon(), i * 500);
        }
        setTimeout(() => askNewColor(), 3000);
        return;
      }

      const randomBalloon = currentBalloons[Math.floor(Math.random() * currentBalloons.length)];
      setTargetColor(randomBalloon.colorName);
      setShowFeedback(null);

      console.log('🎯 Target color:', randomBalloon.colorName);

      setTimeout(() => {
        // Türkçe dilbilgisi için doğru ek (Correct suffix for Turkish grammar)
        let phrase = '';
        if (randomBalloon.colorName === 'Kırmızı') {
          phrase = 'Kırmızı balonu patlat';
        } else if (randomBalloon.colorName === 'Mavi') {
          phrase = 'Mavi balonu patlat';
        } else if (randomBalloon.colorName === 'Sarı') {
          phrase = 'Sarı balonu patlat';
        } else if (randomBalloon.colorName === 'Yeşil') {
          phrase = 'Yeşil balonu patlat';
        } else if (randomBalloon.colorName === 'Turuncu') {
          phrase = 'Turuncu balonu patlat';
        } else if (randomBalloon.colorName === 'Mor') {
          phrase = 'Mor balonu patlat';
        }
        console.log(`🎤 Speaking: ${phrase}`);
        speakTurkish(phrase);
      }, 800);
    }, 100);
  };

  // Balona tıklandığında (When balloon is pressed)
  const handleBalloonPress = (balloon: Balloon) => {
    if (!targetColor) return;

    console.log('🎈 Balloon pressed:', balloon.colorName);
    console.log('🎯 Target color:', targetColor);
    console.log('🎯 Match?', balloon.colorName === targetColor);

    setAttempts(attempts + 1);

    // Patlama animasyonu (Pop animation)
    Animated.parallel([
      Animated.timing(balloon.scale, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(balloon.opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Balonu listeden kaldır (Remove balloon from list)
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    });

    if (balloon.colorName === targetColor) {
      // DOĞRU! (CORRECT!)
      console.log('✅ CORRECT!');
      setShowFeedback('correct');
      setScore(score + 1);
      setShowConfetti(true);

      setTimeout(() => {
        speakTurkish('Aferin! Doğru balon!');
      }, 300);

      setTimeout(() => {
        setShowConfetti(false);
        setShowFeedback(null);
        askNewColor();
      }, 2000);
    } else {
      // YANLIŞ! (WRONG!)
      console.log('❌ WRONG!');
      setShowFeedback('wrong');

      setTimeout(() => {
        speakTurkish('Yanlış balon! Tekrar dene!');
      }, 300);

      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  // Oyunu başlat (Start game)
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setBalloons([]);
    setTargetColor(null);
    setShowFeedback(null);
    balloonIdCounter.current = 0;

    console.log('🎮 Game starting...');
    speakTurkish('Söylediğim renkteki balonu patlat!');

    // İlk balonları oluştur ve renk sor (Create initial balloons and ask for color)
    setTimeout(() => {
      console.log('🎈 Creating initial balloons...');
      const initialBalloons: Balloon[] = [];

      // 3 balon oluştur (Create 3 balloons)
      for (let i = 0; i < 3; i++) {
        const randomColorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

        const newBalloon: Balloon = {
          id: `balloon-${balloonIdCounter.current++}`,
          x: Math.random() * (width - 100) + 10,
          y: height,
          colorName: randomColorObj.name,
          color: randomColorObj.color,
          scale: new Animated.Value(1),
          opacity: new Animated.Value(1),
          translateY: new Animated.Value(0),
        };

        initialBalloons.push(newBalloon);

        // Balonu state'e ekle (Add balloon to state)
        setTimeout(() => {
          setBalloons((prev) => [...prev, newBalloon]);

          // Balonu yukarı hareket ettir (Move balloon up)
          Animated.timing(newBalloon.translateY, {
            toValue: -height - 200,
            duration: 20000,
            useNativeDriver: true,
          }).start(() => {
            setBalloons((prev) => prev.filter((b) => b.id !== newBalloon.id));
          });
        }, i * 800);
      }

      // İlk rengi sor (Ask for first color)
      setTimeout(() => {
        console.log('🎯 Asking for first color with initial balloons...');
        askNewColor(initialBalloons);
      }, 3000);
    }, 1500);
  };

  // Oyunu durdur (Stop game)
  const stopGame = () => {
    setGameStarted(false);
    setBalloons([]);
    if (score > 0) {
      speakTurkish(`Oyun bitti! ${score} balon patlattın!`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Arka plan gradient (Background gradient) */}
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {/* Gökyüzü dekoratif elementleri (Sky decorative elements) */}
        <View style={styles.skyDecoration}>
          <Text style={[styles.decorativeEmoji, { top: '5%', left: '10%' }]}>☁️</Text>
          <Text style={[styles.decorativeEmoji, { top: '15%', right: '15%' }]}>☁️</Text>
          <Text style={[styles.decorativeEmoji, { top: '8%', left: '70%' }]}>☁️</Text>
          <Text style={[styles.decorativeEmoji, { top: '25%', left: '20%' }]}>☁️</Text>
          <Text style={[styles.decorativeEmoji, { top: '20%', right: '30%' }]}>☁️</Text>
          <Text style={[styles.decorativeEmoji, { top: '35%', left: '5%' }]}>☁️</Text>
          <Text style={[styles.decorativeEmoji, { top: '40%', right: '10%' }]}>☁️</Text>
          <Text style={[styles.decorativeEmoji, { top: '3%', left: '40%', fontSize: 30 }]}>⭐</Text>
          <Text style={[styles.decorativeEmoji, { top: '12%', right: '5%', fontSize: 25 }]}>✨</Text>
          <Text style={[styles.decorativeEmoji, { top: '30%', left: '80%', fontSize: 28 }]}>⭐</Text>
          <Text style={[styles.decorativeEmoji, { top: '45%', left: '40%', fontSize: 26 }]}>✨</Text>
        </View>
      </LinearGradient>

      {/* Konfeti efekti (Confetti effect) */}
      {showConfetti && <Confetti count={50} />}

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
            <Text style={styles.titleEmoji}>🎈</Text>
            <Text style={styles.titleText}>Balon Patlatma</Text>
          </View>

          {/* Skor (Score) */}
          {gameStarted && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>🎯 {score}/{attempts}</Text>
            </View>
          )}
        </View>

        {/* Oyun başlamadıysa başlat butonu */}
        {!gameStarted ? (
          <View style={styles.centerContainer}>
            <Text style={styles.instructionText}>
              🎈 Söylediğim renkteki balonu patlatmaya hazır mısın?
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>🎮 Oyunu Başlat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Soru gösterimi (Question display) */}
            {targetColor && (
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {targetColor} balonu patlat! 🎯
                </Text>
              </View>
            )}

            {/* Geri bildirim (Feedback) */}
            {showFeedback && (
              <View style={[
                styles.feedbackContainer,
                showFeedback === 'correct' ? styles.correctFeedback : styles.wrongFeedback
              ]}>
                <Text style={styles.feedbackText}>
                  {showFeedback === 'correct' ? '✅ Aferin! Doğru balon!' : '❌ Yanlış balon! Tekrar dene!'}
                </Text>
              </View>
            )}

            {/* Oyun alanı (Game area) */}
            <View style={styles.gameArea}>
              {balloons.map((balloon) => (
                <Animated.View
                  key={balloon.id}
                  style={[
                    styles.balloonContainer,
                    {
                      left: balloon.x,
                      bottom: 0,
                      transform: [
                        { translateY: balloon.translateY },
                        { scale: balloon.scale },
                      ],
                      opacity: balloon.opacity,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleBalloonPress(balloon)}
                    activeOpacity={0.8}
                  >
                    {/* SVG Balon (SVG Balloon) */}
                    <BalloonSvg
                      color={balloon.color}
                      size={120}
                    />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Durdur butonu (Stop button) */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.stopButton} onPress={stopGame}>
                <Text style={styles.stopButtonText}>⏹️ Durdur</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Ana menü butonu (Home button) */}
        {!gameStarted && (
          <View style={styles.bottomContainer}>
            <GameButton
              title="Ana Menü"
              icon="🏠"
              onPress={() => navigation.navigate('Home')}
              color={COLORS.pink}
            />
          </View>
        )}
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
  skyDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decorativeEmoji: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.6,
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
    backgroundColor: COLORS.pink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: COLORS.pink,
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
  questionContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.pink,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  balloonContainer: {
    position: 'absolute',
    width: 70,
    height: 100,
  },
  balloon: {
    width: 70,
    height: 90,
    borderRadius: 35,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    position: 'relative',
  },
  balloonHighlight: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 20,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
  },
  balloonString: {
    width: 2,
    height: 50,
    backgroundColor: '#8B4513',
    alignSelf: 'center',
    marginTop: -5,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  stopButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

