const ApiError = require('../exceptions/api-error')
const requestsService = require('../service/requests-service')
const RequestModel = require('../models/request-model')
const priceModel = require('../models/price-model')
const infoModel = require('../models/info-model')


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

            const highestCounterRequest = await RequestModel.findOne().sort('-counter').exec();
            let counterValue = 1;
            if (highestCounterRequest.counter) {
                counterValue = highestCounterRequest.counter + 1;
            }
            const request = RequestModel.create({user: userId, departure: departure, destination: destination, date: new Date(), weight: weight, capacity: capacity, wagon_numbers: wagon_numbers, cargo_type: cargo_type, wagon_type: wagon_type, counter: counterValue})
            return res.json(request)
        } catch (error) {
            next(error)
        }
    }
    async getRequestPrices(req, res, next) {
        try {
            const requestId = req.params.requestId
            const prices = await priceModel.find({request: requestId})

            const userInfoPromises = prices.map(price => infoModel.findOne({ user: price.user }));
            const userInfoList = await Promise.all(userInfoPromises);
            const combinedData = [];
            for (let i = 0; i < prices.length; i++) {
                const price = prices[i];
                const userInfo = userInfoList[i];

                combinedData.push({
                    ...price.toObject(),
                    companyName: userInfo ? userInfo.companyName : null
                });
            }
            return res.json(combinedData);
        } catch (error) {
            next(error)
        }
    }
    async setChoosePriceandCarrier(req, res, next) {
        try {
            const {requestId, price, userId} = req.body
            const updatedRequest = await RequestModel.findByIdAndUpdate(requestId, { carrier: userId, price: price });
            return res.json({message: 'Перевозчик выбран', data: updatedRequest})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ShipperController()