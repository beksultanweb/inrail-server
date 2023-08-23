const RequestModel = require('../models/request-model')
const path = require('path')
const fs = require('fs').promises;
const infoModel = require('../models/info-model')

class RequestService {
    async getMyRequests(userId) {
        const requests = await RequestModel.find({user: userId})
        return requests
    }
    async getAllRequests() {
        const requests = await RequestModel.find()
        return requests
    }
    async getRequest(requestId) {
        const request = await RequestModel.findById(requestId)
        return request
    }

    async setInfo(userId, companyName, address, phone, logo, contactName, BIN) {
        try {
            const dirPath = path.join(__dirname, '..', `logos/${userId}`);
    
            try {
                const files = await fs.readdir(dirPath);
                await Promise.all(files.map(async file => {
                    const filePath = path.join(dirPath, file);
                    try {
                        await fs.unlink(filePath);
                    } catch (unlinkErr) {
                        console.error(`Error deleting ${file}:`, unlinkErr);
                    }
                }));
            } catch (err) {
                console.error('Error reading directory:', err);
            }

            Object.keys(logo).forEach(key => {
                const newFilepath = path.join(__dirname, '..', `logos/${userId}`, logo[key].name);
                logo[key].mv(newFilepath, (err) => {
                    if (err) return res.status(500).json({ status: 'error', message: err });
                });
            });

            const request = await infoModel.findOneAndUpdate(
                { user: userId },
                { companyName, address, phone, contactName, BIN, logo: Object.keys(logo) },
                { upsert: true, new: true }
            );
            return request;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new RequestService()