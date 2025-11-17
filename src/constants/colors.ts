// Renk sabitleri (Color constants)
// 0-3 yaş çocuklar için parlak ve canlı renkler

export const COLORS = {
  // Ana renkler (Primary colors)
  primary: '#FF6B6B',      // Kırmızı (Red)
  secondary: '#4ECDC4',    // Turkuaz (Turquoise)
  accent: '#FFE66D',       // Sarı (Yellow)
  
  // Oyun renkleri (Game colors) - Öğrenme için temel renkler
  red: '#FF6B6B',
  blue: '#4A90E2',
  yellow: '#FFE66D',
  green: '#51CF66',
  orange: '#FF9F43',
  purple: '#A55EEA',
  pink: '#FF6B9D',
  brown: '#8B4513',
  white: '#F5F5F5',
  black: '#2C3E50',
  
  // Arka plan renkleri (Background colors)
  background: '#FFF9E6',   // Yumuşak krem (Soft cream)
  cardBackground: '#FFFFFF',
  
  // Metin renkleri (Text colors)
  text: '#2C3E50',
  textLight: '#7F8C8D',
  
  // Durum renkleri (Status colors)
  success: '#51CF66',
  warning: '#FFE66D',
  error: '#FF6B6B',
  
  // Gölge ve kenarlıklar (Shadows and borders)
  shadow: 'rgba(0, 0, 0, 0.1)',
  border: '#E0E0E0',
};

// Renk öğrenme oyunu için renk listesi (Color list for learning game)
export const LEARNING_COLORS = [
  { name: 'Kırmızı', nameEn: 'Red', color: COLORS.red },
  { name: 'Mavi', nameEn: 'Blue', color: COLORS.blue },
  { name: 'Sarı', nameEn: 'Yellow', color: COLORS.yellow },
  { name: 'Yeşil', nameEn: 'Green', color: COLORS.green },
  { name: 'Turuncu', nameEn: 'Orange', color: COLORS.orange },
  { name: 'Mor', nameEn: 'Purple', color: COLORS.purple },
  { name: 'Pembe', nameEn: 'Pink', color: COLORS.pink },
  { name: 'Kahverengi', nameEn: 'Brown', color: COLORS.brown },
  { name: 'Beyaz', nameEn: 'White', color: COLORS.white },
];

