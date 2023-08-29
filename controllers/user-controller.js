const userService = require('../service/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const fs = require('fs').promises
const path = require('path')
const infoModel = require('../models/info-model')
const requestsService = require('../service/requests-service')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, firsName, secondName, roles} = req.body
            const userData = await userService.registration(email, password, firsName, secondName, roles)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error)
        }
    }

    // async resetpassword(req, res, next) {
    //     try {
    //         await userService.resetpassword(req.body.email)
    //         res.send("password reset link sent to your email account")
    //     } catch (error) {
    //         next(error)
    //     }
    // }
    
    // async setnewpassword(req, res, next) {
    //     try {
    //         await userService.setnewpassword(req.params.userId, req.body.password, req.params.token)
    //         res.send("password reset sucessfully")
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async setInfo(req, res, next) {
        try {
            const { userId, companyName, BIN, address, contactName, phone } = req.body
            const logo = req.files
            const request = await requestsService.setInfo(userId, companyName, address, phone, logo, contactName, BIN)
            return res.json({status: 'success', message: request})
        } catch (error) {
            next(error)
        }
    }
    async getLogo(req, res, next) {
        const userId = req.params.userId

        const dirPath = path.join(__dirname, '..', `logos/${userId}`);

        try {
            const files = await fs.readdir(dirPath);
            await Promise.all(files.map(async file => {
                const filePath = path.join(dirPath, file);
                try {
                    res.sendFile(filePath)
                } catch (unlinkErr) {
                    console.error(`Error downloading ${file}:`, unlinkErr);
                }
            }));
        } catch (err) {
            next(err);
        }
    }
    async getInfo(req, res, next) {
        try {
            const userId = req.params.userId

            const carrier = await infoModel.findOne({ user: userId });

            if (carrier === null) {
                throw ApiError.BadRequest('Заполните свой профайл!');
            }

            return res.json(carrier);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController()