import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { fetchData } from "../api/currencies";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getRate } from "../api/rates";
import { actionUpdate, save } from "../utils/database";

export default function Form({ route }) {
  const [localData, setLocalData] = useState({});
  const navigation = useNavigation();
  const { toEditId } = route.params;
  const [finalData, setFinalData] = useState([]);
  const [dataForm, setDataForm] = useState({
    date: new Date(),
  });
  const [dateTimePickerShow, setDateTimePickerShow] = useState(false);

  useEffect(() => {
    fetchData().then((data) => {
      setFinalData(data["value"]);
    });

    if (!dataForm.id) {
      setDataForm({ ...dataForm, id: Math.round(Math.random() * 10000) });
    }
  }, []);

  useEffect(() => {
    if (dataForm.currency && dataForm.date) {
      getRate(dataForm.currency.slice(0, 3), formatString(dataForm.date)).then(
        (data) =>
          setDataForm({
            ...dataForm,
            exchangeRate: data.value[0].cotacaoCompra,
          })
      );
    }
  }, [dataForm.currency, dataForm.date]);

  useEffect(() => {
    save(localData.dataForm);
  }, [localData]);

  useEffect(() => {
    if (toEditId != undefined) {
      const getDataBase = async () => {
        const allData = await fetch(
          `https://at-mobile-f0365-default-rtdb.firebaseio.com/transactions/${toEditId}.json`
        )
          .then((resp) => resp.json())
          .then((data) =>
            setDataForm((dataForm) => ({
              ...dataForm,
              amount: data.amount,
              category: data.category,
              currency: data.currency,
              date: new Date(data.date),
              description: data.description,
              exchangeRate: data.exchangeRate,
              id: data.id,
              totalAmount: Number(data.totalAmount),
              type: data.type,
            }))
          );
      };

      getDataBase();
    }
  }, [toEditId]);

  const formatString = (oldStr) => {
    const newStr = oldStr.toLocaleDateString("pt-BR").replaceAll("/", "-");
    const newDay = newStr.slice(0, 2);
    const newMonth = newStr.slice(3, 5);
    const newYear = newStr.slice(6, 10);
    const rightString = newMonth.concat("-", newDay, "-", newYear);
    return rightString;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Moeda</Text>
      <Picker
        selectedValue={dataForm.currency}
        style={{ backgroundColor: "lightgrey", height: 60 }}
        onValueChange={(value) => {
          setDataForm({ ...dataForm, currency: value });
        }}
      >
        {finalData.map((item, index) => {
          return (
            <Picker.Item
              label={`${item.simbolo} - ${item.nomeFormatado}`}
              key={index}
              value={`${item.simbolo} - ${item.nomeFormatado}`}
            />
          );
        })}
      </Picker>
      <Text style={styles.header}>Valor</Text>
      <TextInput
        placeholder="Valor da transação"
        style={{
          backgroundColor: "lightgrey",
          height: 60,
          paddingLeft: 15,
          fontSize: 18,
          marginBottom: 15,
        }}
        keyboardType="numeric"
        value={dataForm.amount}
        onChangeText={(value) => {
          setDataForm({
            ...dataForm,
            amount: value,
            totalAmount: `${dataForm.amount * dataForm.exchangeRate * 10}`,
          });
          console.log(dataForm.exchangeRate);
        }}
      />

      <Pressable onPress={() => setDateTimePickerShow(true)}>
        <View>
          <Text style={styles.header}>Data e hora da transação</Text>
          <TextInput
            style={{
              backgroundColor: "lightgrey",
              height: 60,
              paddingLeft: 15,
              fontSize: 18,
              marginBottom: 15,
            }}
            editable={false}
            value={`${formatString(
              dataForm.date
            )} às ${dataForm.date.toLocaleTimeString("pt-BR")}`}
          />
        </View>
      </Pressable>
      {dateTimePickerShow && (
        <DateTimePicker
          value={dataForm.date}
          onChange={(event, date) => {
            setDateTimePickerShow(false);
            setDataForm({
              ...dataForm,
              date: date,
            });
          }}
        />
      )}
      <Text style={styles.header}>Valor total em BRL</Text>
      <TextInput
        style={{
          backgroundColor: "lightgrey",
          height: 60,
          paddingLeft: 15,
          fontSize: 18,
          marginBottom: 15,
        }}
        editable={false}
        value={
          dataForm.exchangeRate && dataForm.amount
            ? `${dataForm.exchangeRate * dataForm.amount}`
            : null
        }
      />
      <Text style={styles.header}>Categoria</Text>
      <Picker
        style={{ backgroundColor: "lightgrey", height: 60 }}
        selectedValue={dataForm.category}
        onValueChange={(value) => {
          setDataForm({ ...dataForm, category: value });
        }}
      >
        <Picker.Item label="Alimentação" value="alimentacao" />
        <Picker.Item label="Saúde" value="saude" />
        <Picker.Item label="Estadia" value="estadia" />
        <Picker.Item label="Compras" value="compras" />
      </Picker>
      <Text style={styles.header}>Descrição</Text>
      <TextInput
        style={{
          backgroundColor: "lightgrey",
          height: 60,
          paddingLeft: 15,
          fontSize: 18,
          marginBottom: 15,
        }}
        value={dataForm.description}
        onChangeText={(value) => {
          setDataForm({ ...dataForm, description: value });
        }}
      />
      <Text style={styles.header}>Tipo</Text>
      <Picker
        style={{ backgroundColor: "lightgrey", height: 60, marginBottom: 30 }}
        selectedValue={dataForm.type}
        onValueChange={(value) => {
          setDataForm({ ...dataForm, type: value });
        }}
      >
        <Picker.Item label="Despesa" value="despesa" />
        <Picker.Item label="Receita" value="receita" />
      </Picker>

      <Pressable
        style={{
          marginBottom: 100,
          width: "100%",
          backgroundColor: "blue",
          height: 80,
          justifyContent: "center",
        }}
        onPress={() => {
          if (typeof dataForm.id != Number) {
            //editar
            actionUpdate(dataForm.id, dataForm);
            navigation.navigate("Home");
          } else {
            //salvar
            setLocalData((localData) => ({ ...localData, dataForm }));
            navigation.navigate("Home");
          }
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>
          Salvar
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 600,
  },

  container: {
    padding: 10,
  },
});
