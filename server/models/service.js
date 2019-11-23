const mongoose = require("mongoose");
//модель услуги

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        default: 0
    }
});

const model = mongoose.model("service", schema);

module.exports = model;
