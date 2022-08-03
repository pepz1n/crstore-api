import controller from '../controllers/paymentController'
import adminValidator from '../utils/adminValidator'
import Authenticate from '../utils/Authenticate'

export default (app) => {
  app.post('/payment/destroy',Authenticate, adminValidator, controller.delet)
  app.get('/payment', controller.getAll)
  app.post('/payment',Authenticate, adminValidator, controller.persist)
  app.get('/payment/:id', controller.getById)
  app.post('/payment/:id',Authenticate, adminValidator, controller.persist)
}