const { query_select_all_category, query_insert_category,
     query_select_by_id, query_update_category,
     query_delete_category
} = require("../repositores/query_category");
const logger = require("../../logger");

class CategoryService {
    async service_query_select_all() {
        logger.info("CategoryService: Fetching all categories");
        
        try {
            const result = await query_select_all_category();
            logger.info(`CategoryService: Successfully fetched ${result.length || 0} categories`);
            return result;
        } catch (error) {
            logger.error("CategoryService: Error fetching all categories", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_id(id) {
        logger.info("CategoryService: Fetching category by ID", { id });
        
        try {
            const result = await query_select_by_id(id);
            logger.info("CategoryService: Successfully fetched category by ID", { id });
            return result;
        } catch (error) {
            logger.error("CategoryService: Error fetching category by ID", { id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert(data) {
        logger.info("CategoryService: Creating new category", { name_category: data.name_category, screen: data.screen });
        
        try {
            const result = await query_insert_category(data);
            logger.info("CategoryService: Category created successfully", { name_category: data.name_category });
            return result;
        } catch (error) {
            logger.error("CategoryService: Error creating category", { name_category: data.name_category, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update(id, data) {
        logger.info("CategoryService: Updating category", { id, name_category: data.name_category, screen: data.screen });
        
        try {
            const result = await query_update_category(id, data);
            logger.info("CategoryService: Category updated successfully", { id });
            return result;
        } catch (error) {
            logger.error("CategoryService: Error updating category", { id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete(id) {
        logger.info("CategoryService: Deleting category", { id });
        
        try {
            const result = await query_delete_category(id);
            logger.info("CategoryService: Category deleted successfully", { id });
            return result;
        } catch (error) {
            logger.error("CategoryService: Error deleting category", { id, error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new CategoryService();