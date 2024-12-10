import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { fetchData } from "../api/currencies";
import { useEffect, useState } from "react";
import TransacaoItemList from "../components/transacaoItemList";
import { getDataBase } from "../utils/database";
import { Picker } from "@react-native-picker/picker";

export default function TransacaoListScreen(props) {
  const [finalData, setFinalData] = useState([]);
  const navigation = props.navigation;
  const route = props.route;
  const params = route.params;
  const [data, setData] = useState([]);
  const [sortDate, setSortDate] = useState(false);
  const [sortAmount, setSortAmount] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [sortedByDate, setSortedByDate] = useState([]);
  const [sortedByAmount, setSortedByAmount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const url =
    "https://at-mobile-f0365-default-rtdb.firebaseio.com/transactions.json";

  const filterDate = () => {
    const newArray = Object.entries(data);
    const sortedDates = [];
    const sortedArray = [];
    const finalArray = [];

    for (let item in newArray) {
      sortedDates.push(`${newArray[item][1].date}`);
    }

    const reversed = sortedDates.reverse();

    for (let item in reversed) {
      const found = newArray.find(
        (elemento) => elemento[1].date == reversed[item]
      );
      sortedArray.push(found);
    }

    for (let item in sortedArray) {
      const pureObject = sortedArray[item][1];
      finalArray.push(pureObject);
    }

    setSortedByDate(finalArray);
  };

  useEffect(() => {
    fetchData().then((data) => {
      setFinalData(data["value"]);
    });
    getDataBase(setData);
    setOriginalData(data);
  }, []);

  useEffect(() => {
    if (sortDate) {
      filterDate();
    } else if (sortAmount) {
      filterAmount();
    }
  }, [sortAmount, sortDate]);

  const filterAmount = () => {
    const newArray = Object.entries(data);
    const sortedAmounts = [];
    const sortedArray = [];
    const finalArray = [];

    for (let item in newArray) {
      sortedAmounts.push(`${newArray[item][1].totalAmount}`);
    }

    const sorted = sortedAmounts.sort();

    for (let item in sorted) {
      const found = newArray.find(
        (elemento) => elemento[1].totalAmount == sorted[item]
      );
      sortedArray.push(found);
    }

    for (let item in sortedArray) {
      const pureObject = sortedArray[item][1];
      finalArray.push(pureObject);
    }

    setSortedByAmount(finalArray);
  };

  const SwitchView = () => {
    if (sortDate) {
      return sortedByDate;
    } else if (sortAmount) {
      return sortedByAmount;
    } else {
      return originalData;
    }
  };

  const searchData = (keyword) => {
    const newData = data.filter((item) => {
      return (
        item.currency.toLowerCase().match(keyword) ||
        item.totalAmount.match(keyword) ||
        item.date.match(keyword) ||
        item.description.match(keyword)
      );
    });

    setData(newData);
  };

  const actionRemove = async (produtoID) => {
    //remover da API
    const response = await fetch(
      `https://at-mobile-f0365-default-rtdb.firebaseio.com/transactions/${produtoID}.json`,
      { method: "DELETE" }
    );
    //remover da listaLocal
    setData(data.filter((item) => item.id != produtoID));
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.header}>Transações</Text>
      <Pressable
        style={styles.formButton}
        onPress={() => {
          navigation.navigate("Form", {
            setData: setData,
            data: data,
          });
        }}
      >
        <Text style={styles.buttonText}>Cadastrar produto</Text>
      </Pressable>
      <Picker
        style={{ backgroundColor: "lightgrey", height: 60, marginTop: 10 }}
        onValueChange={(value) => {
          if (value == "data") {
            setSortDate(true);
            setSortAmount(false);
          } else if (value == "valor") {
            setSortDate(false);
            setSortAmount(true);
          } else if (value == "NA") {
            setSortDate(false);
            setSortAmount(false);
          }
        }}
      >
        <Picker.Item label="Não ordenar" value="NA" />
        <Picker.Item label="Valor" value="valor" />
        <Picker.Item label="Data" value="data" />
      </Picker>
      <View style={styles.searchBox}>
        <TextInput
          style={{
            backgroundColor: "lightgrey",
            height: 60,
            paddingLeft: 15,
            fontSize: 18,
            marginBottom: 10,
            marginTop: 10,
            width: "70%",
          }}
          placeholder="Filtrar"
          onChangeText={(value) => {
            setSearchTerm(value);
          }}
          value={searchTerm}
        />
        <Pressable
          style={styles.searchButton}
          onPress={() => {
            searchData(searchTerm.toLowerCase());
          }}
        >
          <Text
            style={{
              textAlign: "center",
              alignContent: "center",
              fontSize: 20,
            }}
          >
            Buscar
          </Text>
        </Pressable>
      </View>
      <Pressable
        style={{
          backgroundColor: "red",
          textAlign: "center",
          alignItems: "center",
          borderRadius: 5,
          height: 30,
          justifyContent: "center",
        }}
        onPress={() => {
          setSearchTerm("");
          getDataBase(setData);
        }}
      >
        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
          }}
        >
          Limpar
        </Text>
      </Pressable>

      {sortDate || sortAmount ? (
        <FlatList
          data={SwitchView()}
          style={{ flex: 1 }}
          renderItem={({ item, index }) => (
            <TransacaoItemList
              amount={item.amount}
              date={item.date}
              description={item.description}
              currency={item.currency}
              type={item.type}
              totalAmount={item.totalAmount}
              category={item.category}
              id={item.id}
              actionRemove={() => actionRemove(item.id)}
              actionUpdate={() => actionUpdate(item.id)}
            />
          )}
        />
      ) : (
        <FlatList
          data={data}
          style={{ flex: 1 }}
          renderItem={({ item, index }) => (
            <TransacaoItemList
              amount={item.amount}
              date={item.date}
              description={item.description}
              currency={item.currency}
              name={index}
              type={item.type}
              totalAmount={item.totalAmount}
              category={item.category}
              id={item.id}
              actionRemove={() => actionRemove(item.id)}
              actionUpdate={() => actionUpdate(item.id)}
            />
          )}
        />
      )}
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
    flex: 1,
  },

  formButton: {
    height: 50,
    width: "100%",
    backgroundColor: "lightsteelblue",
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
  },

  buttonText: {
    textAlign: "center",
    fontSize: 20,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  searchButton: {
    backgroundColor: "lightsteelblue",
    height: 60,
    width: 100,
    borderRadius: 5,
    alignContent: "center",
    justifyContent: "center",
  },
});
