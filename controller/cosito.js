const axios = require("axios"); 

class PaymentService {
  constructor() {
    this.tokensMercadoPago = {
      prod: {},
      test: {
        access_token:
          "APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181" 
// el access_token de MP
      }
    }; 
// declaramos de la siguiente manera el token, para que sea más fácil cambiarlo dependiendo del ambiente
    this.mercadoPagoUrl = "https://api.mercadopago.com/checkout"; 
 // declaramos la url en el constructor para poder accederla a lo largo de toda la clase
  }

  async createPaymentMercadoPago(req,name, price, img) {  
// recibimos las props que le mandamos desde el PaymentController
    const url = `${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}`; 
// url a la que vamos a hacer los requests

    const items = [
      {
        id: "1234", 
// id interno (del negocio) del item
        title: name, 
// nombre que viene de la prop que recibe del controller
        description: "Dispositivo móvil de Tienda e-commerce​",
 // descripción del producto
        picture_url: img, 
// url de la imágen del producto
        category_id: 'phones',  
// categoría interna del producto (del negocio)
        quantity: 1, 
// cantidad, que tiene que ser un intiger
        currency_id: "MXN", 
// id de la moneda, que tiene que ser en ISO 4217
        unit_price: parseFloat(price)
 // el precio, que por su complejidad tiene que ser tipo FLOAT
      }
    ];  
    var se = req.protocol + '://' + req.get('host') + '/success';
    var pe = req.protocol + '://' + req.get('host') + '/pending';
    var fa = req.protocol + '://' + req.get('host') + '/failure';
    const preferences = { 
// declaramos las preferencias de pago
      items, 
// el array de objetos, items que declaramos más arriba
      external_reference: "caednicolas2@gmail.com", 
// referencia para identificar la preferencia, puede ser practicamente cualquier valor
      payer: { 
// información del comprador, si estan en producción tienen que //traerlos del request
//(al igual que hicimos con el precio del item) 
        name: "Lalo",
        surname: "Landa",
        email: "test_user_58295862@testuser.com",
 // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba
        phone: {
          area_code: "52",
          number: "5549737300"
        },
        address: {
          zip_code: "0394​0",
          street_name: "Insurgentes Sur",
          street_number: "1602"
        }
      }, 
      payment_methods: { 
// declaramos el método de pago y sus restricciones
        excluded_payment_methods: [ 
// aca podemos excluir metodos de pagos, tengan en cuenta que es un array de objetos
          {
            id: "amex"
          }
        ],
        excluded_payment_types: [{ id: "atm" }], 
// aca podemos excluir TIPOS de pagos, es un array de objetos
        installments: 6, 
// limite superior de cantidad de cuotas permitidas
        default_installments: 6 
// la cantidad de cuotas que van a aparecer por defecto
      }, 
      back_urls: {
// declaramos las urls de redireccionamiento
        success: se, 
// url que va a redireccionar si sale todo bien
        pending: pe, 
// url a la que va a redireccionar si decide pagar en efectivo por ejemplo
        failure: fa 
// url a la que va a redireccionar si falla el pago
      }, 
      notification_url: req.protocol + '://' + req.get('host') + '/notifications', 
// declaramos nuestra url donde recibiremos las notificaciones
      auto_return: "approved" 
// si la compra es exitosa automaticamente redirige a "success" de back_urls
    };

    try {
      const request = await axios.post(url, preferences, {
 // hacemos el POST a la url que declaramos arriba, con las preferencias
        headers: { 
// y el header, que contiene content-Type
          "Content-Type": "application/json"
        }
      });

      return request.data; 
// devolvemos la data que devuelve el POST
    } catch (e) {
      console.log(e); 
// mostramos error en caso de que falle el POST
    }
  }
}

//NOTA: TODAS las URLS que usemos tienen que ser reales, 
//si prueban con localhost, va a fallar

module.exports = PaymentService;
