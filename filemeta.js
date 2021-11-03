var express = require('express');
var cors = require('cors');
var multer = require('multer')
var upload = multer({dest:'uploads/'})
var bodyparser = require('body-parser')
require('dotenv').config()


var app = express();

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse',upload.single('upfile'),(req,res)=>{
  var outputJson = {
    'name': req.file.originalname, 
    'type': req.file.mimetype,
    'size': req.file.size
    }
  console.log(outputJson);
  res.json(outputJson)
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
