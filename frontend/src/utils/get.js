// function to send request to API and retrieve data

export const put = async (url, ACCESS_TOKEN) => {
  const data = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
  });
  console.log(data)
  const res = await data.json();
  return res;
};

export const get = async (url, ACCESS_TOKEN) => {
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
  });
  if (data.status !== 200){
    console.log(data.status);
    console.log('ERROR');
    return data.status;
  } else {
    // console.log(data.status);
    const res = await data.json();
    return res;
  }
};

export const post = async (url, ACCESS_TOKEN, body) => {
  const data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    body: body,
  });
  const res = await data.json();
  return res;
};

export const toggle = async (url, method, ACCESS_TOKEN, body = {}) => {
  const condition = !!body; // evalutes to false if body is empty and true otherwise
  const data = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    ...(condition && body),
  });

  // Print error message if request fails
  if (data.status === 204 || data.status === 200) {
    return;
  } else {
    const res = await data.json();
    return data;
  }
};
