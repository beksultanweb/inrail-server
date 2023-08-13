const ApiError = require('../exceptions/api-error')
const requestsService = require('../service/requests-service')
const RequestModel = require('../models/request-model')
const carrierModel = require('../models/carrier-model')
const fs = require('fs').promises
const path = require('path')

class RequestsController {
    async getRequests(req, res, next) {
        try {
            const userId = req.params.userId
            const requests = await requestsService.getMyRequests(userId)
            return res.json(requests)
        } catch (error) {
            next(error)
        }
    }
    async getCarrierLogo(req, res, next) {
        const userId = req.params.userId
        const dirPath = path.join(__dirname, '..', `logos/${userId}`);
        
        try {
            const files = await fs.readdir(dirPath);
            await Promise.all(files.map(async file => {
                const filePath = path.join(dirPath, file);
                try {
                    res.download(filePath, file)
                    console.log(`${file} download successfully.`);
                } catch (unlinkErr) {
                    console.error(`Error deleting ${file}:`, unlinkErr);
                }
            }));
        } catch (err) {
            console.error('Error reading directory:', err);
        }
    }
    async getCarrierInfo(req, res, next) {
        try {
            const userId = req.params.userId
            
            const carrier = await carrierModel.findOne({ user: userId });
        
            if (!carrier) {
                return null; // No carrier found for the userId
            }
            console.log(carrier)
            return res.json(carrier);
        } catch (error) {
            next(error)
        }
    }
    async setCarrierInfo(req, res, next) {
        try {
            const { userId, companyName, BIN, address, contactName, phone } = req.body
            const logo = req.files
            const request = await requestsService.setCarrierInfo(userId, companyName, address, phone, logo, contactName, BIN)
            return res.json({status: 'success', message: request})
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

module.exports = new RequestsController()