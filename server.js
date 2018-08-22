var express = require('express');
var app = express();
var cors = require('cors');
var loki = require('lokijs')
var db = new loki('loki.json')
var fs = require('fs');

var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors());

app.get('/', function(req, res) {
  res.type('text/html');
  
  fs.readFile('home_page.html', 'utf8', function (err,data) {
    if (err) {
      console.log(err);
      res.send('<li><a  target="_blank" href=\"https://github.com/jrichardsz/realtime-api-builder\">https://github.com/jrichardsz/realtime-api-builder</a></li>');
    }
    res.send(data);
  });

});

app.get('/v1/:entity', function(req, res) {
  
  var entity = db.getCollection(req.params.entity)

  if(!entity){
    res.json({
      "status":"501",
      "message":req.params.entity + " entity was not found"      
    });
  }else {
    
    var lokiResponse = entity.find();
    
    for(key in lokiResponse){
      delete lokiResponse[key].meta;
      delete lokiResponse[key].$loki;
    }
    
    res.json({
      "status":"200",
      "message":"success",      
      "content":lokiResponse,      
    });        
  }   
  
});

app.post('/v1/:entity', function(req, res) {
  
  var entity = db.getCollection(req.params.entity)
  
  if(!entity){
     entity = db.addCollection(req.params.entity);
  }  
  
  entity.insert(req.body)
  res.json({
    "status":"200",
    "message":"success"
  });
});

app.listen(process.env.PORT || 8080);

