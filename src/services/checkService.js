const {
    query_select_all, query_select_by_id, query_select_order_by_id,
    query_delete_check_by_id, query_insert_check,
    query_update_check_by_id, query_update_close_check_by_id,
    query_select_all_where_status,
    query_insert_check_closed, query_update_insert_notify_id,
    query_delete_all_check
} = require("../repositores/query_check");
const logger = require("../../logger");

class CheckService {
    async service_query_select_all() {
        logger.info("CheckService: Fetching all checks");
        
        try {
            const result = await query_select_all();
            logger.info(`CheckService: Successfully fetched ${result.length || 0} checks`);
            return result;
        } catch (error) {
            logger.error("CheckService: Error fetching all checks", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_id(check_id) {
        logger.info("CheckService: Fetching check by ID", { check_id });
        
        try {
            const result = await query_select_by_id(check_id);
            if (!result) {
                logger.warn("CheckService: Check not found", { check_id });
                return { status: 404, message: "check not found." };
            };
            logger.info("CheckService: Successfully fetched check by ID", { check_id });
            return result;
        } catch (error) {
            logger.error("CheckService: Error fetching check by ID", { check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_all_where_status(status) {
        logger.info("CheckService: Fetching checks by status", { status });
        
        try {
            const result = await query_select_all_where_status(status);
            logger.info(`CheckService: Successfully fetched ${result.length || 0} checks with status`, { status });
            return result;
        } catch (error) {
            logger.error("CheckService: Error fetching checks by status", { status, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert_check(data) {
        logger.info("CheckService: Creating new check", { 
            name_client: data.name_client, 
            cashier_id: data.cashier_id,
            hasObs: !!data.obs 
        });
        
        try {
            await query_insert_check(data);
            const check_id = await query_select_order_by_id();
            logger.info("CheckService: Check created successfully", { check_id: check_id[0].check_id });
            return check_id[0].check_id;
        } catch (error) {
            logger.error("CheckService: Error creating check", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert_check_closed(data) {
        logger.info("CheckService: Creating closed check", { 
            name_client: data.name_client, 
            cashier_id: data.cashier_id,
            hasObs: !!data.obs 
        });
        
        try {
            await query_insert_check_closed(data);
            const check_id = await query_select_order_by_id();
            logger.info("CheckService: Closed check created successfully", { check_id: check_id[0].check_id });
            return check_id[0].check_id;
        } catch (error) {
            logger.error("CheckService: Error creating closed check", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update_check_by_id(check_id, data) {
        logger.info("CheckService: Updating check by ID", { check_id, data });
        
        try {
            const check_if_exists = await query_select_by_id(check_id);

            if (!check_if_exists[0].check_id) {
                logger.warn("CheckService: Check not found for update", { check_id });
                return { status: 404, message: "check not found." };
            };

            const result = await query_update_check_by_id(check_id, data);
            logger.info("CheckService: Check updated successfully", { check_id });
            return result;
        } catch (error) {
            logger.error("CheckService: Error updating check by ID", { check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_close_check_id(pay_form, check_id) {
        logger.info("CheckService: Closing check", { check_id, pay_form });
        
        try {
            const check_if_exists = await query_select_by_id(check_id);

            if (!check_if_exists[0].check_id) {
                logger.warn("CheckService: Check not found for closing", { check_id });
                return { status: 404, message: "check not found." };
            };

            const result = await query_update_close_check_by_id(pay_form, check_id);
            logger.info("CheckService: Check closed successfully", { check_id, pay_form });
            return result;
        } catch (error) {
            logger.error("CheckService: Error closing check", { check_id, pay_form, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_inser_notify_id(notify_id, check_id) {
        logger.info("CheckService: Inserting notification ID", { check_id, notify_id });
        
        try {
            const check_if_exists = await query_select_by_id(check_id);

            if (!check_if_exists[0].check_id) {
                logger.warn("CheckService: Check not found for notification ID insertion", { check_id });
                return { status: 404, message: "check not found." };
            };

            const result = await query_update_insert_notify_id(notify_id, check_id);
            logger.info("CheckService: Notification ID inserted successfully", { check_id, notify_id });
            return result;
        } catch (error) {
            logger.error("CheckService: Error inserting notification ID", { check_id, notify_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete_check_by_id(check_id) {
        logger.info("CheckService: Deleting check by ID", { check_id });
        
        try {
            const check_if_exists = await query_select_by_id(check_id);

            if (!check_if_exists[0].check_id) {
                logger.warn("CheckService: Check not found for deletion", { check_id });
                return { status: 404, message: "check not found." };
            };

            const result = await query_delete_check_by_id(check_id);
            logger.info("CheckService: Check deleted successfully", { check_id });
            return result;
        } catch (error) {
            logger.error("CheckService: Error deleting check by ID", { check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete_all_check() {
        logger.info("CheckService: Deleting all checks");
        
        try {
            const retult = await query_delete_all_check();
            logger.info("CheckService: All checks deleted successfully");
            return retult;
        } catch (error) {
            logger.error("CheckService: Error deleting all checks", { error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new CheckService();