const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const roles = require("../modules/roles");

//обработка роутов
router.get("", (req, res) => getJournals(req, res));

router.get("/by_teacher_id", (req, res) => getTeacherJournals(req, res));

router.get("/by_id", (req, res) => getJournal(req, res));

router.post("/add", (req, res) => addJournal(req, res));

router.post("/del", (req, res) => delJournal(req, res));

router.post("/edit", (req, res) => editJournal(req, res));


/**
 * jотдает журналы исходя и з правила админам все учителю только его
 * @param req
 * @param res
 */
const getJournals = (req, res) => {
    let obj = {};
    if (req.session.auth.role !== roles.ADMIN) {
        obj = { owner: req.session.auth._id }
    }
        Log.find(
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
 * отдает только учительские журналы
 * @param req
 * @param res
 */
const getTeacherJournals = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth._id === req.query.id) {
        const { id } = req.query;

        Log.find({ owner: { _id: id } },
            undefined,
            {
                sort: {
                    name: 1
                }
            }
        ).then(journals => res.json(journals))
            .catch(error => {
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
const getJournal = (req, res) =>
    Log.findById(req.query)
        .then(journal => {
            if (req.session.auth.role === roles.ADMIN || journal.owner === req.session.auth._id){
                res.json(journal)
            } else res.status(403).send({ error: "Нет прав для выполнения операции" });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: "Произошла ошибка сервера" });
        });

const addJournal = (req, res) => {
    if (req.session.auth.role === roles.TEACHER && req.session.auth._id === req.body.owner) {
        const journal = req.body;

        new Log(journal).save()
            .then(journal => res.json(journal))
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
const delJournal = (req, res) =>
    Log.findByIdAndDelete(req.body.id)
        .then(() => res.send())
        .catch(() => res.status(500).send({ error: "Произошла ошибка сервера" }));

/**
 * редактирует журнал
 * @param req
 * @param res
 */
const editJournal = (req, res) => {
    if (req.session.auth.role === roles.ADMIN || req.session.auth._id === req.body.owner) {
        Log.findByIdAndUpdate(req.body._id, req.body)
            .then(journal => res.json(journal))
            .catch(error => {
                console.log(error);
                res.status(500).send({ error: "Произошла ошибка сервера" })
            });
    }
};

module.exports = router;