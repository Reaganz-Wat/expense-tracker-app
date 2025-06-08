import CustomButton from "@/components/game-components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AwesomeButton from "react-native-really-awesome-button";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.42;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

// Game data interface
// interface Game {
//   id: string;
//   title: string;
//   description: string;
//   image: ImageSourcePropType;
//   isAvailable: boolean;
//   color: string;
//   darkColor: string;
//   icon: string;
// }

// // Game data with images, titles, and availability status
// const games: Game[] = [
//   {
//     id: "word-game",
//     title: "Word Puzzle Game",
//     description: "Challenge your vocabulary with fun word puzzles!",
//     image: require("@/assets/images/splash-icon.png"), // Replace with your game image
//     isAvailable: true,
//     color: "#D06B9A", // Pink to match login theme
//     icon: "book-outline"
//   },
//   {
//     id: "memory-match",
//     title: "Memory Match",
//     description: "Test your memory by matching pairs of cards.",
//     image: require("@/assets/images/splash-icon.png"), // Replace with game image
//     isAvailable: false,
//     color: "#5ECBC9", // Teal
//     icon: "copy-outline"
//   },
//   {
//     id: "math-challenge",
//     title: "Math Challenge",
//     description: "Solve math problems against the clock!",
//     image: require("@/assets/images/splash-icon.png"), // Replace with game image
//     isAvailable: false,
//     color: "#2ECC71", // Green
//     icon: "calculator-outline"
//   },
//   {
//     id: "trivia-master",
//     title: "Trivia Master",
//     description: "Test your knowledge across various categories.",
//     image: require("@/assets/images/splash-icon.png"), // Replace with game image
//     isAvailable: false,
//     color: "#8A4FD0", // Purple
//     icon: "help-circle-outline"
//   },
//   {
//     id: "puzzle-slide",
//     title: "Puzzle Slider",
//     description: "Slide tiles to complete the image puzzle.",
//     image: require("@/assets/images/splash-icon.png"), // Replace with game image
//     isAvailable: false,
//     color: "#F93D66", // Red
//     icon: "grid-outline"
//   },
//   {
//     id: "word-scramble",
//     title: "Word Scramble",
//     description: "Unscramble letters to find hidden words.",
//     image: require("@/assets/images/splash-icon.png"), // Replace with game image
//     isAvailable: false,
//     color: "#F0C30F", // Yellow
//     icon: "text-outline"
//   }
// ];


interface Game {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  isAvailable: boolean;
  color: string;
  darkColor: string;
  icon: string;
}

const games: Game[] = [
  {
    id: "word-game",
    title: "Word Puzzle Game",
    description: "Challenge your vocabulary with fun word puzzles!",
    image: require("@/assets/images/splash-icon.png"),
    isAvailable: true,
    color: "#D06B9A", // Pink
    darkColor: "#70344E",
    icon: "book-outline"
  },
  {
    id: "science-survival-quest",
    title: "Science Survival Quest",
    description: "Test your survival skills in a science-themed adventure!",
    image: require("@/assets/images/splash-icon.png"),
    isAvailable: true,
    color: "#5ECBC9", // Teal
    darkColor: "#2E6E6C",
    icon: "copy-outline"
  },
  {
    id: "math-challenge",
    title: "Math Challenge",
    description: "Solve math problems against the clock!",
    image: require("@/assets/images/splash-icon.png"),
    isAvailable: false,
    color: "#2ECC71", // Green
    darkColor: "#1A6639",
    icon: "calculator-outline"
  },
  {
    id: "trivia-master",
    title: "Trivia Master",
    description: "Test your knowledge across various categories.",
    image: require("@/assets/images/splash-icon.png"),
    isAvailable: false,
    color: "#8A4FD0", // Purple
    darkColor: "#4A2770",
    icon: "help-circle-outline"
  },
  {
    id: "puzzle-slide",
    title: "Puzzle Slider",
    description: "Slide tiles to complete the image puzzle.",
    image: require("@/assets/images/splash-icon.png"),
    isAvailable: false,
    color: "#F93D66", // Red
    darkColor: "#801A33",
    icon: "grid-outline"
  },
  {
    id: "word-scramble",
    title: "Word Scramble",
    description: "Unscramble letters to find hidden words.",
    image: require("@/assets/images/splash-icon.png"),
    isAvailable: false,
    color: "#F0C30F", // Yellow
    darkColor: "#665511",
    icon: "text-outline"
  }
];


export default function MainScreen(): JSX.Element {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fadeAnim] = useState<Animated.Value>(new Animated.Value(0));
  const [bounceAnim] = useState<Animated.Value>(new Animated.Value(0));

  // Fade in animation when component mounts
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Function to navigate to selected game
  const navigateToGame = (gameId: string): void => {
    const game = games.find(g => g.id === gameId);
    
    if (game && game.isAvailable) {
      router.push(`/${gameId}`);
    } else if (game) {
      setSelectedGame(game);
      setModalVisible(true);
      
      // Bounce animation for "Coming Soon" modal
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  // Close modal and reset animation
  const closeModal = (): void => {
    setModalVisible(false);
    bounceAnim.setValue(0);
  };

  // Random rotation for game cards to give a slightly uneven, playful look
  const getRandomRotation = (): number => {
    return Math.random() * 4 - 2; // Between -2 and 2 degrees
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hi, Reagan</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#6D4F77" />
        </TouchableOpacity>
      </View>

      {/* Featured Game Banner */}
      <Animated.View 
        style={[
          styles.featuredContainer,
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })}] }
        ]}
      >
        <Image 
          source={require("@/assets/images/splash-icon.png")} 
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredLabel}>FEATURED</Text>
          <Text style={styles.featuredTitle}>Word Puzzle Game</Text>
          <CustomButton 
            label="Play Now" 
            color="#D06B9A" 
            width={150} 
            height={50}
            onPress={() => navigateToGame("word-game")} 
          />
        </View>
      </Animated.View>

      {/* Game Categories */}
      <Text style={styles.sectionTitle}>All Games</Text>
      
      <ScrollView 
        contentContainerStyle={styles.gamesGrid}
        showsVerticalScrollIndicator={false}
      >
        {games.map((game, index) => {
          // Calculate staggered animation delay
          const delay = index * 100;
          
          return (
            <Animated.View 
              key={game.id}
              style={[
                styles.gameCard,
                { 
                  backgroundColor: game.color,
                  transform: [
                    { rotate: `${getRandomRotation()}deg` },
                    { scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1]
                    })},
                  ],
                  opacity: fadeAnim
                }
              ]}
              style={{
                ...styles.gameCardContainer,
                opacity: fadeAnim,
                transform: [
                  { translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })},
                  { scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1]
                  })}
                ] as any // TypeScript fix for transform array
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigateToGame(game.id)}
                style={[styles.gameCard, { backgroundColor: game.color }]}
              >
                <View style={styles.gameIconContainer}>
                  <Ionicons name={game.icon} size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDescription} numberOfLines={2}>
                  {game.description}
                </Text>
                {!game.isAvailable && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>COMING SOON</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Coming Soon Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                transform: [
                  { scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })}
                ]
              }
            ]}
          >
            {selectedGame && (
              <>
                <View style={[styles.modalIconContainer, { backgroundColor: selectedGame.color }]}>
                  <Ionicons name={selectedGame.icon} size={50} color="#FFFFFF" />
                </View>
                <Text style={styles.modalTitle}>{selectedGame.title}</Text>
                <Text style={styles.modalDescription}>{selectedGame.description}</Text>
                <View style={styles.modalDivider} />
                <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
                <Text style={styles.modalMessage}>
                  We're working hard to bring you this exciting new game. 
                  Check back soon for updates!
                </Text>
                {/* <CustomButton 
                  label="Got it" 
                  color={selectedGame.color}
                  width={120}
                  height={50}
                  onPress={closeModal} 
                /> */}
                <AwesomeButton width={120} onPress={closeModal} backgroundColor={selectedGame.color} backgroundDarker={selectedGame.darkColor}>
                  <Text>Got it</Text>
                </AwesomeButton>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="home" size={24} color="#D06B9A" />
          <Text style={[styles.footerButtonText, { color: "#D06B9A" }]}>Games</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="trophy-outline" size={24} color="#9A7AA0" />
          <Text style={styles.footerButtonText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="settings-outline" size={24} color="#9A7AA0" />
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6D4F77",
  },
  profileButton: {
    padding: 5,
  },
  featuredContainer: {
    height: 180,
    margin: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#D06B9A",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.6,
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 15,
  },
  featuredLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "rgba(208, 107, 154, 0.8)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 5,
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6D4F77",
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 90, // Extra space for footer
  },
  gameCardContainer: {
    width: CARD_WIDTH,
    marginBottom: 15,
  },
  gameCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  gameIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  gameTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameDescription: {
    color: "#FFFFFF",
    fontSize: 13,
    opacity: 0.9,
  },
  comingSoonBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6D4F77",
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 16,
    color: "#9A7AA0",
    textAlign: "center",
    marginBottom: 15,
  },
  modalDivider: {
    width: "90%",
    height: 1,
    backgroundColor: "#F0E0F5",
    marginVertical: 10,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D06B9A",
    marginVertical: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#6D4F77",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(208, 107, 154, 0.1)",
    shadowColor: "#D06B9A",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  footerButtonText: {
    fontSize: 12,
    marginTop: 3,
    color: "#9A7AA0",
  },
} as const);