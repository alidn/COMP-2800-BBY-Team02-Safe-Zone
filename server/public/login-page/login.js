const SIGNIN_URL = "http://localhost:3000/login";

document.getElementById("signInSubmitBtn").onclick = function (event) {
  event.preventDefault();
  let username = "Asdf";
  let password = "ASdfaSF";

  fetch(SIGNIN_URL, {
    headers: { "content-type": "application/json" },
    body: {
      username: username,
      password: password,
    },
    method: "POST",
  })
    .then((response) => {
      console.log(response.json());
      console.log("Here");
      return response.json();
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
};
