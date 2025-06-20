import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="main-screen" options={{headerShown: false}}/>
        <Stack.Screen name="word-game" options={{headerShown: false}}/>
        <Stack.Screen name="science-survival-quest" options={{headerShown: false}}/>
        <Stack.Screen name="science-survival-quest-start" options={{headerShown: false}}/>
        <Stack.Screen name="forgot-password"/>
        <Stack.Screen name="sign-up"/>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
