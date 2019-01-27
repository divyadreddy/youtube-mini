const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

router.get('/', (req, res, next) => {

  res.render(
    'search', {
      search: '',
      str: '',
      results: '',
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
      videos: null,
    }
  );
});

const Video = require('../models/video');

router.get('/video', (req, res, next) => {
  let str = (req.query.search_query).toLowerCase();
  Video.find()
    //.select(title description clicks)
    .exec()
    .then(docs => {
      console.log('                                                query    '+ str );
      let result = [];
      console.log(docs[0]);
      docs.forEach(function(doc){
        if(doc.title.toLowerCase().indexOf(str) != -1
          || doc.description.toLowerCase().indexOf(str) != -1 ) {
        result.push({
          title: doc.title,
          description: doc.description,
          clicks: doc.clicks,
          link: 'http://localhost:3000/view/' + doc._id,
          id: doc._id
        });
      }
    });

      console.log(result);
      res.render(
        'search', {
          search: str,
          str: str,
          results: 'Results displayed for \'' + str + '\'',
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
