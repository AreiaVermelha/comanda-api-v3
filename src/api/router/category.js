const router = require('express').Router();
const logger = require("../../../logger");
const CategoryService = require("../../services/categoryService");

router.get("/", async (req, res) => {
    logger.info("GET /category - Fetching all categories");
    
    try {
        const result = await CategoryService.service_query_select_all();
        logger.info(`GET /category - Successfully fetched ${result.length || 0} categories`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /category - Error fetching categories:", error);
        res.status(500).send({ message: "Erro ao buscar categorias.", status: false });
    };
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    logger.info(`GET /category/${id} - Fetching category by ID`);
    
    try {
        const result = await CategoryService.service_query_select_by_id(id);
        logger.info(`GET /category/${id} - Successfully fetched category`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /category/${id} - Error fetching category:`, error);
        res.status(500).send({ message: "Erro ao buscar categoria.", status: false });
    };
});

router.post("/", async (req, res) => {
    const { name_category, screen } = req.body;
    
    logger.info("POST /category - Creating new category", { name_category, screen });
    
    try {
        await CategoryService.service_query_insert({ name_category, screen });
        logger.info(`POST /category - Category "${name_category}" created successfully`);
        res.status(200).send({ message: "Categoria criada com sucesso!", status: true });
    } catch (error) {
        logger.error("POST /category - Error creating category:", error);
        res.status(500).send({ message: "Erro ao buscar categoria.", status: false });
    };
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name_category, screen } = req.body;
    
    logger.info(`PUT /category/${id} - Updating category`, { name_category, screen });
    
    try {
        await CategoryService.service_query_update(id, { name_category, screen });
        logger.info(`PUT /category/${id} - Category updated successfully`);
        res.status(200).send({ message: "Categoria atualizada com sucesso!", status: true });
    } catch (error) {
        logger.error(`PUT /category/${id} - Error updating category:`, error);
        res.status(500).send({ message: "Erro ao buscar categoria.", status: false });
    };
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    logger.info(`DELETE /category/${id} - Deleting category`);
    
    try {
        await CategoryService.service_query_delete(id);
        logger.info(`DELETE /category/${id} - Category deleted successfully`);
        res.status(200).send({ message: "Categoria deletado com sucesso!", status: true });
    } catch (error) {
        logger.error(`DELETE /category/${id} - Error deleting category:`, error);
        res.status(500).send({
            message: `Para deletar uma categoria, é necessário deletar ou alterar 
                    a categoria de todos os produtos vinculados a ela.`,
            status: false
        });
    };
});

module.exports = router;