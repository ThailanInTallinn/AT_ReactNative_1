const getRate = async (currency, date) => {
  const ratesData = await fetch(
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda=%27${currency}%27&@dataCotacao=%27${date}%27&$top=1&$format=json`
  );
  console.log(date);
  return ratesData.json();
};

export { getRate };
