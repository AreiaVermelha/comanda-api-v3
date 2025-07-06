const router = require("express").Router();
const logger = require("../../../logger");
const CheckService = require("../../services/checkService");

router.get("/", async (req, res) => {
    logger.info("GET /check - Fetching all checks");
    
    try {
        const result = await CheckService.service_query_select_all();
        logger.info(`GET /check - Successfully fetched ${result.length || 0} checks`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /check - Error fetching checks:", error);
        res.status(500).send({ message: "Erro ao buscar comandas.", status: false });
    };
});

router.get("/:check_id", async (req, res) => {
    const { check_id } = req.params;
    
    logger.info(`GET /check/${check_id} - Fetching check by ID`);

    try {
        const result = await CheckService.service_query_select_by_id(check_id);
        logger.info(`GET /check/${check_id} - Successfully fetched check`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /check/${check_id} - Error fetching check:`, error);
        res.status(500).send({ message: "Erro ao buscar comanda.", status: false });
    };
});

router.get("/status/:status", async (req, res) => {
    const { status } = req.params;
    
    logger.info(`GET /check/status/${status} - Fetching checks by status`);

    try {
        const result = await CheckService.service_query_select_all_where_status(status);
        logger.info(`GET /check/status/${status} - Successfully fetched ${result.length || 0} checks`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /check/status/${status} - Error fetching checks:`, error);
        res.status(500).send({ message: "Erro ao buscar comandas.", status: false });
    };
});

router.post("/", async (req, res) => {
    const { name_client, obs, cashier_id } = req.body;
    
    logger.info("POST /check - Creating new check", { name_client, cashier_id, obs: obs ? "with observations" : "no observations" });

    const data = {
        name_client, obs, cashier_id, created_for: 0
    };

    try {
        const check_id = await CheckService.service_query_insert_check(data);
        logger.info(`POST /check - Check created successfully with ID: ${check_id}`);
        res.status(201).send({ message: "Comanda criada com sucesso!", status: true, check_id });
    } catch (error) {
        logger.error("POST /check - Error creating check:", error);
        res.status(500).send({ message: "Erro ao criar comanda.", status: false });
    };
});

router.post("/closed", async (req, res) => {
    const { name_client, obs, cashier_id } = req.body;
    
    logger.info("POST /check/closed - Creating closed check", { name_client, cashier_id, obs: obs ? "with observations" : "no observations" });

    const data = {
        name_client, obs, cashier_id, status: 0, created_for: 1
    };

    try {
        const check_id = await CheckService.service_query_insert_check_closed(data);
        logger.info(`POST /check/closed - Closed check created successfully with ID: ${check_id}`);
        res.status(201).send({ message: "Comanda criada com sucesso!", status: true, check_id });
    } catch (error) {
        logger.error("POST /check/closed - Error creating closed check:", error);
        res.status(500).send({ message: "Erro ao criar comanda.", status: false });
    };
});

router.put("/:check_id", async (req, res) => {
    const { check_id } = req.params;
    const { name_client, obs, total_value, status, pay_form, cashier_id } = req.body;
    
    logger.info(`PUT /check/${check_id} - Updating check`, { name_client, total_value, status, pay_form, cashier_id });

    const data = {
        name_client, obs, total_value, status, pay_form, cashier_id
    };

    try {
        await CheckService.service_query_update_check_by_id(check_id, data);
        logger.info(`PUT /check/${check_id} - Check updated successfully`);
        res.status(200).send({ message: "Comanda atualizada com sucesso!", status: true });
    } catch (error) {
        logger.error(`PUT /check/${check_id} - Error updating check:`, error);
        res.status(500).send({ message: "Erro ao atualizar comanda.", status: false });
    };
});

router.put("/close/:check_id", async (req, res) => {
    const { check_id } = req.params;
    const { pay_form } = req.body;
    
    logger.info(`PUT /check/close/${check_id} - Closing check`, { pay_form });
    
    try {
        await CheckService.service_query_close_check_id(pay_form, check_id);
        logger.info(`PUT /check/close/${check_id} - Check closed successfully`);
        res.status(200).send({ message: "Comanda fechada com sucesso!", status: true });
    } catch (error) {
        logger.error(`PUT /check/close/${check_id} - Error closing check:`, error);
        res.status(500).send({ message: "Erro ao atualizar comanda.", status: false });
    };
});

router.put("/insert_notify_id/:check_id", async (req, res) => {
    const { check_id } = req.params;
    const { notify_id } = req.body;
    
    logger.info(`PUT /check/insert_notify_id/${check_id} - Inserting notification ID`, { notify_id });
    
    try {
        await CheckService.service_query_inser_notify_id(notify_id, check_id);
        logger.info(`PUT /check/insert_notify_id/${check_id} - Notification ID inserted successfully`);
        res.status(200).send({ message: "Id da notificação inserido com sucesso!", status: true });
    } catch (error) {
        logger.error(`PUT /check/insert_notify_id/${check_id} - Error inserting notification ID:`, error);
        res.status(500).send({ message: "Erro ao atualizar comanda.", status: false });
    };
});

router.delete("/:check_id", async (req, res) => {
    const { check_id } = req.params;
    
    logger.info(`DELETE /check/${check_id} - Deleting check`);

    try {
        await CheckService.service_query_delete_check_by_id(check_id);
        logger.info(`DELETE /check/${check_id} - Check deleted successfully`);
        res.status(200).send({ message: "Comanda deletada com sucesso!", status: true });
    } catch (error) {
        logger.error(`DELETE /check/${check_id} - Error deleting check:`, error);
        res.status(500).send({ message: "Erro ao deletar comanda.", status: false });
    };
});

router.delete("/delete/delete_all", async (req, res) => {
    logger.info("DELETE /check/delete/delete_all - Deleting all checks");
    
    try {
        await CheckService.service_query_delete_all_check();
        logger.info("DELETE /check/delete/delete_all - All checks deleted successfully");
        res.status(200).send({ message: "Todas as comandas deletadas com sucesso!", status: true })
    } catch (error) {
        logger.error("DELETE /check/delete/delete_all - Error deleting all checks:", error);
        res.status(500).send({ message: "Erro ao deletar comandas.", status: false });
    };
});

module.exports = router;