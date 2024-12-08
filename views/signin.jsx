import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  TextInput,
  View,
  Button,
  StyleSheet,
  Pressable,
  Text,
} from "react-native";

export default function SignIn({ setUserToken }) {
  const [data, setData] = useState({});

  const navigation = useNavigation();

  const login = () => {
    if (data.email && data.password) {
      setUserToken(true);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E-mail"
        keyboardType="default"
        style={styles.userInput}
        value={data?.email}
        onChangeText={(text) => {
          setData((data) => ({ ...data, email: text }));
        }}
      />
      <TextInput
        placeholder="Senha"
        keyboardType="default"
        style={styles.userInput}
        value={data?.password}
        onChangeText={(text) => {
          setData((data) => ({ ...data, password: text }));
        }}
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          login();
        }}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  userInput: {
    height: 90,
    width: 350,
    backgroundColor: "lightgray",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 30,
    fontSize: 20,
    paddingLeft: 15,
  },

  container: {
    alignItems: "center",
  },

  button: {
    width: 250,
    height: 80,
    backgroundColor: "lightblue",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 22,
  },
});
