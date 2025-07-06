const {
    query_select_all, query_insert_setting,
    query_update_setting_by_id,
} = require("../repositores/query_setting");
const logger = require("../../logger");

class SettingService {
    async service_query_select_all() {
        logger.info("SettingService: Fetching all settings");
        
        try {
            const result = await query_select_all();
            logger.info(`SettingService: Successfully fetched ${result.length || 0} settings`);
            return result;
        } catch (error) {
            logger.error("SettingService: Error fetching all settings", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert_setting(data) {
        logger.info("SettingService: Creating/updating setting", { 
            estabishment_name: data.estabishment_name, 
            serveiceChange: data.serveiceChange, 
            service_change_percentage: data.service_change_percentage, 
            color: data.color,
            hasImagePix: !!data.image_buffer 
        });
        
        try {
            const if_existis_setting = await query_select_all();

            if (if_existis_setting) {
                logger.info("SettingService: Setting exists, updating instead of creating");
                const setting_id = if_existis_setting[0].setting_id;
                const result = await query_update_setting_by_id(setting_id, data);
                logger.info("SettingService: Setting updated successfully", { setting_id });
                return result;
            };

            logger.info("SettingService: No existing setting found, creating new one");
            const result = await query_insert_setting(data);
            logger.info("SettingService: Setting created successfully");
            return result;
        } catch (error) {
            logger.error("SettingService: Error creating/updating setting", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update_setting_by_id(setting_id, data) {
        logger.info("SettingService: Updating setting by ID", { 
            setting_id, 
            estabishment_name: data.estabishment_name, 
            serveiceChange: data.serveiceChange, 
            service_change_percentage: data.service_change_percentage, 
            color: data.color,
            service_change_printer: data.service_change_printer,
            printer_name: data.printer_name,
            hasImagePix: !!data.image_buffer 
        });
        
        try {
            const result = await query_update_setting_by_id(setting_id, data);
            logger.info("SettingService: Setting updated successfully", { setting_id });
            return result;
        } catch (error) {
            logger.error("SettingService: Error updating setting by ID", { setting_id, error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new SettingService();