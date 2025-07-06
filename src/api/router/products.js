const router = require("express").Router();
const logger = require("../../../logger");
const ProductService = require("../../services/productService");

router.get("/", async (req, res) => {
    logger.info("GET /products - Fetching all products");
    
    try {
        const result = await ProductService.service_query_select_all();
        logger.info(`GET /products - Successfully fetched ${result.length || 0} products`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /products - Error fetching products:", error);
        res.status(500).send({ message: "Erro ao buscar produtos.", status: false });
    };
});

router.get("/paginated", async (req, res) => {
    const { limit, page } = req.query;
    
    logger.info("GET /products/paginated - Fetching paginated products", { limit, page });

    try {
        const result = await ProductService.service_query_select_by_paginated(limit, page);
        logger.info(`GET /products/paginated - Successfully fetched paginated products`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /products/paginated - Error fetching paginated products:", error);
        res.status(500).send({ message: "Erro ao buscar produtos.", status: false });
    };
});

router.get("/:product_id", async (req, res) => {
    const { product_id } = req.params;
    
    logger.info(`GET /products/${product_id} - Fetching product by ID`);

    try {
        const result = await ProductService.service_query_select_by_id(product_id);
        logger.info(`GET /products/${product_id} - Successfully fetched product`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /products/${product_id} - Error fetching product:`, error);
        res.status(500).send({ message: "Erro ao buscar produto.", status: false });
    };
});

router.get("/stock/:stock", async (req, res) => {
    const { stock } = req.params;
    
    logger.info(`GET /products/stock/${stock} - Fetching products by stock`);

    try {
        const result = await ProductService.service_query_select_by_stock(stock);
        logger.info(`GET /products/stock/${stock} - Successfully fetched ${result.length || 0} products`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /products/stock/${stock} - Error fetching products by stock:`, error);
        res.status(500).send({ message: "Erro ao buscar produto.", status: false });
    };
});

router.get("/get_product/by_name", async (req, res) => {
    const { name_product } = req.query;
    
    logger.info(`GET /products/get_product/by_name - Fetching product by name: ${name_product}`);

    try {
        const result = await ProductService.service_query_select_by_name(name_product);
        logger.info(`GET /products/get_product/by_name - Successfully fetched product by name: ${name_product}`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /products/get_product/by_name - Error fetching product by name: ${name_product}`, error);
        res.status(500).send({ message: "Erro ao buscar produto." });
    };
});

router.post("/", async (req, res) => {
    const { product_name, price, category_id, description, stock, image } = req.body;
    
    logger.info("POST /products - Creating new product", { 
        product_name, 
        price, 
        category_id, 
        stock, 
        hasDescription: !!description, 
        hasImage: !!image 
    });

    let image_buffer = null;
    if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        image_buffer = Buffer.from(base64Data, 'base64');
    };

    const data = {
        product_name, price, category_id, description, stock, image_buffer
    };

    try {
        await ProductService.service_query_insert_product(data);
        logger.info(`POST /products - Product "${product_name}" created successfully`);
        res.status(201).send({ message: "Produto criado com sucesso.", status: true });
    } catch (error) {
        logger.error("POST /products - Error creating product:", error);
        res.status(500).send({ message: "Erro ao inserir produto.", status: false });
    };
});

router.put("/:product_id", async (req, res) => {
    const { product_id } = req.params;
    const { product_name, price, category_id, description, stock, image } = req.body;
    
    logger.info(`PUT /products/${product_id} - Updating product`, { 
        product_name, 
        price, 
        category_id, 
        stock, 
        hasDescription: !!description, 
        hasImage: !!image 
    });

    let image_buffer = null;
    if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        image_buffer = Buffer.from(base64Data, 'base64');
    };

    const data = {
        product_name, price, category_id, description, stock, image_buffer
    };

    try {
        await ProductService.service_query_update_product_by_id(product_id, data);
        logger.info(`PUT /products/${product_id} - Product updated successfully`);
        res.status(200).send({ message: "Produto atualizado com sucesso.", status: true });
    } catch (error) {
        logger.error(`PUT /products/${product_id} - Error updating product:`, error);
        res.status(500).send({ message: "Erro ao atualizar produto.", status: false });
    };
});

router.delete("/:product_id", async (req, res) => {
    const { product_id } = req.params;
    
    logger.info(`DELETE /products/${product_id} - Deleting product`);

    try {
        await ProductService.service_query_delete_product_by_id(product_id);
        logger.info(`DELETE /products/${product_id} - Product deleted successfully`);
        res.status(200).send({ message: "Produto deletado com sucesso.", status: true });
    } catch (error) {
        logger.error(`DELETE /products/${product_id} - Error deleting product:`, error);
        res.status(500).send({ message: "Erro ao deletar produto.", status: false });
    };
});

module.exports = router;