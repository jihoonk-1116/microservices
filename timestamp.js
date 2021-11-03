// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
//--------- Start -------//
app.get("/api/", function(req,res){
  //If empty date, get current time's unix time
  console.log("empty - " + req.body);
  let date = new Date();
  res.redirect("/api/" + date.getTime()); 
  //redirect to :date endpoint with current unix time.
})
app.get("/api/:date", function (req, res){
  console.log(req.params.date);
  if(/\D/.test(req.params.date)){ //Only digit
    date = new Date(req.params.date);
  }
  else{ //req is not digit, but represents a time as string type
    date = new Date(parseInt(req.params.date))
  }
  if(isNaN(date.getTime())){
    return res.json({error : "Invalid Date"});
    //after converting date object, the date is NaN
    //then return error with message
  }
  utcDate = date.toUTCString(); // convert the date to UTC time
  unixDate = date.getTime();// convert the date to UNIX time
  console.log(utcDate);
  console.log(unixDate);
  res.json({
    unix: unixDate,
    utc : utcDate
  }); //response to client with JSON
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
