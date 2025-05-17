import { Spacer } from "@/components/game-components/Spacer";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Login() {


  return (
    <View
      style={styles.container}
    >
      <Spacer height={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontSize: 40,
    color: "blue",
  },
});
