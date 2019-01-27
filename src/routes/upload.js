const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');

const Video = require('../models/video');
router.get('/', (req, res, next) => {
  res.render(
    'upload', {
      title: 'Youtube Mini',
      nav: [{
          link: '/upload',
          title: 'Upload'
        },
        {
          link: '/search',
          title: 'Search'
        }
      ]
    }
  );
});


const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/youtube-mini',
  file: (req, file) => {
    if (file.mimetype === 'video/mp4') {
      return {
        bucketName: 'videos'
      };
    } else {
      return null;
    }
  }
});
const upload = multer({
  storage
});

router.post('/video', upload.single('videoFile'), (req, res, next) => {
  const video = new Video({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    clicks: 0,
    //videoFile: req.body.videoFile.path,
    videoFile: req.file.filename,
    link: 'http://localhost:3000/view/'
  });
  video
    .save()
    .then(result => {
      console.log(result);
      console.log(req.file);
      res.render(
        'success', {
          title: 'YouTube Mini',
          nav: [{
              link: '/upload',
              title: 'Upload'
            },
            {
              link: '/search',
              title: 'Search'
            }
          ]
        }
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

module.exports = router;
