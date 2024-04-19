const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mongoose= require('mongoose')
require('dotenv').config()
const PatientRoutes = require('./routes/PatientRoutes')
const VitalSignsRoutes = require('./routes/VitalSignsRoutes')
const authRoute = require('./routes/authRoute')
const {requireAuth} = require("./utils/utils");

// middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use('/auth',authRoute)
app.use('/patient', PatientRoutes); 
app.use('/nurse', VitalSignsRoutes); 



// view engine

// Database connection
const connectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected successfully");
        app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
    })
    .catch(err => console.log("Database connection failed", err));

// View engine setup for EJS
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('home'));