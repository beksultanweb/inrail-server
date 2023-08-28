const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')
const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middlewares/role-middleware')
const shipperController = require('../controllers/shipper-controller')
const carrierController = require('../controllers/carrier-controller')
const fileUpload = require('express-fileupload')
const filePayloadExitst = require('../middlewares/fileExist-middleware')
const fileExtLimiter = require('../middlewares/fileExt-middleware')
const fileSizeLimiter = require('../middlewares/fileSize-middleware')


router.post('/registration',
    body('firstName'),
    body('secondName'),
    body('email').isEmail(),
    body('password').isLength({min: 4, max: 24}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
// router.post('/password-reset', userController.resetpassword)
// router.post('/password-reset/:userId/:token', userController.setnewpassword)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)

router.get('/request/:requestId', verifyRoles(ROLES_LIST.User), shipperController.getRequest)
router.get('/requests', verifyRoles(ROLES_LIST.Carrier), carrierController.getAllRequests)
router.post('/setprice', verifyRoles(ROLES_LIST.Carrier), carrierController.setPrice)
router.get('/myprices/:userId', verifyRoles(ROLES_LIST.Carrier), carrierController.getMyPrices)

router.get('/requests/:userId', verifyRoles(ROLES_LIST.Shipper), shipperController.getRequests)
router.get('/getprices/:requestId', verifyRoles(ROLES_LIST.Shipper), shipperController.getRequestPrices)
router.post('/choosecarrier', verifyRoles(ROLES_LIST.Shipper), shipperController.setChoosePriceandCarrier)
router.post('/requests', verifyRoles(ROLES_LIST.Admin), authMiddleware, shipperController.createRequest)
router.post('/user-info', fileUpload({createParentPath: true}), filePayloadExitst, fileExtLimiter(['.png', '.jpg', '.jpeg']), fileSizeLimiter, verifyRoles(ROLES_LIST.Shipper, ROLES_LIST.Carrier), userController.setInfo)
router.get('/getmyinfo/:userId', verifyRoles(ROLES_LIST.Shipper, ROLES_LIST.Carrier), userController.getInfo)
router.get('/getmylogo/:userId', verifyRoles(ROLES_LIST.Shipper, ROLES_LIST.Carrier), userController.getLogo)

module.exports = router