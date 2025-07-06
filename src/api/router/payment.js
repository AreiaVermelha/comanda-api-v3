const router = require("express").Router();
const logger = require("../../../logger");

const PaymentService = require("../../services/paymentService");

router.post("/process_payment", async (req, res) => {
    const paymentData = req.body;
    
    logger.info("POST /payment/process_payment - Processing payment", { 
        hasPaymentData: !!paymentData, 
        paymentDataKeys: paymentData ? Object.keys(paymentData) : [] 
    });

    try {
        const result = await PaymentService.createPayment(paymentData);
        logger.info("POST /payment/process_payment - Payment processed successfully");
        res.status(200).send(result);
    } catch (error) {
        logger.error(`POST /payment/process_payment - Error creating payment: ${error.message}`);
        res.status(500).send({ message: "Erro ao criar pagamento.", status: false });
    };
});

router.post("/payment_status", async (req, res) => {
    const { id } = req.body;
    
    logger.info(`POST /payment/payment_status - Fetching payment status for ID: ${id}`);

    try {
        const result = await PaymentService.getPayment(id);
        logger.info(`POST /payment/payment_status - Payment status fetched successfully for ID: ${id}`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`POST /payment/payment_status - Error fetching payment for ID ${id}: ${error.message}`);
        res.status(500).send({ message: "Erro ao buscar pagamento.", status: false });
    };
});

module.exports = router;