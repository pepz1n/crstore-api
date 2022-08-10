import controller from '../controllers/usersController'
import adminValidator from '../utils/adminValidator'
import Authenticate from '../utils/Authenticate'
import verifytoken from '../utils/verifytoken'

export default (app) => {
  app.get('/users', Authenticate, adminValidator, controller.dualGet)
  app.post('/users', controller.persist)
  app.post('/users/cart', controller.addCart)
  app.post('/users/cart-remove', controller.remove)
  app.get('/users/by-token', Authenticate, controller.getByToken)
  app.post('/users/verify-token', verifytoken)
  app.post('/users/update-password',Authenticate, controller.updatePassword)
  app.post('/users/login', controller.login),
  app.post('/users/delete', Authenticate,adminValidator, controller.delet)
  app.post('/users/:id',Authenticate, controller.persist)
  app.get('/users/:id', Authenticate, controller.dualGet)
}