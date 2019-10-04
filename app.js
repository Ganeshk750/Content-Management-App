const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyparser = require('body-parser');
const passport = require("passport");
const hbs = require('express-handlebars');
const { mongodbUrl , port, globalVariables}= require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const { selectOption } = require('./config/customFunction');
const app = express();


/* Configure MongoDb  */
mongoose.connect(mongodbUrl,{ useUnifiedTopology: true })
    .then(response =>{
        console.log('Mongodb Connected Scuccessflly !!');
    }).catch(err =>{
        console.log('Databse Connection Failed..');
    });


 //Passport middleware
app.use(passport.initialize());   

// middleware for body
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

/* Configure Express */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


/* Flash and Session */
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());
app.use(globalVariables);

/* File Upload Middleware */
app.use(fileUpload());

/* Setup Views Engine To Use Handlebars  */
app.engine('handlebars', hbs({ defaultLayout: 'default', helpers:{select: selectOption}}));
app.set('view engine', 'handlebars');

/* Method Override MiddleWare */
app.use(methodOverride('newMethod'));


/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}..` +'\n'+ 'press ctrl+c to stop server'));