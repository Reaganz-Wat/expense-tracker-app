import React from "react";
import { View } from "react-native";

interface SpacerProps {
  height: number;
}

export const Spacer: React.FC<SpacerProps> = ({ height }) => (
  <View style={{ marginTop: height }}></View>
);
