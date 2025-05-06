import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  

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
