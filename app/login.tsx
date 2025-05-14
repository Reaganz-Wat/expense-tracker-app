import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.textStyle}>Sign Up Page</Text>
      </View>
    </>
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
  }
});
