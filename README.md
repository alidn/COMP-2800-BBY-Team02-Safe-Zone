
## About 
This app is a small simulation game intended 
to increase awareness about COVID-19.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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
- Facebook API 
- Novel COVID API 


## Usage 

#### Installing required tools
- MongoDB, to use mongodb, you need to have your 
own mongodb connection string and place it in
`database/utility.js` file 
- NPM and Node 

#### Running the app 
First, run npm install to install all the dependencies.

Run `npm build` and then `npm start`. 

This Runs the app in the development mode.<br />
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

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
