import Controller from "../controllers/orderController"


export default (app) => {
  app.get('/order', Controller.getAll)
  app.post('/order', Controller.persistir)
  app.post('/order/get-corrida', Controller.getOrder)
  app.get('/order/catched-by-me', Controller.ordersCatchedByU)
  app.post('/order/cancel-corrida', Controller.cancelCatchOrder)
  app.post('/order/destroy', Controller.deletar)
  app.get('/order/get-order-avaiable', Controller.avaiableCatchOrders)
  app.get('/order/:id', Controller.getById)
  app.post('/order/:id', Controller.persistir)
}