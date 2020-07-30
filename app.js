var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
const payer = require('./controller/cosito')
// SDK MP
const mercadopago = require('mercadopago');
var app = express();
dotenv.config();
mercadopago.configure({
    access_token: 'APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181'
});
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }))
// Configure CORS
app.use('/assets', express.static('assets'))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/failure', function (req, res) {

    res.render('failure');
});
app.get('/pending', function (req, res) {

    res.render('pending');
});
app.get('/approved', function (req, res) {

    res.render('approved');
});

app.post('/payment-process', function (req, res) {
    // Item generation with examen expects
    var image_url = req.protocol + '://' + req.get('host') +req.body.img.substring(1);
    console.log(image_url);
    var item = { 
        id: "1234",
        title: req.body.title,
        unit_price: parseFloat(req.body.price),
        category_id: 'phones',
        currency_id: "MXN",
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url: image_url,
        quantity:1,
    };
    var coso = new payer();
    coso.createPaymentMercadoPago(req,req.body.title,req.body.price,image_url);

});


app.post('/notifications', (req,res)=>{
    var topic =req.body.topic;
    var id= req.body.id;
    console.log(JSON.stringify(req.body));
    console.log(id + ' Notification');
    // rESPONSE OF NOTIFICATION
    res.status(200).send('OK');

    
})

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 3000);