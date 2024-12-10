//https://at-mobile-f0365-default-rtdb.firebaseio.com/

const url =
  "https://at-mobile-f0365-default-rtdb.firebaseio.com/transactions.json";

const getDataBase = async (setData) => {
  const allData = await fetch(url)
    .then((resp) => resp.json())
    .then((data) => setData(Object.values(data)));
};

const save = async (data) => {
  const postResponse = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const postResult = await postResponse.json();

  const patchResponse = await fetch(
    `https://at-mobile-f0365-default-rtdb.firebaseio.com/transactions/${postResult.name}.json`,
    {
      method: "PATCH",
      body: JSON.stringify({ id: postResult.name }),
    }
  );
};

const actionUpdate = async (produtoID, newData) => {
  await fetch(
    `https://at-mobile-f0365-default-rtdb.firebaseio.com/transactions/${produtoID}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(newData),
    }
  );
};

export { save, getDataBase, actionUpdate };
