const {
    query_select_all, query_select_by_id, query_select_all_created_online,
    query_select_all_from_barmen, query_select_all_from_cozinha,
    query_select_all_where_status, query_select_all_where_check_id,

    query_insert_order,
    query_delete_order_by_id,

    query_update_order_by_id, query_update_total_value_order_by_check_id,
    query_update_stock_product_by_id,

    query_length_products_ordered,
    query_total_value_products_ordered
} = require("../repositores/query_order");
const logger = require("../../logger");

class OrderService {
    async service_query_select_all() {
        logger.info("OrderService: Fetching all orders");
        
        try {
            const result = await query_select_all();
            logger.info(`OrderService: Successfully fetched ${result.length || 0} orders`);
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching all orders", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_id(order_id, check_id) {
        logger.info("OrderService: Fetching order by ID", { order_id, check_id });
        
        try {
            const result = await query_select_by_id(order_id);
            if (!result) {
                logger.warn("OrderService: Order not found", { order_id });
                return { status: 404, message: "order not found." };
            };
            logger.info("OrderService: Successfully fetched order by ID", { order_id });
            await query_update_total_value_order_by_check_id(check_id);
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching order by ID", { order_id, check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_all_where_status(status) {
        logger.info("OrderService: Fetching orders by status", { status });
        
        try {
            const result = await query_select_all_where_status(status);
            logger.info(`OrderService: Successfully fetched ${result.length || 0} orders with status`, { status });
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching orders by status", { status, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_all_from_barmen() {
        logger.info("OrderService: Fetching orders from barmen");
        
        try {
            const result = await query_select_all_from_barmen();
            logger.info(`OrderService: Successfully fetched ${result.length || 0} barmen orders`);
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching barmen orders", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_all_from_cozinha() {
        logger.info("OrderService: Fetching orders from cuisine");
        
        try {
            const result = await query_select_all_from_cozinha();
            logger.info(`OrderService: Successfully fetched ${result.length || 0} cuisine orders`);
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching cuisine orders", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_all_where_check_id(check_id) {
        logger.info("OrderService: Fetching orders by check ID", { check_id });
        
        try {
            await query_update_total_value_order_by_check_id(check_id);
            const result = await query_select_all_where_check_id(check_id);
            logger.info(`OrderService: Successfully fetched ${result.length || 0} orders for check`, { check_id });
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching orders by check ID", { check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_all_created_online() {
        logger.info("OrderService: Fetching online created orders");
        
        try {
            const result = await query_select_all_created_online();
            logger.info(`OrderService: Successfully fetched ${result.length || 0} online created orders`);
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching online created orders", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert_order(data, check_id, new_stock) {
        logger.info("OrderService: Creating new order", { 
            check_id, 
            hasData: !!data, 
            dataLength: data ? data.length : 0,
            hasNewStock: !!new_stock,
            newStockLength: new_stock ? new_stock.length : 0 
        });
        
        try {
            const result = await query_insert_order(data);

            await query_update_total_value_order_by_check_id(check_id);

            if (new_stock && new_stock.length > 0) {
                logger.info("OrderService: Updating stock for products", { stockUpdates: new_stock.length });
                new_stock.map(async (item) => {
                    await query_update_stock_product_by_id(item);
                });
            }

            logger.info("OrderService: Order created successfully", { check_id });
            return result;
        } catch (error) {
            logger.error("OrderService: Error creating order", { check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update_order_by_id(order_id, data, check_id, new_stock) {
        logger.info("OrderService: Updating order by ID", { order_id, check_id, hasNewStock: !!new_stock });
        
        try {
            const order_if_exists = await query_select_by_id(order_id);

            if (!order_if_exists[0].order_id) {
                logger.warn("OrderService: Order not found for update", { order_id });
                return { status: 404, message: "Order not found." };
            };

            const result = await query_update_order_by_id(order_id, data);

            await query_update_total_value_order_by_check_id(check_id);

            if (new_stock) {
                logger.info("OrderService: Updating stock for order", { order_id });
                await query_update_stock_product_by_id(new_stock);
            };
            
            logger.info("OrderService: Order updated successfully", { order_id });
            return result;
        } catch (error) {
            logger.error("OrderService: Error updating order by ID", { order_id, check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete_order_by_id(order_id, check_id, new_stock) {
        logger.info("OrderService: Deleting order by ID", { order_id, check_id, hasNewStock: !!new_stock });
        
        try {
            const order_if_exists = await query_select_by_id(order_id);

            if (!order_if_exists[0].order_id) {
                logger.warn("OrderService: Order not found for deletion", { order_id });
                return { status: 404, message: "order not found." };
            };

            const result = await query_delete_order_by_id(order_id);
            await query_update_total_value_order_by_check_id(check_id);
            await query_update_stock_product_by_id(new_stock);
            logger.info("OrderService: Order deleted successfully", { order_id });
            return result;
        } catch (error) {
            logger.error("OrderService: Error deleting order by ID", { order_id, check_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_length_products_ordered() {
        logger.info("OrderService: Fetching products ordered length");
        
        try {
            const result = await query_length_products_ordered();
            logger.info("OrderService: Successfully fetched products ordered length");
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching products ordered length", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_total_value_products_ordered() {
        logger.info("OrderService: Fetching total value of products ordered");
        
        try {
            const result = await query_total_value_products_ordered();
            logger.info("OrderService: Successfully fetched total value of products ordered");
            return result;
        } catch (error) {
            logger.error("OrderService: Error fetching total value of products ordered", { error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new OrderService();