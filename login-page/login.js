const { DatabaseClient } = require("../database/user.js");

let signUpSubmitBtn = document.getElementById("signUpSubmitBtn");
signUpSubmitBtn.onclick = async function () {
    let database = await new DatabaseClient(); 

    let username = document.getElementById("signUpUsername").value;
    let email = document.getElementById("signUpPassword").value;
    let password = document.getElementById("signUpPassword").value; 


    console.log(username); 
    console.log(email); 
    console.log(password); 
    
    await database.close(); 
};
