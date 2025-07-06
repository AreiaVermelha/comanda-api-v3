const {
    create_table_cachier, create_table_category,
    create_table_check, create_table_order,
    create_table_product, create_table_setting,
    create_table_user
} = require("../repositores/query_setting_database");

class SettingDatabaseService {
    async service_setting_database() {
        try {
            await create_table_cachier();
            await create_table_category();
            await create_table_product();
            await create_table_check();
            await create_table_order();
            await create_table_setting();
            await create_table_user();
            return { status: 200, message: "Database tables created successfully." };
        } catch (error) {
            throw new Error(error.message);
        };
    };
};

module.exports = new SettingDatabaseService();