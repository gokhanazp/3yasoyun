# 📱 Ekran Açıklamaları ve Kullanıcı Akışı

## 🏠 Ana Menü Ekranı (HomeScreen)

```
┌─────────────────────────────────────┐
│                                     │
│        🎈 Eğlenceli Oyunlar        │
│     Oynamak için bir oyun seç!     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🎨    Renkler               │ │
│  │        Renkleri öğren ve     │ │
│  │        eğlen!                │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🐶    Hayvan Sesleri        │ │
│  │        Hayvanları tanı ve    │ │
│  │        seslerini dinle!      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  ⭐    Şekiller               │ │
│  │        Şekilleri eşleştir!   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  🔢    Sayılar               │ │
│  │        Sayıları öğren!       │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Özellikler**:
- Büyük, renkli oyun kartları
- Her kart farklı renkte
- Emoji iconlar
- Kolay okunabilir yazılar
- Scroll edilebilir liste

---

## 🎨 Renk Öğrenme Oyunu (ColorGameScreen)

```
┌─────────────────────────────────────┐
│  ← Geri    🎨 Renkler              │
├─────────────────────────────────────┤
│                                     │
│           [Seçilen Renk]           │
│              Kırmızı               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     🔴          🔵          🟡      │
│   Kırmızı      Mavi       Sarı     │
│                                     │
│     🟢          🟠          🟣      │
│   Yeşil      Turuncu       Mor     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│        🏠  Ana Menü                │
│                                     │
└─────────────────────────────────────┘
```

**Etkileşim**:
1. Kullanıcı bir renk balonuna dokunur
2. Balon büyür (animasyon)
3. Renk ismi üstte görünür
4. 2 saniye sonra seçim temizlenir

**Animasyonlar**:
- Scale animasyonu (0.95 → 1.2 → 1.0)
- Spring efekti
- Yumuşak geçişler

---

## 🐶 Hayvan Sesleri Oyunu (AnimalSoundsScreen)

```
┌─────────────────────────────────────┐
│  ← Geri    🐶 Hayvan Sesleri       │
├─────────────────────────────────────┤
│                                     │
│           Köpek  🔊                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │  🐶  │  │  🐱  │  │  🐮  │     │
│  │Köpek │  │ Kedi │  │ İnek │     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │  🐑  │  │  🐦  │  │  🦁  │     │
│  │Koyun │  │ Kuş  │  │Aslan │     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
│  ┌──────┐  ┌──────┐                │
│  │  🐘  │  │  🐸  │                │
│  │ Fil  │  │Kurbağa│               │
│  └──────┘  └──────┘                │
│                                     │
├─────────────────────────────────────┤
│        🏠  Ana Menü                │
└─────────────────────────────────────┘
```

**Etkileşim**:
1. Kullanıcı hayvan kartına dokunur
2. Kart zıplar (animasyon)
3. Hayvan ismi üstte görünür
4. Ses çalar (gelecek özellik)
5. Kart vurgulanır (yeşil kenarlık)

**Özellikler**:
- 8 hayvan kartı
- Scroll edilebilir
- Büyük emoji görseller
- Seçili kart vurgulama

---

## ⭐ Şekil Eşleştirme Oyunu (ShapeMatchingScreen)

```
┌─────────────────────────────────────┐
│  ← Geri    ⭐ Şekiller             │
├─────────────────────────────────────┤
│                                     │
│              Daire                 │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     ┌──────────┐  ┌──────────┐    │
│     │    🔵    │  │    🟥    │    │
│     │  Daire   │  │   Kare   │    │
│     └──────────┘  └──────────┘    │
│                                     │
│     ┌──────────┐  ┌──────────┐    │
│     │    🔺    │  │    ⭐    │    │
│     │  Üçgen   │  │  Yıldız  │    │
│     └──────────┘  └──────────┘    │
│                                     │
├─────────────────────────────────────┤
│        🏠  Ana Menü                │
└─────────────────────────────────────┘
```

**Etkileşim**:
1. Kullanıcı şekil kartına dokunur
2. Kart büyür ve döner (animasyon)
3. Şekil ismi üstte görünür
4. Beyaz kenarlık belirir

**Animasyonlar**:
- Scale + Rotate kombinasyonu
- Spring geri dönüş
- Smooth transitions

---

## 🔢 Sayı Öğrenme Oyunu (NumberGameScreen)

```
┌─────────────────────────────────────┐
│  ← Geri    🔢 Sayılar              │
├─────────────────────────────────────┤
│                                     │
│              Beş                   │
│               5                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │ 1️⃣   │  │ 2️⃣   │  │ 3️⃣   │     │
│  │ Bir  │  │ İki  │  │ Üç   │     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │ 4️⃣   │  │ 5️⃣   │  │ 6️⃣   │     │
│  │ Dört │  │ Beş  │  │ Altı │     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐     │
│  │ 7️⃣   │  │ 8️⃣   │  │ 9️⃣   │     │
│  │ Yedi │  │Sekiz │  │Dokuz │     │
│  └──────┘  └──────┘  └──────┘     │
│                                     │
│  ┌──────┐                          │
│  │ 🔟   │                          │
│  │  On  │                          │
│  └──────┘                          │
│                                     │
├─────────────────────────────────────┤
│        🏠  Ana Menü                │
└─────────────────────────────────────┘
```

**Etkileşim**:
1. Kullanıcı sayı kartına dokunur
2. Kart zıplar (animasyon)
3. Sayı ismi ve rakamı üstte görünür
4. Kart vurgulanır (mor arka plan)

---

## 🎯 Kullanıcı Akışı

```
        Ana Menü
           │
    ┌──────┼──────┬──────┐
    │      │      │      │
  Renkler Hayvan Şekil Sayı
    │      │      │      │
    └──────┴──────┴──────┘
           │
      Ana Menü'ye Dön
```

## 🎨 Tasarım Prensipleri

### Renk Kullanımı
- **Ana Menü**: Krem arka plan (#FFF9E6)
- **Oyun Kartları**: Her oyun farklı renk
- **Butonlar**: Parlak, canlı renkler
- **Metin**: Koyu gri (#2C3E50)

### Boyutlar
- **Buton Yüksekliği**: Min 60px
- **Kart Boyutu**: 160x160px
- **Font Boyutları**:
  - Başlık: 32-36px
  - Oyun İsimleri: 24-28px
  - Açıklamalar: 16-18px
  - Emoji: 48-72px

### Animasyonlar
- **Süre**: 150-200ms
- **Easing**: Spring (friction: 3, tension: 40)
- **Scale**: 0.95 → 1.2 → 1.0
- **Opacity**: Kullanılmıyor (performans için)

---

**Not**: Tüm ekranlar responsive tasarıma sahiptir ve farklı ekran boyutlarına uyum sağlar.

