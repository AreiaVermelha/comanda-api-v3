const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./logger");

require("dotenv").config();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: [process.env.URL_FRONT],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use(cors({
    origin: [process.env.URL_FRONT],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "is_client"],
}));

const homeRouter = require("./src/api/router/home");
const authRouter = require("./src/api/router/auth");
const userRouter = require("./src/api/router/user");
const orderRouter = require("./src/api/router/order");
const checkRouter = require("./src/api/router/check");
const settingRouter = require("./src/api/router/setting");
const cashierRouter = require("./src/api/router/cashier");
const productRouter = require("./src/api/router/products");
const paymentRouter = require("./src/api/router/payment");
const categoryRouter = require("./src/api/router/category");
const notificationRouter = require("./src/api/router/notification");

const Authentication = require("./src/resources/isAtuthenticaded");

const isAuthenticated = async (req, res, next) => {
    const header = req.headers;
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    logger.auth("Tentativa de autenticação", { 
        clientIP, 
        userAgent: userAgent ? userAgent.substring(0, 100) : 'Unknown',
        isClient: !!header.is_client 
    });

    if (header.is_client) {
        const authClient = await Authentication.authenticationClient(header);

        if (authClient.status) {
            logger.auth("Cliente autenticado com sucesso", { clientIP });
            return next();
        };
    } else {
        const authCheck = await Authentication.authenticationUser(header);

        if (authCheck?.user_id) {
            logger.auth("Usuário autenticado com sucesso", { 
                user_id: authCheck.user_id, 
                clientIP 
            });
            return next();
        };
    };

    logger.security("Acesso negado - autenticação falhou", { 
        clientIP, 
        userAgent: userAgent ? userAgent.substring(0, 100) : 'Unknown' 
    });
    res.status(401).send({ message: "Acesso negado. Faça login.", status: false });
};

app.use("/api", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", isAuthenticated, userRouter);
app.use("/api/order", isAuthenticated, orderRouter);
app.use("/api/check", isAuthenticated, checkRouter);
app.use("/api/setting", isAuthenticated, settingRouter);
app.use("/api/cashier", isAuthenticated, cashierRouter);
app.use("/api/product", isAuthenticated, productRouter);
app.use("/api/payment", isAuthenticated, paymentRouter);
app.use("/api/category", isAuthenticated, categoryRouter);
app.use("/api/notification", notificationRouter)

// Eventos de WebSocket
io.on("connection", (socket) => {

    socket.on("disconnect", (reason) => { });

    // novo pedido
    socket.on("new_order", (order) => {
        socket.data.order = order;
        socket.broadcast.emit("new_order", socket.data.order);
    });

    // nova comanda
    socket.on("new_check", () => {
        socket.broadcast.emit("new_check");
    });

    // comanda finalizada
    socket.on("check_finished", (data) => {
        socket.data.check_finished = data;
        socket.broadcast.emit("check_finished", socket.data.check_finished);
    });

    // pedido pronto
    socket.on("order_ready", (data) => {
        socket.data.order_ready = data;
        socket.broadcast.emit("order_ready", socket.data.order_ready);
    });

    // produto removido
    socket.on("product_removed", (data) => {
        socket.data.product_removed = data;
        socket.broadcast.emit("product_removed", socket.data.product_removed);
    });

    // quantidade alterada
    socket.on("quantity_change", (data) => {
        socket.data.quantity_change = data;
        socket.broadcast.emit("quantity_change", socket.data.quantity_change);
    });

    // comanda cancelado
    socket.on("check_canceled", (data) => {
        socket.data.check_canceled = data;
        socket.broadcast.emit("check_canceled", socket.data.check_canceled);
    });

    // imprimir comanda
    socket.on("print_check", (data) => {
        socket.data.print_check = data;
        socket.broadcast.emit("print_check", socket.data.print_check);
    });
});

server.listen(process.env.PORT_BACK, () => {
    logger.info(`Servidor iniciado na porta ${process.env.PORT_BACK}`);
});
