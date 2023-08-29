const {Schema, model} = require('mongoose')

const RequestSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    departure: {type: String},
    destination: {type: String},
    date: {type: Date},
    weight: {type: Number},
    capacity: {type: Number},
    wagon_numbers: {type: Number},
    cargo_type: {type: String},
    wagon_type: {type: String},
    carrier: {type: String},
    price: {type: String}
})

module.exports = model('Request', RequestSchema)