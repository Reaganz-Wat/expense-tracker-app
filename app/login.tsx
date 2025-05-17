import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const alientData: CombinedAlient = {
    alienName: "Zorg",
    alientAge: 205,
    alientTechnology: "High Tech",
  };

  const [alientD, setAlientD] = useState<CombinedAlient>({
    alienName: "Watz",
    alientAge: 4,
    alientTechnology: "Hell Boy",
  });

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.dark.background }]}
    >
      <Text style={[styles.textStyle, {color: Colors.dark.text}]}>Sign Up Page</Text>
      <Name firstname="Watmon" lastname="Reagan" age={24} />
      <AlientComponent {...alientD} />
      <Spacer height={20} />
      <Button
        title="Click Me Here"
        onPress={() =>
          setAlientD({
            alienName: "Watmon Reagan",
            alientAge: 25,
            alientTechnology: "Nice Technology",
          })
        }
      />
      <Spacer height={20} />
      <TouchableOpacity
        style={{
          margin: 5,
          borderRadius: 5,
          backgroundColor: "green",
          padding: 10,
        }}
      >
        <Text>Reset this</Text>
      </TouchableOpacity>
    </View>
  );
}

interface NameProps {
  firstname: string;
  lastname: string;
  age: number;
}

type AlientInforProps = {
  alienName: string;
};

type AlientAgeProps = {
  alientAge: number;
  alientTechnology: string;
};

type CombinedAlient = AlientInforProps & AlientAgeProps;

const AlientComponent: React.FC<CombinedAlient> = (props) => (
  <View>
    <Text>AlienName: {props.alienName}</Text>
    <Text>AlienAge: {props.alientAge}</Text>
    <Text>Alient Technology: {props.alientTechnology}</Text>
  </View>
);

const Spacer = ({ height }: { height: number }) => (
  <View style={{ marginTop: height }}></View>
);

const Name: React.FC<NameProps> = ({ firstname, lastname, age }) => {
  return (
    <View>
      <Text>FirstName: {firstname}</Text>
      <Text>LastName: {lastname}</Text>
      <Text>Age: {age}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontSize: 40,
    color: "blue",
  },
});
