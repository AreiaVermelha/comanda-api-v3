const { check_connection } = require("../repositores/query_home");
const logger = require("../../logger");

class HomeService {
    async check_connection() {
        logger.info("HomeService: Testing database connection");
        
        try {
            const result = await check_connection();
            logger.info("HomeService: Database connection successful", { threadId: result.threadId });
            return result;
        } catch (error) {
            logger.error("HomeService: Database connection failed", { error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new HomeService();