
## Overview
This app is a small simulation game intended 
to increase awareness about COVID-19.

Link to the web app: [Website](https://rocky-temple-78336.herokuapp.com/ejs/login)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Link to the testing plan: [testing plan](https://docs.google.com/spreadsheets/d/1MJ9dS-VP9yhOe5p5RrGlAhf8RlyBSCCEG97f49UoT8M/edit#gid=0) 

### Team Information 
- Amir Khamesy - Term 1 CST Student at BCIT
- Ali - Term 1 CST Student at BCIT 
- Brendun Diu - Term 1 CST Student at BCIT
- Takashi Asaoka - Term 1 CST Student at BCIT
- Sam Merati - Term 1 CST Student at BCIT

#### Languages 
- HTML/CSS
- JavaScript

#### Libraries and frameworks  
- Mongodb NodeJS driver 
- React 
- Jest library for testing. 
- Jquery
- Bootstrap 

#### Third party apis
- Facebook API (you don't need ant passwords or credentials for this)
- Novel COVID API (you don't need ant passwords or credentials for this)


## Usage 

#### Installing required tools
- MongoDB, to use mongodb, you need to have your 
own mongodb connection string and place it in
`database/utility.js` file 
- NPM and Node 

#### Running the app 

1. First, run `npm install` to install all the dependencies.

2. Run `npm run build` and then `npm start`. 

3. This Runs the app in the development mode.

4. Open [http://localhost:5000/ejs/login](http://localhost:5000/ejs/login) to view it in the browser.

## File Structure 
```
root
  ├── build - contains all the build files after you run `npm run build`
  ├── database - contains the database layer files and unit tests.
  ├── public - contains css, static html, js and images. 
  ├── src - contains the react components. 
  ├── views - contains the ejs files.
  ├── server.js - the main server file. 

```
