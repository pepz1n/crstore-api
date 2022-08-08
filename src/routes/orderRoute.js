import Controller from "../controllers/orderController"
import adminValidator from "../utils/adminValidator"
import Authenticate from "../utils/Authenticate"
import deliverValidator from "../utils/deliverValidator"


export default (app) => {
  app.get('/order', Authenticate, adminValidator, Controller.getAll)
  app.post('/order',Authenticate, Controller.persistir)
  app.post('/order/confirm', Authenticate, deliverValidator, Controller.confirmOrder)
  app.get('/order/get-all-delivered', Authenticate, deliverValidator, Controller.getAllDelivered)
  app.post('/order/cancel-customer', Authenticate, Controller.cancelCustomerOrder)
  app.post('/order/get-corrida',Authenticate,deliverValidator, Controller.getOrder)
  app.get('/order/catched-by-me',Authenticate,deliverValidator, Controller.ordersCatchedByU)
  app.post('/order/cancel-corrida',Authenticate,deliverValidator, Controller.cancelCatchOrder)
  app.post('/order/destroy',Authenticate, adminValidator, Controller.deletar)
  app.get('/order/get-order-avaiable',Authenticate,deliverValidator, Controller.avaiableCatchOrders)
  app.get('/order/get-all-orders-by-token',Authenticate, Controller.getAllByToken)
  app.get('/order/:id',Authenticate, Controller.getById)
  app.post('/order/:id',Authenticate, Controller.persistir)
}