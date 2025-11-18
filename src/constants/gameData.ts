// Oyun verileri (Game data)
import { GameItem, Animal } from '../types/navigation';
import { COLORS } from './colors';

// Ana menüdeki oyun kartları (Game cards in main menu)
export const GAMES: GameItem[] = [
  {
    id: '1',
    title: 'Renkler',
    description: 'Renkleri öğren ve eğlen!',
    icon: '🎨',
    color: COLORS.red,
    screen: 'ColorGame',
  },
  {
    id: '2',
    title: 'Hayvan Sesleri',
    description: 'Hayvanları tanı ve seslerini dinle!',
    icon: '🐶',
    color: COLORS.green,
    screen: 'AnimalSounds',
  },
  {
    id: '3',
    title: 'Şekiller',
    description: 'Şekilleri eşleştir!',
    icon: '⭐',
    color: COLORS.blue,
    screen: 'ShapeMatching',
  },
  {
    id: '4',
    title: 'Sayılar',
    description: 'Sayıları öğren!',
    icon: '🔢',
    color: COLORS.purple,
    screen: 'NumberGame',
  },
  {
    id: '5',
    title: 'Meyveler',
    description: 'Meyveleri tanı ve öğren!',
    icon: '🍎',
    color: COLORS.orange,
    screen: 'FruitGame',
  },
  {
    id: '6',
    title: 'Balon Patlatma',
    description: 'Balonları patlat ve eğlen!',
    icon: '🎈',
    color: COLORS.pink,
    screen: 'BalloonPop',
  },
];

// Hayvan verileri (Animal data)
export const ANIMALS: Animal[] = [
  {
    id: '1',
    name: 'Köpek',
    nameEn: 'Dog',
    emoji: '🐶',
  },
  {
    id: '2',
    name: 'Kedi',
    nameEn: 'Cat',
    emoji: '🐱',
  },
  {
    id: '3',
    name: 'İnek',
    nameEn: 'Cow',
    emoji: '🐮',
  },
  {
    id: '4',
    name: 'Koyun',
    nameEn: 'Sheep',
    emoji: '🐑',
  },
  {
    id: '5',
    name: 'Kuş',
    nameEn: 'Bird',
    emoji: '🐦',
  },
  {
    id: '6',
    name: 'Aslan',
    nameEn: 'Lion',
    emoji: '🦁',
  },
  {
    id: '7',
    name: 'Fil',
    nameEn: 'Elephant',
    emoji: '🐘',
  },
  {
    id: '8',
    name: 'Kurbağa',
    nameEn: 'Frog',
    emoji: '🐸',
  },
];

// Sayılar (Numbers) - 1'den 10'a kadar
export const NUMBERS = [
  { value: 1, name: 'Bir', nameEn: 'One', emoji: '1️⃣' },
  { value: 2, name: 'İki', nameEn: 'Two', emoji: '2️⃣' },
  { value: 3, name: 'Üç', nameEn: 'Three', emoji: '3️⃣' },
  { value: 4, name: 'Dört', nameEn: 'Four', emoji: '4️⃣' },
  { value: 5, name: 'Beş', nameEn: 'Five', emoji: '5️⃣' },
  { value: 6, name: 'Altı', nameEn: 'Six', emoji: '6️⃣' },
  { value: 7, name: 'Yedi', nameEn: 'Seven', emoji: '7️⃣' },
  { value: 8, name: 'Sekiz', nameEn: 'Eight', emoji: '8️⃣' },
  { value: 9, name: 'Dokuz', nameEn: 'Nine', emoji: '9️⃣' },
  { value: 10, name: 'On', nameEn: 'Ten', emoji: '🔟' },
];

// Meyveler (Fruits)
export const FRUITS = [
  { id: '1', name: 'Elma', nameEn: 'Apple', emoji: '🍎', color: '#FF3B30' },
  { id: '2', name: 'Muz', nameEn: 'Banana', emoji: '🍌', color: '#FFCC00' },
  { id: '3', name: 'Portakal', nameEn: 'Orange', emoji: '🍊', color: '#FF9500' },
  { id: '4', name: 'Üzüm', nameEn: 'Grape', emoji: '🍇', color: '#8E44AD' },
  { id: '5', name: 'Çilek', nameEn: 'Strawberry', emoji: '🍓', color: '#E74C3C' },
  { id: '6', name: 'Karpuz', nameEn: 'Watermelon', emoji: '🍉', color: '#27AE60' },
  { id: '7', name: 'Kiraz', nameEn: 'Cherry', emoji: '🍒', color: '#C0392B' },
  { id: '8', name: 'Armut', nameEn: 'Pear', emoji: '🍐', color: '#95C623' },
  { id: '9', name: 'Ananas', nameEn: 'Pineapple', emoji: '🍍', color: '#F39C12' },
  { id: '10', name: 'Şeftali', nameEn: 'Peach', emoji: '🍑', color: '#FFB6C1' },
  { id: '11', name: 'Limon', nameEn: 'Lemon', emoji: '🍋', color: '#FFF44F' },
  { id: '12', name: 'Kavun', nameEn: 'Melon', emoji: '🍈', color: '#90EE90' },
];

