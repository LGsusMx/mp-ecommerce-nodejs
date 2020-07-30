require('./config/config');
var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');
const bodyParser = require('body-parser');
const https = require('https');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// configuracion de handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// configuracion de rutas
app.get('/', function(req, res) {
    res.render('home');
});
app.get('/detail', function(req, res) {
    res.render('detail', req.query);
});
app.get('/rejected', function(req, res) {
    res.render('rejected');
});
app.get('/pending', function(req, res) {
    res.render('pending');
});
app.get('/approved', function(req, res) {
    const url = 'https://api.mercadopago.com/v1/payments/' + req.query.payment_id + '?access_token=' + process.env.ACCESS_TOKEN_PROD;
    https.get(url, resp => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                res.render('approved', JSON.parse(data));
            });
        })
        .on("error", (err) => {
            console.log("Error: " + err.message);
        });
});
app.get('/checkout/payment', (req, res) => {
    if (req.query.payment_status === 'approved') {
        const url = 'https://api.mercadopago.com/v1/payments/' + req.query.payment_id + '?access_token=' + process.env.ACCESS_TOKEN_PROD;
        https.get(url, resp => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    res.render('approved', JSON.parse(data));
                });
            })
            .on("error", (err) => {
                console.log("Error: " + err.message);
            });
    } else {
        if (req.query.payment_status === 'pending' || req.query.payment_status === 'in_process') {
            res.render('pending');
        } else {
            res.render('rejected');
        }
    }
});

app.post('/checkout/webhook', (req, res) => {
    console.log("hay retorno");
    console.log(req);
    res.json('Aca se reciben notificaciones');
});

// configuración de mercadopago
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_PROD
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(process.env.PORT);