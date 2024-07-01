// controllers/paymentController.js

const { Order } = require('../models/order');
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/alipay/form').default;
const { Wechatpay } = require('wechatpay-axios-plugin');

const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID,
  privateKey: process.env.ALIPAY_PRIVATE_KEY,
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
});

const wechatpay = new Wechatpay({
  appId: process.env.WECHATPAY_APP_ID,
  mchId: process.env.WECHATPAY_MCH_ID,
  privateKey: process.env.WECHATPAY_PRIVATE_KEY,
  serialNo: process.env.WECHATPAY_SERIAL_NO,
  publicCertPath: process.env.WECHATPAY_PUBLIC_CERT_PATH,
});

exports.createAlipayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const formData = new AlipayFormData();
    formData.setMethod('get');
    formData.addField('bizContent', {
      outTradeNo: orderId,
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: order.totalAmount,
      subject: 'Order Payment',
    });

    const result = await alipaySdk.exec('alipay.trade.page.pay', {}, { formData });
    res.status(200).json({ paymentUrl: result });
  } catch (error) {
    console.error('Alipay payment creation error:', error);
    res.status(500).json({ message: 'Error creating Alipay payment', error });
  }
};

exports.createWechatpayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const result = await wechatpay.transactions({
      out_trade_no: orderId,
      description: 'Order Payment',
      amount: {
        total: order.totalAmount * 100, // 单位为分
        currency: 'CNY',
      },
      payer: {
        openid: 'payer-openid', // 需要通过微信接口获取
      },
    });

    res.status(200).json({ paymentInfo: result });
  } catch (error) {
    console.error('Wechatpay payment creation error:', error);
    res.status(500).json({ message: 'Error creating Wechatpay payment', error });
  }
};
