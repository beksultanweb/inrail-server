const ApiError = require('../exceptions/api-error')
const requestsService = require('../service/requests-service')
const RequestModel = require('../models/request-model')


class ShipperController {
    async getRequests(req, res, next) {
        try {
            const userId = req.params.userId
            const requests = await requestsService.getMyRequests(userId)
            return res.json(requests)
        } catch (error) {
            next(error)
        }
    }

    async getRequest(req, res, next) {
        try {
            const requestId = req.params.requestId
            const request = await requestsService.getRequest(requestId)
            return res.json(request)
        } catch (error) {
            next(error)
        }
    }
    async createRequest(req, res, next) {
        try {
            const { departure, destination, weight, capacity, wagon_numbers, cargo_type, wagon_type } = req.body.values
            const userId = req.user.id
            const request = RequestModel.create({user: userId, departure: departure, destination: destination, date: new Date(), weight: weight, capacity: capacity, wagon_numbers: wagon_numbers, cargo_type: cargo_type, wagon_type: wagon_type})
            return res.json(request)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ShipperController()