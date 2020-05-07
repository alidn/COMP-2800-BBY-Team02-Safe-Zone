const SIGNIN_URL = "http://localhost:3000/login";

document.getElementById("signInSubmitBtn").onclick = async function (event) {
  event.preventDefault();
  let username = "some_user";
  let password = "pass";
  let body = {
    username: username,
    password: password,
  };

  let response = await fetch(SIGNIN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log(await response.json());
};
