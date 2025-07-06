const router = require("express").Router();
const logger = require("../../../logger");
const AuthService = require("../../services/authService");
const UserService = require("../../services/userService");
const SettingDatabaseService = require("../../services/settingDatabaseService");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    logger.info(`Login attempt for email: ${email}`);

    try {
        const { token, user } = await AuthService.login(email, password);

        logger.info(`Login successful for user: ${user.user_id} (${user.func})`);

        return res.status(200).send({
            message: "Login realizado com sucesso.",
            func: user.func,
            token: token,
            user_id: user.user_id,
            status: true
        });
    } catch (error) {
        logger.error(`Login failed for email: ${email}`, error);
        return res.status(500).send({ message: "Erro ao realizar login.", status: false });
    };
});

router.post("/logout", async (req, res) => {
    const { user_id } = req.body;

    logger.info(`Logout attempt for user_id: ${user_id}`);

    try {
        await AuthService.logout(user_id);
        
        logger.info(`Logout successful for user_id: ${user_id}`);
        
        res.status(201).send({ message: "Até a próxima!", status: true });
    } catch (error) {
        logger.error(`Logout failed for user_id: ${user_id}`, error);
        return res.status(500).send({ message: "Erro ao realizar logout.", status: false });
    };
});

router.post("/first_access", async (req, res) => {
    const { username, email, password } = req.body;

    logger.info(`First access attempt for username: ${username}, email: ${email}`);

    const data = { username, email, password, func: "admin" };

    try {
        logger.info("Initializing database settings...");
        await SettingDatabaseService.service_setting_database();
        
        logger.info("Creating first admin user...");
        await UserService.service_query_insert_user(data);
        
        logger.info(`First access successful - Admin user created: ${username} (${email})`);
        
        res.status(201).send({ message: "Primeiro usuário criado com sucesso", status: true });
    } catch (error) {
        logger.error(`First access failed for username: ${username}, email: ${email}`, error);
        return res.status(500).send({ message: "Erro ao cadastrar primeiro usuário.", status: false });
    };
});

router.post("/create_token_for_client", async (req, res) => {
    const { client } = req.body;

    logger.info(`Client token creation attempt for client: ${client}`);

    try {
        const token = await AuthService.create_token_for_client(client);

        logger.info(`Client token created successfully for client: ${client}`);

        return res.status(200).send({ message: "Cliente autenticado com sucesso.", token: token, status: true });
    } catch (error) {
        logger.error(`Client token creation failed for client: ${client}`, error);
        return res.status(500).send({ message: "Erro ao autenticar cliente.", status: false });
    };
});

module.exports = router;