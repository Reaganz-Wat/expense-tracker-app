import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeButton from "react-native-really-awesome-button";

const { width, height } = Dimensions.get("window");

interface LoginCredentials {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (error) setError(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = (): boolean => {
    if (!credentials.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!credentials.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Successfully logged in
      router.push("/main-screen");
    }, 1500);
  };

  const moveToForgotPassword = () => {
    // Navigate to forgot password screen
    router.push("/forgot-password");
  };

  const moveToSignUp = () => {
    // Navigate to sign up screen
    router.push("/sign-up");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* <Text style={styles.logoText}>GAME TITLE</Text> */}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#9A7AA0"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9A7AA0"
              value={credentials.username}
              onChangeText={(text) => handleInputChange("username", text)}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9A7AA0"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#9A7AA0"
              secureTextEntry={!passwordVisible}
              value={credentials.password}
              onChangeText={(text) => handleInputChange("password", text)}
            />
            <TouchableOpacity
              style={styles.passwordVisibilityButton}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9A7AA0"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={moveToForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <AwesomeButton
              width={270}
              backgroundColor="#D06B9A"
              backgroundDarker="#66133a"
              onPress={handleLogin}
            >
              {isLoading ? "Logging in..." : "LOGIN"}
            </AwesomeButton>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={moveToSignUp}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0.0</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F9", // Light background with a subtle pink tint
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6D4F77", // Deep purple-pink that complements pink
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(208, 107, 154, 0.15)", // Subtle pink border
    shadowColor: "#D06B9A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6D4F77",
    textAlign: "center",
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 87, 87, 0.1)",
    borderWidth: 1,
    borderColor: "#FF5757",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "#FF5757",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5EEF5", // Very light pink/purple background
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(208, 107, 154, 0.2)",
  },
  inputIcon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: "#6D4F77",
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordVisibilityButton: {
    position: "absolute",
    right: 15,
    padding: 5,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#9A7AA0", // Muted purple that complements pink
    fontSize: 14,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#6D4F77",
    fontSize: 14,
  },
  signupButtonText: {
    color: "#D06B9A", // Pink color for emphasis
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    color: "#9A7AA0",
    fontSize: 12,
  },
});
