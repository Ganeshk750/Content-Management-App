const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const { mongodbUrl , port, globalVariables}= require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();


/* Configure MongoDb  */
mongoose.connect(mongodbUrl,{ useUnifiedTopology: true })
    .then(response =>{
        console.log('Mongodb Connected Scuccessflly !!');
    }).catch(err =>{
        console.log('Databse Connection Failed..');
    });


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

/* Setup Views Engine To Use Handlebars  */
app.engine('handlebars', hbs({ defaultLayout: 'default'}));
app.set('view engine', 'handlebars');


/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}..` +'\n'+ 'press ctrl+c to stop server'));