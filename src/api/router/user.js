const router = require("express").Router();
const logger = require("../../../logger");
const UserService = require("../../services/userService");

router.get("/", async (req, res) => {
    logger.info("GET /user - Fetching all users");
    
    try {
        const result = await UserService.service_query_select_all();
        logger.info(`GET /user - Successfully fetched ${result.length || 0} users`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /user - Error fetching users:", error);
        res.status(500).send({ message: "Erro ao buscar os usuário", status: false });
    };
});

router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    
    logger.info(`GET /user/${user_id} - Fetching user by ID`);

    try {
        const result = await UserService.service_query_select_by_id(user_id);
        logger.info(`GET /user/${user_id} - Successfully fetched user`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /user/${user_id} - Error fetching user:`, error);
        res.status(500).send({ message: "Erro ao buscar os usuários", status: false });
    };
});

router.post("/get_by_funcs", async (req, res) => {
    const { funcs } = req.body;
    
    logger.info("POST /user/get_by_funcs - Fetching users by functions", { funcs });

    try {
        const result = await UserService.service_query_select_by_func(funcs);
        logger.info(`POST /user/get_by_funcs - Successfully fetched ${result.length || 0} users by functions`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("POST /user/get_by_funcs - Error fetching users by functions:", error);
        res.status(500).send({ message: "Erro ao buscar os usuários", status: false });
    };
});

router.post("/", async (req, res) => {
    const { username, email, password, func } = req.body;
    
    logger.info("POST /user - Creating new user", { username, email, func });

    try {
        const data = { username, email, password, func };

        await UserService.service_query_insert_user(data);
        logger.info(`POST /user - User "${username}" created successfully`);
        res.status(201).send({ message: "Usuário criado com sucesso", status: true });
    } catch (error) {
        logger.error("POST /user - Error creating user:", error);
        res.status(500).send({ message: "Erro ao criar o usuário", status: false });
    };
});

router.put("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { username, email, password, func } = req.body;
    
    logger.info(`PUT /user/${user_id} - Updating user`, { username, email, func });

    try {
        let data = { username, email, password, func };

        await UserService.service_query_update_user_by_id(user_id, data);
        logger.info(`PUT /user/${user_id} - User updated successfully`);
        res.status(200).send({ message: "Usuário atualizado com sucesso", status: true });
    } catch (error) {
        logger.error(`PUT /user/${user_id} - Error updating user:`, error);
        res.status(500).send({ message: "Erro ao atualizar o usuário", status: false });
    };
});

router.put("/insert_notify_id/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { notify_id } = req.body;
    
    logger.info(`PUT /user/insert_notify_id/${user_id} - Inserting notification ID`, { notify_id });

    try {
        await UserService.service_query_insert_notify_id(user_id, notify_id);
        logger.info(`PUT /user/insert_notify_id/${user_id} - Notification ID inserted successfully`);
        res.status(200).send({ message: "Id de notificação inserido com sucesso", status: true });
    } catch (error) {
        logger.error(`PUT /user/insert_notify_id/${user_id} - Error inserting notification ID:`, error);
        res.status(500).send({ message: "Erro ao inserir o id de notificação.", status: false });
    };
});

router.delete("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    
    logger.info(`DELETE /user/${user_id} - Deleting user`);

    try {
        await UserService.service_query_delete_user_by_id(user_id);
        logger.info(`DELETE /user/${user_id} - User deleted successfully`);
        res.status(200).send({ message: "Usuário deletado com sucesso", status: true });
    } catch (error) {
        logger.error(`DELETE /user/${user_id} - Error deleting user:`, error);
        res.status(500).send({ message: "Erro ao deletar o usuário.", status: false });
    };
});

module.exports = router;