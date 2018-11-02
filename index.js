
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
var admin = require("firebase-admin");

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));



// Fetch the service account key JSON file contents
var serviceAccount = require("./citas-292bb-firebase-adminsdk-dv3fx-86cda32c59.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://citas-292bb.firebaseio.com/"
});


// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();


//

app.get('/', function (req, res) {
    res.render('home',{'title':'Citas Médicas','description':'Esta aplicación nos ayuda a gestionar las citas médicas y sus horarios.'});
});

app.get('/doctores', function (req, res) {
    var list;
    db.ref("doctores").on("value",function(snapshot){
        list=snapshot.val()
    })
    res.render('doctores',{'list':list});
});

app.get('/doctor/new', function (req, res) {
    res.render('create_doctor');
});

app.post('/doctor/new', function (req, res) {
    var newDoctor = {
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        phone:req.body.phone,
        email:req.body.mail,
        starthour:req.body.horainicio,
        endhour:req.body.horafin
    }
    db.ref("doctores").push(newDoctor);
    console.log('Se intento guardar: ',req.body);    
    res.render('create_doctor',{'message':'¡Se guardó correctamente el doctor!'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});