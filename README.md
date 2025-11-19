# 🎈 3 Yaş Oyunları - Eğitici Çocuk Oyunları

3 yaş ve üzeri çocuklar için tasarlanmış, eğitici ve eğlenceli mobil oyun uygulaması.

## 📱 Özellikler

### 🎮 7 Farklı Oyun

1. **🎨 Renkler** - 8 farklı rengi öğrenin
2. **🐶 Hayvan Sesleri** - Hayvanları tanıyın ve seslerini öğrenin
3. **⭐ Şekiller** - Temel geometrik şekilleri eşleştirin
4. **🔢 Sayılar** - 1'den 10'a kadar sayıları öğrenin
5. **🍎 Meyveler** - Meyveleri tanıyın ve isimlerini öğrenin
6. **🎈 Balon Patlatma** - Renkleri eşleştirerek balon patlatın
7. **🖍️ Boyama** - Hayvanları boyayın

### ✨ Özellikler

- ✅ Tamamen ücretsiz
- ✅ Reklamsız
- ✅ Çevrimdışı çalışır
- ✅ Türkçe sesli anlatım (expo-speech)
- ✅ 3 yaş çocuklar için optimize edilmiş
- ✅ Güvenli ve eğitici içerik
- ✅ COPPA uyumlu

## 🎯 Gelişimsel Hedefler

- **Motor Beceriler**: Dokunma, tıklama hareketleri
- **Bilişsel Gelişim**: Renk, şekil, sayı tanıma
- **Dil Gelişimi**: Kelime dağarcığı genişletme
- **El-Göz Koordinasyonu**: İnteraktif oyunlar

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v20+)
- npm veya yarn
- Expo Go uygulaması (mobil cihazda test için)

### Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm start
```

### Test Etme
```bash
# iOS simülatörde çalıştır
npm run ios

# Android emülatörde çalıştır
npm run android

# Web tarayıcıda çalıştır
npm run web
```

### Mobil Cihazda Test
1. App Store veya Google Play'den "Expo Go" uygulamasını indirin
2. `npm start` komutuyla uygulamayı başlatın
3. Terminalde görünen QR kodu Expo Go ile tarayın

## 📁 Proje Yapısı

```
src/
├── screens/          # Oyun ekranları
│   ├── HomeScreen.tsx
│   ├── ColorGameScreen.tsx
│   ├── AnimalSoundsScreen.tsx
│   ├── ShapeMatchingScreen.tsx
│   └── NumberGameScreen.tsx
├── components/       # Yeniden kullanılabilir bileşenler
│   ├── GameButton.tsx
│   └── GameCard.tsx
├── constants/        # Sabitler ve veriler
│   ├── colors.ts
│   └── gameData.ts
└── types/           # TypeScript tip tanımlamaları
    └── navigation.ts
```

## 🎨 Tasarım İlkeleri

- ✅ Büyük, kolay tıklanabilir butonlar
- ✅ Parlak, canlı renkler
- ✅ Basit, sezgisel arayüz
- ✅ Animasyonlu geri bildirimler
- ✅ Yuvarlak köşeler, yumuşak şekiller
- ✅ Yüksek kontrast
- ✅ Minimal dikkat dağıtıcı unsurlar

## 🔧 Teknolojiler

- **React Native** - Mobil uygulama framework'ü
- **Expo** - Geliştirme ve dağıtım platformu
- **TypeScript** - Tip güvenliği
- **React Navigation** - Sayfa geçişleri
- **React Native Reanimated** - Animasyonlar
- **React Native Gesture Handler** - Dokunmatik etkileşimler

## 📝 Gelecek Özellikler

- [ ] Gerçek hayvan sesleri ekleme
- [ ] Sesli renk ve sayı okuması
- [ ] İlerleme takibi ve ödüller
- [ ] Ebeveyn kontrol paneli
- [ ] Daha fazla oyun ekleme
- [ ] Çoklu dil desteği
- [ ] Offline mod

## 👨‍💻 Geliştirici Notları

### Ses Dosyaları Ekleme
Hayvan sesleri için `assets/sounds/` klasörüne ses dosyaları eklenebilir:
```typescript
// AnimalSoundsScreen.tsx içinde
import { Audio } from 'expo-av';

const playSound = async (soundFile: string) => {
  const { sound } = await Audio.Sound.createAsync(
    require(`../assets/sounds/${soundFile}`)
  );
  await sound.playAsync();
};
```

### Yeni Oyun Ekleme
1. `src/screens/` klasörüne yeni ekran dosyası ekle
2. `src/types/navigation.ts` içine route ekle
3. `src/constants/gameData.ts` içine oyun kartı ekle
4. `App.tsx` içinde Stack.Screen olarak ekle

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

