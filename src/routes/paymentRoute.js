import controller from '../controllers/paymentController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
  app.post('/payment/destroy', controller.delet)
  app.get('/payment', controller.getAll)
  app.post('/payment', controller.persist)
  app.get('/payment/:id', controller.getById)
  app.post('/payment/:id', controller.persist)
}