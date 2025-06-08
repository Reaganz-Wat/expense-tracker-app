import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get('window');

interface Level {
  id: number;
  name: string;
  zone: string;
  subject: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
}

const ScienceSurvivalQuest: React.FC = () => {
  const [levels] = useState<Level[]>([
    {
      id: 1,
      name: "Jungle of Cells",
      zone: "Biology Zone",
      subject: "Biology",
      icon: "🧬",
      color: "#2ECC71",
      isUnlocked: true,
      isCompleted: false,
      progress: 0
    },
    {
      id: 2,
      name: "River of Reactions",
      zone: "Chemistry Zone", 
      subject: "Chemistry",
      icon: "⚗️",
      color: "#3498DB",
      isUnlocked: false,
      isCompleted: false,
      progress: 0
    },
    {
      id: 3,
      name: "Electric Caverns",
      zone: "Physics Zone",
      subject: "Physics", 
      icon: "⚡",
      color: "#9B59B6",
      isUnlocked: false,
      isCompleted: false,
      progress: 0
    },
    {
      id: 4,
      name: "DNA Gate",
      zone: "Genetics Zone",
      subject: "Biology & Chemistry",
      icon: "🧬",
      color: "#E74C3C",
      isUnlocked: false,
      isCompleted: false,
      progress: 0
    },
    {
      id: 5,
      name: "Science Bridge",
      zone: "Final Challenge",
      subject: "Integrated Sciences",
      icon: "🏗️",
      color: "#F39C12",
      isUnlocked: false,
      isCompleted: false,
      progress: 0
    }
  ]);

  const router = useRouter();

  const handleLevelPress = (level: Level) => {
    if (level.isUnlocked) {
      console.log(`Starting level: ${level.name}`);
      // Navigate to level gameplay
      router.push("/science-survival-quest-start")
    }
  };

  const renderConnector = (index: number) => {
    if (index === levels.length - 1) return null;
    
    return (
      <View style={styles.connector}>
        <View style={styles.dottedLine}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </View>
    );
  };

  const renderLevel = (level: Level, index: number) => {
    const isEven = index % 2 === 0;
    
    return (
      <View key={level.id} style={styles.levelContainer}>
        <View style={[styles.levelWrapper, isEven ? styles.levelLeft : styles.levelRight]}>
          <TouchableOpacity
            style={[
              styles.levelCard,
              { 
                backgroundColor: level.color,
                opacity: level.isUnlocked ? 1 : 0.5
              }
            ]}
            onPress={() => handleLevelPress(level)}
            disabled={!level.isUnlocked}
          >
            <View style={styles.levelIcon}>
              <Text style={styles.iconText}>{level.icon}</Text>
            </View>
            
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{level.name}</Text>
              <Text style={styles.levelZone}>{level.zone}</Text>
              <Text style={styles.levelSubject}>{level.subject}</Text>
            </View>
            
            {level.isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
            
            {!level.isUnlocked && (
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {level.isUnlocked && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${level.progress}%`, backgroundColor: level.color }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{level.progress}%</Text>
            </View>
          )}
        </View>
        
        {renderConnector(index)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Science Survival Quest</Text>
        <Text style={styles.subtitle}>Choose Your Adventure Zone</Text>
        <View style={styles.clouds}>
          <Text style={styles.cloud}>☁️</Text>
          <Text style={[styles.cloud, styles.cloud2]}>☁️</Text>
          <Text style={[styles.cloud, styles.cloud3]}>☁️</Text>
        </View>
      </View>

      {/* Levels */}
      <ScrollView 
        style={styles.levelsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {levels.map((level, index) => renderLevel(level, index))}
        
        {/* Victory Section */}
        <View style={styles.victorySection}>
          <Text style={styles.victoryIcon}>🏆</Text>
          <Text style={styles.victoryText}>Escape the Island!</Text>
          <Text style={styles.victorySubtext}>Complete all zones to win</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center' as const,
    position: 'relative' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center' as const,
  },
  clouds: {
    position: 'absolute' as const,
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  cloud: {
    fontSize: 24,
    opacity: 0.7,
  },
  cloud2: {
    marginTop: 10,
    opacity: 0.5,
  },
  cloud3: {
    marginTop: 5,
    opacity: 0.6,
  },
  levelsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelWrapper: {
    width: '100%',
  },
  levelLeft: {
    alignItems: 'flex-start' as const,
  },
  levelRight: {
    alignItems: 'flex-end' as const,
  },
  levelCard: {
    width: 280, // Fixed width instead of width * 0.75
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative' as const,
  },
  levelIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 15,
  },
  iconText: {
    fontSize: 32,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  levelZone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  levelSubject: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic' as const,
  },
  completedBadge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27AE60',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  lockedOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  lockIcon: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  progressContainer: {
    marginTop: 12,
    width: 280, // Fixed width instead of width * 0.75
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: 'bold' as const,
    minWidth: 35,
  },
  connector: {
    alignItems: 'center' as const,
    paddingVertical: 10,
  },
  dottedLine: {
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BDC3C7',
    marginVertical: 2,
  },
  victorySection: {
    alignItems: 'center' as const,
    marginTop: 30,
    padding: 20,
  },
  victoryIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  victoryText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#F39C12',
    marginBottom: 5,
  },
  victorySubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center' as const,
  },
};

export default ScienceSurvivalQuest;