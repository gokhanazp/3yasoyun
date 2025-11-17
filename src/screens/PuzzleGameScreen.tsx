// Yapboz oyunu ekranı (Puzzle game screen)
// Gerçek yapboz - Parçaları sürükleyerek birleştir (Real puzzle - Drag pieces to connect)

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { Confetti } from '../components/Confetti';
import { speakTurkish, initializeAudio } from '../utils/soundManager';

const { width, height } = Dimensions.get('window');
const PUZZLE_SIZE = width * 0.7; // Yapboz alanı boyutu (Puzzle area size)
const PIECE_SIZE = PUZZLE_SIZE / 2; // Her parça boyutu (Each piece size) - 2x2 grid

type PuzzleGameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PuzzleGame'
>;

interface PuzzleGameScreenProps {
  navigation: PuzzleGameScreenNavigationProp;
}

// Parça tipi (Piece type)
interface PuzzlePiece {
  id: number;
  correctPosition: number; // Doğru pozisyon (0-3) (Correct position)
  currentPosition: { x: number; y: number }; // Mevcut pozisyon (Current position)
  isPlaced: boolean; // Doğru yere yerleştirildi mi? (Is placed correctly?)
}

// Yapboz resimleri (Puzzle images)
const PUZZLES = [
  {
    id: 1,
    name: 'Kedi',
    emoji: '🐱',
    color: '#FFE5B4',
  },
  {
    id: 2,
    name: 'Araba',
    emoji: '🚗',
    color: '#E3F2FD',
  },
  {
    id: 3,
    name: 'Köpek',
    emoji: '🐶',
    color: '#FFF3E0',
  },
  {
    id: 4,
    name: 'Güneş',
    emoji: '☀️',
    color: '#FFF9C4',
  },
];

export const PuzzleGameScreen: React.FC<PuzzleGameScreenProps> = ({
  navigation,
}) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [puzzleAreaLayout, setPuzzleAreaLayout] = useState({ x: 0, y: 0 });

  // Her parça için animasyon değerleri (Animation values for each piece)
  const panValues = useRef<Animated.ValueXY[]>([]).current;

  // Ses sistemini başlat (Initialize audio system)
  React.useEffect(() => {
    initializeAudio();
  }, []);

  // Oyunu başlat (Start game)
  const startGame = () => {
    console.log('🎮 Starting puzzle game...');
    setGameStarted(true);
    setGameCompleted(false);

    // Parçaları oluştur ve karıştır (Create and shuffle pieces)
    const initialPieces: PuzzlePiece[] = [0, 1, 2, 3].map((index) => ({
      id: index,
      correctPosition: index,
      currentPosition: {
        x: Math.random() * (width - PIECE_SIZE - 40) + 20,
        y: height * 0.5 + Math.random() * 100,
      },
      isPlaced: false,
    }));

    setPieces(initialPieces);

    // Animasyon değerlerini oluştur (Create animation values)
    panValues.length = 0;
    initialPieces.forEach((piece) => {
      panValues.push(new Animated.ValueXY(piece.currentPosition));
    });

    speakTurkish(`${currentPuzzle.name} yapbozunu tamamla! Parçaları sürükle!`);
  };

  // Yeni yapboz seç (Select new puzzle)
  const selectPuzzle = (puzzle: typeof PUZZLES[0]) => {
    setCurrentPuzzle(puzzle);
    setGameStarted(false);
    setGameCompleted(false);
    setPieces([]);
  };

  // Parçanın doğru yere yerleştirilip yerleştirilmediğini kontrol et (Check if piece is placed correctly)
  const checkPiecePlacement = (pieceIndex: number, absoluteX: number, absoluteY: number) => {
    const piece = pieces[pieceIndex];
    if (piece.isPlaced) return false;

    // Parçanın hedef pozisyonunu hesapla (Calculate target position)
    const row = Math.floor(piece.correctPosition / 2);
    const col = piece.correctPosition % 2;
    const targetX = puzzleAreaLayout.x + col * PIECE_SIZE;
    const targetY = puzzleAreaLayout.y + row * PIECE_SIZE;

    // Mesafeyi kontrol et (Check distance)
    const distance = Math.sqrt(
      Math.pow(absoluteX - targetX, 2) + Math.pow(absoluteY - targetY, 2)
    );

    console.log('🎯 Piece:', pieceIndex, 'Distance:', distance.toFixed(2), 'Target:', targetX.toFixed(2), targetY.toFixed(2), 'Current:', absoluteX.toFixed(2), absoluteY.toFixed(2));

    // Eğer yeterince yakınsa, parçayı yerleştir (If close enough, place the piece)
    if (distance < PIECE_SIZE * 0.6) {
      // Parçayı doğru pozisyona animasyonla taşı (Animate piece to correct position)
      Animated.spring(panValues[pieceIndex], {
        toValue: { x: targetX, y: targetY },
        useNativeDriver: false,
      }).start();

      // Parçayı yerleştirildi olarak işaretle (Mark piece as placed)
      const newPieces = [...pieces];
      newPieces[pieceIndex] = {
        ...piece,
        currentPosition: { x: targetX, y: targetY },
        isPlaced: true,
      };
      setPieces(newPieces);

      speakTurkish('Aferin! Doğru yere koydun!');

      // Tüm parçalar yerleştirildi mi? (All pieces placed?)
      if (newPieces.every((p) => p.isPlaced)) {
        console.log('🎉 PUZZLE COMPLETED!');
        setGameCompleted(true);
        setShowConfetti(true);

        setTimeout(() => {
          speakTurkish(`Tebrikler! ${currentPuzzle.name} yapbozunu tamamladın!`);
        }, 500);

        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }

      return true;
    }

    return false;
  };

  // Her parça için PanResponder oluştur (Create PanResponder for each piece)
  const createPanResponder = (pieceIndex: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !pieces[pieceIndex]?.isPlaced,
      onMoveShouldSetPanResponder: () => !pieces[pieceIndex]?.isPlaced,
      onPanResponderGrant: () => {
        const piece = pieces[pieceIndex];
        if (!piece) return;

        // Mevcut pozisyonu offset olarak ayarla (Set current position as offset)
        panValues[pieceIndex].setOffset({
          x: piece.currentPosition.x,
          y: piece.currentPosition.y,
        });
        panValues[pieceIndex].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: panValues[pieceIndex]?.x, dy: panValues[pieceIndex]?.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        panValues[pieceIndex].flattenOffset();

        const piece = pieces[pieceIndex];
        const finalX = piece.currentPosition.x + gestureState.dx;
        const finalY = piece.currentPosition.y + gestureState.dy;

        const placed = checkPiecePlacement(pieceIndex, finalX, finalY);

        if (!placed) {
          // Parçayı mevcut pozisyona güncelle (Update piece to current position)
          const newPieces = [...pieces];
          newPieces[pieceIndex] = {
            ...piece,
            currentPosition: { x: finalX, y: finalY },
          };
          setPieces(newPieces);

          // Animasyonu güncelle (Update animation)
          panValues[pieceIndex].setValue({ x: finalX, y: finalY });
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Arka plan gradient (Background gradient) */}
      <LinearGradient
        colors={['#FFF9E6', '#FFE5E5', '#E8F5E9', '#F3E5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

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
            <Text style={styles.titleEmoji}>🧩</Text>
            <Text style={styles.titleText}>Yapboz</Text>
          </View>
        </View>

        {/* Oyun başlamadıysa yapboz seçimi (Puzzle selection if game not started) */}
        {!gameStarted ? (
          <View style={styles.centerContainer}>
            <Text style={styles.instructionText}>
              🧩 Hangi yapbozu yapmak istersin?
            </Text>
            <View style={styles.puzzleSelection}>
              {PUZZLES.map((puzzle) => (
                <TouchableOpacity
                  key={puzzle.id}
                  style={[
                    styles.puzzleOption,
                    { backgroundColor: puzzle.color },
                    currentPuzzle.id === puzzle.id && styles.selectedPuzzle,
                  ]}
                  onPress={() => selectPuzzle(puzzle)}
                >
                  <Text style={styles.puzzleEmoji}>{puzzle.emoji}</Text>
                  <Text style={styles.puzzleName}>{puzzle.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>🎮 Oyunu Başlat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gameContainer}>
            {/* Yapboz hedef alanı (Puzzle target area) */}
            <View
              style={styles.puzzleTargetArea}
              onLayout={(event) => {
                const { x, y } = event.nativeEvent.layout;
                setPuzzleAreaLayout({ x, y });
              }}
            >
              {/* 2x2 grid - Hedef slotlar (Target slots) */}
              {[0, 1, 2, 3].map((position) => {
                const row = Math.floor(position / 2);
                const col = position % 2;

                return (
                  <View
                    key={position}
                    style={[
                      styles.targetSlot,
                      {
                        top: row * PIECE_SIZE,
                        left: col * PIECE_SIZE,
                        backgroundColor: currentPuzzle.color,
                      },
                    ]}
                  >
                    <Text style={styles.slotNumber}>{position + 1}</Text>
                  </View>
                );
              })}
            </View>

            {/* Yapboz parçaları (Puzzle pieces) */}
            {pieces.map((piece, index) => {
              const panResponder = createPanResponder(index);
              const row = Math.floor(piece.correctPosition / 2);
              const col = piece.correctPosition % 2;

              return (
                <Animated.View
                  key={piece.id}
                  {...panResponder.panHandlers}
                  style={[
                    styles.puzzlePiece,
                    {
                      backgroundColor: currentPuzzle.color,
                      transform: [
                        { translateX: panValues[index]?.x || 0 },
                        { translateY: panValues[index]?.y || 0 },
                      ],
                    },
                    piece.isPlaced && styles.placedPiece,
                  ]}
                >
                  {/* Parça içeriği - Emoji'nin bir bölümü (Piece content - Part of emoji) */}
                  <View style={styles.pieceContent}>
                    <View
                      style={{
                        position: 'absolute',
                        // Emoji'yi parçaya göre kaydır (Shift emoji based on piece)
                        // Her parça, tam emoji'nin farklı bir bölümünü gösterir
                        left: -col * PIECE_SIZE,
                        top: -row * PIECE_SIZE,
                        width: PUZZLE_SIZE,
                        height: PUZZLE_SIZE,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={styles.pieceEmoji}>{currentPuzzle.emoji}</Text>
                    </View>
                  </View>

                  {/* Parça kenarlığı (Piece border) */}
                  <View style={styles.pieceBorder} />
                </Animated.View>
              );
            })}

            {/* Oyun tamamlandıysa (If game completed) */}
            {gameCompleted && (
              <View style={styles.completedContainer}>
                <Text style={styles.completedText}>🎉 Tebrikler!</Text>
                <Text style={styles.completedSubtext}>
                  {currentPuzzle.name} yapbozunu tamamladın!
                </Text>
                <TouchableOpacity
                  style={styles.playAgainButton}
                  onPress={() => setGameStarted(false)}
                >
                  <Text style={styles.playAgainButtonText}>🔄 Yeni Yapboz</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  puzzleSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
  },
  puzzleOption: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedPuzzle: {
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  puzzleEmoji: {
    fontSize: 50,
  },
  puzzleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 5,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  puzzleTargetArea: {
    width: PUZZLE_SIZE,
    height: PUZZLE_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    position: 'relative',
  },
  targetSlot: {
    position: 'absolute',
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotNumber: {
    fontSize: 40,
    color: 'rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
  },
  puzzlePiece: {
    position: 'absolute',
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  placedPiece: {
    borderColor: COLORS.green,
    borderWidth: 4,
  },
  pieceContent: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    overflow: 'hidden',
    position: 'relative',
  },
  pieceEmoji: {
    fontSize: PUZZLE_SIZE * 0.8, // Emoji yapboz boyutunda (Emoji size matches puzzle size)
  },
  pieceBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  completedContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  completedSubtext: {
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  playAgainButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

