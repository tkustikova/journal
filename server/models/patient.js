const mongoose = require("mongoose");
//модель пациента

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Date,
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true, //пациент не мб без доктора
    }
});

const model = mongoose.model("Patient", schema);

module.exports = model;
