import Controller from "../controllers/cupomController"


export default (app) => {
  app.get('/cupom', Controller.dualGet)
  app.post('/cupom', Controller.persist)
  app.post('/cupom/destroy', Controller.delet)
  app.get('/cupom/:id', Controller.dualGet)
  app.post('/cupom/:id', Controller.persist)
}