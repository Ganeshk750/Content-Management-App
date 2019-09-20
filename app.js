const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const { mongodbUrl , port}= require('./config/configuration');
const app = express();

/* Configure MongoDb  */
mongoose.connect(mongodbUrl,{ useUnifiedTopology: true })
    .then(response =>{
        console.log('Mongodb Connected Scuccessflly !!');
    }).catch(err =>{
        console.log('Databse Connection Failed..');
    });

/* Setup Views Engine To Use Handlebars  */

app.engine('handlebars', hbs({ defaultLayout: 'default'}));
app.set('view engine', 'handlebars');



/* Configure Express */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}..` +'\n'+ 'press ctrl+c to stop server'));