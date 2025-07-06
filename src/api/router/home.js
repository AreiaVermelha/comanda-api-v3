const router = require("express").Router();
const logger = require("../../../logger");
const HomeService = require("../../services/homeService");

router.get("/", async (req, res) => {
    logger.info("GET /home - Testing database connection");
    
    try {
        const result = await HomeService.check_connection();
        logger.info(`GET /home - Connected to database as thread ID: ${result.threadId}`);
        res.status(200).send({ message: "To test, press ALT + F4!", status: true });
        result.release()
    } catch (error) {
        logger.error("GET /home - Error connecting to database:", error);
        res.status(500).send({ message: "Error connecting to database", status: false });
    };
});

module.exports = router;