// Run this in React Native Debugger or add to your app temporarily
import AsyncStorage from '@react-native-async-storage/async-storage';

async function clearAuthStorage() {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
  console.log('Auth storage cleared!');
}

clearAuthStorage();
