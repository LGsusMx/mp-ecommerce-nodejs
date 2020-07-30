var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
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
    var item = { 
        id: "1234",
        title: req.body.title,
        unit_price: parseFloat(req.body.price),
        category_id: 'phones',
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url: image_url,
        quantity:1,
    };
    // Fill the payer data with the exam data uwu
    var payer = {
        name: "Lalo",
        surname:"Landa",
        //identification: { type: "DNI", number: "535650015" },
        email: "test_user_58295862@testuser.com",
        phone: { area_code: "52", number: 5549737300 },
        address: { zip_code: "0394​0", street_name: "Insurgentes Sur", street_number: 1602 }
    };
    //external reference with my mail
    var external_reference = 'caednicolas2@gmail.com';

    //full url for notifications API
    var fullUrl = req.protocol + '://' + req.get('host') + '/notifications';

    // Back URL for responses
    var s = req.protocol + '://' + req.get('host') + '/success';
    var p = req.protocol + '://' + req.get('host') + '/pending';
    var f = req.protocol + '://' + req.get('host') + '/failure';
    // Crea un objeto de preferencia
    let preference = {
        items: [
            item
        ],
        payer: payer,
        external_reference: external_reference,
        payment_methods: { excluded_payment_methods: [{ id: 'amex' }], installments: 6 , excluded_payment_types:[{ id: 'atm' }]},
        notification_url: fullUrl,
        back_urls:{
            success:s,
            pending:p,
            failure:f
        },
        auto_return:"approved"

    };
    mercadopago.preferences.create(preference).then((response) => {
        console.log(response.body.id)
        res.render('detail', {id:response.body.id, price:req.body.price, title:req.body.title, img:req.body.img});
    }).catch((error) => {
        console.log(error)
        res.status(500).send(error);
    });

});


app.post('/notifications', (req,res)=>{
    var topic =req.body.topic;
    var id= req.body.id;
    console.log(id);
    // rESPONSE OF NOTIFICATION
    res.status(200).send('OK');
})

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT || 3000);