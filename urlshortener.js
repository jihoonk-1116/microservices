require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const bodyparser = require('body-parser');
const shortid = require('shortid');
const url = require('url');
const validurl = require('valid-url')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://JihoonDB:<password>@firstdb.irfsc.mongodb.net/firstDB?retryWrites=true&w=majority",{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    (err)=>{console.log("DB connected",err)});

app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urls = new mongoose.Schema({
  original_url: {type: String, required:true},
  short_url:{type:String, required:true}
})
const Urlid = mongoose.model('Urlid', urls);

// Your first API endpoint
app.post('/api/shorturl', (req, res) => {
  var original_url = req.body.url;
  const short_url = shortid.generate();
  let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
  if(!original_url.match(urlRegex) ||
   original_url.match(new RegExp(/ftp/))){
    console.log("err");
    return res.json({error: 'invalid url'})
  }
  // const parsedUrl = url.parse(original_url);
  // dns.lookup(parsedUrl.hostname,function(error, address,family){
  // console.log(address + "    --: address");
  // if(error || !address){
  //     console.log(error + "Error In");
  //     res.json({error: 'invalid url'});
  //   }
  // })
  const urlid = Urlid.create({
            original_url, short_url
        }, (err) =>{
          if(err){
            return res.json({error:"existed url"});
          }
        })
  res.json({'original_url':original_url, 'short_url':short_url}) 
});

app.get('/api/shorturl/:short_url', (req,res)=>{
  const id = req.params.short_url;
  Urlid.findOne({short_url:id}, (err, url) =>{
    if(err) res.json({error:"Url not found"});
    else res.redirect(url.original_url);
  })
})
  
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
