const {Schema, model} = require('mongoose')

const PriceSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    request: {type: Schema.Types.ObjectId, ref: 'Request'},
    price: {type: String}
})

module.exports = model('Price', PriceSchema)