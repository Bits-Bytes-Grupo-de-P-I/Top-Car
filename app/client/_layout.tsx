import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = Font.useFonts({
    "DM-Sans": require("../../assets/fonts/DM-Sans.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack />;
}


// // app/_layout.js
// import { APP_VERSION } from '../env';
// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   if (APP_VERSION === 'admin') {
//     return <Stack screenOptions={{ headerShown: false }} initialRouteName="admin/index" />;
//   } else {
//     return <Stack screenOptions={{ headerShown: false }} initialRouteName="client/index" />;
//   }
// }
