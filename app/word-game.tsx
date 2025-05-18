// import * as Speech from "expo-speech";
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
//   PanGestureHandlerGestureEvent,
// } from "react-native-gesture-handler";
// import Animated, {
//   runOnJS,
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated";

// import AwesomeButton from "react-native-really-awesome-button";

// const { width } = Dimensions.get("window");

// interface DraggableLetterProps {
//   letter: string;
//   onDrop: (letter: string, dropX: number, dropY: number) => void;
//   index: number;
//   isSource?: boolean;
// }

// const DraggableLetter: React.FC<DraggableLetterProps> = ({
//   letter,
//   onDrop,
//   index,
//   isSource = true,
// }) => {
//   const x = useSharedValue(0);
//   const y = useSharedValue(0);
//   const isActive = useSharedValue(false);

//   const gestureHandler =
//     useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
//       onStart: () => {
//         isActive.value = true;
//       },
//       onActive: (event) => {
//         x.value = event.translationX;
//         y.value = event.translationY;
//       },
//       onEnd: (event) => {
//         isActive.value = false;
//         runOnJS(onDrop)(letter, event.absoluteX, event.absoluteY);
//         if (isSource) {
//           x.value = withSpring(0);
//           y.value = withSpring(0);
//         }
//       },
//     });

//   const animatedStyle = useAnimatedStyle(() => {
//     const zIndex = isActive.value ? 100 : 1;
//     const scale = isActive.value ? 1.1 : 1;

//     return {
//       transform: [{ translateX: x.value }, { translateY: y.value }, { scale }],
//       zIndex,
//     };
//   });

//   return (
//     <PanGestureHandler onGestureEvent={gestureHandler}>
//       <Animated.View style={[styles.letterContainer, animatedStyle]}>
//         <Text style={styles.letterText}>{letter}</Text>
//       </Animated.View>
//     </PanGestureHandler>
//   );
// };

// interface WordGameState {
//   word: string;
//   shuffled: string[];
//   dropped: string[];
//   score: number;
// }

// const WordGame: React.FC = () => {
//   const words = [
//     "HELLO",
//     "WORLD",
//     "REACT",
//     "NATIVE",
//     "GAME",
//     "PUZZLE",
//     "CODING",
//     "SPEECH",
//   ];

//   const [gameState, setGameState] = useState<WordGameState>({
//     word: "",
//     shuffled: [],
//     dropped: [],
//     score: 0,
//   });

//   const dropZonePosition = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });

//   // Initialize game with first word
//   useEffect(() => {
//     loadNextWord();
//   }, []);

//   const shuffleWord = (word: string): string[] => {
//     const letters = word.split("");
//     for (let i = letters.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [letters[i], letters[j]] = [letters[j], letters[i]];
//     }
//     return letters;
//   };

//   const loadNextWord = () => {
//     const randomIndex = Math.floor(Math.random() * words.length);
//     const nextWord = words[randomIndex];

//     setGameState({
//       word: nextWord,
//       shuffled: shuffleWord(nextWord),
//       dropped: [],
//       score: gameState.score,
//     });

//     // Speak the word
//     Speech.speak(`Arrange the letters to form the word: ${nextWord}`, {
//       language: "en",
//       pitch: 1.0,
//       rate: 0.8,
//     });
//   };

//   const checkWin = (dropped: string[]) => {
//     const formedWord = dropped.join("");
//     if (formedWord === gameState.word) {
//       const newScore = gameState.score + 1;
//       setGameState((prev) => ({
//         ...prev,
//         score: newScore,
//       }));

//       // Celebrate the win
//       Speech.speak(`Excellent! You formed the word ${formedWord} correctly!`, {
//         language: "en",
//         pitch: 1.2,
//         rate: 0.9,
//       });

//       // Show alert before moving to next word
//       Alert.alert(
//         "Great job!",
//         `You formed the word ${formedWord} correctly! Score: ${newScore}`,
//         [{ text: "Next Word", onPress: loadNextWord }]
//       );
//     }
//   };

//   const handleDrop = (letter: string, dropX: number, dropY: number) => {
//     const { x, y, width, height } = dropZonePosition.value;
//     const isInDropZone =
//       dropX >= x && dropX <= x + width && dropY >= y && dropY <= y + height;

//     if (isInDropZone) {
//       // Remove from shuffled letters
//       const newShuffled = [...gameState.shuffled];
//       const letterIndex = newShuffled.indexOf(letter);
//       if (letterIndex !== -1) {
//         newShuffled.splice(letterIndex, 1);

//         // Add to dropped letters
//         const newDropped = [...gameState.dropped, letter];

//         setGameState((prev) => ({
//           ...prev,
//           shuffled: newShuffled,
//           dropped: newDropped,
//         }));

//         // Check if word is complete
//         if (newDropped.length === gameState.word.length) {
//           checkWin(newDropped);
//         }
//       }
//     }
//   };

//   const handleReturnToSource = (letter: string, index: number) => {
//     // Remove from dropped letters
//     const newDropped = [...gameState.dropped];
//     newDropped.splice(index, 1);

//     // Add back to shuffled letters
//     const newShuffled = [...gameState.shuffled, letter];

//     setGameState((prev) => ({
//       ...prev,
//       shuffled: newShuffled,
//       dropped: newDropped,
//     }));
//   };

//   const handleLayout = (event: any) => {
//     const { x, y, width, height } = event.nativeEvent.layout;
//     dropZonePosition.value = { x, y, width, height };
//   };

//   const speakCurrentWord = () => {
//     Speech.speak(gameState.word, {
//       language: "en",
//       pitch: 1.0,
//       rate: 0.8,
//     });
//   };

//   return (
//     <ScrollView style={{ flex: 1, marginTop: 30 }}>
//       <GestureHandlerRootView>
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Word Game</Text>
//             <Text style={styles.score}>Score: {gameState.score}</Text>
//           </View>

//           <AwesomeButton
//             style={styles.speakButton}
//             backgroundColor="#9b59b6"
//             backgroundDarker="#502063"
//             width={145}
//             onPress={speakCurrentWord}
//           >
//             <Text style={styles.speakButtonText}>🔊 Speak Word</Text>
//           </AwesomeButton>

//           <View style={styles.lettersContainer}>
//             {gameState.shuffled.map((letter, index) => (
//               <DraggableLetter
//                 key={`source-${index}-${letter}`}
//                 letter={letter}
//                 onDrop={handleDrop}
//                 index={index}
//                 isSource
//               />
//             ))}
//           </View>

//           <View style={styles.dropZone} onLayout={handleLayout}>
//             <Text style={styles.dropZoneText}>
//               Drop letters here to form:{" "}
//               {gameState.word
//                 .split("")
//                 .map(() => "_")
//                 .join(" ")}
//             </Text>
//             <View style={styles.wordContainer}>
//               {gameState.dropped.map((letter, index) => (
//                 <TouchableOpacity
//                   key={`dropped-${index}-${letter}`}
//                   onPress={() => handleReturnToSource(letter, index)}
//                 >
//                   <View style={styles.droppedLetterContainer}>
//                     <Text style={styles.letterText}>{letter}</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* <TouchableOpacity style={styles.resetButton} onPress={loadNextWord}>
//             <Text style={styles.resetButtonText}>Skip/Next Word</Text>
//           </TouchableOpacity> */}

//           <AwesomeButton style={styles.resetButton} backgroundColor="#e67e22" backgroundDarker="#754316" onPress={loadNextWord}>
//             <Text style={styles.resetButtonText}>Skip/Next Word</Text>
//           </AwesomeButton>

//         </View>
//       </GestureHandlerRootView>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   score: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#2ecc71",
//   },
//   speakButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     alignSelf: "center",
//     marginBottom: 20,
//   },
//   speakButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   lettersContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     flexWrap: "wrap",
//     marginBottom: 30,
//     paddingHorizontal: 20,
//     minHeight: 70,
//   },
//   letterContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#3498db",
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   droppedLetterContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#e74c3c",
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   letterText: {
//     fontSize: 24,
//     color: "white",
//     fontWeight: "bold",
//   },
//   dropZone: {
//     flex: 1,
//     borderWidth: 2,
//     borderColor: "#7f8c8d",
//     borderRadius: 10,
//     padding: 20,
//     backgroundColor: "#ecf0f1",
//   },
//   dropZoneText: {
//     fontSize: 18,
//     color: "#7f8c8d",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   wordContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     minHeight: 60,
//   },
//   resetButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     alignSelf: "center",
//     marginTop: 20,
//   },
//   resetButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default WordGame;
















import { lottiJson } from "@/assets/confetti";
import * as Speech from "expo-speech";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import AwesomeButton from "react-native-really-awesome-button";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Fireworks animation JSON (you can replace this with your own)
const fireworksAnimation = {
  "v": "5.5.7",
  "fr": 30,
  "ip": 0,
  "op": 90,
  "w": 400,
  "h": 400,
  "nm": "Firework",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Firework",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            {
              "i": {"x": [0.833], "y": [0.833]},
              "o": {"x": [0.167], "y": [0.167]},
              "t": 0,
              "s": [0]
            },
            {
              "i": {"x": [0.833], "y": [0.833]},
              "o": {"x": [0.167], "y": [0.167]},
              "t": 10,
              "s": [100]
            },
            {
              "t": 80,
              "s": [0]
            }
          ],
          "ix": 11
        },
        "r": {
          "a": 0,
          "k": 0,
          "ix": 10
        },
        "p": {
          "a": 0,
          "k": [200, 200, 0],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [0, 0, 0],
          "ix": 1
        },
        "s": {
          "a": 1,
          "k": [
            {
              "i": {"x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833]},
              "o": {"x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167]},
              "t": 0,
              "s": [0, 0, 100]
            },
            {
              "t": 80,
              "s": [200, 200, 100]
            }
          ],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": {"a": 0, "k": [300, 300], "ix": 2},
              "p": {"a": 0, "k": [0, 0], "ix": 3},
              "nm": "Ellipse Path 1",
              "mn": "ADBE Vector Shape - Ellipse",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 1,
                "k": [
                  {
                    "i": {"x": [0.833], "y": [0.833]},
                    "o": {"x": [0.167], "y": [0.167]},
                    "t": 0,
                    "s": [1, 0, 0, 1]
                  },
                  {
                    "i": {"x": [0.833], "y": [0.833]},
                    "o": {"x": [0.167], "y": [0.167]},
                    "t": 30,
                    "s": [1, 1, 0, 1]
                  },
                  {
                    "t": 60,
                    "s": [0, 1, 0, 1]
                  }
                ],
                "ix": 3
              },
              "o": {"a": 0, "k": 100, "ix": 4},
              "w": {"a": 0, "k": 4, "ix": 5},
              "lc": 1,
              "lj": 1,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0], "ix": 2},
              "a": {"a": 0, "k": [0, 0], "ix": 1},
              "s": {"a": 0, "k": [100, 100], "ix": 3},
              "r": {"a": 0, "k": 0, "ix": 6},
              "o": {"a": 0, "k": 100, "ix": 7},
              "sk": {"a": 0, "k": 0, "ix": 4},
              "sa": {"a": 0, "k": 0, "ix": 5},
              "nm": "Transform"
            }
          ],
          "nm": "Ellipse 1",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sr",
              "sy": 1,
              "d": 1,
              "pt": {"a": 0, "k": 8, "ix": 3},
              "p": {"a": 0, "k": [0, 0], "ix": 4},
              "r": {"a": 0, "k": 0, "ix": 5},
              "ir": {"a": 0, "k": 50, "ix": 6},
              "is": {"a": 0, "k": 0, "ix": 8},
              "or": {"a": 0, "k": 100, "ix": 7},
              "os": {"a": 0, "k": 0, "ix": 9},
              "ix": 1,
              "nm": "Polystar Path 1",
              "mn": "ADBE Vector Shape - Star",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 1,
                "k": [
                  {
                    "i": {"x": [0.833], "y": [0.833]},
                    "o": {"x": [0.167], "y": [0.167]},
                    "t": 0,
                    "s": [0, 0, 1, 1]
                  },
                  {
                    "i": {"x": [0.833], "y": [0.833]},
                    "o": {"x": [0.167], "y": [0.167]},
                    "t": 30,
                    "s": [1, 0, 1, 1]
                  },
                  {
                    "t": 60,
                    "s": [0, 1, 1, 1]
                  }
                ],
                "ix": 3
              },
              "o": {"a": 0, "k": 100, "ix": 4},
              "w": {"a": 0, "k": 4, "ix": 5},
              "lc": 1,
              "lj": 1,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0], "ix": 2},
              "a": {"a": 0, "k": [0, 0], "ix": 1},
              "s": {"a": 0, "k": [100, 100], "ix": 3},
              "r": {
                "a": 1,
                "k": [
                  {
                    "i": {"x": [0.833], "y": [0.833]},
                    "o": {"x": [0.167], "y": [0.167]},
                    "t": 0,
                    "s": [0]
                  },
                  {
                    "t": 89,
                    "s": [360]
                  }
                ],
                "ix": 6
              },
              "o": {"a": 0, "k": 100, "ix": 7},
              "sk": {"a": 0, "k": 0, "ix": 4},
              "sa": {"a": 0, "k": 0, "ix": 5},
              "nm": "Transform"
            }
          ],
          "nm": "Star 1",
          "np": 3,
          "cix": 2,
          "bm": 0,
          "ix": 2,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 90,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

const fireW = lottiJson

interface DraggableLetterProps {
  letter: string;
  onDrop: (letter: string, dropX: number, dropY: number) => void;
  index: number;
  isSource?: boolean;
}

const DraggableLetter: React.FC<DraggableLetterProps> = ({
  letter,
  onDrop,
  index,
  isSource = true,
}) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const isActive = useSharedValue(false);
  const scale = useSharedValue(1);

  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: () => {
        isActive.value = true;
        scale.value = withTiming(1.1, { duration: 200 });
      },
      onActive: (event) => {
        x.value = event.translationX;
        y.value = event.translationY;
      },
      onEnd: (event) => {
        isActive.value = false;
        scale.value = withTiming(1, { duration: 200 });
        runOnJS(onDrop)(letter, event.absoluteX, event.absoluteY);
        if (isSource) {
          x.value = withSpring(0);
          y.value = withSpring(0);
        }
      },
    });

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isActive.value ? 100 : 1;

    return {
      transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
      zIndex,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.letterContainer, animatedStyle]}>
        <Text style={styles.letterText}>{letter}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

interface WordGameState {
  word: string;
  shuffled: string[];
  dropped: string[];
  score: number;
  lives: number;
  wordsCompleted: number;
  totalWords: number;
  attempts: number;
  wordsHistory: {word: string, completed: boolean}[];
}

const WordGame: React.FC = () => {
  const words = [
    "HELLO",
    "WORLD",
    "REACT",
    "NATIVE",
    "GAME",
    "PUZZLE",
    "CODING",
    "SPEECH",
  ];

  const [gameState, setGameState] = useState<WordGameState>({
    word: "",
    shuffled: [],
    dropped: [],
    score: 0,
    lives: 3,
    wordsCompleted: 0,
    totalWords: words.length,
    attempts: 0,
    wordsHistory: [],
  });

  const [showResults, setShowResults] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const lottieRef = useRef<LottieView>(null);
  const dropZonePosition = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  const [usedWords, setUsedWords] = useState<string[]>([]);

  // Initialize game with first word
  useEffect(() => {
    loadNextWord();
  }, []);

  const shuffleWord = (word: string): string[] => {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  };

  const getRandomWord = () => {
    // Get words that haven't been used yet
    const availableWords = words.filter(word => !usedWords.includes(word));
    
    // If all words have been used, reset the used words list (except the last word)
    if (availableWords.length === 0) {
      const lastWord = usedWords[usedWords.length - 1];
      setUsedWords([lastWord]);
      return words.filter(word => word !== lastWord)[Math.floor(Math.random() * (words.length - 1))];
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  };

  const loadNextWord = () => {
    if (gameState.wordsCompleted >= words.length) {
      showGameResults();
      return;
    }

    const nextWord = getRandomWord();
    
    // Add to used words
    setUsedWords(prev => [...prev, nextWord]);
    
    setGameState(prev => ({
      ...prev,
      word: nextWord,
      shuffled: shuffleWord(nextWord),
      dropped: [],
      attempts: 0,
    }));

    // Speak the word
    Speech.speak(`Arrange the letters to form the word: ${nextWord}`, {
      language: "en",
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const showGameResults = () => {
    setShowResults(true);
    setShowFireworks(true);
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const checkWord = (dropped: string[]) => {
    const formedWord = dropped.join("");
    setGameState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
    }));
    
    if (formedWord === gameState.word) {
      handleCorrectWord(formedWord);
    } else {
      handleIncorrectWord(formedWord);
    }
  };

  const handleCorrectWord = (formedWord: string) => {
    // Calculate score based on word length and attempts
    const baseScore = formedWord.length * 10;
    const attemptPenalty = Math.max(0, (gameState.attempts - 1) * 2);
    const wordScore = Math.max(baseScore - attemptPenalty, formedWord.length * 5);
    
    const newScore = gameState.score + wordScore;
    const newWordsCompleted = gameState.wordsCompleted + 1;
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      score: newScore,
      wordsCompleted: newWordsCompleted,
      wordsHistory: [...prev.wordsHistory, {word: formedWord, completed: true}],
    }));

    // Celebrate the win
    Speech.speak(`Excellent! You formed the word ${formedWord} correctly!`, {
      language: "en",
      pitch: 1.2,
      rate: 0.9,
    });

    // Show small fireworks
    setShowFireworks(true);
    setTimeout(() => {
      setShowFireworks(false);
    }, 2000);

    // Show alert before moving to next word
    Alert.alert(
      "Great job!",
      `You formed the word ${formedWord} correctly!\nScore: +${wordScore}\nTotal Score: ${newScore}`,
      [{ text: "Next Word", onPress: () => {
        if (newWordsCompleted >= words.length) {
          showGameResults();
        } else {
          loadNextWord();
        }
      }}]
    );
  };

  const handleIncorrectWord = (formedWord: string) => {
    // Check remaining lives
    if (gameState.lives > 1) {
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
      }));
      
      // Provide feedback
      Speech.speak(`That's not quite right. Try again! You have ${gameState.lives - 1} lives remaining.`, {
        language: "en",
        pitch: 0.9,
        rate: 0.8,
      });
      
      Alert.alert(
        "Not quite right",
        `"${formedWord}" is not correct. Try again!\nLives remaining: ${gameState.lives - 1}`,
        [{ text: "Try Again", onPress: () => {
          // Reset dropped letters but keep shuffled
          setGameState(prev => ({
            ...prev,
            dropped: [],
            shuffled: [...prev.shuffled, ...prev.dropped],
          }));
        }}]
      );
    } else {
      // Game over - no more lives
      setGameState(prev => ({
        ...prev,
        lives: 0,
        wordsHistory: [...prev.wordsHistory, {word: gameState.word, completed: false}],
      }));
      
      Speech.speak(`Game over! The word was ${gameState.word}.`, {
        language: "en",
        pitch: 0.8,
        rate: 0.8,
      });
      
      setGameOver(true);
      
      Alert.alert(
        "Game Over!",
        `You've run out of lives. The word was "${gameState.word}".\nFinal Score: ${gameState.score}`,
        [{ text: "See Results", onPress: showGameResults }]
      );
    }
  };

  const handleDrop = (letter: string, dropX: number, dropY: number) => {
    const { x, y, width, height } = dropZonePosition.value;
    const isInDropZone =
      dropX >= x && dropX <= x + width && dropY >= y && dropY <= y + height;

    if (isInDropZone) {
      // Remove from shuffled letters
      const newShuffled = [...gameState.shuffled];
      const letterIndex = newShuffled.indexOf(letter);
      if (letterIndex !== -1) {
        newShuffled.splice(letterIndex, 1);

        // Add to dropped letters
        const newDropped = [...gameState.dropped, letter];

        setGameState((prev) => ({
          ...prev,
          shuffled: newShuffled,
          dropped: newDropped,
        }));

        // Check if word is complete
        if (newDropped.length === gameState.word.length) {
          checkWord(newDropped);
        }
      }
    }
  };

  const handleReturnToSource = (letter: string, index: number) => {
    // Remove from dropped letters
    const newDropped = [...gameState.dropped];
    newDropped.splice(index, 1);

    // Add back to shuffled letters
    const newShuffled = [...gameState.shuffled, letter];

    setGameState((prev) => ({
      ...prev,
      shuffled: newShuffled,
      dropped: newDropped,
    }));
  };

  const handleLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    dropZonePosition.value = { x, y, width, height };
  };

  const speakCurrentWord = () => {
    Speech.speak(gameState.word, {
      language: "en",
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const showHintModal = () => {
    setShowHint(true);
    
    // Show first letter as hint
    Speech.speak(`The word starts with the letter ${gameState.word[0]}`, {
      language: "en",
      pitch: 1.0,
      rate: 0.8,
    });
    
    setTimeout(() => {
      setShowHint(false);
    }, 3000);
  };

  const restartGame = () => {
    setGameState({
      word: "",
      shuffled: [],
      dropped: [],
      score: 0,
      lives: 3,
      wordsCompleted: 0,
      totalWords: words.length,
      attempts: 0,
      wordsHistory: [],
    });
    setUsedWords([]);
    setShowResults(false);
    setGameOver(false);
    loadNextWord();
  };

  const renderResultsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showResults}
      onRequestClose={() => setShowResults(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Game Results</Text>
          
          <Text style={styles.resultText}>Final Score: {gameState.score}</Text>
          <Text style={styles.resultText}>Words Completed: {gameState.wordsCompleted}/{words.length}</Text>
          <Text style={styles.resultText}>Lives Remaining: {gameState.lives}</Text>
          
          <Text style={styles.wordHistoryTitle}>Word History:</Text>
          <ScrollView style={styles.wordHistoryContainer}>
            {gameState.wordsHistory.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={[styles.historyWord, item.completed ? styles.completedWord : styles.failedWord]}>
                  {item.word} {item.completed ? "✓" : "✗"}
                </Text>
              </View>
            ))}
          </ScrollView>
          
          <AwesomeButton
            style={styles.playAgainButton}
            backgroundColor="#27ae60"
            backgroundDarker="#1e8449"
            width={200}
            onPress={() => {
              setShowResults(false);
              restartGame();
            }}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </AwesomeButton>
        </View>
      </View>
    </Modal>
  );

  const renderHintModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showHint}
    >
      <View style={styles.hintModalOverlay}>
        <View style={styles.hintModalContent}>
          <Text style={styles.hintText}>Hint: The word starts with "{gameState.word[0]}"</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={{ flex: 1, marginTop: 30 }}>
      <GestureHandlerRootView>
        <View style={styles.container}>
          {showFireworks && (
            <View style={styles.fireworksContainer}>
              <LottieView
                ref={lottieRef}
                source={lottiJson}
                autoPlay
                loop={showResults}
                style={styles.fireworks}
              />
            </View>
          )}
          
          <View style={styles.header}>
            <Text style={styles.title}>Word Game</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{gameState.score}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Lives</Text>
              <Text style={styles.statValue}>
                {"❤️".repeat(gameState.lives)}
                {"🖤".repeat(3 - gameState.lives)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Words</Text>
              <Text style={styles.statValue}>{gameState.wordsCompleted}/{words.length}</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <AwesomeButton
              backgroundColor="#9b59b6"
              backgroundDarker="#502063"
              width={150}
              onPress={speakCurrentWord}
            >
              <Text style={styles.buttonText}>🔊 Speak Word</Text>
            </AwesomeButton>
            
            <AwesomeButton
              backgroundColor="#3498db"
              backgroundDarker="#2980b9"
              width={150}
              onPress={showHintModal}
            >
              <Text style={styles.buttonText}>💡 Get Hint</Text>
            </AwesomeButton>
          </View>

          <View style={styles.lettersContainer}>
            {gameState.shuffled.map((letter, index) => (
              <DraggableLetter
                key={`source-${index}-${letter}`}
                letter={letter}
                onDrop={handleDrop}
                index={index}
                isSource
              />
            ))}
          </View>

          <View style={styles.dropZone} onLayout={handleLayout}>
            <Text style={styles.dropZoneText}>
              Drop letters here to form:{" "}
              {gameState.word
                .split("")
                .map(() => "_")
                .join(" ")}
            </Text>
            <View style={styles.wordContainer}>
              {gameState.dropped.map((letter, index) => (
                <TouchableOpacity
                  key={`dropped-${index}-${letter}`}
                  onPress={() => handleReturnToSource(letter, index)}
                >
                  <View style={styles.droppedLetterContainer}>
                    <Text style={styles.letterText}>{letter}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <AwesomeButton 
            style={styles.resetButton} 
            backgroundColor="#e67e22" 
            backgroundDarker="#754316" 
            width={200}
            onPress={loadNextWord}
            disabled={gameOver}
          >
            <Text style={styles.buttonText}>Skip/Next Word</Text>
          </AwesomeButton>
          
          {gameOver && (
            <AwesomeButton 
              style={styles.restartButton} 
              backgroundColor="#27ae60" 
              backgroundDarker="#1e8449" 
              width={200}
              onPress={restartGame}
            >
              <Text style={styles.buttonText}>Start New Game</Text>
            </AwesomeButton>
          )}
        </View>
        
        {renderResultsModal()}
        {renderHintModal()}
      </GestureHandlerRootView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#ecf0f1",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  lettersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 30,
    paddingHorizontal: 20,
    minHeight: 70,
  },
  letterContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  droppedLetterContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  letterText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  dropZone: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#7f8c8d",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#ecf0f1",
    minHeight: 150,
  },
  dropZoneText: {
    fontSize: 18,
    color: "#7f8c8d",
    marginBottom: 20,
    textAlign: "center",
  },
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    minHeight: 60,
  },
  resetButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  restartButton: {
    marginTop: 15,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  resultText: {
    fontSize: 18,
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  wordHistoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 15,
    marginBottom: 10,
  },
  wordHistoryContainer: {
    maxHeight: 200,
    width: "100%",
    marginBottom: 20,
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  historyWord: {
    fontSize: 18,
    textAlign: "center",
  },
  completedWord: {
    color: "#27ae60",
  },
  failedWord: {
    color: "#e74c3c",
  },
  playAgainButton: {
    marginTop: 10,
  },
  hintModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  hintModalContent: {
    backgroundColor: "#f39c12",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hintText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  fireworksContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    pointerEvents: "none",
  },
  fireworks: {
    width: 600,
    height: 600,
  },
});

export default WordGame;