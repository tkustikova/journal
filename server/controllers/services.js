const express = require("express");
const router = express.Router();
const Service = require("../models/service");

//обработка роутов
router.get("", (req, res) => getServices(req, res));

router.post("/add", (req, res) => addService(req, res));

router.post("/del", (req, res) => delService(req, res));

router.post("/edit", (req, res) => editService(req, res));


/**
 * отдает услуги
 * @param req
 * @param res
 */
const getServices = (req, res) => {
    let obj = {};
    Service.find(
        obj,
        undefined,
        {
            sort: {
                name: 1
            }
        }
    ).then(logs => res.json(logs))
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: "Произошла ошибка сервера" });
        });
};

const addService = (req, res) => {
    if (req.body !== undefined) {
        const service = req.body;
        new Service(service).save()
            .then(service => res.json(service))
            .catch(error => {
                console.error(error);
                res.status(500).send({ error: "Произошла ошибка сервера" });
            });
    } else res.status(403).send({ error: "Нет прав для выполнения операции" });

};
/**
 * удаляет услугу
 * @param req
 * @param res
 * @returns {Promise<any | never>}
 */
const delService = (req, res) =>
    Service.findByIdAndDelete(req.body.id)
        .then(() => res.send())
        .catch(() => res.status(500).send({ error: "Произошла ошибка сервера" }));

/**
 * редактирует журнал
 * @param req
 * @param res
 */
const editService = (req, res) => {
    if (req.body !== undefined) {
        Service.findByIdAndUpdate(req.body._id, req.body)
            .then(service => res.json(service))
            .catch(error => {
                console.log(error);
                res.status(500).send({ error: "Произошла ошибка сервера" })
            });
    }
};

module.exports = router;