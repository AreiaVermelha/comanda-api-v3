const router = require("express").Router();
const logger = require("../../../logger");
const CashierService = require("../../services/cashierService");

router.get("/", async (req, res) => {
    logger.info("GET /cashier - Fetching all cashiers");
    
    try {
        const result = await CashierService.service_query_select_all();
        logger.info(`GET /cashier - Successfully fetched ${result.length || 0} cashiers`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /cashier - Error fetching cashiers:", error);
        res.status(500).send({ message: "Erro ao buscar caixas.", status: false });
    };
});

router.get("/:cashier_id", async (req, res) => {
    const { cashier_id } = req.params;
    
    logger.info(`GET /cashier/${cashier_id} - Fetching cashier by ID`);

    try {
        const result = await CashierService.service_query_select_by_id(cashier_id);
        logger.info(`GET /cashier/${cashier_id} - Successfully fetched cashier`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /cashier/${cashier_id} - Error fetching cashier:`, error);
        res.status(500).send({ message: "Erro ao buscar caixa.", status: false });
    };
});

router.get("/status/:status", async (req, res) => {
    const { status } = req.params;
    
    logger.info(`GET /cashier/status/${status} - Fetching cashiers by status`);

    try {
        const result = await CashierService.service_query_select_where_status(status);
        logger.info(`GET /cashier/status/${status} - Successfully fetched ${result.length || 0} cashiers`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /cashier/status/${status} - Error fetching cashiers:`, error);
        res.status(500).send({ message: "Erro ao buscar caixa.", status: false });
    };
});

router.post("/", async (req, res) => {
    logger.info("POST /cashier - Creating new cashier");
    
    try {
        await CashierService.service_query_insert_cashier();
        logger.info("POST /cashier - Cashier created successfully");
        res.status(201).send({ message: "Caixa criado com sucesso.", status: true });
    } catch (error) {
        logger.error("POST /cashier - Error creating cashier:", error);
        res.status(500).send({ message: "Erro ao criar caixa.", status: false });
    };
});

router.put("/:cashier_id", async (req, res) => {
    const { cashier_id } = req.params;
    const { lenght_cheks, lenght_products, total_value, status } = req.body;
    
    logger.info(`PUT /cashier/${cashier_id} - Updating cashier`, { lenght_cheks, lenght_products, total_value, status });

    const data = {
        lenght_cheks, lenght_products, total_value, status
    };

    try {
        await CashierService.service_query_update_cashier_by_id(cashier_id, data);
        logger.info(`PUT /cashier/${cashier_id} - Cashier updated successfully`);
        res.status(200).send({ message: "Caixa atualizado com sucesso.", status: true });
    } catch (error) {
        logger.error(`PUT /cashier/${cashier_id} - Error updating cashier:`, error);
        res.status(500).send({ message: "Erro ao atualizar caixa.", status: false });
    };
});

router.put("/close/:cashier_id", async (req, res) => {
    const { cashier_id } = req.params;
    
    logger.info(`PUT /cashier/close/${cashier_id} - Closing cashier`);

    try {
        await CashierService.service_query_update_close_cashier(cashier_id);
        logger.info(`PUT /cashier/close/${cashier_id} - Cashier closed successfully`);
        res.status(200).send({ message: "Caixa fechado com sucesso.", status: true });
    } catch (error) {
        logger.error(`PUT /cashier/close/${cashier_id} - Error closing cashier:`, error);
        res.status(500).send({ message: "Erro ao fechar caixa.", status: false });
    };
});

router.delete("/:cashier_id", async (req, res) => {
    const { cashier_id } = req.params;
    
    logger.info(`DELETE /cashier/${cashier_id} - Deleting cashier`);

    try {
        await CashierService.service_query_delete_cashier_by_id(cashier_id);
        logger.info(`DELETE /cashier/${cashier_id} - Cashier deleted successfully`);
        res.status(200).send({ message: "Caixa deletado com sucesso.", status: true });
    } catch (error) {
        logger.error(`DELETE /cashier/${cashier_id} - Error deleting cashier:`, error);
        res.status(500).send({ message: "Erro ao deletar caixa.", status: false });
    };
});

module.exports = router;