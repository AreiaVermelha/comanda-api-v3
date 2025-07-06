const { compareSync } = require("bcrypt");
const { sign, verify } = require('jsonwebtoken');
const {
    query_auth_verify_if_user_exists,
    query_auth_verify_if_user_exists_by_id
 } = require("../repositores/query_auth");

const { service_query_insert_notify_id } = require("../services/userService");
const logger = require("../../logger");
require('dotenv').config();

class AuthService {
    async login(email, password) {
        logger.info("AuthService: Login attempt", { email });
        
        try {
            const user = await query_auth_verify_if_user_exists(email);

            if (!user) {
                logger.warn("AuthService: Login failed - User not found", { email });
                throw new Error("User not found");
            };

            const isPasswordValid = compareSync(password, user.password);

            if (!isPasswordValid) {
                logger.warn("AuthService: Login failed - Invalid password", { email });
                throw new Error("Invalid credentials");
            };

            const token = sign({ id: user.user_id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            logger.info("AuthService: Login successful", { email, user_id: user.user_id });
            return { token, user };
        } catch (error) {
            logger.error("AuthService: Login error", { email, error: error.message });
            throw new Error(error.message);
        };
    };

    async logout(user_id) {
        logger.info("AuthService: Logout attempt", { user_id });
        
        try {
            const result = await service_query_insert_notify_id(user_id, "");
            logger.info("AuthService: Logout successful", { user_id });
            return result;
        } catch (error) {
            logger.error("AuthService: Logout error", { user_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async verifyUser(token) {
        logger.info("AuthService: Verifying user token");
        
        try {
            const decoded = verify(token, process.env.JWT_SECRET, { expiresIn: "1d" });
            const result = await query_auth_verify_if_user_exists_by_id(decoded.id);
            
            if (result) {
                logger.info("AuthService: User token verified successfully", { user_id: decoded.id });
            } else {
                logger.warn("AuthService: User token verification failed - User not found", { user_id: decoded.id });
            }
            
            return result;
        } catch (error) {
            logger.error("AuthService: User token verification error", { error: error.message });
            throw new Error(error.message);
        };
    };

    async create_token_for_client (client) {
        logger.info("AuthService: Creating token for client", { client });
        
        try {
            const token = sign({ id: client }, process.env.JWT_SECRET_CLIENT, {
                expiresIn: "12h"
            });

            logger.info("AuthService: Client token created successfully", { client });
            return token;
        } catch (error) {
            logger.error("AuthService: Client token creation error", { client, error: error.message });
            throw new Error(error.message);
        };
    };

    async verifyClient(token, client) {
        logger.info("AuthService: Verifying client token", { client });
        
        try {
            const decoded = verify(token, process.env.JWT_SECRET_CLIENT, { expiresIn: "12h" });

            if (decoded.id !== client) {
                logger.warn("AuthService: Client token verification failed - Invalid client", { client, decodedId: decoded.id });
                throw new Error("Invalid token");
            };
            
            logger.info("AuthService: Client token verified successfully", { client });
            return decoded;
        } catch (error) {
            logger.error("AuthService: Client token verification error", { client, error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new AuthService();
