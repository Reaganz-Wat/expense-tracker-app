import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    PanResponder,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Types
interface Word {
  id: string;
  original: string;
  jumbled: string;
  readAloud: boolean;
}

interface Sentence {
  id: string;
  text: string;
  words: Word[];
  level: number;
}

interface Letter {
  id: string;
  char: string;
  placed: boolean;
}

interface Position {
  x: number;
  y: number;
}

// Initial game data
const GAME_DATA: Sentence[] = [
  {
    id: '1',
    text: 'The cat sat on the mat',
    words: [
      { id: '1_1', original: 'The', jumbled: 'ehT', readAloud: true },
      { id: '1_2', original: 'cat', jumbled: 'tca', readAloud: true },
      { id: '1_3', original: 'sat', jumbled: 'tas', readAloud: true },
      { id: '1_4', original: 'on', jumbled: 'no', readAloud: true },
      { id: '1_5', original: 'the', jumbled: 'eht', readAloud: true },
      { id: '1_6', original: 'mat', jumbled: 'tam', readAloud: true },
    ],
    level: 1,
  },
  {
    id: '2',
    text: 'I can see a dog',
    words: [
      { id: '2_1', original: 'I', jumbled: 'I', readAloud: true },
      { id: '2_2', original: 'can', jumbled: 'acn', readAloud: true },
      { id: '2_3', original: 'see', jumbled: 'ese', readAloud: true },
      { id: '2_4', original: 'a', jumbled: 'a', readAloud: true },
      { id: '2_5', original: 'dog', jumbled: 'ogd', readAloud: true },
    ],
    level: 1,
  },
  {
    id: '3',
    text: 'The sun is shining bright',
    words: [
      { id: '3_1', original: 'The', jumbled: 'ehT', readAloud: true },
      { id: '3_2', original: 'sun', jumbled: 'uns', readAloud: true },
      { id: '3_3', original: 'is', jumbled: 'si', readAloud: true },
      { id: '3_4', original: 'shining', jumbled: 'gninish', readAloud: true },
      { id: '3_5', original: 'bright', jumbled: 'thgirb', readAloud: true },
    ],
    level: 2,
  },
];

// Main Component
const WordGame: React.FC = () => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentLetters, setCurrentLetters] = useState<Letter[]>([]);
  const [placedLetters, setPlacedLetters] = useState<Letter[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameMode, setGameMode] = useState<'sentence' | 'word'>('sentence');
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // References for animations
  const positions = useRef<{ [key: string]: Position }>({});
  const animations = useRef<{ [key: string]: Animated.ValueXY }>({});
  const panResponders = useRef<{ [key: string]: any }>({});

  // Initialize the game
  useEffect(() => {
    if (gameStarted) {
      startNewWord();
    }
  }, [currentWordIndex, currentSentenceIndex, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentSentenceIndex(0);
    setCurrentWordIndex(0);
    setScore(0);
    readCurrentSentence();
  };

  const readCurrentSentence = () => {
    const currentSentence = GAME_DATA[currentSentenceIndex];
    Speech.speak(currentSentence.text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const readCurrentWord = () => {
    const currentWord = GAME_DATA[currentSentenceIndex].words[currentWordIndex];
    Speech.speak(currentWord.original, {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const startNewWord = () => {
    if (!gameStarted) return;

    const currentSentence = GAME_DATA[currentSentenceIndex];
    if (!currentSentence) return;

    const currentWord = currentSentence.words[currentWordIndex];
    if (!currentWord) return;

    // Reset the state for the new word
    setIsCorrect(null);
    setPlacedLetters([]);

    // Initialize the jumbled letters
    const letters: Letter[] = currentWord.jumbled.split('').map((char, index) => ({
      id: `${currentWord.id}_${index}`,
      char,
      placed: false,
    }));

    setCurrentLetters(letters);

    // Initialize animations and pan responders for each letter
    letters.forEach((letter) => {
      animations.current[letter.id] = new Animated.ValueXY();
      positions.current[letter.id] = { x: 0, y: 0 };

      panResponders.current[letter.id] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          animations.current[letter.id].setOffset({
            x: animations.current[letter.id].x._value,
            y: animations.current[letter.id].y._value,
          });
          animations.current[letter.id].setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event(
          [null, { dx: animations.current[letter.id].x, dy: animations.current[letter.id].y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, gesture) => {
          animations.current[letter.id].flattenOffset();

          // Check if the letter is dragged to the answer area
          const dropZoneY = 300; // Y position of the drop zone
          const dropZoneHeight = 80; // Height of the drop zone

          if (gesture.moveY > dropZoneY && gesture.moveY < dropZoneY + dropZoneHeight) {
            // Calculate position in the answer area
            const placedIndex = placedLetters.length;
            const newX = placedIndex * 40;

            Animated.spring(animations.current[letter.id], {
              toValue: { x: newX - positions.current[letter.id].x, y: dropZoneY - positions.current[letter.id].y },
              friction: 5,
              useNativeDriver: false,
            }).start();

            // Mark the letter as placed
            const updatedLetters = currentLetters.map((l) =>
              l.id === letter.id ? { ...l, placed: true } : l
            );
            setCurrentLetters(updatedLetters);

            // Add to placed letters
            setPlacedLetters([...placedLetters, letter]);

            // Check if all letters are placed to verify the answer
            if (placedLetters.length + 1 === currentWord.original.length) {
              setTimeout(checkAnswer, 500);
            }
          } else {
            // Return to original position if not dropped in the answer area
            Animated.spring(animations.current[letter.id], {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: false,
            }).start();
          }
        },
      });
    });

    // Read the current word aloud
    if (currentWord.readAloud) {
      readCurrentWord();
    }
  };

  const checkAnswer = () => {
    const currentWord = GAME_DATA[currentSentenceIndex].words[currentWordIndex];
    const userAnswer = placedLetters.map((letter) => letter.char).join('');

    if (userAnswer.toLowerCase() === currentWord.original.toLowerCase()) {
      setIsCorrect(true);
      setScore(score + 10);
      playCorrectSound();
      
      // Move to next word or sentence
      setTimeout(() => {
        if (currentWordIndex < GAME_DATA[currentSentenceIndex].words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
        } else {
          if (currentSentenceIndex < GAME_DATA.length - 1) {
            setCurrentSentenceIndex(currentSentenceIndex + 1);
            setCurrentWordIndex(0);
            setTimeout(readCurrentSentence, 1000);
          } else {
            // Game completed
            Alert.alert(
              "Game Completed!",
              `Congratulations! You've completed the game with a score of ${score + 10}.`,
              [{ text: "Play Again", onPress: () => startGame() }]
            );
          }
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      playIncorrectSound();
      
      // Reset the placement after a delay
      setTimeout(() => {
        resetPlacement();
      }, 1500);
    }
  };

  const resetPlacement = () => {
    // Reset all letters
    setPlacedLetters([]);
    setIsCorrect(null);

    const updatedLetters = currentLetters.map((letter) => ({ ...letter, placed: false }));
    setCurrentLetters(updatedLetters);

    // Reset animations
    Object.keys(animations.current).forEach((key) => {
      Animated.spring(animations.current[key], {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }).start();
    });
  };

  const playCorrectSound = () => {
    // In a real app you would use something like react-native-sound
    // For now we'll just use console.log as a placeholder
    console.log("Playing correct sound");
  };

  const playIncorrectSound = () => {
    console.log("Playing incorrect sound");
  };

  const renderLetter = (letter: Letter, index: number) => {
    if (letter.placed) return null;

    return (
      <Animated.View
        key={letter.id}
        style={[
          styles.letterContainer,
          {
            transform: animations.current[letter.id]?.getTranslateTransform() || [{ translateX: 0 }, { translateY: 0 }],
          },
        ]}
        {...(panResponders.current[letter.id]?.panHandlers || {})}
      >
        <Text style={styles.letterText}>{letter.char}</Text>
      </Animated.View>
    );
  };

  const renderPlacedLetters = () => {
    return (
      <View style={styles.placedLettersContainer}>
        {placedLetters.map((letter, index) => (
          <View key={`placed_${letter.id}`} style={styles.placedLetterContainer}>
            <Text style={styles.placedLetterText}>{letter.char}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderGameStatus = () => {
    const currentWord = GAME_DATA[currentSentenceIndex]?.words[currentWordIndex];
    
    if (!currentWord) return null;
    
    return (
      <View style={styles.gameStatusContainer}>
        <TouchableOpacity style={styles.speakerButton} onPress={readCurrentWord}>
          <Text style={styles.speakerButtonText}>🔊</Text>
        </TouchableOpacity>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
        
        {isCorrect !== null && (
          <View style={[styles.feedbackContainer, isCorrect ? styles.correctFeedback : styles.incorrectFeedback]}>
            <Text style={styles.feedbackText}>
              {isCorrect ? "Correct! 🎉" : "Try Again! 🔄"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderLettersPlacement = () => {
    return (
      <>
        <View style={styles.answerContainer}>
          {renderPlacedLetters()}
          {Array(currentLetters.length - placedLetters.length)
            .fill(0)
            .map((_, index) => (
              <View key={`empty_${index}`} style={styles.emptyLetterSlot} />
            ))}
        </View>
        
        <View style={styles.lettersContainer}>
          {currentLetters.map(renderLetter)}
        </View>
      </>
    );
  };

  const renderStartScreen = () => {
    return (
      <View style={styles.startScreenContainer}>
        <Text style={styles.gameTitleText}>Word Scramble</Text>
        <Text style={styles.gameDescriptionText}>
          Listen to words and arrange the jumbled letters in the correct order!
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!gameStarted ? (
        renderStartScreen()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Word Game - Level {GAME_DATA[currentSentenceIndex]?.level || 1}
            </Text>
          </View>
          
          <View style={styles.sentenceContainer}>
            <Text style={styles.sentenceText}>
              {GAME_DATA[currentSentenceIndex]?.text || ""}
            </Text>
            <TouchableOpacity style={styles.speakerButton} onPress={readCurrentSentence}>
              <Text style={styles.speakerButtonText}>🔊</Text>
            </TouchableOpacity>
          </View>
          
          {renderGameStatus()}
          {renderLettersPlacement()}
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Word {currentWordIndex + 1} of {GAME_DATA[currentSentenceIndex]?.words.length}
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sentenceContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sentenceText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  gameStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedbackContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  correctFeedback: {
    backgroundColor: '#4caf50',
  },
  incorrectFeedback: {
    backgroundColor: '#f44336',
  },
  feedbackText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  answerContainer: {
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 30,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placedLettersContainer: {
    flexDirection: 'row',
  },
  placedLetterContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  placedLetterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyLetterSlot: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  letterContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#ff9800',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  speakerButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4caf50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  startScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameTitleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 20,
  },
  gameDescriptionText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default WordGame;