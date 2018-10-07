const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');



const app = express();

mongoose.connect("mongodb+srv://anokhaMongoDBuserID:wZBw88V7Yx9uXgRX@cluster0-mijcm.mongodb.net/angular-node-auth?retryWrites=true", { useNewUrlParser: true })
.then(() => {
  console.log('Database Connection success');
}).catch((err) => {
  console.log('Database connection error = ', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
