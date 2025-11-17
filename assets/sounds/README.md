# 🔊 Ses Dosyaları Rehberi (Sound Files Guide)

Bu klasöre hayvan sesleri ve diğer ses efektlerini eklemeniz gerekiyor.

## 📥 Ses Dosyalarını Nereden İndirebilirsiniz?

### Ücretsiz ve Telif Hakkı Olmayan Kaynaklar:

1. **Mixkit** (Önerilen) ⭐
   - URL: https://mixkit.co/free-sound-effects/animals/
   - Telif hakkı yok, ücretsiz kullanım
   - Yüksek kalite MP3 dosyaları

2. **Pixabay**
   - URL: https://pixabay.com/sound-effects/search/animals/
   - Tamamen ücretsiz
   - Ticari kullanım için uygun

3. **Freesound.org**
   - URL: https://freesound.org/
   - Creative Commons lisanslı
   - Geniş koleksiyon

4. **Zapsplat**
   - URL: https://www.zapsplat.com/sound-effect-categories/animals/
   - Ücretsiz hesap gerekli
   - Profesyonel kalite

---

## 📋 İhtiyacınız Olan Ses Dosyaları

Aşağıdaki ses dosyalarını indirip bu klasöre ekleyin:

### Hayvan Sesleri (Animal Sounds):
- ✅ `dog.mp3` - Köpek havlaması (Dog barking)
- ✅ `cat.mp3` - Kedi miyavlaması (Cat meowing)
- ✅ `cow.mp3` - İnek böğürmesi (Cow mooing)
- ✅ `sheep.mp3` - Koyun melemesi (Sheep bleating)
- ✅ `bird.mp3` - Kuş cıvıltısı (Bird chirping)
- ✅ `lion.mp3` - Aslan kükremesi (Lion roaring)
- ✅ `elephant.mp3` - Fil böğürmesi (Elephant trumpeting)
- ✅ `frog.mp3` - Kurbağa vıraklaması (Frog croaking)

### Diğer Sesler (Other Sounds):
- ✅ `success.mp3` - Başarı sesi (Success sound) - Alkış veya kutlama
- ✅ `click.mp3` - Tıklama sesi (Click sound) - Basit bip

---

## 🎯 Hızlı Başlangıç (Quick Start)

### Adım 1: Ses Dosyalarını İndirin
1. Yukarıdaki sitelerden birini ziyaret edin
2. Her hayvan için uygun sesi arayın (örn: "dog bark")
3. MP3 formatında indirin
4. Dosya adını yukarıdaki listeye göre değiştirin

### Adım 2: Dosyaları Bu Klasöre Kopyalayın
```bash
# Ses dosyalarını buraya kopyalayın:
/Users/gokhan.yildirim/3yasoyun/assets/sounds/

# Örnek:
dog.mp3
cat.mp3
cow.mp3
...
```

### Adım 3: Kod Güncellemesi
Ses dosyalarını ekledikten sonra, `src/utils/soundManager.ts` dosyasını güncelleyin:

```typescript
const soundFiles: { [key in SoundType]?: any } = {
  dog: require('../../assets/sounds/dog.mp3'),
  cat: require('../../assets/sounds/cat.mp3'),
  cow: require('../../assets/sounds/cow.mp3'),
  sheep: require('../../assets/sounds/sheep.mp3'),
  bird: require('../../assets/sounds/bird.mp3'),
  lion: require('../../assets/sounds/lion.mp3'),
  elephant: require('../../assets/sounds/elephant.mp3'),
  frog: require('../../assets/sounds/frog.mp3'),
  success: require('../../assets/sounds/success.mp3'),
  click: require('../../assets/sounds/click.mp3'),
};
```

---

## 📝 Önerilen Ses Özellikleri

- **Format**: MP3 (en uyumlu)
- **Süre**: 1-3 saniye (çok uzun olmasın)
- **Kalite**: 128 kbps yeterli (dosya boyutu küçük olsun)
- **Ses Seviyesi**: Normalize edilmiş (çok yüksek veya düşük olmasın)

---

## 🎨 Alternatif: Online Ses Jeneratörleri

Eğer ses dosyası indirmek istemezseniz, online jeneratörler kullanabilirsiniz:

1. **Text-to-Speech**
   - Google Text-to-Speech
   - "Köpek hav hav" gibi metinleri sese çevirebilir

2. **Ses Efekti Jeneratörleri**
   - SFXR (http://www.drpetter.se/project_sfxr.html)
   - Basit ses efektleri oluşturabilir

---

## ⚠️ Telif Hakkı Uyarısı

- Sadece telif hakkı olmayan veya Creative Commons lisanslı sesleri kullanın
- YouTube'dan veya diğer kaynaklardan rastgele ses indirmeyin
- Ticari kullanım için lisansı kontrol edin

---

## 🚀 Test Etme

Ses dosyalarını ekledikten sonra:

1. Uygulamayı yeniden başlatın: `npm start`
2. Hayvan Sesleri oyununa gidin
3. Her hayvana tıklayın ve sesi duyun

---

## 💡 İpuçları

- Ses dosyaları çok büyükse (>500 KB), online araçlarla sıkıştırın
- Tüm seslerin ses seviyesi benzer olmalı
- Çocuklar için çok yüksek veya korkutucu sesler kullanmayın
- Test ederken hoparlör/kulaklık ses seviyesini kontrol edin

---

**Sorularınız için:** Ses dosyalarını ekledikten sonra sorun yaşarsanız, konsolu kontrol edin.

