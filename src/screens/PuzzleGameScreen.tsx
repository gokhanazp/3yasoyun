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

  // Yapboz alanı referansı (Puzzle area reference)
  const puzzleAreaRef = useRef<View>(null);

  // Ses sistemini başlat (Initialize audio system)
  React.useEffect(() => {
    initializeAudio();
  }, []);

  // Oyunu başlat (Start game)
  const startGame = () => {
    console.log('🎮 Starting puzzle game...');
    setGameStarted(true);
    setGameCompleted(false);

    // Yapboz alanının ekran koordinatlarını al (Get puzzle area screen coordinates)
    setTimeout(() => {
      if (puzzleAreaRef.current) {
        puzzleAreaRef.current.measureInWindow((x, y, width, height) => {
          console.log('📐 Puzzle area position:', x, y, width, height);
          setPuzzleAreaLayout({ x, y });
        });
      }
    }, 100);

    // Parçaları oluştur ve karıştır (Create and shuffle pieces)
    const initialPieces: PuzzlePiece[] = [0, 1, 2, 3].map((index) => ({
      id: index,
      correctPosition: index,
      currentPosition: {
        x: Math.random() * (width - PIECE_SIZE - 40) + 20,
        y: height * 0.6 + Math.random() * 100,
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
    if (piece.isPlaced) return { placed: false, correct: false };

    // Parçanın merkez noktasını hesapla (Calculate center point of piece)
    const pieceCenterX = absoluteX + PIECE_SIZE / 2;
    const pieceCenterY = absoluteY + PIECE_SIZE / 2;

    console.log('🎯 Piece:', pieceIndex, 'Absolute pos:', absoluteX.toFixed(0), absoluteY.toFixed(0), 'Center:', pieceCenterX.toFixed(0), pieceCenterY.toFixed(0));
    console.log('📐 Puzzle area:', puzzleAreaLayout.x.toFixed(0), puzzleAreaLayout.y.toFixed(0));

    // Hangi slotun içinde olduğunu kontrol et (Check which slot it's inside)
    // Daha geniş tolerans ile (With wider tolerance)
    let targetPosition = -1;
    const TOLERANCE = PIECE_SIZE * 0.3; // %30 tolerans (30% tolerance)

    for (let pos = 0; pos < 4; pos++) {
      const row = Math.floor(pos / 2);
      const col = pos % 2;
      const slotX = puzzleAreaLayout.x + col * PIECE_SIZE;
      const slotY = puzzleAreaLayout.y + row * PIECE_SIZE;
      const slotCenterX = slotX + PIECE_SIZE / 2;
      const slotCenterY = slotY + PIECE_SIZE / 2;

      // Parçanın merkezi ile slotun merkezinin mesafesi (Distance between piece center and slot center)
      const distance = Math.sqrt(
        Math.pow(pieceCenterX - slotCenterX, 2) + Math.pow(pieceCenterY - slotCenterY, 2)
      );

      console.log('  Slot', pos, ':', slotCenterX.toFixed(0), slotCenterY.toFixed(0), 'Distance:', distance.toFixed(0));

      // Eğer yeterince yakınsa (If close enough)
      if (distance < PIECE_SIZE * 0.7) {
        targetPosition = pos;
        break;
      }
    }

    console.log('  → Target slot:', targetPosition, 'Correct pos:', piece.correctPosition);

    // Eğer bir slotun içindeyse (If inside a slot)
    if (targetPosition !== -1) {
      const row = Math.floor(targetPosition / 2);
      const col = targetPosition % 2;
      const targetX = puzzleAreaLayout.x + col * PIECE_SIZE;
      const targetY = puzzleAreaLayout.y + row * PIECE_SIZE;

      // Parçayı pozisyona animasyonla taşı (Animate piece to position)
      Animated.spring(panValues[pieceIndex], {
        toValue: { x: targetX, y: targetY },
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();

      // Doğru pozisyon mu? (Is it correct position?)
      const isCorrect = targetPosition === piece.correctPosition;

      if (isCorrect) {
        // DOĞRU! (CORRECT!)
        console.log('✅ CORRECT! Piece', pieceIndex, 'placed at correct position', targetPosition);

        // Parçayı yerleştirildi olarak işaretle (Mark piece as placed)
        const newPieces = [...pieces];
        newPieces[pieceIndex] = {
          ...piece,
          currentPosition: { x: targetX, y: targetY },
          isPlaced: true,
        };
        setPieces(newPieces);

        speakTurkish('Doğru!');

        // Tüm parçalar yerleştirildi mi? (All pieces placed?)
        const allPlaced = newPieces.every((p) => p.isPlaced);
        console.log('📊 Placed pieces:', newPieces.filter(p => p.isPlaced).length, '/ 4');

        if (allPlaced) {
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

        return { placed: true, correct: true };
      } else {
        // YANLIŞ! (WRONG!)
        console.log('❌ WRONG! Piece', pieceIndex, 'at position', targetPosition, 'but should be at', piece.correctPosition);

        // Parçayı mevcut pozisyona güncelle ama yerleştirildi olarak işaretleme (Update position but don't mark as placed)
        const newPieces = [...pieces];
        newPieces[pieceIndex] = {
          ...piece,
          currentPosition: { x: targetX, y: targetY },
          isPlaced: false, // Yanlış yere yerleştirildi, tekrar taşınabilir (Wrong position, can be moved again)
        };
        setPieces(newPieces);

        speakTurkish('Yanlış! Tekrar dene!');

        return { placed: true, correct: false };
      }
    }

    return { placed: false, correct: false };
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

        const result = checkPiecePlacement(pieceIndex, finalX, finalY);

        if (!result.placed) {
          // Hiçbir yere yerleştirilmedi, mevcut pozisyona güncelle (Not placed anywhere, update to current position)
          const newPieces = [...pieces];
          newPieces[pieceIndex] = {
            ...piece,
            currentPosition: { x: finalX, y: finalY },
          };
          setPieces(newPieces);

          // Animasyonu güncelle (Update animation)
          panValues[pieceIndex].setValue({ x: finalX, y: finalY });
        }
        // Eğer yerleştirildi ise (doğru veya yanlış), checkPiecePlacement zaten animasyonu yaptı
        // (If placed (correct or wrong), checkPiecePlacement already did the animation)
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
              ref={puzzleAreaRef}
              style={styles.puzzleTargetArea}
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

