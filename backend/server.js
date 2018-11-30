// import packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// import handlers
const display = require('./controllers/display');

// middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

// connect to database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'CIS550'
});
connection.connect(err => {
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }else{
        console.log("successfully connected to database");
    }
})

// handle requests
app.get('/',(req, res) => res.send("This is my mainpage"));
app.get('/display',(req, res) => display.handleDisplay(connection))


// setup listen port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
});