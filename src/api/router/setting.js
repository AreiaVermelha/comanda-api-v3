const router = require("express").Router();
const logger = require("../../../logger");
const SettingService = require("../../services/settingService");

router.get("/", async (req, res) => {
    logger.info("GET /setting - Fetching all settings");
    
    try {
        const result = await SettingService.service_query_select_all();
        logger.info(`GET /setting - Successfully fetched ${result.length || 0} settings`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /setting - Error fetching settings:", error);
        res.status(500).send({ message: "Erro ao buscar as configurações.", status: false });
    };
});

router.post("/", async (req, res) => {
    const { estabishment_name, serveiceChange, service_change_percentage, image_pix, color } = req.body;
    
    logger.info("POST /setting - Creating new setting", { 
        estabishment_name, 
        serveiceChange, 
        service_change_percentage, 
        color, 
        hasImagePix: !!image_pix 
    });

    let image_buffer = null;
    if (image_pix) {
        const base64Data = image_pix.replace(/^data:image\/\w+;base64,/, "");
        image_buffer = Buffer.from(base64Data, 'base64');
    };

    const data = {
        estabishment_name, serveiceChange, service_change_percentage, image_buffer, color
    };

    try {
        await SettingService.service_query_insert_setting(data);
        logger.info(`POST /setting - Setting created successfully for establishment: ${estabishment_name}`);
        res.status(201).send({ message: "Configuração criada com sucesso.", status: true });
    } catch (error) {
        logger.error("POST /setting - Error creating setting:", error);
        res.status(500).send({ message: "Erro ao criar nova configuração.", status: false });
    };
});

router.put("/:setting_id", async (req, res) => {
    const { setting_id } = req.params;
    const {
        estabishment_name,
        serveice_change,
        service_change_percentage,
        image_pix,
        color,
        service_change_printer,
        printer_name
    } = req.body;
    
    logger.info(`PUT /setting/${setting_id} - Updating setting`, { 
        estabishment_name, 
        serveice_change, 
        service_change_percentage, 
        color, 
        service_change_printer, 
        printer_name, 
        hasImagePix: !!image_pix 
    });

    let image_buffer = null;
    if (image_pix) {
        const base64Data = image_pix.replace(/^data:image\/\w+;base64,/, "");
        image_buffer = Buffer.from(base64Data, 'base64');
    };

    const data = {
        estabishment_name,
        serveice_change,
        service_change_percentage,
        image_buffer,
        color,
        service_change_printer,
        printer_name
    };

    try {
        await SettingService.service_query_update_setting_by_id(setting_id, data);
        logger.info(`PUT /setting/${setting_id} - Setting updated successfully`);
        res.status(200).send({ message: "Configuração atualizada com sucesso.", status: true });
    } catch (error) {
        logger.error(`PUT /setting/${setting_id} - Error updating setting:`, error);
        res.status(500).send({ message: "Erro ao atualizar a configuração.", status: false });
    };
});

module.exports = router;