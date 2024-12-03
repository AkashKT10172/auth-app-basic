const express = require('express');
const app = express();

//connnect to db
const connectToMongo = require('./db');
connectToMongo();

//import Routes
const authRoute = require('./Routes/auth');
const postRoute = require('./Routes/posts');

//middlewares
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/user', postRoute);



app.listen(5000, () => console.log("server is ON!"));