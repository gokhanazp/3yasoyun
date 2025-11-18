// Ana uygulama dosyası (Main application file)
// Navigation yapısı ve ekranların bağlandığı yer

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

// Ekranlar (Screens)
import { HomeScreen } from './src/screens/HomeScreen';
import { ColorGameScreen } from './src/screens/ColorGameScreen';
import { AnimalSoundsScreen } from './src/screens/AnimalSoundsScreen';
import { ShapeMatchingScreen } from './src/screens/ShapeMatchingScreen';
import { NumberGameScreen } from './src/screens/NumberGameScreen';
import { FruitGameScreen } from './src/screens/FruitGameScreen';
import { BalloonPopScreen } from './src/screens/BalloonPopScreen';

// Navigation tipleri (Navigation types)
import { RootStackParamList } from './src/types/navigation';

// Stack Navigator oluştur (Create Stack Navigator)
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false, // Başlıkları gizle (Hide headers)
            }}
          >
            {/* Ana menü ekranı (Home screen) */}
            <Stack.Screen name="Home" component={HomeScreen} />

            {/* Oyun ekranları (Game screens) */}
            <Stack.Screen name="ColorGame" component={ColorGameScreen} />
            <Stack.Screen name="AnimalSounds" component={AnimalSoundsScreen} />
            <Stack.Screen name="ShapeMatching" component={ShapeMatchingScreen} />
            <Stack.Screen name="NumberGame" component={NumberGameScreen} />
            <Stack.Screen name="FruitGame" component={FruitGameScreen} />
            <Stack.Screen name="BalloonPop" component={BalloonPopScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
