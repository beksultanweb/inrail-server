const RequestService = require('../service/requests-service')
const UserService = require('../service/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const path = require('path')
const priceModel = require('../models/price-model')

class CarrierController {
    async getAllRequests(req, res, next) {
        try {
            const requests = await RequestService.getAllRequests()
            return res.json(requests)
        } catch (error) {
            next(error)
        }
    }
    async getUser(req, res, next) {
        try {
            const userId = req.params.userId
            const user = await UserService.getUserInfo(userId)
            return res.json(user)
        } catch (error) {
            next(error)
        }
    }
    async setPrice(req, res, next) {
        try {
            const { userId, requestId, price } = req.body
            await priceModel.findOneAndUpdate(
                { user: userId, request: requestId },
                { request: requestId, price },
                { upsert: true, new: true }
            )
            return res.json({ price, request: requestId })
        } catch (error) {
            next(error)
        }
    }
    async getMyPrices(req, res, next) {
        try {
            const userId = req.params.userId
            const prices = await priceModel.find({user: userId})
            return res.json(prices)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CarrierController()