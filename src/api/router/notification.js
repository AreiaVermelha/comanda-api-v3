const router = require("express").Router();
const logger = require("../../../logger");
const notificationService = require("../../services/notificationService");

require("dotenv").config();

router.post("/notifyUser", async (req, res) => {
    const payload = req.body;
    
    logger.info("POST /notification/notifyUser - Sending notification to user", { 
        hasPayload: !!payload, 
        payloadKeys: payload ? Object.keys(payload) : [] 
    });

    try {
        await notificationService.notifyUser(payload);
        logger.info("POST /notification/notifyUser - User notified successfully");
        res.status(200).send({ message: "Usuário notificado com sucesso", status: true });
    } catch (error) {
        logger.error("POST /notification/notifyUser - Error while notifying user:", error);
        res.status(500).send({ message: "Erro ao notificar usuário", status: false });
    };
});

module.exports = router;