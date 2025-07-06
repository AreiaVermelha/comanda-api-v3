const AuthService = require("../services/authService");
const logger = require("../../logger");

class Authentication {
    async authenticationUser(headers) {
        logger.info("Authentication attempt for user");
        
        const authHeader = headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("User authentication failed: Invalid or missing authorization header");
            return { message: "Token não fornecido ou inválido.", status: false };
        };

        const token = authHeader.split(" ")[1];
        logger.info("User authentication: Token extracted, verifying...");

        try {
            const result = await AuthService.verifyUser(token);
            
            if (result?.user_id) {
                logger.info(`User authentication successful for user_id: ${result.user_id}`);
                return { status: true, user_id: result.user_id };
            } else {
                logger.warn("User authentication failed: Invalid token or user not found");
                return { status: false };
            }
        } catch (error) {
            logger.error("User authentication error during token verification:", error);
            return { message: "Erro na autenticação.", status: false };
        };
    };

    async authenticationClient(headers) {
        const client = headers.is_client;
        logger.info("Client authentication attempt", { client });
        
        const authHeader = headers.authorization;

        if (!client) {
            logger.warn("Client authentication failed: Client not specified");
            return { message: "Cliente não informado.", status: false };
        };

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("Client authentication failed: Invalid or missing authorization header", { client });
            return { message: "Token não fornecido ou inválido.", status: false };
        };

        const token = authHeader.split(" ")[1];
        logger.info("Client authentication: Token extracted, verifying...", { client });

        try {
            const result = await AuthService.verifyClient(token, client);
            
            if (result?.id) {
                logger.info(`Client authentication successful for client: ${client}`, { clientId: result.id });
                return { status: true, client: result };
            } else {
                logger.warn("Client authentication failed: Invalid token or client not found", { client });
                return { status: false };
            }
        } catch (error) {
            logger.error("Client authentication error during token verification:", error, { client });
            return { message: "Erro na autenticação.", status: false };
        };
    };

};

module.exports = new Authentication;