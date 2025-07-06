const router = require("express").Router();
const logger = require("../../../logger");
const OrderService = require("../../services/orderService");

router.get("/", async (req, res) => {
    logger.info("GET /order - Fetching all orders");
    
    try {
        const result = await OrderService.service_query_select_all();
        logger.info(`GET /order - Successfully fetched ${result.length || 0} orders`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /order - Error fetching orders:", error);
        res.status(500).send({ message: "Erro ao buscar os pedidos.", status: false });
    };
});

router.get("/:order_id", async (req, res) => {
    const { order_id } = req.params;
    
    logger.info(`GET /order/${order_id} - Fetching order by ID`);

    try {
        const result = await OrderService.service_query_select_by_id(order_id);
        logger.info(`GET /order/${order_id} - Successfully fetched order`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /order/${order_id} - Error fetching order:`, error);
        res.status(500).send({ message: "Erro ao buscar o pedido.", status: false });
    };
});

router.get("/status/:status", async (req, res) => {
    const { status } = req.params;
    
    logger.info(`GET /order/status/${status} - Fetching orders by status`);

    try {
        const result = await OrderService.service_query_select_all_where_status(status);
        logger.info(`GET /order/status/${status} - Successfully fetched ${result.length || 0} orders`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /order/status/${status} - Error fetching orders:`, error);
        res.status(500).send({ message: "Erro ao buscar o pedidos.", status: false });
    };
});

router.get("/cuisine/1", async (req, res) => {
    logger.info("GET /order/cuisine/1 - Fetching orders from cuisine");
    
    try {
        const result = await OrderService.service_query_select_all_from_cozinha();
        logger.info(`GET /order/cuisine/1 - Successfully fetched ${result.length || 0} cuisine orders`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /order/cuisine/1 - Error fetching cuisine orders:", error);
        res.status(500).send({ message: "Erro ao buscar o pedidos.", status: false });
    };
});

router.get("/barmen/1", async (req, res) => {
    logger.info("GET /order/barmen/1 - Fetching orders from barmen");
    
    try {
        const result = await OrderService.service_query_select_all_from_barmen();
        logger.info(`GET /order/barmen/1 - Successfully fetched ${result.length || 0} barmen orders`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /order/barmen/1 - Error fetching barmen orders:", error);
        res.status(500).send({ message: "Erro ao buscar o pedidos.", status: false });
    };
});

router.get("/list/check/created_online", async (req, res) => {
    logger.info("GET /order/list/check/created_online - Fetching online created checks");
    
    try {
        const result = await OrderService.service_query_select_all_created_online();
        logger.info(`GET /order/list/check/created_online - Successfully fetched ${result.length || 0} online checks`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /order/list/check/created_online - Error fetching online checks:", error);
        res.status(500).send({ message: "Erro ao buscar comandas.", status: false });
    };
});

router.get("/check_id/:check_id", async (req, res) => {
    const { check_id } = req.params;
    
    logger.info(`GET /order/check_id/${check_id} - Fetching orders by check ID`);

    try {
        const result = await OrderService.service_query_select_all_where_check_id(check_id);
        logger.info(`GET /order/check_id/${check_id} - Successfully fetched ${result.length || 0} orders`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /order/check_id/${check_id} - Error fetching orders:`, error);
        res.status(500).send({ message: "Erro ao buscar o pedido.", status: false });
    };
});

router.get("/length/products_ordered", async (req, res) => {
    logger.info("GET /order/length/products_ordered - Fetching products ordered length");
    
    try {
        const result = await OrderService.service_query_length_products_ordered();
        logger.info("GET /order/length/products_ordered - Successfully fetched products ordered length");
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /order/length/products_ordered - Error fetching products ordered length:", error);
        res.status(500).send({ message: "Erro ao buscar o pedido.", status: false });
    };
});

router.get("/total_value/products_ordered", async (req, res) => {
    logger.info("GET /order/total_value/products_ordered - Fetching total value of products ordered");
    
    try {
        const result = await OrderService.service_query_total_value_products_ordered();
        logger.info("GET /order/total_value/products_ordered - Successfully fetched total value");
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /order/total_value/products_ordered - Error fetching total value:", error);
        res.status(500).send({ message: "Erro ao buscar o pedido.", status: false });
    };
});

router.post("/", async (req, res) => {
    const { list_order, check_id, new_stock } = req.body;
    
    logger.info("POST /order - Creating new order", { 
        check_id, 
        hasListOrder: !!list_order, 
        listOrderLength: list_order ? list_order.length : 0,
        hasNewStock: !!new_stock 
    });

    try {
        await OrderService.service_query_insert_order(list_order, check_id, new_stock);
        logger.info(`POST /order - Order created successfully for check_id: ${check_id}`);
        res.status(201).send({ message: "Pedido criado com sucesso", status: true });
    } catch (error) {
        logger.error("POST /order - Error creating order:", error);
        res.status(500).send({ message: "Erro ao criar pedido.", status: false });
    };
});

router.put("/:order_id", async (req, res) => {
    const { order_id } = req.params;
    const { check_id, status, quantity, obs, new_stock } = req.body;
    
    logger.info(`PUT /order/${order_id} - Updating order`, { check_id, status, quantity, obs: obs ? "with observations" : "no observations" });

    const data = { status, quantity, obs };

    try {
        await OrderService.service_query_update_order_by_id(order_id, data, check_id, new_stock);
        logger.info(`PUT /order/${order_id} - Order updated successfully`);
        res.status(201).send({ message: "Pedido atualizado com sucesso", status: true });
    } catch (error) {
        logger.error(`PUT /order/${order_id} - Error updating order:`, error);
        res.status(500).send({ message: "Erro ao atualizar pedido.", status: false });
    };
});

router.delete("/:order_id", async (req, res) => {
    const { order_id } = req.params;
    const { check_id, new_stock, product_id } = req.query;
    
    logger.info(`DELETE /order/${order_id} - Deleting order`, { check_id, product_id });

    const new_stock_quantity = [ new_stock, product_id ]

    try {
        await OrderService.service_query_delete_order_by_id(order_id, check_id, new_stock_quantity);
        logger.info(`DELETE /order/${order_id} - Order deleted successfully`);
        res.status(201).send({ message: "Pedido deletado com sucesso", status: true });
    } catch (error) {
        logger.error(`DELETE /order/${order_id} - Error deleting order:`, error);
        res.status(500).send({ message: "Erro ao deletar pedido.", status: false });
    };
});

module.exports = router;