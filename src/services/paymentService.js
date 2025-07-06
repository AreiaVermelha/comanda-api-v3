const { MercadoPagoConfig, Payment } = require("mercadopago");
const { v4: uuidv4 } = require('uuid');
const logger = require("../../logger");
require("dotenv").config();

class PaymentService {
    constructor() {
        logger.info("PaymentService: Initializing MercadoPago client");
        this.client = new MercadoPagoConfig({
            accessToken: process.env.ACCESS_TOKEN_MERCADO_PAGO,
            options: {
                timeout: 5000,
                idempotencyKey: uuidv4()
            }
        });
        logger.info("PaymentService: MercadoPago client initialized successfully");
    };

    async createPayment(data) {
        logger.info("PaymentService: Creating payment", { 
            hasData: !!data, 
            dataKeys: data ? Object.keys(data) : [] 
        });
        
        try {
            const payment = new Payment(this.client);
            const result = await payment.create({
                body: data,
                requestOptions: {
                    idempotencyKey: uuidv4()
                },
            });
            
            logger.info("PaymentService: Payment created successfully", { 
                paymentId: result.id,
                status: result.status 
            });
            return result;
        } catch (error) {
            logger.error("PaymentService: Error creating payment", { error: error.message });
            throw error;
        };
    };

    async getPayment(id) {
        logger.info("PaymentService: Fetching payment", { paymentId: id });
        
        try {
            const payment = new Payment(this.client)
            const result = await payment.get({ id });
            
            logger.info("PaymentService: Payment fetched successfully", { 
                paymentId: id,
                status: result.status 
            });
            return result;
        } catch (error) {
            logger.error("PaymentService: Error fetching payment", { paymentId: id, error: error.message });
            throw error;
        };
    };
};

module.exports = new PaymentService();
