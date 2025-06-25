// app/layout.js
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/hooks/useAuth";  // ajuste o caminho se necessário

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = Font.useFonts({
    "DM-Sans": require("../assets/fonts/DM-Sans.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
