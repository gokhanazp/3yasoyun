# 👨‍💻 Geliştirici Notları

## 🏗️ Proje Mimarisi

### Klasör Yapısı Mantığı

```
src/
├── components/      # Yeniden kullanılabilir UI bileşenleri
├── constants/       # Statik veriler ve sabitler
├── screens/         # Sayfa/Ekran bileşenleri
├── types/           # TypeScript tip tanımlamaları
└── utils/           # Yardımcı fonksiyonlar
```

**Neden bu yapı?**
- **Modülerlik**: Her bileşen bağımsız çalışabilir
- **Yeniden Kullanılabilirlik**: Components klasöründeki bileşenler her yerde kullanılabilir
- **Tip Güvenliği**: Types klasörü merkezi tip yönetimi sağlar
- **Kolay Bakım**: Her şey mantıksal olarak gruplandırılmış

### Component Hiyerarşisi

```
App.tsx
└── NavigationContainer
    └── Stack.Navigator
        ├── HomeScreen
        │   └── GameCard (x4)
        ├── ColorGameScreen
        │   └── GameButton
        ├── AnimalSoundsScreen
        │   └── GameButton
        ├── ShapeMatchingScreen
        │   └── GameButton
        └── NumberGameScreen
            └── GameButton
```

## 🎨 Stil Yönetimi

### Neden StyleSheet.create?
```typescript
// ✅ İyi - StyleSheet.create kullanımı
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

// ❌ Kötü - Inline stil
<View style={{ flex: 1, backgroundColor: '#FFF9E6' }}>
```

**Avantajları**:
- Performans optimizasyonu
- Stil nesneleri bir kez oluşturulur
- Hata kontrolü
- Daha temiz kod

### Renk Yönetimi
Tüm renkler `src/constants/colors.ts` dosyasında merkezi olarak yönetilir:

```typescript
// ✅ İyi
backgroundColor: COLORS.primary

// ❌ Kötü
backgroundColor: '#FF6B6B'
```

**Neden?**
- Tek bir yerden tüm renkleri değiştirebilirsiniz
- Tutarlılık sağlar
- Dark mode geçişi kolaylaşır

## 🎭 Animasyon Stratejisi

### React Native Animated API

```typescript
const scaleValue = useRef(new Animated.Value(1)).current;

// Basit animasyon
Animated.timing(scaleValue, {
  toValue: 1.2,
  duration: 150,
  useNativeDriver: true, // ÖNEMLİ!
}).start();

// Spring animasyon (daha doğal)
Animated.spring(scaleValue, {
  toValue: 1,
  friction: 3,
  tension: 40,
  useNativeDriver: true,
}).start();
```

**useNativeDriver: true neden önemli?**
- Animasyonlar native thread'de çalışır
- JavaScript thread'i bloklamaz
- 60 FPS performans
- Daha akıcı animasyonlar

### Animasyon Best Practices

```typescript
// ✅ İyi - Transform ve opacity kullan
transform: [{ scale: scaleValue }]
opacity: opacityValue

// ❌ Kötü - Layout özellikleri
width: widthValue  // Yavaş!
height: heightValue // Yavaş!
```

## 🧩 Component Tasarım Prensipleri

### 1. Props Interface Tanımlama
```typescript
interface GameButtonProps {
  title: string;
  onPress: () => void;
  color?: string;        // Opsiyonel
  icon?: string;         // Opsiyonel
  disabled?: boolean;    // Opsiyonel
}
```

### 2. Default Props
```typescript
const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  color = COLORS.primary,  // Default değer
  icon,
  disabled = false,
}) => {
  // ...
};
```

### 3. Memoization (Gelecek optimizasyon)
```typescript
// Performans için
export const GameButton = React.memo<GameButtonProps>(({ ... }) => {
  // ...
});
```

## 🔄 Navigation Yapısı

### Stack Navigator Kullanımı
```typescript
const Stack = createNativeStackNavigator<RootStackParamList>();

// Tip güvenliği için RootStackParamList
export type RootStackParamList = {
  Home: undefined;
  ColorGame: undefined;
  // ...
};
```

### Navigation Props
```typescript
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}
```

**Avantajları**:
- TypeScript otomatik tamamlama
- Hatalı route isimleri yakalanır
- Parametre tip kontrolü

## 🎯 Performans Optimizasyonları

### 1. FlatList vs ScrollView
```typescript
// Çok sayıda item için FlatList kullan
<FlatList
  data={items}
  renderItem={({ item }) => <Item {...item} />}
  keyExtractor={(item) => item.id}
/>

// Az sayıda item için ScrollView
<ScrollView>
  {items.map(item => <Item key={item.id} {...item} />)}
</ScrollView>
```

### 2. Image Optimization
```typescript
// Gelecek iyileştirme
<Image
  source={require('./image.png')}
  resizeMode="contain"
  style={{ width: 100, height: 100 }}
/>
```

### 3. Avoid Inline Functions
```typescript
// ❌ Kötü - Her render'da yeni fonksiyon
<TouchableOpacity onPress={() => handlePress(item.id)}>

// ✅ İyi - useCallback kullan
const handlePress = useCallback((id: string) => {
  // ...
}, []);
```

## 🔊 Ses Entegrasyonu (Gelecek Özellik)

### Expo AV Kullanımı
```typescript
import { Audio } from 'expo-av';

// Ses yükleme
const [sound, setSound] = useState<Audio.Sound>();

async function playSound() {
  const { sound } = await Audio.Sound.createAsync(
    require('./assets/sounds/dog.mp3')
  );
  setSound(sound);
  await sound.playAsync();
}

// Cleanup
useEffect(() => {
  return sound
    ? () => {
        sound.unloadAsync();
      }
    : undefined;
}, [sound]);
```

## 🧪 Test Stratejisi (Gelecek)

### Unit Tests
```typescript
// GameButton.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { GameButton } from './GameButton';

test('calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <GameButton title="Test" onPress={onPress} />
  );
  
  fireEvent.press(getByText('Test'));
  expect(onPress).toHaveBeenCalled();
});
```

## 📱 Platform Specific Code

### Platform Kontrolü
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

// Veya
const padding = Platform.select({
  ios: 20,
  android: 10,
  default: 0,
});
```

## 🐛 Debug İpuçları

### 1. Console Logging
```typescript
// Geliştirme sırasında
console.log('Selected animal:', animalName);

// Production'da kaldırılmalı veya:
if (__DEV__) {
  console.log('Debug info');
}
```

### 2. React DevTools
```bash
# Chrome DevTools ile debug
npm start
# Sonra 'j' tuşuna bas
```

### 3. Expo Go Debug Menu
- iOS: Cmd + D
- Android: Cmd + M (Mac) veya Ctrl + M (Windows)

## 🚀 Build ve Deploy

### Development Build
```bash
npm start
```

### Production Build
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Expo Updates
```bash
# OTA (Over-The-Air) güncelleme
eas update --branch production
```

## 📝 Kod Standartları

### Naming Conventions
- **Components**: PascalCase (GameButton.tsx)
- **Functions**: camelCase (handlePress)
- **Constants**: UPPER_SNAKE_CASE (COLORS, GAMES)
- **Interfaces**: PascalCase + Props suffix (GameButtonProps)

### Yorum Yazma
```typescript
// Türkçe açıklama (Turkish explanation)
// İngilizce açıklama (English explanation)
const handlePress = () => {
  // ...
};
```

## 🔐 Güvenlik Notları

- ❌ API key'leri kodda saklamayın
- ✅ Environment variables kullanın
- ❌ Hassas verileri AsyncStorage'da saklamayın
- ✅ Secure storage kullanın (expo-secure-store)

## 📚 Faydalı Kaynaklar

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

**Son Güncelleme**: 2025-11-17

