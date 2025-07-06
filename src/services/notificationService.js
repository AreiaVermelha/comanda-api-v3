require('dotenv').config();
const admin = require("firebase-admin");
const logger = require("../../logger");

const credentials = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
};

class NotificationService {
    constructor() {
        logger.info("NotificationService: Initializing Firebase Admin");
        this.admin = admin.initializeApp({
            credential: admin.credential.cert(credentials),
        });
        logger.info("NotificationService: Firebase Admin initialized successfully");
    };

    async notifyUser(payload_list = []) {
        logger.info("NotificationService: Sending notifications", { 
            payloadCount: payload_list.length,
            hasPayloads: payload_list.length > 0 
        });

        const promises = payload_list.map((payload) => {
            return admin.messaging().send(payload);
        });

        const result = await Promise.allSettled(promises);

        let successCount = 0;
        let failureCount = 0;

        result.forEach((result, i) => {
            if (result.status !== 'fulfilled') {
                failureCount++;
                logger.error(`NotificationService: Error sending notification [${i}]`, { 
                    error: result.reason,
                    payloadIndex: i 
                });
            } else {
                successCount++;
            };
        });

        logger.info("NotificationService: Notification sending completed", { 
            total: payload_list.length,
            success: successCount,
            failures: failureCount 
        });

        return { message: 'Envio concluído', result };
    };
};

module.exports = new NotificationService();