import controller from '../controllers/productController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.post('/product/destroy',controller.delet)
	app.get('/product',controller.getAll)
	app.post('/product',controller.persist)
	app.get('/product/:id', controller.getById)
	app.post('/product/:id',controller.persist)
}