const {
    query_select_all, query_select_by_paginated,
    query_select_by_id, query_select_by_stock, query_select_by_name,
    query_insert_product,
    query_delete_product_by_id, 
    query_update_product_by_id, 
} = require("../repositores/query_product");
const logger = require("../../logger");

class ProductService {
    async service_query_select_all() {
        logger.info("ProductService: Fetching all products");
        
        try {
            const result = await query_select_all();
            logger.info(`ProductService: Successfully fetched ${result.length || 0} products`);
            return result;
        } catch (error) {
            logger.error("ProductService: Error fetching all products", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_paginated(limit, page) {
        const value = [Number(limit), (Number(page) - 1) * Number(limit)];
        
        logger.info("ProductService: Fetching paginated products", { limit, page });
        
        try {
            const result = await query_select_by_paginated(value);
            logger.info(`ProductService: Successfully fetched paginated products`, { limit, page });
            return result;
        } catch (error) {
            logger.error("ProductService: Error fetching paginated products", { limit, page, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_id(product_id) {
        logger.info("ProductService: Fetching product by ID", { product_id });
        
        try {
            const result = await query_select_by_id(product_id);
            if (!result) {
                logger.warn("ProductService: Product not found", { product_id });
                return { status: 404, message: "Product not found." };
            };
            logger.info("ProductService: Successfully fetched product by ID", { product_id });
            return result;
        } catch (error) {
            logger.error("ProductService: Error fetching product by ID", { product_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_stock(status) {
        logger.info("ProductService: Fetching products by stock", { status });
        
        try {
            const result = await query_select_by_stock(status);
            logger.info(`ProductService: Successfully fetched ${result.length || 0} products by stock`, { status });
            return result;
        } catch (error) {
            logger.error("ProductService: Error fetching products by stock", { status, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_name(name_product) {
        logger.info("ProductService: Fetching product by name", { name_product });
        
        try {
            const result = await query_select_by_name(name_product);
            logger.info("ProductService: Successfully fetched product by name", { name_product });
            return result;
        } catch (error) {
            logger.error("ProductService: Error fetching product by name", { name_product, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert_product(data) {
        logger.info("ProductService: Creating new product", { 
            product_name: data.product_name, 
            price: data.price, 
            category_id: data.category_id, 
            stock: data.stock,
            hasDescription: !!data.description,
            hasImage: !!data.image_buffer 
        });
        
        try {
            const result = await query_insert_product(data);
            logger.info("ProductService: Product created successfully", { product_name: data.product_name });
            return result;
        } catch (error) {
            logger.error("ProductService: Error creating product", { product_name: data.product_name, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update_product_by_id(product_id, data) {
        logger.info("ProductService: Updating product by ID", { 
            product_id, 
            product_name: data.product_name, 
            price: data.price, 
            category_id: data.category_id, 
            stock: data.stock,
            hasDescription: !!data.description,
            hasImage: !!data.image_buffer 
        });
        
        try {
            const check_if_exists = await query_select_by_id(product_id);

            if (!check_if_exists[0].product_id) {
                logger.warn("ProductService: Product not found for update", { product_id });
                return { status: 404, message: "Product not found." };
            };

            const result = await query_update_product_by_id(product_id, data);
            logger.info("ProductService: Product updated successfully", { product_id });
            return result;
        } catch (error) {
            logger.error("ProductService: Error updating product by ID", { product_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete_product_by_id(product_id) {
        logger.info("ProductService: Deleting product by ID", { product_id });
        
        try {
            const check_if_exists = await query_select_by_id(product_id);

            if (!check_if_exists[0].product_id) {
                logger.warn("ProductService: Product not found for deletion", { product_id });
                return { status: 404, message: "Product not found." };
            };

            const result = await query_delete_product_by_id(product_id);
            logger.info("ProductService: Product deleted successfully", { product_id });
            return result;
        } catch (error) {
            logger.error("ProductService: Error deleting product by ID", { product_id, error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new ProductService();