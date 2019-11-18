const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const roles = require("../modules/roles");

//обработка роутов
router.get("", (req, res) => getServices(req, res));

router.get("/by_teacher_id", (req, res) => getDoctorServices(req, res));

router.get("/by_id", (req, res) => getService(req, res));

router.post("/add", (req, res) => addService(req, res));

router.post("/del", (req, res) => delService(req, res));

router.post("/edit", (req, res) => editService(req, res));


/**
 * jотдает услуги исходя и з правила админам все врачу только его
 * @param req
 * @param res
 */
const getServices = (req, res) => {
    let obj = {};
    if (req.session.auth.role !== roles.ADMIN) {
        obj = { owner: req.session.auth._id }
    }
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

/**
 * отдает только услуги врача
 * @param req
 * @param res
 */
// eslint-disable-next-line no-unused-vars
const getDoctorServices = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth._id === req.query.id) {
        const { id } = req.query;

        Service.find({ owner: { _id: id } },
            undefined,
            {
                sort: {
                    name: 1
                }
            }
        ).then(services => res.json(services))
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
                res.status(500).send({ error: "Произошла ошибка сервера" });
            });
    } else res.status(403).send({ error: "Нет прав для выполнения операции" });
};

/**
 * отдает 1 журнал
 * @param req
 * @param res
 * @returns {Promise<any | never>}
 */
const getService = (req, res) =>
    Service.findById(req.query)
        .then(service => {
            if (req.session.auth.role === roles.ADMIN || service.owner === req.session.auth._id){
                res.json(service)
            } else res.status(403).send({ error: "Нет прав для выполнения операции" });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: "Произошла ошибка сервера" });
        });

const addService = (req, res) => {
    if (req.session.auth.role === roles.TEACHER && req.session.auth._id === req.body.owner) {
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
 * удаляет журнал
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
    if (req.session.auth.role === roles.ADMIN || req.session.auth._id === req.body.owner) {
        Service.findByIdAndUpdate(req.body._id, req.body)
            .then(journal => res.json(journal))
            .catch(error => {
                console.log(error);
                res.status(500).send({ error: "Произошла ошибка сервера" })
            });
    }
};

module.exports = router;