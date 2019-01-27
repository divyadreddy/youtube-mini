const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');

const Video = require('../models/video');

//function routerHome(nav) {
router.get('/', (req, res, next) => {
  const analytics = {
    clicks: req.body.clicks
  };
  Video.find()
    //.select(title description clicks)
    .exec()
    .then(docs => {
      const result = docs.map(doc => {
        return {
          title: doc.title,
          description: doc.description,
          clicks: doc.clicks,
          link: 'http://localhost:3000/view/' + doc._id,
          id: doc._id
        };
      });
      console.log(result);
      res.render(
        'home', {
          title: 'Youtube Mini',
          nav: [{
              link: '/upload',
              title: 'Upload'
            },
            {
              link: '/search',
              title: 'Search'
            }
          ],
          videos: result
        });
    })
    .catch(err => console.log(err));
  //return routerHome;
});

module.exports = router;
