import { useAudioPlayer } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Interface for plants in the game
interface Plant {
  id: number;
  name: string;
  image: any;
  isEdible: boolean;
  cellStructure: string;
  photosynthesis: boolean;
  discovered: boolean;
  x: number;
  y: number;
  health: number; // Added default to new plants
  points: number; // Added default to new plants
  description: string; // Added default to new plants
}

// Interface for game statistics
interface GameStats {
  health: number;
  score: number;
  plantsDiscovered: number;
  energy: number;
  knowledge: number;
  timeLeft: number;
}

// Interface for mini-games (currently only memory, but can be expanded)
interface MiniGame {
  id: number;
  type: 'memory' | 'sequence' | 'quiz'; // Added 'quiz' type
  active: boolean;
  completed: boolean;
}

// Interface for new quiz-style challenges
interface Challenge {
  id: number;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer (0-based)
  explanation: string;
  points: number;
  completed: boolean;
}

// Interface for forest elements (emojis)
interface ForestElement {
  id: number;
  type: 'tree' | 'rock' | 'water';
  emoji: string;
  x: number;
  y: number;
  size: number;
}

const ScienceSurvivalQuestStart: React.FC = () => {
  // Game state management
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'microscope' | 'minigame' | 'victory' | 'gameover' | 'challenge'>('intro');
  const [playerPosition] = useState(new Animated.ValueXY({ x: width/2 - 25, y: height/2 }));
  
  // Animation states
  const [fadeAnim] = useState(new Animated.Value(0)); // Used for intro fade-in
  const [pulseAnim] = useState(new Animated.Value(1)); // Used for pulsating effects
  const [rotateAnim] = useState(new Animated.Value(0)); // Used for plant rotation
  
  // Modals and selections
  const [showMicroscope, setShowMicroscope] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [currentMiniGame, setCurrentMiniGame] = useState<MiniGame | null>(null);
  
  // Game timer
  const [gameTimer, setGameTimer] = useState(180); // 3 minutes
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  // Memory game specific states (kept for potential future use or if user wants to re-add it separately)
  const [memorySequence, setMemorySequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceStep, setSequenceStep] = useState(0);

  // Audio players - Ensure these paths are correct relative to your project structure
  const discoveryPlayer = useAudioPlayer(require('../assets/sounds/game-start.mp3'));
  const errorPlayer = useAudioPlayer(require('../assets/sounds/error.mp3'));
  const backgroundMusicPlayer = useAudioPlayer(require('../assets/sounds/background.mp3'));

  // Game statistics state
  const [stats, setStats] = useState<GameStats>({
    health: 100,
    score: 0,
    plantsDiscovered: 0,
    energy: 100,
    knowledge: 0,
    timeLeft: 180
  });

  // Plants data (UPDATED with user-provided data and default values for missing properties)
  const [plants, setPlants] = useState<Plant[]>([
    {
      id: 1,
      name: "Glowing Fern",
      image: require('../assets/images/berry.png'),
      isEdible: true,
      cellStructure: "Has visible chloroplasts",
      photosynthesis: true,
      discovered: false,
      x: width * 0.2,
      y: height * 0.3,
      health: 20, // Default health
      points: 15, // Default points
      description: "A fern that emits a soft glow, indicating active photosynthesis." // Default description
    },
    {
      id: 2,
      name: "Crystal Moss",
      image: require('../assets/images/vine.png'),
      isEdible: false,
      cellStructure: "Unusual crystalline structure, lacks chloroplasts.",
      photosynthesis: false,
      discovered: false,
      x: width * 0.7,
      y: height * 0.4,
      health: -15, // Default health (negative as it's not edible)
      points: 10, // Default points
      description: "A moss with a beautiful but rigid crystalline structure, indicating it's not a typical plant." // Default description
    },
    {
      id: 3,
      name: "Bio-luminous Leaf",
      image: require('../assets/images/berry.png'),
      isEdible: true,
      cellStructure: "Dense chloroplast clusters, optimized for light capture.",
      photosynthesis: true,
      discovered: false,
      x: width * 0.5,
      y: height * 0.6,
      health: 25, // Default health
      points: 20, // Default points
      description: "A large leaf that glows brightly, suggesting high energy content." // Default description
    },
    {
      id: 4,
      name: "Toxic Vine",
      image: require('../assets/images/vine.png'),
      isEdible: false,
      cellStructure: "Thick cell walls, no chloroplasts, stores toxic compounds.",
      photosynthesis: false,
      discovered: false,
      x: width * 0.3,
      y: height * 0.7,
      health: -20, // Default health (negative)
      points: 10, // Default points
      description: "A thorny vine that appears vibrant but contains harmful toxins." // Default description
    }
  ]);

  // Challenges data (NEW: user-provided challenges)
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Cell Structure Identification",
      question: "Which cellular component is primarily responsible for photosynthesis in plants?",
      options: ["Nucleus", "Mitochondria", "Chloroplasts", "Cell Wall"],
      correctAnswer: 2, // Index 2 is "Chloroplasts"
      explanation: "Chloroplasts contain chlorophyll and are where photosynthesis occurs, converting sunlight into energy.",
      points: 25,
      completed: false
    },
    {
      id: 2,
      title: "Plant vs Animal Cells",
      question: "What structure provides rigid support and is unique to plant cells?",
      options: ["Cell Membrane", "Cytoplasm", "Vacuole", "Cell Wall"],
      correctAnswer: 3, // Index 3 is "Cell Wall"
      explanation: "The cell wall is made of cellulose and provides structural support, protection, and shape to plant cells.",
      points: 30,
      completed: false
    },
    {
      id: 3,
      title: "Food Chain Knowledge",
      question: "In a jungle ecosystem, which organisms are typically the primary producers?",
      options: ["Carnivores", "Herbivores", "Plants", "Decomposers"],
      correctAnswer: 2, // Index 2 is "Plants"
      explanation: "Plants are primary producers because they make their own food through photosynthesis using sunlight.",
      points: 35,
      completed: false
    }
  ]);

  // State for current active challenge and feedback
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeFeedback, setChallengeFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  // Forest elements (emojis for trees, rocks, water)
  const [forestElements, setForestElements] = useState<ForestElement[]>([
    { id: 101, type: 'tree', emoji: '🌳', x: width * 0.05, y: height * 0.15, size: 40 },
    { id: 102, type: 'tree', emoji: '🌲', x: width * 0.9, y: height * 0.2, size: 45 },
    { id: 103, type: 'rock', emoji: '🪨', x: width * 0.25, y: height * 0.45, size: 35 },
    { id: 104, type: 'water', emoji: '🌊', x: width * 0.6, y: height * 0.1, size: 30 },
    { id: 105, type: 'tree', emoji: '🌴', x: width * 0.1, y: height * 0.6, size: 50 },
    { id: 106, type: 'rock', emoji: '🪨', x: width * 0.75, y: height * 0.55, size: 40 },
    { id: 107, type: 'water', emoji: '💧', x: width * 0.35, y: height * 0.18, size: 25 },
    { id: 108, type: 'tree', emoji: '🌳', x: width * 0.5, y: height * 0.85, size: 40 },
    { id: 109, type: 'tree', emoji: '🌲', x: width * 0.65, y: height * 0.38, size: 38 },
    { id: 110, type: 'rock', emoji: '🪨', x: width * 0.08, y: height * 0.35, size: 30 },
    { id: 111, type: 'water', emoji: '💧', x: width * 0.92, y: height * 0.7, size: 28 },
    { id: 112, type: 'tree', emoji: '🌴', x: width * 0.3, y: height * 0.05, size: 45 },
  ]);


  // Initialize game with animations
  useEffect(() => {
    // Fade in animation for intro
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();

    // Continuous pulse animation for buttons/titles
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    );
    pulseAnimation.start();

    // Rotation animation for undiscovered plants
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true
      })
    );
    rotateAnimation.start();

    // Cleanup animations on component unmount
    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  // Game timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            setGameState('gameover'); // Transition to game over if time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear timer if game state is not 'playing'
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]); // Re-run effect when gameState changes

  // Audio cleanup on component unmount
  useEffect(() => {
    return () => {
      try {
        if (backgroundMusicPlayer) {
          backgroundMusicPlayer.pause();
        }
        if (discoveryPlayer) {
          discoveryPlayer.pause();
        }
        if (errorPlayer) {
          errorPlayer.pause();
        }
      } catch (error) {
        console.log('Audio cleanup error:', error);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and unmount

  // Helper function to play sounds
  const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
    try {
      if (player) {
        if (player.playing) {
          player.pause(); // Pause if already playing to restart
        }
        player.seekTo(0); // Go to the beginning of the sound
        player.play();
      }
    } catch (error) {
      console.log('Audio playback error:', error);
    }
  };

  // Function to start the game
  const startGame = () => {
    setGameState('playing'); // Change game state to 'playing'
    setGameTimer(180); // Reset game timer
    playSound(discoveryPlayer); // Play game start sound
    
    // Start background music in a loop
    try {
      if (backgroundMusicPlayer) {
        backgroundMusicPlayer.loop = true; // Set loop property
        backgroundMusicPlayer.play();
      }
    } catch (error) {
      console.log('Background music error:', error);
    }
  };

  // Function to move the player
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    // If energy is too low, player cannot move (no annoying popup)
    if (stats.energy < 5) {
      return;
    }

    const moveDistance = 60; // Distance to move in each step
    let newX = playerPosition.x._value;
    let newY = playerPosition.y._value;

    // Calculate new position based on direction, clamping to screen boundaries
    switch (direction) {
      case 'up':
        newY = Math.max(80, newY - moveDistance); // 80 from top to avoid header
        break;
      case 'down':
        newY = Math.min(height - 200, newY + moveDistance); // 200 from bottom to avoid controls
        break;
      case 'left':
        newX = Math.max(20, newX - moveDistance); // 20 from left edge
        break;
      case 'right':
        newX = Math.min(width - 70, newX + moveDistance); // 70 from right edge (player width + padding)
        break;
    }

    // Animate player movement
    Animated.spring(playerPosition, {
      toValue: { x: newX, y: newY },
      useNativeDriver: false, // Must be false for Animated.ValueXY
      tension: 120, // Spring physics
      friction: 8
    }).start();

    // Consume energy with each move
    setStats(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 3) // Ensure energy doesn't go below 0
    }));

    // Check if player is near any undiscovered plants
    checkForPlantDiscovery(newX, newY);
  };

  // Check for plant discovery based on player's proximity
  const checkForPlantDiscovery = (playerX: number, playerY: number) => {
    plants.forEach((plant, index) => {
      if (!plant.discovered) {
        const distance = Math.sqrt(
          Math.pow(playerX - plant.x, 2) + Math.pow(playerY - plant.y, 2)
        );
        
        if (distance < 80) { // If player is within 80 units of the plant
          discoverPlant(index); // Trigger discovery
        }
      }
    });
  };

  // Handle plant discovery logic
  const discoverPlant = (plantIndex: number) => {
    const plant = plants[plantIndex];
    if (plant.discovered) return; // Prevent re-discovering

    playSound(discoveryPlayer); // Play discovery sound
    
    // Update plant's discovered status in state
    const updatedPlants = [...plants];
    updatedPlants[plantIndex].discovered = true;
    setPlants(updatedPlants);

    // Update game stats based on plant properties
    setStats(prev => ({
      ...prev,
      health: Math.max(0, Math.min(100, prev.health + plant.health)), // Health update, clamped between 0-100
      score: prev.score + plant.points, // Add points
      plantsDiscovered: prev.plantsDiscovered + 1, // Increment discovered plant count
      knowledge: prev.knowledge + (plant.isEdible ? 15 : 10) // Gain knowledge (more for edible plants)
    }));

    // Show an alert with discovery details
    const title = plant.isEdible ? "🌟 Discovery!" : "⚠️ Danger!";
    const message = `${plant.description}\n\nHealth: ${plant.health > 0 ? '+' : ''}${plant.health}\nPoints: +${plant.points}`;

    Alert.alert(title, message, [
      { text: "Analyze 🔬", onPress: () => examineUnderMicroscope(plant) }, // Option to analyze
      { text: "Continue", onPress: () => checkVictoryCondition() } // Option to continue
    ]);
  };

  // Open microscope modal to examine plant details
  const examineUnderMicroscope = (plant: Plant) => {
    setSelectedPlant(plant); // Set the plant to be analyzed
    setShowMicroscope(true); // Show the microscope modal
    setStats(prev => ({ ...prev, knowledge: prev.knowledge + 20 })); // Gain extra knowledge for analysis
    playSound(discoveryPlayer); // Play sound
  };

  // --- Memory Game Logic (Retained but not currently used by "Take Challenge" button) ---
  const startMemoryGame = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const sequence: any = [];
    for (let i = 0; i < 4; i++) {
      sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setMemorySequence(sequence);
    setPlayerSequence([]);
    setCurrentMiniGame({ id: 1, type: 'memory', active: true, completed: false });
    setGameState('minigame');
    setShowingSequence(true);
    setSequenceStep(0);
    
    setTimeout(() => showSequenceStep(0, sequence), 1000);
  };

  const showSequenceStep = (step: number, sequence: string[]) => {
    if (step >= sequence.length) {
      setShowingSequence(false);
      return;
    }
    setSequenceStep(step);
    setTimeout(() => showSequenceStep(step + 1, sequence), 800);
  };

  const handleMemoryInput = (color: string) => {
    if (showingSequence) return;
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    
    if (newPlayerSequence.length === memorySequence.length) {
      const isCorrect = newPlayerSequence.every((color, index) => color === memorySequence[index]);
      
      if (isCorrect) {
        playSound(discoveryPlayer);
        setStats(prev => ({ 
          ...prev, 
          score: prev.score + 50,
          knowledge: prev.knowledge + 30,
          energy: Math.min(100, prev.energy + 20)
        }));
        Alert.alert("🎉 Perfect!", "Sequence memorized correctly! +50 points, +20 energy", [
          { text: "Continue", onPress: () => setGameState('playing') }
        ]);
      } else {
        playSound(errorPlayer);
        setStats(prev => ({ ...prev, health: Math.max(0, prev.health - 15) }));
        Alert.alert("❌ Wrong sequence", "Try again! -15 health", [
          { text: "Retry", onPress: () => {
            setPlayerSequence([]);
            setShowingSequence(true);
            setTimeout(() => showSequenceStep(0, memorySequence), 500);
          }},
          { text: "Skip", onPress: () => setGameState('playing') }
        ]);
      }
    }
  };
  // --- End Memory Game Logic ---

  // --- NEW: Challenge System Logic ---
  const startNextChallenge = () => {
    // Find the first uncompleted challenge
    const nextChallenge = challenges.find(c => !c.completed);
    if (nextChallenge) {
      setCurrentChallenge(nextChallenge); // Set the current challenge
      setChallengeFeedback(null); // Clear previous feedback
      setShowChallengeModal(true); // Show the challenge modal
      setGameState('challenge'); // Change game state to 'challenge'
    } else {
      Alert.alert("No More Challenges!", "You have completed all available challenges. Explore more to find new opportunities!");
    }
  };

  const handleChallengeAnswer = (selectedOptionIndex: number) => {
    if (!currentChallenge) return;

    const isCorrect = selectedOptionIndex === currentChallenge.correctAnswer;
    let message = '';

    setChallenges(prevChallenges =>
      prevChallenges.map(c =>
        c.id === currentChallenge.id ? { ...c, completed: true } : c
      )
    );

    if (isCorrect) {
      playSound(discoveryPlayer);
      message = `✅ Correct! ${currentChallenge.explanation}\n\n+${currentChallenge.points} Score, +20 Knowledge`;
      setStats(prev => ({
        ...prev,
        score: prev.score + currentChallenge.points,
        knowledge: prev.knowledge + 20,
        energy: Math.min(100, prev.energy + 10) // Small energy boost for correct answer
      }));
    } else {
      playSound(errorPlayer);
      message = `❌ Incorrect! ${currentChallenge.explanation}\n\n-10 Health`;
      setStats(prev => ({
        ...prev,
        health: Math.max(0, prev.health - 10) // Lose health for incorrect answer
      }));
    }
    setChallengeFeedback({ message, isCorrect });
  };

  const closeChallengeModal = () => {
    setShowChallengeModal(false);
    setCurrentChallenge(null);
    setChallengeFeedback(null);
    setGameState('playing'); // Return to main game after challenge
    checkVictoryCondition(); // Check victory condition after challenge
  };
  // --- END NEW: Challenge System Logic ---

  // Check victory condition
  const checkVictoryCondition = () => {
    if (stats.score >= 150 && stats.plantsDiscovered >= 4) {
      setTimeout(() => setGameState('victory'), 1000); // Transition to victory after a short delay
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`; // Pad seconds with leading zero if needed
  };

  // Render Intro Screen
  const renderIntro = () => (
    <View style={styles.solidBackground}>
      <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
        <Animated.Text style={[styles.title, { transform: [{ scale: pulseAnim }] }]}>
          🧬 SURVIVAL SCIENTIST
        </Animated.Text>
        <Text style={styles.subtitle}>Cellular Exploration Mission</Text>
        
        <View style={styles.storyBox}>
          <Text style={styles.storyText}>
            🚁 Emergency Landing on Bio-Island!
            {'\n\n'}
            Your research helicopter crashed during a storm. As a cellular biologist, 
            you must use your scientific knowledge to survive while waiting for rescue.
            {'\n\n'}
            🎯 MISSION OBJECTIVES:
            {'\n'}• Discover and analyze 4+ plant species
            {'\n'}• Score 150+ points through exploration  
            {'\n'}• Manage health, energy, and knowledge
            {'\n'}• Complete cellular analysis challenges
            {'\n'}• Survive for 3 minutes until rescue arrives!
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>🚀 BEGIN SURVIVAL MISSION</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );

  // Render Main Game Screen
  const renderGame = () => {
    // Interpolate rotation for undiscovered plants
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <View style={styles.gameContainer}>
        {/* Game Header with Stats */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌿 Bio-Island Survival</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.stat, { color: '#ff6b6b' }]}>❤️ {stats.health}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.stat, { color: '#4ecdc4' }]}>⚡ {stats.energy}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.stat, { color: '#45b7d1' }]}>🧠 {stats.knowledge}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.stat, { color: '#f39c12' }]}>⭐ {stats.score}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.stat, { color: '#e74c3c' }]}>⏰ {formatTime(gameTimer)}</Text>
            </View>
          </View>
        </View>

        {/* Game Area with Forest Elements and Plants */}
        <View style={styles.gameArea}>
          {/* Render forest elements (emojis) */}
          {forestElements.map(element => (
            <View
              key={element.id}
              style={[
                styles.forestElement,
                {
                  left: element.x,
                  top: element.y,
                  width: element.size,
                  height: element.size,
                }
              ]}
            >
              <Text style={{ fontSize: element.size * 0.7 }}>{element.emoji}</Text>
            </View>
          ))}

          {/* Render plants */}
          {plants.map(plant => (
            <Animated.View
              key={plant.id}
              style={[
                styles.plant,
                {
                  left: plant.x,
                  top: plant.y,
                  // Rotate undiscovered plants
                  transform: plant.discovered ? [] : [{ rotate: spin }] 
                }
              ]}
            >
              <TouchableOpacity onPress={() => plant.discovered && examineUnderMicroscope(plant)}>
                <Animated.View style={[
                  styles.plantContainer,
                  { 
                    backgroundColor: plant.discovered ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 193, 7, 0.3)',
                    borderColor: plant.isEdible ? '#4CAF50' : '#f44336',
                    // Scale animation for discovered/undiscovered
                    transform: [{ scale: plant.discovered ? 0.9 : 1.1 }]
                  }
                ]}>
                  <Image source={plant.image} style={styles.plantImage} />
                  {plant.discovered && (
                    <Text style={styles.plantLabel}>{plant.name}</Text>
                  )}
                  {!plant.discovered && (
                    <Text style={styles.unknownLabel}>❓</Text>
                  )}
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Player Character */}
          <Animated.View style={[styles.player, playerPosition.getLayout()]}>
            <View style={styles.playerContainer}>
              <Text style={styles.playerIcon}>🧑‍🔬</Text>
              <View style={styles.playerIndicator} />
            </View>
          </Animated.View>
        </View>

        {/* Game Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.leftControls}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('up')}>
              <Text style={styles.controlText}>⬆️</Text>
            </TouchableOpacity>
            <View style={styles.horizontalControls}>
              <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('left')}>
                <Text style={styles.controlText}>⬅️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('right')}>
                <Text style={styles.controlText}>➡️</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('down')}>
              <Text style={styles.controlText}>⬇️</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.rightControls}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#9b59b6' }]} 
              onPress={startNextChallenge} // NEW: Trigger challenges here
              disabled={challenges.every(c => c.completed)} // Disable if all challenges are completed
            >
              <Text style={styles.actionBtnText}>🧠{'\n'}Take{'\n'}Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            🌱 Plants: {stats.plantsDiscovered}/5 | 🎯 Score: {stats.score}/150
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(100, (stats.score / 150) * 100)}%` }
              ]} 
            />
          </View>
        </View>

        {/* Microscope Modal */}
        <Modal visible={showMicroscope} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.microscopeContainer}>
              <Text style={styles.microscopeTitle}>🔬 Cellular Analysis Lab</Text>
              {selectedPlant && (
                <ScrollView style={styles.analysisScrollView}>
                  <View style={styles.analysisContainer}>
                    <Image source={selectedPlant.image} style={styles.microscopeImage} />
                    <Text style={styles.plantName}>{selectedPlant.name}</Text>
                    
                    <View style={styles.analysisCard}>
                      <Text style={styles.analysisLabel}>🔬 Cell Structure:</Text>
                      <Text style={styles.analysisValue}>{selectedPlant.cellStructure}</Text>
                    </View>
                    
                    <View style={styles.analysisCard}>
                      <Text style={styles.analysisLabel}>🌱 Photosynthesis:</Text>
                      <Text style={[styles.analysisValue, { color: selectedPlant.photosynthesis ? '#4CAF50' : '#f44336' }]}>
                        {selectedPlant.photosynthesis ? '✅ Active - Contains chloroplasts' : '❌ Inactive - No chloroplasts detected'}
                      </Text>
                    </View>
                    
                    <View style={styles.analysisCard}>
                      <Text style={styles.analysisLabel}>⚗️ Safety Analysis:</Text>
                      <Text style={[styles.analysisValue, { color: selectedPlant.isEdible ? '#4CAF50' : '#f44336' }]}>
                        {selectedPlant.isEdible ? '✅ SAFE - Edible compounds detected' : '⚠️ TOXIC - Harmful alkaloids present'}
                      </Text>
                    </View>

                    <View style={styles.analysisCard}>
                      <Text style={styles.analysisLabel}>📋 Scientific Notes:</Text>
                      <Text style={styles.analysisValue}>{selectedPlant.description}</Text>
                    </View>
                  </View>
                </ScrollView>
              )}
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowMicroscope(false)}
              >
                <Text style={styles.closeButtonText}>Complete Analysis</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // Render Mini-Game (Memory Game - currently not used by "Take Challenge")
  const renderMiniGame = () => (
    <View style={styles.solidBackground}>
        <View style={styles.miniGameContainer}>
          <Text style={styles.miniGameTitle}>🧠 Cellular Memory Challenge</Text>
          <Text style={styles.miniGameSubtitle}>
            Remember the sequence of cellular components!
          </Text>
          
          {showingSequence && (
            <View style={styles.sequenceDisplay}>
              <Text style={styles.sequenceText}>Observe the sequence...</Text>
              <Text style={styles.currentStep}>
                Step {sequenceStep + 1} of {memorySequence.length}
              </Text>
            </View>
          )}
          
          {!showingSequence && (
            <View style={styles.sequenceDisplay}>
              <Text style={styles.sequenceText}>Now repeat the sequence!</Text>
              <Text style={styles.playerProgress}>
                {playerSequence.length} / {memorySequence.length}
              </Text>
            </View>
          )}

          <View style={styles.colorGrid}>
            {['red', 'blue', 'green', 'yellow', 'purple'].map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  (showingSequence && memorySequence[sequenceStep] === color) ? styles.activeColor : {},
                ]}
                onPress={() => handleMemoryInput(color)}
                disabled={showingSequence}
              >
                <Text style={styles.colorLabel}>
                  {color === 'red' && '🔴 Nucleus'}
                  {color === 'blue' && '🔵 Cytoplasm'}
                  {color === 'green' && '🟢 Chloroplast'}
                  {color === 'yellow' && '🟡 Vacuole'}
                  {color === 'purple' && '🟣 Mitochondria'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => setGameState('playing')}
          >
            <Text style={styles.skipButtonText}>Skip Challenge</Text>
          </TouchableOpacity>
        </View>
    </View>
  );

  // --- NEW: Render Challenge Modal ---
  const renderChallengeModal = () => (
    <Modal visible={showChallengeModal} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.challengeModalContainer}>
          <Text style={styles.challengeModalTitle}>📚 {currentChallenge?.title}</Text>
          <Text style={styles.challengeQuestion}>{currentChallenge?.question}</Text>
          
          <View style={styles.challengeOptionsContainer}>
            {currentChallenge?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.challengeOptionButton,
                  challengeFeedback && (index === currentChallenge.correctAnswer) ? styles.correctOption : {},
                  challengeFeedback && !challengeFeedback.isCorrect && (index === selectedOptionIndexOnIncorrect) ? styles.incorrectOption : {},
                ]}
                onPress={() => handleChallengeAnswer(index)}
                disabled={!!challengeFeedback} // Disable buttons after an answer is given
              >
                <Text style={styles.challengeOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {challengeFeedback && (
            <View style={styles.challengeFeedbackBox}>
              <Text style={[styles.challengeFeedbackText, { color: challengeFeedback.isCorrect ? '#4CAF50' : '#f44336' }]}>
                {challengeFeedback.message}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={closeChallengeModal}
            disabled={!challengeFeedback} // Only allow closing after feedback is shown
          >
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  // --- END NEW: Render Challenge Modal ---

  // Helper state to store the index of the selected incorrect option
  const [selectedOptionIndexOnIncorrect, setSelectedOptionIndexOnIncorrect] = useState<number | null>(null);
  
  // Update handleChallengeAnswer to store selected incorrect option
  const handleChallengeAnswerWrapper = (selectedOptionIndex: number) => {
    if (!currentChallenge) return;
    const isCorrect = selectedOptionIndex === currentChallenge.correctAnswer;
    if (!isCorrect) {
      setSelectedOptionIndexOnIncorrect(selectedOptionIndex);
    } else {
      setSelectedOptionIndexOnIncorrect(null);
    }
    handleChallengeAnswer(selectedOptionIndex);
  };


  // Render Victory Screen
  const renderVictory = () => (
    <View style={styles.solidBackground}>
      <View style={styles.victoryContainer}>
        <Animated.Text style={[styles.victoryTitle, { transform: [{ scale: pulseAnim }] }]}>
          🎉 MISSION ACCOMPLISHED!
        </Animated.Text>
        
        <View style={styles.victoryStats}>
          <Text style={styles.victoryText}>
            🏆 SURVIVAL REPORT 🏆
            {'\n\n'}
            ⭐ Final Score: {stats.score} points
            {'\n'}❤️ Health Status: {stats.health}%
            {'\n'}🧠 Knowledge Gained: {stats.knowledge} units
            {'\n'}🌱 Species Discovered: {stats.plantsDiscovered}/{plants.length}
            {'\n'}⚡ Energy Remaining: {stats.energy}%
            {'\n\n'}
            🚁 Rescue helicopter inbound!
            {'\n'}Your cellular biology expertise saved your life!
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.restartButton}
          onPress={() => {
            // Reset all game states for a new game
            setGameState('intro');
            setGameTimer(180);
            setStats({
              health: 100,
              score: 0,
              plantsDiscovered: 0,
              energy: 100,
              knowledge: 0,
              timeLeft: 180
            });
            // Reset all plants to undiscovered
            setPlants(prevPlants => prevPlants.map(p => ({ ...p, discovered: false })));
            // Reset all challenges to uncompleted
            setChallenges(prevChallenges => prevChallenges.map(c => ({ ...c, completed: false })));
            backgroundMusicPlayer?.pause(); // Pause music
          }}
        >
          <Text style={styles.restartButtonText}>🔄 New Survival Mission</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Game Over Screen
  const renderGameOver = () => (
    <View style={styles.solidBackground}>
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>⚠️ MISSION FAILED</Text>
        
        <View style={styles.gameOverStats}>
          <Text style={styles.gameOverText}>
            {stats.health <= 0 ? "💀 Health depleted!" : "⏰ Time ran out!"}
            {'\n\n'}
            📊 FINAL REPORT:
            {'\n'}• Score: {stats.score} points
            {'\n'}• Plants Found: {stats.plantsDiscovered}/{plants.length}
            {'\n'}• Knowledge: {stats.knowledge} units
            {'\n'}
            The rescue team couldn't locate you in time.
            Learn from this experience for your next mission!
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            // Reset all game states for a new game
            setGameState('intro');
            setGameTimer(180);
            setStats({
              health: 100,
              score: 0,
              plantsDiscovered: 0,
              energy: 100,
              knowledge: 0,
              timeLeft: 180
            });
            // Reset all plants to undiscovered
            setPlants(prevPlants => prevPlants.map(p => ({ ...p, discovered: false })));
            // Reset all challenges to uncompleted
            setChallenges(prevChallenges => prevChallenges.map(c => ({ ...c, completed: false })));
            backgroundMusicPlayer?.pause(); // Pause music
          }}
        >
          <Text style={styles.retryButtonText}>🔄 Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main rendering logic based on gameState
  return (
    <>
      {(() => {
        switch (gameState) {
          case 'intro': return renderIntro();
          case 'playing': return renderGame();
          case 'minigame': return renderMiniGame(); // Memory game
          case 'victory': return renderVictory();
          case 'gameover': return renderGameOver();
          case 'challenge': return renderGame(); // Render game background while challenge modal is open
          default: return renderIntro();
        }
      })()}
      {showChallengeModal && renderChallengeModal()} {/* Render challenge modal conditionally */}
    </>
  );
};

const styles = StyleSheet.create({
  // Solid background for screens without dynamic game area
  solidBackground: {
    flex: 1,
    backgroundColor: '#1a4f32', // Darker green for a forest feel
  },
  // Container for the main game area (with player, plants, emojis)
  gameContainer: {
    flex: 1,
    backgroundColor: '#2e7d32', // A more vibrant green for the playable area
  },
  // Intro screen container
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent overlay
  },
  // Title text style
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  // Subtitle text style
  subtitle: {
    fontSize: 20,
    color: '#88ffaa',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  // Story box background and border
  storyBox: {
    backgroundColor: 'rgba(0, 50, 25, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  // Story text style
  storyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Start button style
  startButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  // Start button text style
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  // Game header style
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
  },
  // Header title style
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Grid for displaying stats
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  // Individual stat item style
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 10,
    margin: 2,
    minWidth: 60,
  },
  // Stat text style
  stat: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Main game area (where player moves and plants are)
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#2e7d32', // Forest background
  },
  // Style for emoji forest elements
  forestElement: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Plant container (invisible touchable area around image)
  plant: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Plant visual container
  plantContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  // Plant image style
  plantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // Label for discovered plants
  plantLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    position: 'absolute',
    bottom: -15,
    minWidth: 80,
  },
  // Label for undiscovered plants (question mark)
  unknownLabel: {
    fontSize: 24,
    position: 'absolute',
    color: '#fff',
  },
  // Player character container
  player: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  // Player visual representation
  playerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffea00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffc107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  // Player emoji icon
  playerIcon: {
    fontSize: 30,
  },
  // Small indicator on player (e.g., health status)
  playerIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  // Controls container (bottom of screen)
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'transparent', // Transparent background for controls
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  // Left movement controls group
  leftControls: {
    alignItems: 'center',
  },
  // Horizontal movement controls group
  horizontalControls: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  // Individual control button style
  controlBtn: {
    backgroundColor: 'rgba(30, 80, 40, 0.7)', // Semi-transparent dark green
    padding: 15,
    borderRadius: 10,
    margin: 5,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  // Control button text (arrows)
  controlText: {
    fontSize: 24,
    color: '#fff',
  },
  // Right action controls group
  rightControls: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Action button style (e.g., Take Challenge)
  actionBtn: {
    backgroundColor: '#2980b9',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    width: 100,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
  },
  // Action button text style
  actionBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Progress bar container
  progressContainer: {
    position: 'absolute',
    bottom: 180, // Positioned above controls
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  // Progress text style
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  // Progress bar background
  progressBar: {
    height: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    overflow: 'hidden',
  },
  // Progress bar fill
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 5,
  },
  // Modal overlay for background dimming
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  // Microscope modal container
  microscopeContainer: {
    width: '90%',
    backgroundColor: '#2c3e50',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
  },
  // Microscope modal title
  microscopeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
    textAlign: 'center',
  },
  // Scroll view for analysis content
  analysisScrollView: {
    maxHeight: height * 0.6,
    width: '100%',
  },
  // Analysis content container
  analysisContainer: {
    alignItems: 'center',
  },
  // Microscope image (of the plant)
  microscopeImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  // Plant name in microscope modal
  plantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  // Card style for each analysis detail
  analysisCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '95%',
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  // Label for analysis details
  analysisLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#88ffaa',
    marginBottom: 5,
  },
  // Value for analysis details
  analysisValue: {
    fontSize: 15,
    color: '#eee',
    lineHeight: 22,
  },
  // Close button for modals
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // Close button text
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Mini-game container
  miniGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  // Mini-game title
  miniGameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 10,
    textAlign: 'center',
  },
  // Mini-game subtitle
  miniGameSubtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Sequence display for memory game
  sequenceDisplay: {
    marginBottom: 20,
    alignItems: 'center',
  },
  // Sequence text for memory game
  sequenceText: {
    fontSize: 22,
    color: '#f39c12',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Current step text for memory game
  currentStep: {
    fontSize: 18,
    color: '#fff',
  },
  // Player progress text for memory game
  playerProgress: {
    fontSize: 18,
    color: '#fff',
  },
  // Color grid for memory game buttons
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  // Individual color button for memory game
  colorButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  // Active color button (highlighted)
  activeColor: {
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  // Label for color buttons
  colorLabel: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Skip button for mini-games
  skipButton: {
    backgroundColor: '#7f8c8d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  // Skip button text
  skipButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Victory screen container
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  // Victory title
  victoryTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  // Victory stats box
  victoryStats: {
    backgroundColor: 'rgba(0, 50, 25, 0.9)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00ff88',
    marginVertical: 20,
  },
  // Victory text
  victoryText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Restart button
  restartButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // Restart button text
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Game over container
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  // Game over title
  gameOverTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  // Game over stats box
  gameOverStats: {
    backgroundColor: 'rgba(50, 0, 0, 0.9)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e74c3c',
    marginVertical: 20,
  },
  // Game over text
  gameOverText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Retry button
  retryButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // Retry button text
  retryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  // --- NEW CHALLENGE MODAL STYLES ---
  challengeModalContainer: {
    width: '90%',
    backgroundColor: '#2c3e50',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4ecdc4', // Cyan border for challenges
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
  },
  challengeModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 15,
    textAlign: 'center',
  },
  challengeQuestion: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 25,
  },
  challengeOptionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  challengeOptionButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  challengeOptionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  correctOption: {
    borderColor: '#4CAF50', // Green for correct
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  incorrectOption: {
    borderColor: '#f44336', // Red for incorrect
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
  },
  challengeFeedbackBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },
  challengeFeedbackText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ScienceSurvivalQuestStart;
