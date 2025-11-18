// Navigation tipleri (Navigation types)
// React Navigation için tip tanımlamaları

export type RootStackParamList = {
  Home: undefined;              // Ana menü ekranı (Home screen)
  ColorGame: undefined;         // Renk öğrenme oyunu (Color learning game)
  AnimalSounds: undefined;      // Hayvan sesleri oyunu (Animal sounds game)
  ShapeMatching: undefined;     // Şekil eşleştirme oyunu (Shape matching game)
  NumberGame: undefined;        // Sayı öğrenme oyunu (Number learning game)
  FruitGame: undefined;         // Meyve öğrenme oyunu (Fruit learning game)
  BalloonPop: undefined;        // Balon patlatma oyunu (Balloon pop game)
};

// Oyun tipleri (Game types)
export interface GameItem {
  id: string;
  title: string;              // Oyun başlığı (Game title)
  description: string;        // Oyun açıklaması (Game description)
  icon: string;               // Emoji icon
  color: string;              // Kart rengi (Card color)
  screen: keyof RootStackParamList;
}

// Hayvan tipleri (Animal types)
export interface Animal {
  id: string;
  name: string;               // Hayvan adı Türkçe (Animal name in Turkish)
  nameEn: string;             // Hayvan adı İngilizce (Animal name in English)
  emoji: string;              // Emoji gösterimi (Emoji representation)
  sound?: string;             // Ses dosyası yolu (Sound file path)
}

// Şekil tipleri (Shape types)
export interface Shape {
  id: string;
  name: string;               // Şekil adı Türkçe (Shape name in Turkish)
  nameEn: string;             // Şekil adı İngilizce (Shape name in English)
  type: 'circle' | 'square' | 'triangle' | 'star';
  color: string;
}

