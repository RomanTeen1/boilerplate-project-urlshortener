require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();








// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const originalUrls = [];
const shortUrls = [];

// Your first API endpoint
app.post('/api/shorturl', bodyParser.urlencoded({extended:false}), function(req, res) {
  const url = req.body.url;
  let foundIndex = originalUrls.indexOf(url);

  if(!url.includes('http://') && !url.includes('https://')){
    return res.json({error: "Invalid url"});
  }

  if(foundIndex < 0){
    originalUrls.push(url);
    shortUrls.push(shortUrls.length)
    return res.json({original_url: url, short_url: shortUrls.length-1});
  }
  return res.json({original_url: url, short_url: shortUrls[foundIndex]});
});

app.get('/api/shorturl/:shorturl', (req, res) =>{
  const shortUrl = Number(req.params.shorturl) ;
  const foundIndex = shortUrls.indexOf(shortUrl);

  if(foundIndex < 0){
    return res.json({error: 'No short URL found for the given input'});
  }

  res.redirect(originalUrls[foundIndex]);
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
