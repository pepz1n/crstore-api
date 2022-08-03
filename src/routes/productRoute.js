import controller from '../controllers/productController'
import adminValidator from '../utils/adminValidator'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.post('/product/destroy',Authenticate, adminValidator, controller.delet)
	app.get('/product',controller.getAll)
	app.post('/product', Authenticate, adminValidator, controller.persist)
	app.get('/product/:id', controller.getById)
	app.post('/product/:id',Authenticate,adminValidator, controller.persist)
}