import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

export default function TransacaoItemList({
  date,
  amount,
  description,
  currency,
  type,
  totalAmount,
  category,
  name,
  actionRemove,
  id,
  actionUpdate,
}) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const navigation = useNavigation();

  const formatDate = (oldDate) => {
    const newDay = oldDate.slice(8, 10);
    const newMonth = oldDate.slice(5, 7);
    const newYear = oldDate.slice(0, 4);
    const newDate = newDay.concat("/", newMonth, "/", newYear);
    return newDate;
  };

  const formatCur = (oldCur) => {
    const newCur = oldCur.slice(0, 4);
    return newCur;
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        renderLeftActions={(event, drag) => {
          const styleAnimation = useAnimatedStyle(() => {
            return {
              transform: [{ translateX: drag.value - 130 }],
            };
          });
          return (
            <Reanimated.View
              style={[
                styleAnimation,
                {
                  width: 120,
                  height: 80,

                  marginRight: 70,
                  marginTop: 20,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  flexDirection: "row",
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  actionRemove(id);
                }}
                style={{
                  backgroundColor: "red",
                  flex: 1,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Excluir
                </Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "blue",
                  flex: 1,
                  height: "100%",
                  justifyContent: "center",
                }}
                onPress={() => {
                  navigation.navigate("Form", {
                    toEditId: id,
                  });
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Editar
                </Text>
              </Pressable>
            </Reanimated.View>
          );
        }}
      >
        <Pressable
          style={{
            ...styles.container,
            flexDirection: isLandscape ? "row" : "",
            justifyContent: isLandscape ? "space-between" : "",
          }}
          onPress={() => {
            console.log(type);
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={{ ...styles.text, fontSize: 22 }}>{`${formatCur(
              currency
            )}${amount}`}</Text>
            <Text style={styles.text}>{formatDate(date)}</Text>
            <Text style={styles.text}>{description}</Text>
          </View>
          {isLandscape && (
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.text}>{type}</Text>
              <Text style={styles.text}>Valor em BRL{totalAmount}</Text>
              <Text style={styles.text}>{category}</Text>
            </View>
          )}
        </Pressable>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    height: 100,
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },

  text: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    flex: 1,
  },
});
