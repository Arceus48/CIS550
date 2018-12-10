// import packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// import handlers
const display = require('./controllers/display');
const welcome = require('./controllers/welcome');
const information = require('./controllers/information');

// middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

// connect to database
const dbconfig = require('./config.js');
const mysql = require('mysql');
const connection = mysql.createConnection(dbconfig);

connection.connect(err => {
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
    else{
        console.log("successfully connected to database");
    }
})

// handle requests
app.get('/',(req, res) => res.send("This is my mainpage"));
app.get('/display', display.handleDisplay(connection));
app.post('/welcome', welcome.handleWelcome(connection));
app.post('/information', information.handleInformation(connection));

// setup listen port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
});