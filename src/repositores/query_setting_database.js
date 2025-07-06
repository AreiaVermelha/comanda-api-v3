const pool = require("../../db/conn");

const create_table_cachier = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS comanda_menu.cashier (
                cashier_id		INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                lenght_cheks 	INTEGER DEFAULT 0,
                lenght_products INTEGER DEFAULT 0,
                total_value		FLOAT DEFAULT 0,
                pix				FLOAT DEFAULT 0,
                debit			FLOAT DEFAULT 0,
                credit			FLOAT DEFAULT 0,
                cash			FLOAT DEFAULT 0,
                status			BOOLEAN DEFAULT 1, -- Aberto
                created_at		DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at		DATETIME ON UPDATE CURRENT_TIMESTAMP
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const create_table_category = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS comanda_menu.category (
                category_id		INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name_category	VARCHAR(50) NOT NULL,
                screen			VARCHAR(20) NOT NULL,
                created_at		DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at		DATETIME ON UPDATE CURRENT_TIMESTAMP
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const create_table_product = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS comanda_menu.product (
                product_id					INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                product_name 				VARCHAR(30) NOT NULL,
                price						FLOAT NOT NULL,
                category_id					INTEGER NOT NULL,
                description 	 			VARCHAR(100) DEFAULT NULL,
                stock						INTEGER DEFAULT 0,
                image						MEDIUMBLOB DEFAULT NULL,
                created_at					DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at					DATETIME ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id)	REFERENCES category (category_id)
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const create_table_check = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS comanda_menu.\`check\` (
                check_id					INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name_client					VARCHAR(100) NOT NULL,
                obs							VARCHAR(100) DEFAULT NULL,
                total_value					FLOAT DEFAULT 0,
                status						BOOLEAN DEFAULT 1,
                pay_form					VARCHAR(10) DEFAULT NULL,
                created_for                 BOOLEAN DEFAULT 0, -- 0 garcom, 1 site
                cashier_id					INTEGER NOT NULL,
                notify_id 					VARCHAR(255),
                created_at					DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at					DATETIME ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (cashier_id)	REFERENCES cashier (cashier_id) ON DELETE CASCADE
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const create_table_order = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS comanda_menu.\`order\` (
                order_id     				INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                check_id      				INTEGER NOT NULL,
                product_id    				INTEGER NOT NULL,
                quantity      				INTEGER DEFAULT 1,
                status						BOOLEAN DEFAULT 1,
                obs           				VARCHAR(100) DEFAULT NULL,
                created_at					DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at					DATETIME ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (check_id) 		REFERENCES \`check\` (check_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) 	REFERENCES product (product_id) ON DELETE CASCADE
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const create_table_setting = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS comanda_menu.\`setting\` (
                setting_id					INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                estabishment_name			VARCHAR(100),
                serveice_change				BOOLEAN DEFAULT 0,
                service_change_percentage	FLOAT DEFAULT 0,
                image_pix					MEDIUMBLOB DEFAULT NULL,
                color						VARCHAR(30) DEFAULT NULL,
                service_change_printer		BOOLEAN DEFAULT 0,
                printer_name				VARCHAR(30) DEFAULT NULL,
                created_at					DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at					DATETIME ON UPDATE CURRENT_TIMESTAMP
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const create_table_user = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS comanda_menu.\`user\` (
                user_id		INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                username	VARCHAR(100) NOT NULL,
                email		VARCHAR(100) NOT NULL UNIQUE,
                password	VARCHAR(150) NOT NULL,
                func		VARCHAR(20) NOT NULL,
                notify_id 	VARCHAR(255),
                created_at	DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at	DATETIME ON UPDATE CURRENT_TIMESTAMP
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

module.exports = {
    create_table_cachier,
    create_table_category,
    create_table_product,
    create_table_check,
    create_table_order,
    create_table_setting,
    create_table_user,
};