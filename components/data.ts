import { Challenge, Plant } from "@/app/science-survival-quest-start";
import { useState } from "react";

  // Plants in the jungle
  export const [plants, setPlants] = useState<Plant[]>([
    {
      id: 1,
      name: "Glowing Fern",
      image: require('../assets/images/berry.png'),
      isEdible: true,
      cellStructure: "Has visible chloroplasts",
      photosynthesis: true,
      discovered: false,
      x: width * 0.2,
      y: height * 0.3
    },
    {
      id: 2,
      name: "Crystal Moss",
      image: require('../assets/images/vine.png'),
      isEdible: false,
      cellStructure: "Unusual crystalline structure",
      photosynthesis: false,
      discovered: false,
      x: width * 0.7,
      y: height * 0.4
    },
    {
      id: 3,
      name: "Bio-luminous Leaf",
      image: require('../assets/images/berry.png'),
      isEdible: true,
      cellStructure: "Dense chloroplast clusters",
      photosynthesis: true,
      discovered: false,
      x: width * 0.5,
      y: height * 0.6
    },
    {
      id: 4,
      name: "Toxic Vine",
      image: require('../assets/images/vine.png'),
      isEdible: false,
      cellStructure: "No chloroplasts, thick cell walls",
      photosynthesis: false,
      discovered: false,
      x: width * 0.3,
      y: height * 0.7
    }
  ]);

  // Challenges based on the game document
  export const challenges: Challenge[] = [
    {
      id: 1,
      title: "Cell Structure Identification",
      question: "Which cellular component is primarily responsible for photosynthesis in plants?",
      options: ["Nucleus", "Mitochondria", "Chloroplasts", "Cell Wall"],
      correctAnswer: 2,
      explanation: "Chloroplasts contain chlorophyll and are where photosynthesis occurs, converting sunlight into energy.",
      points: 25,
      completed: false
    },
    {
      id: 2,
      title: "Plant vs Animal Cells",
      question: "What structure provides rigid support and is unique to plant cells?",
      options: ["Cell Membrane", "Cytoplasm", "Vacuole", "Cell Wall"],
      correctAnswer: 3,
      explanation: "The cell wall is made of cellulose and provides structural support, protection, and shape to plant cells.",
      points: 30,
      completed: false
    },
    {
      id: 3,
      title: "Food Chain Knowledge",
      question: "In a jungle ecosystem, which organisms are typically the primary producers?",
      options: ["Carnivores", "Herbivores", "Plants", "Decomposers"],
      correctAnswer: 2,
      explanation: "Plants are primary producers because they make their own food through photosynthesis using sunlight.",
      points: 35,
      completed: false
    }
  ];