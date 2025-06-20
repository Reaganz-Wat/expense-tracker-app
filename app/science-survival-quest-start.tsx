// import { challenges, plants } from '@/components/data';
// import { useAudioPlayer } from 'expo-audio';
// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   Image,
//   ImageBackground,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// const { width, height } = Dimensions.get('window');

// export interface Plant {
//   id: number;
//   name: string;
//   image: any;
//   isEdible: boolean;
//   cellStructure: string;
//   photosynthesis: boolean;
//   discovered: boolean;
//   x: number;
//   y: number;
// }

// export interface GameStats {
//   health: number;
//   score: number;
//   plantsDiscovered: number;
//   challengesCompleted: number;
//   inventory: string[];
// }

// export interface Challenge {
//   id: number;
//   title: string;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
//   points: number;
//   completed: boolean;
// }

// const ScienceSurvivalQuestStart: React.FC = () => {
//   const [gameState, setGameState] = useState<'intro' | 'playing' | 'challenge' | 'microscope' | 'victory'>('intro');
//   const [playerPosition] = useState(new Animated.ValueXY({ x: width/2 - 25, y: height/2 }));
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [pulseAnim] = useState(new Animated.Value(1));
//   const [showMicroscope, setShowMicroscope] = useState(false);
//   const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
//   const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);

//   // Audio players
//   const discoveryPlayer = useAudioPlayer(require('../assets/sounds/game-start.mp3'));
//   const errorPlayer = useAudioPlayer(require('../assets/sounds/error.mp3'));
//   const backgroundMusicPlayer = useAudioPlayer(require('../assets/sounds/background.mp3'));

//   // Game state
//   const [stats, setStats] = useState<GameStats>({
//     health: 100,
//     score: 0,
//     plantsDiscovered: 0,
//     challengesCompleted: 0,
//     inventory: []
//   });


//   // Initialize game
//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true
//     }).start();

//     // Start pulsing animation
//     const pulseAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.1,
//           duration: 1000,
//           useNativeDriver: true
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true
//         })
//       ])
//     );
//     pulseAnimation.start();

//     // Start background music
//     if (backgroundMusicPlayer) {
//       backgroundMusicPlayer.loop = true;
//       backgroundMusicPlayer.play();
//     }

//     return () => {
//       backgroundMusicPlayer?.pause();
//       pulseAnimation.stop();
//     };
//   }, []);

//   const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
//     if (player) {
//       player.seekTo(0);
//       player.play();
//     }
//   };

//   const startGame = () => {
//     setGameState('playing');
//     playSound(discoveryPlayer);
//   };

//   const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
//     const moveDistance = 50;
//     let newX = playerPosition.x._value;
//     let newY = playerPosition.y._value;

//     switch (direction) {
//       case 'up':
//         newY = Math.max(50, newY - moveDistance);
//         break;
//       case 'down':
//         newY = Math.min(height - 150, newY + moveDistance);
//         break;
//       case 'left':
//         newX = Math.max(20, newX - moveDistance);
//         break;
//       case 'right':
//         newX = Math.min(width - 70, newX + moveDistance);
//         break;
//     }

//     Animated.spring(playerPosition, {
//       toValue: { x: newX, y: newY },
//       useNativeDriver: false,
//       tension: 100,
//       friction: 8
//     }).start();

//     // Check for plant discoveries
//     checkForPlantDiscovery(newX, newY);
//   };

//   const checkForPlantDiscovery = (playerX: number, playerY: number) => {
//     plants.forEach((plant, index) => {
//       if (!plant.discovered) {
//         const distance = Math.sqrt(
//           Math.pow(playerX - plant.x, 2) + Math.pow(playerY - plant.y, 2)
//         );
        
//         if (distance < 60) {
//           discoverPlant(index);
//         }
//       }
//     });
//   };

//   const discoverPlant = (plantIndex: number) => {
//     const plant = plants[plantIndex];
//     if (plant.discovered) return;

//     playSound(discoveryPlayer);
    
//     const updatedPlants = [...plants];
//     updatedPlants[plantIndex].discovered = true;
//     setPlants(updatedPlants);

//     const healthChange = plant.isEdible ? 20 : -15;
//     const scoreChange = plant.isEdible ? 15 : 5;

//     setStats(prev => ({
//       ...prev,
//       health: Math.max(0, Math.min(100, prev.health + healthChange)),
//       score: prev.score + scoreChange,
//       plantsDiscovered: prev.plantsDiscovered + 1,
//       inventory: [...prev.inventory, plant.name]
//     }));

//     Alert.alert(
//       plant.isEdible ? "🌟 Discovery!" : "⚠️ Caution!",
//       plant.isEdible 
//         ? `You found ${plant.name}! It's safe to consume. +20 Health, +15 Points`
//         : `You found ${plant.name}! It appears toxic. -15 Health but you gained knowledge. +5 Points`,
//       [
//         { text: "Examine under Microscope", onPress: () => examineUnderMicroscope(plant) },
//         { text: "Continue Exploring", onPress: () => {} }
//       ]
//     );
//   };

//   const examineUnderMicroscope = (plant: Plant) => {
//     setSelectedPlant(plant);
//     setShowMicroscope(true);
//     playSound(discoveryPlayer);
//   };

//   const startChallenge = (challenge: Challenge) => {
//     if (stats.plantsDiscovered < 2) {
//       Alert.alert("Not Ready!", "Discover at least 2 plants before attempting challenges!");
//       return;
//     }
//     setCurrentChallenge(challenge);
//     setGameState('challenge');
//   };

//   const answerChallenge = (selectedOption: number) => {
//     if (!currentChallenge) return;

//     const isCorrect = selectedOption === currentChallenge.correctAnswer;
    
//     if (isCorrect) {
//       playSound(discoveryPlayer);
//       setStats(prev => ({
//         ...prev,
//         score: prev.score + currentChallenge.points,
//         challengesCompleted: prev.challengesCompleted + 1
//       }));
      
//       Alert.alert(
//         "🎉 Correct!",
//         `${currentChallenge.explanation}\n\n+${currentChallenge.points} Points!`,
//         [{ text: "Continue", onPress: () => setGameState('playing') }]
//       );
//     } else {
//       playSound(errorPlayer);
//       setStats(prev => ({
//         ...prev,
//         health: Math.max(0, prev.health - 10)
//       }));
      
//       Alert.alert(
//         "❌ Incorrect",
//         `${currentChallenge.explanation}\n\n-10 Health. Try again!`,
//         [{ text: "Try Again", onPress: () => setGameState('playing') }]
//       );
//     }

//     // Check for victory condition
//     if (stats.score + currentChallenge.points >= 100 && stats.plantsDiscovered >= 3) {
//       setTimeout(() => setGameState('victory'), 1000);
//     }
//   };

//   const renderIntro = () => (
//     <ImageBackground 
//       source={require('../assets/images/jungle.gif')} 
//       style={styles.container}
//       blurRadius={2}
//     >
//       <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
//         <Animated.Text style={[styles.title, { transform: [{ scale: pulseAnim }] }]}>
//           🧬 SCIENCE SURVIVAL QUEST
//         </Animated.Text>
//         <Text style={styles.subtitle}>Level 1: Jungle of Cells</Text>
        
//         <View style={styles.storyBox}>
//           <Text style={styles.storyText}>
//             You've crash-landed on a mysterious science island! 🏝️
//             {'\n\n'}
//             As a stranded scientist, you must use your biological knowledge to survive.
//             {'\n\n'}
//             🔍 Explore the jungle and discover plants
//             {'\n'}🧬 Examine cell structures under microscope
//             {'\n'}🧠 Answer science challenges to gain points
//             {'\n'}❤️ Maintain your health by finding edible plants
//           </Text>
//         </View>

//         <TouchableOpacity style={styles.startButton} onPress={startGame}>
//           <Text style={styles.startButtonText}>🚀 START SURVIVAL MISSION</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </ImageBackground>
//   );

//   const renderGame = () => (
//     <ImageBackground source={require('../assets/images/jungle.gif')} style={styles.container}>
//       {/* Header with stats */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>🌿 Jungle of Cells</Text>
//         <View style={styles.statsContainer}>
//           <Text style={styles.stat}>❤️ {stats.health}</Text>
//           <Text style={styles.stat}>⭐ {stats.score}</Text>
//           <Text style={styles.stat}>🌱 {stats.plantsDiscovered}/4</Text>
//         </View>
//       </View>

//       {/* Game area with plants */}
//       <View style={styles.gameArea}>
//         {plants.map(plant => (
//           <Animated.View
//             key={plant.id}
//             style={[
//               styles.plant,
//               {
//                 left: plant.x,
//                 top: plant.y,
//                 opacity: plant.discovered ? 0.7 : 1,
//                 transform: [{ scale: plant.discovered ? 0.8 : 1 }]
//               }
//             ]}
//           >
//             <TouchableOpacity onPress={() => plant.discovered && examineUnderMicroscope(plant)}>
//               <Image source={plant.image} style={styles.plantImage} />
//               {plant.discovered && (
//                 <Text style={styles.plantLabel}>{plant.name}</Text>
//               )}
//             </TouchableOpacity>
//           </Animated.View>
//         ))}

//         {/* Player */}
//         <Animated.View style={[styles.player, playerPosition.getLayout()]}>
//           <Text style={styles.playerIcon}>🧑‍🔬</Text>
//         </Animated.View>
//       </View>

//       {/* Movement controls */}
//       <View style={styles.controls}>
//         <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('up')}>
//           <Text style={styles.controlText}>⬆️</Text>
//         </TouchableOpacity>
//         <View style={styles.horizontalControls}>
//           <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('left')}>
//             <Text style={styles.controlText}>⬅️</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('right')}>
//             <Text style={styles.controlText}>➡️</Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('down')}>
//           <Text style={styles.controlText}>⬇️</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Challenges */}
//       <ScrollView horizontal style={styles.challengesContainer} showsHorizontalScrollIndicator={false}>
//         {challenges.map(challenge => (
//           <TouchableOpacity
//             key={challenge.id}
//             style={[
//               styles.challengeCard,
//               { opacity: stats.plantsDiscovered >= 2 ? 1 : 0.5 }
//             ]}
//             onPress={() => startChallenge(challenge)}
//             disabled={stats.plantsDiscovered < 2}
//           >
//             <Text style={styles.challengeTitle}>{challenge.title}</Text>
//             <Text style={styles.challengePoints}>🏆 {challenge.points} pts</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Microscope Modal */}
//       <Modal visible={showMicroscope} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.microscopeContainer}>
//             <Text style={styles.microscopeTitle}>🔬 Microscope Analysis</Text>
//             {selectedPlant && (
//               <View style={styles.analysisContainer}>
//                 <Image source={selectedPlant.image} style={styles.microscopeImage} />
//                 <Text style={styles.plantName}>{selectedPlant.name}</Text>
//                 <Text style={styles.analysisText}>
//                   Cell Structure: {selectedPlant.cellStructure}
//                 </Text>
//                 <Text style={styles.analysisText}>
//                   Photosynthesis: {selectedPlant.photosynthesis ? '✅ Active' : '❌ Inactive'}
//                 </Text>
//                 <Text style={styles.analysisText}>
//                   Safety: {selectedPlant.isEdible ? '✅ Edible' : '⚠️ Toxic'}
//                 </Text>
//               </View>
//             )}
//             <TouchableOpacity 
//               style={styles.closeButton} 
//               onPress={() => setShowMicroscope(false)}
//             >
//               <Text style={styles.closeButtonText}>Close Microscope</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ImageBackground>
//   );

//   const renderChallenge = () => (
//     <View style={styles.container}>
//       <ImageBackground 
//         source={require('../assets/images/berry.png')} 
//         style={styles.challengeBackground}
//         blurRadius={1}
//       >
//         <View style={styles.challengeContainer}>
//           <Text style={styles.challengeHeader}>🧠 {currentChallenge?.title}</Text>
//           <Text style={styles.challengeQuestion}>{currentChallenge?.question}</Text>
          
//           <View style={styles.optionsContainer}>
//             {currentChallenge?.options.map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.optionButton}
//                 onPress={() => answerChallenge(index)}
//               >
//                 <Text style={styles.optionText}>{option}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <TouchableOpacity 
//             style={styles.backButton} 
//             onPress={() => setGameState('playing')}
//           >
//             <Text style={styles.backButtonText}>← Back to Jungle</Text>
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>
//     </View>
//   );

//   const renderVictory = () => (
//     <ImageBackground 
//       source={require('../assets/images/berry.png')} 
//       style={styles.container}
//       blurRadius={2}
//     >
//       <View style={styles.victoryContainer}>
//         <Text style={styles.victoryTitle}>🎉 MISSION ACCOMPLISHED!</Text>
//         <Text style={styles.victoryText}>
//           Congratulations, Scientist! You've mastered the Jungle of Cells!
//           {'\n\n'}
//           🏆 Final Score: {stats.score}
//           {'\n'}❤️ Health: {stats.health}
//           {'\n'}🌱 Plants Discovered: {stats.plantsDiscovered}/4
//           {'\n'}🧠 Challenges Completed: {stats.challengesCompleted}
//           {'\n\n'}
//           You're ready for the next level: River of Reactions! 🧪
//         </Text>
        
//         <TouchableOpacity style={styles.nextLevelButton}>
//           <Text style={styles.nextLevelButtonText}>➡️ Continue to Chemistry Level</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.restartButton}
//           onPress={() => {
//             setGameState('intro');
//             setStats({
//               health: 100,
//               score: 0,
//               plantsDiscovered: 0,
//               challengesCompleted: 0,
//               inventory: []
//             });
//             setPlants(plants.map(p => ({ ...p, discovered: false })));
//           }}
//         >
//           <Text style={styles.restartButtonText}>🔄 Play Again</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );

//   // Main render
//   switch (gameState) {
//     case 'intro': return renderIntro();
//     case 'playing': return renderGame();
//     case 'challenge': return renderChallenge();
//     case 'victory': return renderVictory();
//     default: return renderIntro();
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1a4d3a',
//   },
//   introContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 10,
//     textShadowColor: '#000',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#88ffaa',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   storyBox: {
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 30,
//     borderColor: '#00ff88',
//     borderWidth: 2,
//   },
//   storyText: {
//     fontSize: 16,
//     color: '#ffffff',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   startButton: {
//     backgroundColor: '#00ff88',
//     paddingHorizontal: 30,
//     paddingVertical: 15,
//     borderRadius: 25,
//     elevation: 5,
//     shadowColor: '#00ff88',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   startButtonText: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     borderBottomColor: '#00ff88',
//     borderBottomWidth: 2,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#00ff88',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     gap: 15,
//   },
//   stat: {
//     fontSize: 16,
//     color: '#ffffff',
//     fontWeight: 'bold',
//   },
//   gameArea: {
//     flex: 1,
//     position: 'relative',
//   },
//   plant: {
//     position: 'absolute',
//     alignItems: 'center',
//   },
//   plantImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   plantLabel: {
//     fontSize: 10,
//     color: '#ffffff',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 4,
//     borderRadius: 4,
//     marginTop: 2,
//   },
//   player: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   playerIcon: {
//     fontSize: 30,
//   },
//   controls: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   controlBtn: {
//     backgroundColor: '#00ff88',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: 5,
//   },
//   controlText: {
//     fontSize: 20,
//   },
//   horizontalControls: {
//     flexDirection: 'row',
//   },
//   challengesContainer: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     paddingVertical: 10,
//   },
//   challengeCard: {
//     backgroundColor: '#2a5f4a',
//     padding: 15,
//     borderRadius: 10,
//     marginHorizontal: 10,
//     minWidth: 150,
//     borderColor: '#00ff88',
//     borderWidth: 1,
//   },
//   challengeTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 5,
//   },
//   challengePoints: {
//     fontSize: 12,
//     color: '#00ff88',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   microscopeContainer: {
//     backgroundColor: '#1a4d3a',
//     padding: 20,
//     borderRadius: 15,
//     width: width * 0.9,
//     borderColor: '#00ff88',
//     borderWidth: 2,
//   },
//   microscopeTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   analysisContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   microscopeImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   plantName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 10,
//   },
//   analysisText: {
//     fontSize: 16,
//     color: '#ffffff',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   closeButton: {
//     backgroundColor: '#00ff88',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   challengeBackground: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   challengeContainer: {
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     margin: 20,
//     padding: 20,
//     borderRadius: 15,
//     borderColor: '#00ff88',
//     borderWidth: 2,
//   },
//   challengeHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   challengeQuestion: {
//     fontSize: 18,
//     color: '#ffffff',
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 24,
//   },
//   optionsContainer: {
//     marginBottom: 20,
//   },
//   optionButton: {
//     backgroundColor: '#2a5f4a',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     borderColor: '#00ff88',
//     borderWidth: 1,
//   },
//   optionText: {
//     color: '#ffffff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   backButton: {
//     backgroundColor: '#ff6b6b',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   backButtonText: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//   },
//   victoryContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//   },
//   victoryTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   victoryText: {
//     fontSize: 16,
//     color: '#ffffff',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 30,
//   },
//   nextLevelButton: {
//     backgroundColor: '#00ff88',
//     paddingHorizontal: 30,
//     paddingVertical: 15,
//     borderRadius: 25,
//     marginBottom: 15,
//   },
//   nextLevelButtonText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   restartButton: {
//     backgroundColor: '#6c5ce7',
//     paddingHorizontal: 30,
//     paddingVertical: 15,
//     borderRadius: 25,
//   },
//   restartButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ScienceSurvivalQuestStart;












































// import { useAudioPlayer } from 'expo-audio';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   Image,
//   ImageBackground,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const { width, height } = Dimensions.get('window');

// interface Plant {
//   id: number;
//   name: string;
//   image: any;
//   isEdible: boolean;
//   cellStructure: string;
//   photosynthesis: boolean;
//   discovered: boolean;
//   x: number;
//   y: number;
//   health: number;
//   points: number;
//   description: string;
// }

// interface GameStats {
//   health: number;
//   score: number;
//   plantsDiscovered: number;
//   energy: number;
//   knowledge: number;
//   timeLeft: number;
// }

// interface MiniGame {
//   id: number;
//   type: 'memory' | 'sequence' | 'quiz';
//   active: boolean;
//   completed: boolean;
// }

// const ScienceSurvivalQuestStart: React.FC = () => {
//   const [gameState, setGameState] = useState<'intro' | 'playing' | 'microscope' | 'minigame' | 'victory' | 'gameover'>('intro');
//   const [playerPosition] = useState(new Animated.ValueXY({ x: width/2 - 25, y: height/2 }));
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [pulseAnim] = useState(new Animated.Value(1));
//   const [rotateAnim] = useState(new Animated.Value(0));
//   const [showMicroscope, setShowMicroscope] = useState(false);
//   const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
//   const [currentMiniGame, setCurrentMiniGame] = useState<MiniGame | null>(null);
//   const [gameTimer, setGameTimer] = useState(180); // 3 minutes
//   const timerRef = useRef<NodeJS.Timeout | number | null>(null);

//   // Memory game states
//   const [memorySequence, setMemorySequence] = useState<string[]>([]);
//   const [playerSequence, setPlayerSequence] = useState<string[]>([]);
//   const [showingSequence, setShowingSequence] = useState(false);
//   const [sequenceStep, setSequenceStep] = useState(0);

//   // Audio players
//   const discoveryPlayer = useAudioPlayer(require('../assets/sounds/game-start.mp3'));
//   const errorPlayer = useAudioPlayer(require('../assets/sounds/error.mp3'));
//   const backgroundMusicPlayer = useAudioPlayer(require('../assets/sounds/background.mp3'));

//   // Game state
//   const [stats, setStats] = useState<GameStats>({
//     health: 100,
//     score: 0,
//     plantsDiscovered: 0,
//     energy: 100,
//     knowledge: 0,
//     timeLeft: 180
//   });

//   // Interactive plants with better mechanics
//   const [plants, setPlants] = useState<Plant[]>([
//     {
//       id: 1,
//       name: "Luminous Moss",
//       image: require('../assets/images/berry.png'),
//       isEdible: true,
//       cellStructure: "Dense chloroplast clusters with bioluminescent proteins",
//       photosynthesis: true,
//       discovered: false,
//       x: width * 0.15,
//       y: height * 0.25,
//       health: 25,
//       points: 20,
//       description: "Glows softly in darkness, rich in nutrients"
//     },
//     {
//       id: 2,
//       name: "Crystal Vine",
//       image: require('../assets/images/vine.png'),
//       isEdible: false,
//       cellStructure: "Mineralized cell walls, no chloroplasts",
//       photosynthesis: false,
//       discovered: false,
//       x: width * 0.8,
//       y: height * 0.3,
//       health: -20,
//       points: 15,
//       description: "Beautiful but toxic, crystalline structure"
//     },
//     {
//       id: 3,
//       name: "Energy Berry",
//       image: require('../assets/images/berry.png'),
//       isEdible: true,
//       cellStructure: "High-density chloroplasts, sugar-rich vacuoles",
//       photosynthesis: true,
//       discovered: false,
//       x: width * 0.4,
//       y: height * 0.6,
//       health: 30,
//       points: 25,
//       description: "Bursting with natural sugars and energy"
//     },
//     {
//       id: 4,
//       name: "Poison Spore",
//       image: require('../assets/images/vine.png'),
//       isEdible: false,
//       cellStructure: "Thick cell walls, toxic alkaloid storage",
//       photosynthesis: false,
//       discovered: false,
//       x: width * 0.7,
//       y: height * 0.7,
//       health: -30,
//       points: 10,
//       description: "Releases toxic spores when disturbed"
//     },
//     {
//       id: 5,
//       name: "Healing Leaf",
//       image: require('../assets/images/berry.png'),
//       isEdible: true,
//       cellStructure: "Modified chloroplasts with medicinal compounds",
//       photosynthesis: true,
//       discovered: false,
//       x: width * 0.2,
//       y: height * 0.8,
//       health: 40,
//       points: 30,
//       description: "Contains natural healing compounds"
//     }
//   ]);

//   // Initialize game with animations
//   useEffect(() => {
//     // Fade in animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true
//     }).start();

//     // Continuous pulse animation
//     const pulseAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.2,
//           duration: 1500,
//           useNativeDriver: true
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true
//         })
//       ])
//     );
//     pulseAnimation.start();

//     // Rotation animation for discoveries
//     const rotateAnimation = Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 4000,
//         useNativeDriver: true
//       })
//     );
//     rotateAnimation.start();

//     return () => {
//       pulseAnimation.stop();
//       rotateAnimation.stop();
//     };
//   }, []);

//   // Game timer
//   useEffect(() => {
//     if (gameState === 'playing') {
//       timerRef.current = setInterval(() => {
//         setGameTimer(prev => {
//           if (prev <= 1) {
//             setGameState('gameover');
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } else {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [gameState]);


//   useEffect(() => {
//   return () => {
//     // Cleanup audio players
//     try {
//       if (backgroundMusicPlayer) {
//         backgroundMusicPlayer.pause();
//       }
//       if (discoveryPlayer) {
//         discoveryPlayer.pause();
//       }
//       if (errorPlayer) {
//         errorPlayer.pause();
//       }
//     } catch (error) {
//       console.log('Audio cleanup error:', error);
//     }
//   };
// }, []);

//   // const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
//   //   if (player) {
//   //     player.seekTo(0);
//   //     player.play();
//   //   }
//   // };

//   const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
//   try {
//     if (player && player.playing) {
//       player.pause();
//     }
//     if (player) {
//       player.seekTo(0);
//       player.play();
//     }
//   } catch (error) {
//     console.log('Audio playback error:', error);
//   }
// };

//   // const startGame = () => {
//   //   setGameState('playing');
//   //   setGameTimer(180);
//   //   playSound(discoveryPlayer);
    
//   //   // Start background music
//   //   if (backgroundMusicPlayer) {
//   //     backgroundMusicPlayer.loop = true;
//   //     backgroundMusicPlayer.play();
//   //   }
//   // };

//   const startGame = () => {
//   setGameState('playing');
//   setGameTimer(180);
//   playSound(discoveryPlayer);
  
//   // Fix background music
//   try {
//     if (backgroundMusicPlayer) {
//       backgroundMusicPlayer.loop = true; // Use the loop property
//       backgroundMusicPlayer.play();
//     }
//   } catch (error) {
//     console.log('Background music error:', error);
//   }
// };

//   const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
//     if (stats.energy < 5) {
//       Alert.alert("Too Tired!", "Rest or find energy to continue moving!");
//       return;
//     }

//     const moveDistance = 60;
//     let newX = playerPosition.x._value;
//     let newY = playerPosition.y._value;

//     switch (direction) {
//       case 'up':
//         newY = Math.max(80, newY - moveDistance);
//         break;
//       case 'down':
//         newY = Math.min(height - 200, newY + moveDistance);
//         break;
//       case 'left':
//         newX = Math.max(20, newX - moveDistance);
//         break;
//       case 'right':
//         newX = Math.min(width - 70, newX + moveDistance);
//         break;
//     }

//     // Smooth movement animation
//     // Animated.spring(playerPosition, {
//     //   toValue: { x: newX, y: newY },
//     //   useNativeDriver: false,
//     //   tension: 120,
//     //   friction: 8,
//     //   speed: 20
//     // }).start();

//     Animated.spring(playerPosition, {
//   toValue: { x: newX, y: newY },
//   useNativeDriver: false,
//   // Remove conflicting parameters, use only one set:
//   tension: 120,
//   friction: 8
//   // Remove: speed: 20 (this conflicts with tension/friction)
// }).start();

//     // Consume energy
//     setStats(prev => ({
//       ...prev,
//       energy: Math.max(0, prev.energy - 3)
//     }));

//     // Check for discoveries
//     checkForPlantDiscovery(newX, newY);
//   };

//   const checkForPlantDiscovery = (playerX: number, playerY: number) => {
//     plants.forEach((plant, index) => {
//       if (!plant.discovered) {
//         const distance = Math.sqrt(
//           Math.pow(playerX - plant.x, 2) + Math.pow(playerY - plant.y, 2)
//         );
        
//         if (distance < 80) {
//           discoverPlant(index);
//         }
//       }
//     });
//   };

//   const discoverPlant = (plantIndex: number) => {
//     const plant = plants[plantIndex];
//     if (plant.discovered) return;

//     playSound(discoveryPlayer);
    
//     const updatedPlants = [...plants];
//     updatedPlants[plantIndex].discovered = true;
//     setPlants(updatedPlants);

//     setStats(prev => ({
//       ...prev,
//       health: Math.max(0, Math.min(100, prev.health + plant.health)),
//       score: prev.score + plant.points,
//       plantsDiscovered: prev.plantsDiscovered + 1,
//       knowledge: prev.knowledge + (plant.isEdible ? 15 : 10)
//     }));

//     const title = plant.isEdible ? "🌟 Discovery!" : "⚠️ Danger!";
//     const message = `${plant.description}\n\nHealth: ${plant.health > 0 ? '+' : ''}${plant.health}\nPoints: +${plant.points}`;

//     Alert.alert(title, message, [
//       { text: "Analyze 🔬", onPress: () => examineUnderMicroscope(plant) },
//       { text: "Continue", onPress: () => checkVictoryCondition() }
//     ]);
//   };

//   const examineUnderMicroscope = (plant: Plant) => {
//     setSelectedPlant(plant);
//     setShowMicroscope(true);
//     setStats(prev => ({ ...prev, knowledge: prev.knowledge + 20 }));
//     playSound(discoveryPlayer);
//   };

//   const startMemoryGame = () => {
//     const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
//     const sequence: any = [];
//     for (let i = 0; i < 4; i++) {
//       sequence.push(colors[Math.floor(Math.random() * colors.length)]);
//     }
//     setMemorySequence(sequence);
//     setPlayerSequence([]);
//     setCurrentMiniGame({ id: 1, type: 'memory', active: true, completed: false });
//     setGameState('minigame');
//     setShowingSequence(true);
//     setSequenceStep(0);
    
//     // Show sequence with delay
//     setTimeout(() => showSequenceStep(0, sequence), 1000);
//   };

//   const showSequenceStep = (step: number, sequence: string[]) => {
//     if (step >= sequence.length) {
//       setShowingSequence(false);
//       return;
//     }
    
//     setSequenceStep(step);
//     setTimeout(() => showSequenceStep(step + 1, sequence), 800);
//   };

//   const handleMemoryInput = (color: string) => {
//     if (showingSequence) return;
    
//     const newPlayerSequence = [...playerSequence, color];
//     setPlayerSequence(newPlayerSequence);
    
//     if (newPlayerSequence.length === memorySequence.length) {
//       // Check if sequence matches
//       const isCorrect = newPlayerSequence.every((color, index) => color === memorySequence[index]);
      
//       if (isCorrect) {
//         playSound(discoveryPlayer);
//         setStats(prev => ({ 
//           ...prev, 
//           score: prev.score + 50,
//           knowledge: prev.knowledge + 30,
//           energy: Math.min(100, prev.energy + 20)
//         }));
//         Alert.alert("🎉 Perfect!", "Sequence memorized correctly! +50 points, +20 energy", [
//           { text: "Continue", onPress: () => setGameState('playing') }
//         ]);
//       } else {
//         playSound(errorPlayer);
//         setStats(prev => ({ ...prev, health: Math.max(0, prev.health - 15) }));
//         Alert.alert("❌ Wrong sequence", "Try again! -15 health", [
//           { text: "Retry", onPress: () => {
//             setPlayerSequence([]);
//             setShowingSequence(true);
//             setTimeout(() => showSequenceStep(0, memorySequence), 500);
//           }},
//           { text: "Skip", onPress: () => setGameState('playing') }
//         ]);
//       }
//     }
//   };

//   const checkVictoryCondition = () => {
//     if (stats.score >= 150 && stats.plantsDiscovered >= 4) {
//       setTimeout(() => setGameState('victory'), 1000);
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const renderIntro = () => (
//     <ImageBackground 
//       source={require('../assets/images/jungle.gif')} 
//       style={styles.container}
//       blurRadius={3}
//     >
//       <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
//         <Animated.Text style={[styles.title, { transform: [{ scale: pulseAnim }] }]}>
//           🧬 SURVIVAL SCIENTIST
//         </Animated.Text>
//         <Text style={styles.subtitle}>Cellular Exploration Mission</Text>
        
//         <View style={styles.storyBox}>
//           <Text style={styles.storyText}>
//             🚁 Emergency Landing on Bio-Island!
//             {'\n\n'}
//             Your research helicopter crashed during a storm. As a cellular biologist, 
//             you must use your scientific knowledge to survive while waiting for rescue.
//             {'\n\n'}
//             🎯 MISSION OBJECTIVES:
//             {'\n'}• Discover and analyze 4+ plant species
//             {'\n'}• Score 150+ points through exploration  
//             {'\n'}• Manage health, energy, and knowledge
//             {'\n'}• Complete cellular analysis challenges
//             {'\n'}• Survive for 3 minutes until rescue arrives!
//           </Text>
//         </View>

//         <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//           <TouchableOpacity style={styles.startButton} onPress={startGame}>
//             <Text style={styles.startButtonText}>🚀 BEGIN SURVIVAL MISSION</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </Animated.View>
//     </ImageBackground>
//   );

//   const renderGame = () => {
//     const spin = rotateAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['0deg', '360deg']
//     });

//     return (
//       <ImageBackground source={require('../assets/images/jungle.gif')} style={styles.container}>
//         {/* Enhanced Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>🌿 Bio-Island Survival</Text>
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Text style={[styles.stat, { color: '#ff6b6b' }]}>❤️ {stats.health}</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.stat, { color: '#4ecdc4' }]}>⚡ {stats.energy}</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.stat, { color: '#45b7d1' }]}>🧠 {stats.knowledge}</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.stat, { color: '#f39c12' }]}>⭐ {stats.score}</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={[styles.stat, { color: '#e74c3c' }]}>⏰ {formatTime(gameTimer)}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Game area with enhanced plants */}
//         <View style={styles.gameArea}>
//           {plants.map(plant => (
//             <Animated.View
//               key={plant.id}
//               style={[
//                 styles.plant,
//                 {
//                   left: plant.x,
//                   top: plant.y,
//                   transform: plant.discovered ? [] : [{ rotate: spin }]
//                 }
//               ]}
//             >
//               <TouchableOpacity onPress={() => plant.discovered && examineUnderMicroscope(plant)}>
//                 <Animated.View style={[
//                   styles.plantContainer,
//                   { 
//                     backgroundColor: plant.discovered ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 193, 7, 0.3)',
//                     borderColor: plant.isEdible ? '#4CAF50' : '#f44336',
//                     transform: [{ scale: plant.discovered ? 0.9 : 1.1 }]
//                   }
//                 ]}>
//                   <Image source={plant.image} style={styles.plantImage} />
//                   {plant.discovered && (
//                     <Text style={styles.plantLabel}>{plant.name}</Text>
//                   )}
//                   {!plant.discovered && (
//                     <Text style={styles.unknownLabel}>❓</Text>
//                   )}
//                 </Animated.View>
//               </TouchableOpacity>
//             </Animated.View>
//           ))}

//           {/* Enhanced Player */}
//           <Animated.View style={[styles.player, playerPosition.getLayout()]}>
//             <View style={styles.playerContainer}>
//               <Text style={styles.playerIcon}>🧑‍🔬</Text>
//               <View style={styles.playerIndicator} />
//             </View>
//           </Animated.View>
//         </View>

//         {/* Enhanced Controls */}
//         <View style={styles.controlsContainer}>
//           <View style={styles.leftControls}>
//             <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('up')}>
//               <Text style={styles.controlText}>⬆️</Text>
//             </TouchableOpacity>
//             <View style={styles.horizontalControls}>
//               <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('left')}>
//                 <Text style={styles.controlText}>⬅️</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('right')}>
//                 <Text style={styles.controlText}>➡️</Text>
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity style={styles.controlBtn} onPress={() => movePlayer('down')}>
//               <Text style={styles.controlText}>⬇️</Text>
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.rightControls}>
//             <TouchableOpacity 
//               style={[styles.actionBtn, { backgroundColor: '#9b59b6' }]} 
//               onPress={startMemoryGame}
//               disabled={stats.plantsDiscovered < 2}
//             >
//               <Text style={styles.actionBtnText}>🧠{'\n'}Memory{'\n'}Test</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Progress indicator */}
//         <View style={styles.progressContainer}>
//           <Text style={styles.progressText}>
//             🌱 Plants: {stats.plantsDiscovered}/5 | 🎯 Score: {stats.score}/150
//           </Text>
//           <View style={styles.progressBar}>
//             <View 
//               style={[
//                 styles.progressFill, 
//                 { width: `${Math.min(100, (stats.score / 150) * 100)}%` }
//               ]} 
//             />
//           </View>
//         </View>

//         {/* Microscope Modal */}
//         <Modal visible={showMicroscope} animationType="slide" transparent>
//           <View style={styles.modalOverlay}>
//             <View style={styles.microscopeContainer}>
//               <Text style={styles.microscopeTitle}>🔬 Cellular Analysis Lab</Text>
//               {selectedPlant && (
//                 <ScrollView style={styles.analysisScrollView}>
//                   <View style={styles.analysisContainer}>
//                     <Image source={selectedPlant.image} style={styles.microscopeImage} />
//                     <Text style={styles.plantName}>{selectedPlant.name}</Text>
                    
//                     <View style={styles.analysisCard}>
//                       <Text style={styles.analysisLabel}>🔬 Cell Structure:</Text>
//                       <Text style={styles.analysisValue}>{selectedPlant.cellStructure}</Text>
//                     </View>
                    
//                     <View style={styles.analysisCard}>
//                       <Text style={styles.analysisLabel}>🌱 Photosynthesis:</Text>
//                       <Text style={[styles.analysisValue, { color: selectedPlant.photosynthesis ? '#4CAF50' : '#f44336' }]}>
//                         {selectedPlant.photosynthesis ? '✅ Active - Contains chloroplasts' : '❌ Inactive - No chloroplasts detected'}
//                       </Text>
//                     </View>
                    
//                     <View style={styles.analysisCard}>
//                       <Text style={styles.analysisLabel}>⚗️ Safety Analysis:</Text>
//                       <Text style={[styles.analysisValue, { color: selectedPlant.isEdible ? '#4CAF50' : '#f44336' }]}>
//                         {selectedPlant.isEdible ? '✅ SAFE - Edible compounds detected' : '⚠️ TOXIC - Harmful alkaloids present'}
//                       </Text>
//                     </View>

//                     <View style={styles.analysisCard}>
//                       <Text style={styles.analysisLabel}>📋 Scientific Notes:</Text>
//                       <Text style={styles.analysisValue}>{selectedPlant.description}</Text>
//                     </View>
//                   </View>
//                 </ScrollView>
//               )}
//               <TouchableOpacity 
//                 style={styles.closeButton} 
//                 onPress={() => setShowMicroscope(false)}
//               >
//                 <Text style={styles.closeButtonText}>Complete Analysis</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </ImageBackground>
//     );
//   };

//   const renderMiniGame = () => (
//     <View style={styles.container}>
//       <ImageBackground 
//         source={require('../assets/images/berry.png')} 
//         style={styles.challengeBackground}
//         blurRadius={8}
//       >
//         <View style={styles.miniGameContainer}>
//           <Text style={styles.miniGameTitle}>🧠 Cellular Memory Challenge</Text>
//           <Text style={styles.miniGameSubtitle}>
//             Remember the sequence of cellular components!
//           </Text>
          
//           {showingSequence && (
//             <View style={styles.sequenceDisplay}>
//               <Text style={styles.sequenceText}>Observe the sequence...</Text>
//               <Text style={styles.currentStep}>
//                 Step {sequenceStep + 1} of {memorySequence.length}
//               </Text>
//             </View>
//           )}
          
//           {!showingSequence && (
//             <View style={styles.sequenceDisplay}>
//               <Text style={styles.sequenceText}>Now repeat the sequence!</Text>
//               <Text style={styles.playerProgress}>
//                 {playerSequence.length} / {memorySequence.length}
//               </Text>
//             </View>
//           )}

//           <View style={styles.colorGrid}>
//             {['red', 'blue', 'green', 'yellow', 'purple'].map(color => (
//               <TouchableOpacity
//                 key={color}
//                 style={[
//                   styles.colorButton,
//                   { backgroundColor: color },
//                   (showingSequence && memorySequence[sequenceStep] === color) ? styles.activeColor : {},
//                 ]}
//                 onPress={() => handleMemoryInput(color)}
//                 disabled={showingSequence}
//               >
//                 <Text style={styles.colorLabel}>
//                   {color === 'red' && '🔴 Nucleus'}
//                   {color === 'blue' && '🔵 Cytoplasm'}
//                   {color === 'green' && '🟢 Chloroplast'}
//                   {color === 'yellow' && '🟡 Vacuole'}
//                   {color === 'purple' && '🟣 Mitochondria'}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <TouchableOpacity 
//             style={styles.skipButton}
//             onPress={() => setGameState('playing')}
//           >
//             <Text style={styles.skipButtonText}>Skip Challenge</Text>
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>
//     </View>
//   );

//   const renderVictory = () => (
//     <ImageBackground 
//       source={require('../assets/images/jungle.gif')} 
//       style={styles.container}
//       blurRadius={4}
//     >
//       <View style={styles.victoryContainer}>
//         <Animated.Text style={[styles.victoryTitle, { transform: [{ scale: pulseAnim }] }]}>
//           🎉 MISSION ACCOMPLISHED!
//         </Animated.Text>
        
//         <View style={styles.victoryStats}>
//           <Text style={styles.victoryText}>
//             🏆 SURVIVAL REPORT 🏆
//             {'\n\n'}
//             ⭐ Final Score: {stats.score} points
//             {'\n'}❤️ Health Status: {stats.health}%
//             {'\n'}🧠 Knowledge Gained: {stats.knowledge} units
//             {'\n'}🌱 Species Discovered: {stats.plantsDiscovered}/5
//             {'\n'}⚡ Energy Remaining: {stats.energy}%
//             {'\n\n'}
//             🚁 Rescue helicopter inbound!
//             {'\n'}Your cellular biology expertise saved your life!
//           </Text>
//         </View>
        
//         <TouchableOpacity 
//           style={styles.restartButton}
//           onPress={() => {
//             // Reset game
//             setGameState('intro');
//             setGameTimer(180);
//             setStats({
//               health: 100,
//               score: 0,
//               plantsDiscovered: 0,
//               energy: 100,
//               knowledge: 0,
//               timeLeft: 180
//             });
//             setPlants(plants.map(p => ({ ...p, discovered: false })));
//             backgroundMusicPlayer?.pause();
//           }}
//         >
//           <Text style={styles.restartButtonText}>🔄 New Survival Mission</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );

//   const renderGameOver = () => (
//     <ImageBackground 
//       source={require('../assets/images/jungle.gif')} 
//       style={styles.container}
//       blurRadius={6}
//     >
//       <View style={styles.gameOverContainer}>
//         <Text style={styles.gameOverTitle}>⚠️ MISSION FAILED</Text>
        
//         <View style={styles.gameOverStats}>
//           <Text style={styles.gameOverText}>
//             {stats.health <= 0 ? "💀 Health depleted!" : "⏰ Time ran out!"}
//             {'\n\n'}
//             📊 FINAL REPORT:
//             {'\n'}• Score: {stats.score} points
//             {'\n'}• Plants Found: {stats.plantsDiscovered}/5
//             {'\n'}• Knowledge: {stats.knowledge} units
//             {'\n\n'}
//             The rescue team couldn't locate you in time.
//             Learn from this experience for your next mission!
//           </Text>
//         </View>
        
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => {
//             setGameState('intro');
//             setGameTimer(180);
//             setStats({
//               health: 100,
//               score: 0,
//               plantsDiscovered: 0,
//               energy: 100,
//               knowledge: 0,
//               timeLeft: 180
//             });
//             setPlants(plants.map(p => ({ ...p, discovered: false })));
//             backgroundMusicPlayer?.pause();
//           }}
//         >
//           <Text style={styles.retryButtonText}>🔄 Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );

//   // Main render
//   switch (gameState) {
//     case 'intro': return renderIntro();
//     case 'playing': return renderGame();
//     case 'minigame': return renderMiniGame();
//     case 'victory': return renderVictory();
//     case 'gameover': return renderGameOver();
//     default: return renderIntro();
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0a2a1a',
//   },
//   introContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 10,
//     textShadowColor: '#000',
//     textShadowOffset: { width: 3, height: 3 },
//     textShadowRadius: 6,
//   },
// subtitle: {
//     fontSize: 20,
//     color: '#88ffaa',
//     textAlign: 'center',
//     marginBottom: 30,
//     fontStyle: 'italic',
//   },
//   storyBox: {
//     backgroundColor: 'rgba(0, 50, 25, 0.9)',
//     padding: 20,
//     borderRadius: 15,
//     marginVertical: 20,
//     borderWidth: 2,
//     borderColor: '#00ff88',
//     shadowColor: '#00ff88',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//   },
//   storyText: {
//     fontSize: 16,
//     color: '#ffffff',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   startButton: {
//     backgroundColor: '#00ff88',
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//     borderRadius: 25,
//     shadowColor: '#00ff88',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 15,
//   },
//   startButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//   },
//   header: {
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     padding: 15,
//     borderBottomWidth: 2,
//     borderBottomColor: '#00ff88',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     flexWrap: 'wrap',
//   },
//   statItem: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: 8,
//     borderRadius: 10,
//     margin: 2,
//     minWidth: 60,
//   },
//   stat: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   gameArea: {
//     flex: 1,
//     position: 'relative',
//   },
//   plant: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   plantContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   plantImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   plantLabel: {
//     fontSize: 10,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     borderRadius: 8,
//     position: 'absolute',
//     bottom: -15,
//     minWidth: 80,
//   },
//   unknownLabel: {
//     fontSize: 24,
//     position: 'absolute',
//     top: -5,
//     right: -5,
//   },
//   player: {
//     position: 'absolute',
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playerContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(0, 255, 136, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#00ff88',
//     shadowColor: '#00ff88',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//   },
//   playerIcon: {
//     fontSize: 24,
//   },
//   playerIndicator: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     width: 15,
//     height: 15,
//     borderRadius: 7.5,
//     backgroundColor: '#00ff88',
//   },
//   controlsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   leftControls: {
//     alignItems: 'center',
//   },
//   horizontalControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: 120,
//     marginVertical: 10,
//   },
//   controlBtn: {
//     backgroundColor: '#00ff88',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#00ff88',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   controlText: {
//     fontSize: 20,
//     color: '#000',
//   },
//   rightControls: {
//     alignItems: 'center',
//   },
//   actionBtn: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   actionBtnText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   progressContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     padding: 15,
//     borderTopWidth: 2,
//     borderTopColor: '#00ff88',
//   },
//   progressText: {
//     fontSize: 14,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   progressBar: {
//     height: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#00ff88',
//     borderRadius: 5,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   microscopeContainer: {
//     backgroundColor: 'rgba(0, 50, 25, 0.95)',
//     width: width * 0.9,
//     height: height * 0.8,
//     borderRadius: 20,
//     padding: 20,
//     borderWidth: 3,
//     borderColor: '#00ff88',
//     shadowColor: '#00ff88',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 20,
//   },
//   microscopeTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   analysisScrollView: {
//     flex: 1,
//   },
//   analysisContainer: {
//     alignItems: 'center',
//   },
//   microscopeImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 20,
//     borderWidth: 3,
//     borderColor: '#00ff88',
//   },
//   plantName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   analysisCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 8,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#00ff88',
//   },
//   analysisLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#88ffaa',
//     marginBottom: 5,
//   },
//   analysisValue: {
//     fontSize: 14,
//     color: '#ffffff',
//     lineHeight: 20,
//   },
//   closeButton: {
//     backgroundColor: '#00ff88',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   closeButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//   },
//   challengeBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   miniGameContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     padding: 20,
//     borderRadius: 20,
//     width: width * 0.9,
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#9b59b6',
//   },
//   miniGameTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#9b59b6',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   miniGameSubtitle: {
//     fontSize: 16,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   sequenceDisplay: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   sequenceText: {
//     fontSize: 18,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   currentStep: {
//     fontSize: 16,
//     color: '#9b59b6',
//     fontWeight: 'bold',
//   },
//   playerProgress: {
//     fontSize: 16,
//     color: '#00ff88',
//     fontWeight: 'bold',
//   },
//   colorGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 10,
//     marginBottom: 20,
//   },
//   colorButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   activeColor: {
//     borderColor: '#ffff00',
//     borderWidth: 5,
//     shadowColor: '#ffff00',
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//   },
//   colorLabel: {
//     fontSize: 10,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     textShadowColor: '#000',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   skipButton: {
//     backgroundColor: '#e74c3c',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 15,
//   },
//   skipButtonText: {
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   victoryContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   victoryTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#00ff88',
//     textAlign: 'center',
//     marginBottom: 30,
//     textShadowColor: '#000',
//     textShadowOffset: { width: 3, height: 3 },
//     textShadowRadius: 6,
//   },
//   victoryStats: {
//     backgroundColor: 'rgba(0, 50, 25, 0.9)',
//     padding: 20,
//     borderRadius: 15,
//     marginVertical: 20,
//     borderWidth: 2,
//     borderColor: '#00ff88',
//   },
//   victoryText: {
//     fontSize: 16,
//     color: '#ffffff',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   restartButton: {
//     backgroundColor: '#00ff88',
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//     borderRadius: 25,
//     shadowColor: '#00ff88',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 15,
//   },
//   restartButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//   },
//   gameOverContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   gameOverTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#ff4444',
//     textAlign: 'center',
//     marginBottom: 30,
//     textShadowColor: '#000',
//     textShadowOffset: { width: 3, height: 3 },
//     textShadowRadius: 6,
//   },
//   gameOverStats: {
//     backgroundColor: 'rgba(50, 0, 0, 0.9)',
//     padding: 20,
//     borderRadius: 15,
//     marginVertical: 20,
//     borderWidth: 2,
//     borderColor: '#ff4444',
//   },
//   gameOverText: {
//     fontSize: 16,
//     color: '#ffffff',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   retryButton: {
//     backgroundColor: '#ff4444',
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//     borderRadius: 25,
//     shadowColor: '#ff4444',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 15,
//   },
//   retryButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
// });

// export default ScienceSurvivalQuestStart;

















import { useAudioPlayer } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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
  health: number;
  points: number;
  description: string;
}

interface GameStats {
  health: number;
  score: number;
  plantsDiscovered: number;
  energy: number;
  knowledge: number;
  timeLeft: number;
}

interface MiniGame {
  id: number;
  type: 'memory' | 'sequence' | 'quiz';
  active: boolean;
  completed: boolean;
}

// New type for forest elements
interface ForestElement {
  id: number;
  type: 'tree' | 'rock' | 'water';
  emoji: string;
  x: number;
  y: number;
  size: number;
}

const ScienceSurvivalQuestStart: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'microscope' | 'minigame' | 'victory' | 'gameover'>('intro');
  const [playerPosition] = useState(new Animated.ValueXY({ x: width/2 - 25, y: height/2 }));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [showMicroscope, setShowMicroscope] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [currentMiniGame, setCurrentMiniGame] = useState<MiniGame | null>(null);
  const [gameTimer, setGameTimer] = useState(180); // 3 minutes
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  // Memory game states
  const [memorySequence, setMemorySequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceStep, setSequenceStep] = useState(0);

  // Audio players
  const discoveryPlayer = useAudioPlayer(require('../assets/sounds/game-start.mp3'));
  const errorPlayer = useAudioPlayer(require('../assets/sounds/error.mp3'));
  const backgroundMusicPlayer = useAudioPlayer(require('../assets/sounds/background.mp3'));

  // Game state
  const [stats, setStats] = useState<GameStats>({
    health: 100,
    score: 0,
    plantsDiscovered: 0,
    energy: 100,
    knowledge: 0,
    timeLeft: 180
  });

  // Interactive plants with better mechanics
  const [plants, setPlants] = useState<Plant[]>([
    {
      id: 1,
      name: "Luminous Moss",
      image: require('../assets/images/berry.png'),
      isEdible: true,
      cellStructure: "Dense chloroplast clusters with bioluminescent proteins",
      photosynthesis: true,
      discovered: false,
      x: width * 0.15,
      y: height * 0.25,
      health: 25,
      points: 20,
      description: "Glows softly in darkness, rich in nutrients"
    },
    {
      id: 2,
      name: "Crystal Vine",
      image: require('../assets/images/vine.png'),
      isEdible: false,
      cellStructure: "Mineralized cell walls, no chloroplasts",
      photosynthesis: false,
      discovered: false,
      x: width * 0.8,
      y: height * 0.3,
      health: -20,
      points: 15,
      description: "Beautiful but toxic, crystalline structure"
    },
    {
      id: 3,
      name: "Energy Berry",
      image: require('../assets/images/berry.png'),
      isEdible: true,
      cellStructure: "High-density chloroplasts, sugar-rich vacuoles",
      photosynthesis: true,
      discovered: false,
      x: width * 0.4,
      y: height * 0.6,
      health: 30,
      points: 25,
      description: "Bursting with natural sugars and energy"
    },
    {
      id: 4,
      name: "Poison Spore",
      image: require('../assets/images/vine.png'),
      isEdible: false,
      cellStructure: "Thick cell walls, toxic alkaloid storage",
      photosynthesis: false,
      discovered: false,
      x: width * 0.7,
      y: height * 0.7,
      health: -30,
      points: 10,
      description: "Releases toxic spores when disturbed"
    },
    {
      id: 5,
      name: "Healing Leaf",
      image: require('../assets/images/berry.png'),
      isEdible: true,
      cellStructure: "Modified chloroplasts with medicinal compounds",
      photosynthesis: true,
      discovered: false,
      x: width * 0.2,
      y: height * 0.8,
      health: 40,
      points: 30,
      description: "Contains natural healing compounds"
    }
  ]);

  // New state for forest elements
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
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();

    // Continuous pulse animation
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

    // Rotation animation for discoveries
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true
      })
    );
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);


  useEffect(() => {
  return () => {
    // Cleanup audio players
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
}, []);

  const playSound = (player: ReturnType<typeof useAudioPlayer>) => {
  try {
    if (player && player.playing) {
      player.pause();
    }
    if (player) {
      player.seekTo(0);
      player.play();
    }
  } catch (error) {
    console.log('Audio playback error:', error);
  }
};

  const startGame = () => {
  setGameState('playing');
  setGameTimer(180);
  playSound(discoveryPlayer);
  
  // Fix background music
  try {
    if (backgroundMusicPlayer) {
      backgroundMusicPlayer.loop = true; // Use the loop property
      backgroundMusicPlayer.play();
    }
  } catch (error) {
    console.log('Background music error:', error);
  }
};

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (stats.energy < 5) {
      Alert.alert("Too Tired!", "Rest or find energy to continue moving!");
      return;
    }

    const moveDistance = 60;
    let newX = playerPosition.x._value;
    let newY = playerPosition.y._value;

    switch (direction) {
      case 'up':
        newY = Math.max(80, newY - moveDistance);
        break;
      case 'down':
        newY = Math.min(height - 200, newY + moveDistance);
        break;
      case 'left':
        newX = Math.max(20, newX - moveDistance);
        break;
      case 'right':
        newX = Math.min(width - 70, newX + moveDistance);
        break;
    }

    Animated.spring(playerPosition, {
      toValue: { x: newX, y: newY },
      useNativeDriver: false,
      tension: 120,
      friction: 8
    }).start();

    // Consume energy
    setStats(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 3)
    }));

    // Check for discoveries
    checkForPlantDiscovery(newX, newY);
  };

  const checkForPlantDiscovery = (playerX: number, playerY: number) => {
    plants.forEach((plant, index) => {
      if (!plant.discovered) {
        const distance = Math.sqrt(
          Math.pow(playerX - plant.x, 2) + Math.pow(playerY - plant.y, 2)
        );
        
        if (distance < 80) {
          discoverPlant(index);
        }
      }
    });
  };

  const discoverPlant = (plantIndex: number) => {
    const plant = plants[plantIndex];
    if (plant.discovered) return;

    playSound(discoveryPlayer);
    
    const updatedPlants = [...plants];
    updatedPlants[plantIndex].discovered = true;
    setPlants(updatedPlants);

    setStats(prev => ({
      ...prev,
      health: Math.max(0, Math.min(100, prev.health + plant.health)),
      score: prev.score + plant.points,
      plantsDiscovered: prev.plantsDiscovered + 1,
      knowledge: prev.knowledge + (plant.isEdible ? 15 : 10)
    }));

    const title = plant.isEdible ? "🌟 Discovery!" : "⚠️ Danger!";
    const message = `${plant.description}\n\nHealth: ${plant.health > 0 ? '+' : ''}${plant.health}\nPoints: +${plant.points}`;

    Alert.alert(title, message, [
      { text: "Analyze 🔬", onPress: () => examineUnderMicroscope(plant) },
      { text: "Continue", onPress: () => checkVictoryCondition() }
    ]);
  };

  const examineUnderMicroscope = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowMicroscope(true);
    setStats(prev => ({ ...prev, knowledge: prev.knowledge + 20 }));
    playSound(discoveryPlayer);
  };

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
    
    // Show sequence with delay
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
      // Check if sequence matches
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

  const checkVictoryCondition = () => {
    if (stats.score >= 150 && stats.plantsDiscovered >= 4) {
      setTimeout(() => setGameState('victory'), 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderIntro = () => (
    <ImageBackground 
      source={require('../assets/images/jungle.gif')} 
      style={styles.container}
      blurRadius={3}
    >
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
    </ImageBackground>
  );

  const renderGame = () => {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <ImageBackground source={require('../assets/images/jungle.gif')} style={styles.container}>
        {/* Enhanced Header */}
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

        {/* Game area with enhanced plants and new forest elements */}
        <View style={styles.gameArea}>
          {/* Render forest elements */}
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

          {plants.map(plant => (
            <Animated.View
              key={plant.id}
              style={[
                styles.plant,
                {
                  left: plant.x,
                  top: plant.y,
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

          {/* Enhanced Player */}
          <Animated.View style={[styles.player, playerPosition.getLayout()]}>
            <View style={styles.playerContainer}>
              <Text style={styles.playerIcon}>🧑‍🔬</Text>
              <View style={styles.playerIndicator} />
            </View>
          </Animated.View>
        </View>

        {/* Enhanced Controls */}
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
              onPress={startMemoryGame}
              disabled={stats.plantsDiscovered < 2}
            >
              <Text style={styles.actionBtnText}>🧠{'\n'}Memory{'\n'}Test</Text>
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
      </ImageBackground>
    );
  };

  const renderMiniGame = () => (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/images/berry.png')} 
        style={styles.challengeBackground}
        blurRadius={8}
      >
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
      </ImageBackground>
    </View>
  );

  const renderVictory = () => (
    <ImageBackground 
      source={require('../assets/images/jungle.gif')} 
      style={styles.container}
      blurRadius={4}
    >
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
            {'\n'}🌱 Species Discovered: {stats.plantsDiscovered}/5
            {'\n'}⚡ Energy Remaining: {stats.energy}%
            {'\n\n'}
            🚁 Rescue helicopter inbound!
            {'\n'}Your cellular biology expertise saved your life!
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.restartButton}
          onPress={() => {
            // Reset game
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
            setPlants(plants.map(p => ({ ...p, discovered: false })));
            backgroundMusicPlayer?.pause();
          }}
        >
          <Text style={styles.restartButtonText}>🔄 New Survival Mission</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  const renderGameOver = () => (
    <ImageBackground 
      source={require('../assets/images/jungle.gif')} 
      style={styles.container}
      blurRadius={6}
    >
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>⚠️ MISSION FAILED</Text>
        
        <View style={styles.gameOverStats}>
          <Text style={styles.gameOverText}>
            {stats.health <= 0 ? "💀 Health depleted!" : "⏰ Time ran out!"}
            {'\n\n'}
            📊 FINAL REPORT:
            {'\n'}• Score: {stats.score} points
            {'\n'}• Plants Found: {stats.plantsDiscovered}/5
            {'\n'}• Knowledge: {stats.knowledge} units
            {'\n'}
            The rescue team couldn't locate you in time.
            Learn from this experience for your next mission!
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
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
            setPlants(plants.map(p => ({ ...p, discovered: false })));
            backgroundMusicPlayer?.pause();
          }}
        >
          <Text style={styles.retryButtonText}>🔄 Try Again</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  // Main render
  switch (gameState) {
    case 'intro': return renderIntro();
    case 'playing': return renderGame();
    case 'minigame': return renderMiniGame();
    case 'victory': return renderVictory();
    case 'gameover': return renderGameOver();
    default: return renderIntro();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2a1a',
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
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
subtitle: {
    fontSize: 20,
    color: '#88ffaa',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
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
  storyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
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
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 10,
    margin: 2,
    minWidth: 60,
  },
  stat: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden', // Ensure elements stay within bounds
  },
  // New style for forest elements
  forestElement: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plant: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  plantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
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
  unknownLabel: {
    fontSize: 24,
    position: 'absolute',
    top: -5,
    right: -5,
  },
  player: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  playerIcon: {
    fontSize: 24,
  },
  playerIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#00ff88',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  leftControls: {
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginVertical: 10,
  },
  controlBtn: {
    backgroundColor: '#00ff88',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  controlText: {
    fontSize: 24,
    color: '#000',
  },
  rightControls: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  progressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderTopWidth: 2,
    borderTopColor: '#00ff88',
  },
  progressText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 14,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  microscopeContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '85%',
    borderWidth: 2,
    borderColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },
  microscopeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  analysisScrollView: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  analysisContainer: {
    alignItems: 'center',
  },
  microscopeImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderColor: '#00ff88',
    borderWidth: 2,
  },
  plantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  analysisCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 5,
  },
  analysisValue: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#00ff88',
    padding: 12,
    borderRadius: 15,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  challengeBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniGameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9b59b6',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },
  miniGameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 10,
    textAlign: 'center',
  },
  miniGameSubtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  sequenceDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9b59b6',
  },
  sequenceText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currentStep: {
    fontSize: 16,
    color: '#fff',
  },
  playerProgress: {
    fontSize: 16,
    color: '#fff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorButton: {
    width: 90,
    height: 90,
    borderRadius: 15,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  activeColor: {
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  colorLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  victoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  victoryTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  victoryStats: {
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
  victoryText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
  restartButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  gameOverTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  gameOverStats: {
    backgroundColor: 'rgba(50, 0, 0, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  gameOverText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default ScienceSurvivalQuestStart;