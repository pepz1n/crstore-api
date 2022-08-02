import adressController from "../controllers/adressController"


export default (app) => {
  app.post('/adress/destroy', adressController.delet)
  app.get('/adress', adressController.getAll)
  app.post('/adress', adressController.persist)
  app.get('/adress/:id', adressController.getById)
  app.post('/adress/:id', adressController.persist)
}