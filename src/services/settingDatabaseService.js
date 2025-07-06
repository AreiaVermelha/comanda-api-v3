const {
    create_table_cachier, create_table_category,
    create_table_check, create_table_order,
    create_table_product, create_table_setting,
    create_table_user
} = require("../repositores/query_setting_database");
const logger = require("../../logger");

class SettingDatabaseService {
    async service_setting_database() {
        logger.info("SettingDatabaseService: Starting database table creation");
        
        try {
            logger.info("SettingDatabaseService: Creating cashier table");
            await create_table_cachier();
            
            logger.info("SettingDatabaseService: Creating category table");
            await create_table_category();
            
            logger.info("SettingDatabaseService: Creating product table");
            await create_table_product();
            
            logger.info("SettingDatabaseService: Creating check table");
            await create_table_check();
            
            logger.info("SettingDatabaseService: Creating order table");
            await create_table_order();
            
            logger.info("SettingDatabaseService: Creating setting table");
            await create_table_setting();
            
            logger.info("SettingDatabaseService: Creating user table");
            await create_table_user();
            
            logger.info("SettingDatabaseService: All database tables created successfully");
            return { status: 200, message: "Database tables created successfully." };
        } catch (error) {
            logger.error("SettingDatabaseService: Error creating database tables", { error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new SettingDatabaseService();