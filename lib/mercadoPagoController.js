const mercadopago = require('mercadopago');
mercadopago.configure({
  access_token: 'APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181'
});


let preference = {
  items: [
    {
      id: '1234',
      title: 'LG G6',
      description: '​Dispositivo móvil de Tienda e-commerce',
      category_id: 'phones',
      picture_url: '../assets/l6g6.jpg',
      quantity: 1,
      currency_id: 'MXN',
      unit_price: 55.41,
      //external_reference = 'caednicolas2@gmail.com'
    }
  ]
};

mercadopago.preferences.create(preference).then(function(response){
// Este valor reemplazará el string "$$init_point$$" en tu HTML
  global.init_point = response.body.init_point;
}).catch(function(error){
  console.log(error);
});

