# 🎈 0-3 Yaş Eğitici Oyunlar

0-3 yaş arası çocuklar için geliştirilmiş eğitici mobil oyun uygulaması.

## 📱 Özellikler

### Oyunlar
1. **🎨 Renkler** - Renk öğrenme oyunu
   - 6 temel renk (Kırmızı, Mavi, Sarı, Yeşil, Turuncu, Mor)
   - Dokunmatik etkileşim
   - Animasyonlu geri bildirim

2. **🐶 Hayvan Sesleri** - Hayvan tanıma oyunu
   - 8 farklı hayvan
   - Görsel ve işitsel öğrenme
   - Büyük, kolay tıklanabilir kartlar

3. **⭐ Şekiller** - Şekil eşleştirme oyunu
   - 4 temel şekil (Daire, Kare, Üçgen, Yıldız)
   - Renkli ve eğlenceli tasarım
   - İnteraktif animasyonlar

4. **🔢 Sayılar** - Sayı öğrenme oyunu
   - 1'den 10'a kadar sayılar
   - Türkçe sayı isimleri
   - Görsel sayı gösterimi

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

