const mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN);

const MercadoPago = {
  payment: async (req, res) => {
    try {
      const { email, amount, description, token, paymentMethodId } = req.body;
      const payment_data = {
        transaction_amount: 181,
        token: token,
        description: description,
        installments: 1,
        payment_method_id: paymentMethodId,
        payer: {
          email: email
        }
      };

      let { body } = await mercadopago.payment.save(payment_data);

      switch (body.status) {
        case 'approved':
          res.render('afterPayment', {
            message: '¡Listo! Se acreditó tu pago.'
          });
        case 'reject':
          res.render('afterPayment', {
            message: 'No pudimos procesar tu pago.'
          });
          case 'in_process':
          res.render('afterPayment', {
            message: 'Estamos procesando tu pago. /n No te preocupes, menos de 2 días hábiles te avisaremos por e-mail si se acreditó.'
          });
      }
    } catch (e) {
      console.log('error:', e);
      res.status(500).json({ error: true, message: e.message });
    }
  }
};

module.exports = MercadoPago;
