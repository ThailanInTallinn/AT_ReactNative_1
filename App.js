import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import SignIn from "./views/signin";
import TransacaoListScreen from "./views/transacaoListScreen";
import Form from "./views/form";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [userToken, setUserToken] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          <>
            <Stack.Screen
              name="Home"
              component={TransacaoListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Form" component={Form} />
          </>
        ) : (
          <Stack.Screen name="SignIn">
            {() => (
              <SignIn
                component={SignIn}
                options={{ headerShown: true }}
                setUserToken={setUserToken}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
