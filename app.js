const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const GridFSStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
const mongo = require("mongodb");

const nav = [{
    link: '/',
    title: 'Home'
  },
  {
    link: '/upload',
    title: 'Upload'
  }
];

mongoose.connect('mongodb://localhost:27017/youtube-mini', {
  useNewUrlParser: true
});

const conn = null;

const homeRoutes = require('./src/routes/home');
const uploadRoutes = require('./src/routes/upload');
const viewRoutes = require('./src/routes/view');
const searchRoutes = require('./src/routes/search');


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jqueury/dist')));

app.use('/', homeRoutes);
app.use('/upload', uploadRoutes);
app.use('/view', viewRoutes);
app.use('/search', searchRoutes);

app.set('views', './src/views');
app.set('view engine', 'ejs');


app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app; //to export the module
