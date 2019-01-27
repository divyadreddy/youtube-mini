const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const GridFSStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
const mongo = require("mongodb");
const fs = require('fs');

const Video = require('../models/video');




router.get('/:videoId', (req, res, next) => {
  const id = req.params.videoId;
  Video.findById(id)
    .exec()
    .then(result => {
      console.log(result);
      var response;
      var gfs;

      var conn = mongoose.createConnection('mongodb://localhost:27017/youtube-mini', {
        useNewUrlParser: true
      });
      conn.once('open', () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('videos');
        console.log(result.videoFile);

        gfs.files.findOne({
          filename: result.videoFile
        }, (err, file) => {
          if (!file) {
            res.status(500).json({
              error: err
            });
          } else {
            console.log('       blah           ' + file);
            console.log('       id          ' + file._id);
            res.writeHead(200, {
              'Content-Type': 'video/mp4'
            });
            var readstream = gfs.createReadStream({
              _id: file._id
            });
            //write content to file system
/*var fs_write_stream = fs.createWriteStream(path.join(__dirname, '/public/images/vid.mp4'));

readstream.pipe(fs_write_stream);
fs_write_stream.on('close', function () {
     console.log('file has been written fully!');
});
*/
            readstream.pipe(res);
            //return res.status(200).json(file);
          }
          /*res.render(
            'view', {
              id: result._id,
              title: result.title,
              description: result.description,
              clicks: result.clicks,
              //response: response,
              nav: [{
                  link: '/upload',
                  title: 'Upload'
                },
                {
                  link: '/search',
                  title: 'Search'
                }
              ],
            }
          );*/
        });
      });
console.log('               inc                  ')
      Video.findOneAndUpdate({
        _id: id
      }, {
        $inc: {
          'clicks': 0.5
        }
      }).exec();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        err
      })
    });

});

module.exports = router;
