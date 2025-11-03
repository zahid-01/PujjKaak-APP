import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";

import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Wait a bit for router to be ready
    const timer = setTimeout(() => {
      const currentPath = segments.length > 0 ? segments.join("/") : "";
      const isLoginScreen = currentPath === "login" || segments[0] === "login";

      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        if (!isLoginScreen) {
          router.replace("/login");
        }
      } else {
        // Redirect to home if authenticated and on login screen
        if (isLoginScreen) {
          router.replace("/(tabs)");
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, segments]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E23744" }}>
          <StatusBar style="light" />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Contact" }}
        />
        <Stack.Screen
          name="category/[categoryId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutNav />
      </CartProvider>
    </AuthProvider>
  );
}
