const {Schema, model} = require('mongoose')

const InfoSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    companyName: {type: String},
    address: {type: String},
    phone: {type: String},
    contactName: {type: String},
    BIN: {type: String},
    logo: [{type: String}]
})

module.exports = model('Info', InfoSchema)