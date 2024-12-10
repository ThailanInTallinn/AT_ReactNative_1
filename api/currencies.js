const URI =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json";

const fetchData = async () => {
  const totalData = await fetch(URI);
  return totalData.json();
};

export { fetchData };
