import { View, Text, StyleSheet } from "react-native";

export default function TransacaoListScreen() {
  return (
    <View style={styles.outerContainer}>
      <Text style={styles.header}>Transações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    marginTop: 20,
    width: "100%",
    paddingLeft: 10,
    fontWeight: 600,
  },

  outerContainer: {
    padding: 20,
  },
});
