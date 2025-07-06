const {
    query_select_all, query_select_by_id,
    query_delete_cashier_by_id, query_insert_cashier,
    query_update_cashier_by_id, query_update_close_cashier,
    query_update_cashier_total_value,
    query_select_where_status
} = require("../repositores/query_cashier");
const logger = require("../../logger");

class CashierService {
    async service_query_select_all() {
        logger.info("CashierService: Fetching all cashiers");
        
        try {
            const result = await query_select_all();
            logger.info(`CashierService: Successfully fetched ${result.length || 0} cashiers`);
            return result;
        } catch (error) {
            logger.error("CashierService: Error fetching all cashiers", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_where_status(status) {
        logger.info("CashierService: Fetching cashiers by status", { status });
        
        try {
            const result = await query_select_where_status(status);

            if (!result[0]) {
                logger.info("CashierService: No cashier found with status, creating new one", { status });
                await this.service_query_insert_cashier();

                const result = await query_select_where_status(status);
                logger.info(`CashierService: Successfully fetched ${result.length || 0} cashiers after creation`);
                return result;
            };
            
            logger.info(`CashierService: Successfully fetched ${result.length || 0} cashiers with status`, { status });
            await query_update_cashier_total_value(result[0].cashier_id);
            return result;
        } catch (error) {
            logger.error("CashierService: Error fetching cashiers by status", { status, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_id(cashier_id) {
        logger.info("CashierService: Fetching cashier by ID", { cashier_id });
        
        try {
            const result = await query_select_by_id(cashier_id);

            if (!result) {
                logger.warn("CashierService: Cashier not found", { cashier_id });
                return { status: 404, message: "Cashier not found." };
            };

            logger.info("CashierService: Successfully fetched cashier by ID", { cashier_id });
            await query_update_cashier_total_value(cashier_id);
            return result;
        } catch (error) {
            logger.error("CashierService: Error fetching cashier by ID", { cashier_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert_cashier() {
        logger.info("CashierService: Creating new cashier");
        
        try {
            const result = await query_insert_cashier();
            logger.info("CashierService: Cashier created successfully");
            return result;
        } catch (error) {
            logger.error("CashierService: Error creating cashier", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update_cashier_by_id(cashier_id, data) {
        logger.info("CashierService: Updating cashier by ID", { cashier_id, data });
        
        try {
            const check_if_exists = await query_select_by_id(cashier_id);

            if (!check_if_exists[0].cashier_id) {
                logger.warn("CashierService: Cashier not found for update", { cashier_id });
                return { status: 404, message: "Cashier not found." };
            };

            const result = await query_update_cashier_by_id(cashier_id, data);
            logger.info("CashierService: Cashier updated successfully", { cashier_id });
            return result;
        } catch (error) {
            logger.error("CashierService: Error updating cashier by ID", { cashier_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update_close_cashier(cashier_id) {
        logger.info("CashierService: Closing cashier", { cashier_id });
        
        try {
            const check_if_exists = await query_select_by_id(cashier_id);

            if (!check_if_exists[0].cashier_id) {
                logger.warn("CashierService: Cashier not found for closing", { cashier_id });
                return { status: 404, message: "Cashier not found." };
            };

            const result = await query_update_close_cashier(cashier_id);
            logger.info("CashierService: Cashier closed successfully", { cashier_id });
            return result;
        } catch (error) {
            logger.error("CashierService: Error closing cashier", { cashier_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete_cashier_by_id(cashier_id) {
        logger.info("CashierService: Deleting cashier by ID", { cashier_id });
        
        try {
            const check_if_exists = await query_select_by_id(cashier_id);

            if (!check_if_exists[0].cashier_id) {
                logger.warn("CashierService: Cashier not found for deletion", { cashier_id });
                return { status: 404, message: "Cashier not found." };
            };

            const result = await query_delete_cashier_by_id(cashier_id);
            logger.info("CashierService: Cashier deleted successfully", { cashier_id });
            return result;
        } catch (error) {
            logger.error("CashierService: Error deleting cashier by ID", { cashier_id, error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new CashierService();