const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const roles = require("../modules/roles");

//обработка роутов
router.get("", (req, res) => getPatients(req, res));

router.post("/add", (req, res) => addPatient(req, res));

router.post("/del", (req, res) => delPatient(req, res));

router.post("/edit", (req, res) => editPatient(req, res));

/**
 * отдает пациентов админу или врачам
 * @param req
 * @param res
 */
const getPatients = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth.role === roles.TEACHER) {
        Patient.find(
            {},
            undefined,
            {
                sort: {
                    name: 1
                }
            }
        ).then(users => res.json(users))
            .catch(error => {
                console.error(error);
                res.status(500).send({ error: "Произошла ошибка сервера" });
            });
    } else {
        res.json([req.session.auth]);
    }
};
/**
 * добавляет пациента
 * @param req
 * @param res
 */
const addPatient = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth.role === roles.TEACHER) {
        if (req.body !== undefined) {
            const patient = req.body;
            new Patient(patient).save()
                .then(patient => res.json(patient))
                .catch(error => {
                    console.error(error);
                    res.status(500).send({ error: "Произошла ошибка сервера" });
                });
        } else res.status(403).send({ error: "Некорретные данные пациента" });
    } else res.status(403).send({ error: "Нет прав для выполнения операции" });
};
/**
 * редактирует пациента
 * @param req
 * @param res
 */
const editPatient = (req, res) => {
    if (req.body !== undefined) {
        Patient.findByIdAndUpdate(req.body._id, req.body)
            .then(patient => res.json(patient))
            .catch(error => {
                console.log(error);
                res.status(500).send({ error: "Произошла ошибка сервера" })
            });
    }
};
/**
 * удаляет пациента
 * @param req
 * @param res
 */
const delPatient = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth.role === roles.TEACHER) {
        Patient.findByIdAndDelete(req.body.id)
            .then(() => res.send())
            .catch(error => {
                console.log(error);
                res.status(500).send({ error: "Произошла ошибка сервера" })});
    } else res.status(403).send({ error: "Нет прав для выполнения операции" });
};


module.exports = router;