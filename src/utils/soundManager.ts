// Ses yönetimi (Sound management)
// Hayvan sesleri ve diğer ses efektleri için

import { AudioPlayer, useAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// Ses dosyaları için tip tanımı (Type definition for sound files)
type SoundType = 'dog' | 'cat' | 'cow' | 'sheep' | 'bird' | 'lion' | 'elephant' | 'frog' | 'success' | 'click';

// Ses cache'i (Sound cache) - expo-audio için
const soundCache: { [key: string]: AudioPlayer } = {};

// Ses dosyaları mapping (Sound files mapping)
// Yerel dosyalar (Local files) - assets/sounds/ klasöründen yüklenir
// NOT: Ses dosyalarını assets/sounds/ klasörüne ekleyin (Add sound files to assets/sounds/)
const soundFiles: { [key in SoundType]?: any } = {
  // Yerel dosyalar (Local files)
  // Ses dosyalarını ekledikten sonra bu satırların yorumunu kaldırın:
  // (Uncomment these lines after adding sound files)

  dog: require('../../assets/sounds/dog.mp3'), // ✅ Eklendi
  // cat: require('../../assets/sounds/cat.mp3'),
  // cow: require('../../assets/sounds/cow.mp3'),
  // sheep: require('../../assets/sounds/sheep.mp3'),
  // bird: require('../../assets/sounds/bird.mp3'),
  // lion: require('../../assets/sounds/lion.mp3'),
  // elephant: require('../../assets/sounds/elephant.mp3'),
  // frog: require('../../assets/sounds/frog.mp3'),
  // success: require('../../assets/sounds/success.mp3'),
  // click: require('../../assets/sounds/click.mp3'),
};

// Online ses URL'leri (Online sound URLs) - Ücretsiz ve telif hakkı yok
// Freesound.org ve diğer ücretsiz kaynaklardan
const soundUrls: { [key in SoundType]?: string } = {
  dog: 'https://freesound.org/data/previews/416/416838_5121236-lq.mp3',
  cat: 'https://freesound.org/data/previews/398/398937_7080874-lq.mp3',
  cow: 'https://freesound.org/data/previews/58/58277_634166-lq.mp3',
  sheep: 'https://freesound.org/data/previews/415/415209_5121236-lq.mp3',
  bird: 'https://freesound.org/data/previews/416/416838_5121236-lq.mp3',
  lion: 'https://freesound.org/data/previews/232/232013_4172505-lq.mp3',
  elephant: 'https://freesound.org/data/previews/268/268822_4486188-lq.mp3',
  frog: 'https://freesound.org/data/previews/416/416838_5121236-lq.mp3',
};

// Ses ayarlarını yapılandır (Configure audio settings)
export const initializeAudio = async () => {
  try {
    // Web Speech API seslerini yükle (Load Web Speech API voices)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Sesleri yükle (Load voices)
      const voices = window.speechSynthesis.getVoices();
      console.log('🔊 Initializing speech synthesis...');
      console.log('Available voices:', voices.length);

      // Sesler yüklendiğinde tekrar kontrol et (Check again when voices are loaded)
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          const loadedVoices = window.speechSynthesis.getVoices();
          console.log('✅ Voices loaded:', loadedVoices.length);
          const turkishVoices = loadedVoices.filter(v => v.lang.startsWith('tr'));
          console.log('🇹🇷 Turkish voices:', turkishVoices.map(v => v.name));
        };
      } else {
        const turkishVoices = voices.filter(v => v.lang.startsWith('tr'));
        console.log('🇹🇷 Turkish voices:', turkishVoices.map(v => v.name));
      }
    }
  } catch (error) {
    console.log('Audio initialization error:', error);
  }
};

// Ses çal (Play sound)
export const playSound = async (soundType: SoundType) => {
  try {
    // Web'de direkt Web Audio API kullan (Use Web Audio API directly on web)
    if (typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined') {
      console.log(`🔊 Playing web sound: ${soundType}`);
      playWebSound(soundType);
      return;
    }

    // Mobilde Expo Audio kullan (Use Expo Audio on mobile)
    // Yerel dosya varsa çal (Play local file if available)
    if (soundFiles[soundType]) {
      console.log(`📱 Playing mobile sound: ${soundType}`);

      // Yeni AudioPlayer oluştur (Create new AudioPlayer)
      const player = new AudioPlayer(soundFiles[soundType]);

      // Sesi çal (Play sound)
      await player.play();

      console.log(`✅ Sound played: ${soundType}`);
      return;
    }

    // Ses dosyası yoksa bilgi ver (If no sound file, log info)
    console.log(`ℹ️ No sound file for: ${soundType}`);
    console.log(`ℹ️ Add sound files to assets/sounds/ and uncomment in soundManager.ts`);
  } catch (error) {
    console.log('Sound play error:', error);
  }
};

// Web için ses efektleri (Sound effects for web)
// Daha gerçekçi hayvan sesleri simülasyonu
const playWebSound = (soundType: SoundType) => {
  try {
    // AudioContext kontrolü (Check if AudioContext is available)
    if (typeof window === 'undefined' ||
        (typeof window.AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined')) {
      console.log('ℹ️ AudioContext not available (mobile device)');
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Hayvan seslerine göre özel ses üretimi (Custom sound generation for animal sounds)
    switch (soundType) {
      case 'dog':
        playDogSound(audioContext);
        break;
      case 'cat':
        playCatSound(audioContext);
        break;
      case 'cow':
        playCowSound(audioContext);
        break;
      case 'sheep':
        playSheepSound(audioContext);
        break;
      case 'bird':
        playBirdSound(audioContext);
        break;
      case 'lion':
        playLionSound(audioContext);
        break;
      case 'elephant':
        playElephantSound(audioContext);
        break;
      case 'frog':
        playFrogSound(audioContext);
        break;
      default:
        playSimpleSound(audioContext, soundType);
    }
  } catch (error) {
    console.log('ℹ️ Web Audio API error:', error);
  }
};

// Köpek sesi - Hav hav (Dog sound - Woof woof)
const playDogSound = (audioContext: AudioContext) => {
  // İki kısa havlama (Two short barks)
  for (let i = 0; i < 2; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    const startTime = audioContext.currentTime + (i * 0.3);

    oscillator.frequency.setValueAtTime(200, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, startTime + 0.1);

    gainNode.gain.setValueAtTime(0.4, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.15);
  }
};

// Kedi sesi - Miyav (Cat sound - Meow)
const playCatSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  const startTime = audioContext.currentTime;

  // Miyav sesi için frekans değişimi (Frequency change for meow)
  oscillator.frequency.setValueAtTime(800, startTime);
  oscillator.frequency.linearRampToValueAtTime(400, startTime + 0.2);
  oscillator.frequency.linearRampToValueAtTime(600, startTime + 0.4);

  gainNode.gain.setValueAtTime(0.3, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

  oscillator.start(startTime);
  oscillator.stop(startTime + 0.5);
};

// İnek sesi - Möö (Cow sound - Moo)
const playCowSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sawtooth';
  const startTime = audioContext.currentTime;

  oscillator.frequency.setValueAtTime(150, startTime);
  oscillator.frequency.linearRampToValueAtTime(120, startTime + 0.6);

  gainNode.gain.setValueAtTime(0.4, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

  oscillator.start(startTime);
  oscillator.stop(startTime + 0.8);
};

// Koyun sesi - Mee (Sheep sound - Baa)
const playSheepSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'square';
  const startTime = audioContext.currentTime;

  oscillator.frequency.setValueAtTime(300, startTime);
  oscillator.frequency.linearRampToValueAtTime(250, startTime + 0.4);

  gainNode.gain.setValueAtTime(0.3, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

  oscillator.start(startTime);
  oscillator.stop(startTime + 0.5);
};

// Kuş sesi - Cik cik (Bird sound - Chirp chirp)
const playBirdSound = (audioContext: AudioContext) => {
  // Üç hızlı cıvıltı (Three quick chirps)
  for (let i = 0; i < 3; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    const startTime = audioContext.currentTime + (i * 0.15);

    oscillator.frequency.setValueAtTime(1200, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(1800, startTime + 0.08);

    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.1);
  }
};

// Aslan sesi - Kükreme (Lion sound - Roar)
const playLionSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sawtooth';
  const startTime = audioContext.currentTime;

  oscillator.frequency.setValueAtTime(80, startTime);
  oscillator.frequency.linearRampToValueAtTime(120, startTime + 0.3);
  oscillator.frequency.linearRampToValueAtTime(60, startTime + 0.8);

  gainNode.gain.setValueAtTime(0.5, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.0);

  oscillator.start(startTime);
  oscillator.stop(startTime + 1.0);
};

// Fil sesi - Böğürme (Elephant sound - Trumpet)
const playElephantSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'triangle';
  const startTime = audioContext.currentTime;

  oscillator.frequency.setValueAtTime(200, startTime);
  oscillator.frequency.linearRampToValueAtTime(400, startTime + 0.4);
  oscillator.frequency.linearRampToValueAtTime(150, startTime + 0.8);

  gainNode.gain.setValueAtTime(0.4, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.0);

  oscillator.start(startTime);
  oscillator.stop(startTime + 1.0);
};

// Kurbağa sesi - Vırak (Frog sound - Ribbit)
const playFrogSound = (audioContext: AudioContext) => {
  // İki kısa vıraklama (Two short ribbits)
  for (let i = 0; i < 2; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    const startTime = audioContext.currentTime + (i * 0.25);

    oscillator.frequency.setValueAtTime(250, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, startTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.15);
  }
};

// Basit ses efektleri (Simple sound effects)
const playSimpleSound = (audioContext: AudioContext, soundType: SoundType) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const configs = {
    success: { frequency: 523, duration: 0.2, type: 'sine' as OscillatorType },
    click: { frequency: 800, duration: 0.05, type: 'sine' as OscillatorType },
  };

  const config = configs[soundType as 'success' | 'click'] || configs.click;

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + config.duration);
};

// Renk sesi çal (Play color sound)
export const playColorSound = (colorName: string) => {
  console.log('🎨 Playing color sound:', colorName);

  // Her renk için farklı nota (Different note for each color)
  const colorFrequencies: { [key: string]: number } = {
    'Kırmızı': 261.63,    // C4
    'Mavi': 293.66,       // D4
    'Sarı': 329.63,       // E4
    'Yeşil': 349.23,      // F4
    'Turuncu': 392.00,    // G4
    'Mor': 440.00,        // A4
    'Pembe': 493.88,      // B4
    'Kahverengi': 523.25, // C5
    'Beyaz': 587.33,      // D5
  };

  const frequency = colorFrequencies[colorName] || 440;

  // Web'de Web Audio API kullan (Use Web Audio API on web)
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' &&
          (typeof window.AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined')) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        console.log('✅ Color sound played (web)');
      }
    } catch (error) {
      console.log('❌ Color sound error:', error);
    }
  } else {
    // Mobilde sadece log (Mobile: just log for now)
    console.log('📱 Color sound on mobile (no audio yet)');
  }
};

// Sayı sesi çal (Play number sound)
export const playNumberSound = (number: number) => {
  // Sayılar için artan tonlar (Ascending tones for numbers)
  const baseFrequency = 261.63; // C4
  const frequency = baseFrequency * Math.pow(2, (number - 1) / 12);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      console.log('Number sound error:', error);
    }
  } else {
    // Mobile'da sayı sesi yok (No number sound on mobile yet)
    console.log('📱 Number sound on mobile (no audio yet)');
  }
};

// Başarı sesi çal (Play success sound)
export const playSuccessSound = () => {
  playSound('success');
};

// Tıklama sesi çal (Play click sound)
export const playClickSound = () => {
  playSound('click');
};

// Konuşma kuyruğu (Speech queue)
let speechQueue: string[] = [];
let isSpeakingNow = false;

// Türkçe sesli okuma (Turkish text-to-speech)
// Kuyruk sistemi ile çalışır
// Web'de Web Speech API, mobilde expo-speech kullanır
export const speakTurkish = async (text: string) => {
  console.log('🎤 speakTurkish called with:', text);
  console.log('📱 Platform:', Platform.OS);

  // Platform kontrolü (Check platform)
  if (Platform.OS === 'web') {
    // Web'de Web Speech API kullan (Use Web Speech API on web)
    console.log('🌐 Using Web Speech API');

    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      // Kuyruğa ekle (Add to queue)
      speechQueue.push(text);
      console.log('📝 Added to queue. Queue length:', speechQueue.length);

      // Eğer konuşma devam etmiyorsa, başlat (If not speaking, start)
      if (!isSpeakingNow) {
        processQueue();
      }
    } else {
      console.log('❌ Web Speech API not available');
    }
    return;
  }

  // Mobilde expo-speech kullan (Use expo-speech on mobile)
  console.log('📱 Using expo-speech for mobile');
  try {
    // Önce mevcut konuşmaları durdur (Stop any ongoing speech)
    await Speech.stop();

    // Yeni konuşmayı başlat (Start new speech)
    await Speech.speak(text, {
      language: 'tr-TR',
      pitch: 1.1,
      rate: 0.85,
    });
    console.log('✅ Speech completed:', text);
  } catch (error) {
    console.log('❌ Speech error:', error);
  }
};

// Kuyruğu işle (Process queue)
const processQueue = () => {
  if (speechQueue.length === 0) {
    console.log('✅ Queue empty');
    isSpeakingNow = false;
    return;
  }

  // Kuyruktan al (Get from queue)
  const text = speechQueue.shift()!;
  isSpeakingNow = true;

  console.log('🔄 Processing:', text, '(Remaining:', speechQueue.length, ')');

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    // Türkçe ses bul (Find Turkish voice)
    const voices = window.speechSynthesis.getVoices();
    const turkishVoice = voices.find(voice =>
      voice.lang === 'tr-TR' || voice.lang.startsWith('tr')
    );

    if (turkishVoice) {
      utterance.voice = turkishVoice;
      console.log('✅ Using Turkish voice:', turkishVoice.name);
    }

    // Event listeners
    utterance.onstart = () => {
      console.log('✅✅✅ Speech STARTED:', text);
    };

    utterance.onend = () => {
      console.log('✅ Speech ENDED:', text);
      isSpeakingNow = false;

      // Sonraki konuşmayı işle (Process next)
      setTimeout(() => {
        processQueue();
      }, 300);
    };

    utterance.onerror = (event) => {
      console.error('❌ Speech ERROR:', event.error);
      isSpeakingNow = false;

      // Hata durumunda da devam et (Continue on error)
      setTimeout(() => {
        processQueue();
      }, 300);
    };

    // Konuşmayı başlat (Start speaking)
    console.log('🚀 Starting speech...');
    window.speechSynthesis.speak(utterance);

  } catch (error) {
    console.error('❌ Exception:', error);
    isSpeakingNow = false;
    processQueue();
  }
};

// Hayvan adını söyle (Speak animal name)
export const speakAnimalName = (animalName: string) => {
  speakTurkish(`${animalName}`);
};

// Soru sor (Ask question)
// Türkçe dilbilgisi kurallarına göre belirtme hali ekleri
export const askAnimalQuestion = (animalName: string) => {
  // Belirtme hali ekleri - Doğru telaffuz için (Accusative case suffixes - for correct pronunciation)
  const questionMap: { [key: string]: string } = {
    'Köpek': 'Köpeği bul',
    'Kedi': 'Kediyi bul',
    'İnek': 'İneği bul',
    'Koyun': 'Koyunu bul',
    'Kuş': 'Kuşu bul',
    'Aslan': 'Aslanı bul',
    'Fil': 'Fili bul',
    'Kurbağa': 'Kurbağayı bul',
  };

  const question = questionMap[animalName] || `${animalName} bul`;
  speakTurkish(question);
};

// Doğru cevap (Correct answer)
export const speakCorrectAnswer = (animalName: string, sound: string) => {
  speakTurkish(`Aferin! ${animalName} ${sound} der!`);
};

// Yanlış cevap (Wrong answer)
export const speakWrongAnswer = () => {
  speakTurkish('Tekrar dene!');
};

// Başarı mesajı (Success message)
export const speakSuccess = () => {
  speakTurkish('Harika! Çok güzel!');
};

// Konuşmayı durdur (Stop speaking)
export const stopSpeaking = () => {
  try {
    console.log('🛑 Stopping speech...');

    // Kuyruğu temizle (Clear queue)
    speechQueue.length = 0;
    isSpeakingNow = false;

    // Platform'a göre durdur (Stop based on platform)
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      // Mobil için expo-speech
      Speech.stop();
    }

    console.log('✅ Speech stopped');
  } catch (error) {
    console.log('❌ Stop speech error:', error);
  }
};

// Tüm sesleri temizle (Clean up all sounds)
export const cleanupSounds = async () => {
  try {
    // Konuşmayı durdur (Stop speech)
    stopSpeaking();

    // Ses cache'ini temizle (Clean sound cache)
    for (const key in soundCache) {
      // expo-audio için cleanup
      soundCache[key].remove();
    }
  } catch (error) {
    console.log('Sound cleanup error:', error);
  }
};

