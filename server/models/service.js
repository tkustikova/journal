const mongoose = require("mongoose");
//модель услуги

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Date,
        required: true
    }
});

const model = mongoose.model("Serv", schema);

module.exports = model;
