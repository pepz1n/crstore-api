import adressController from "../controllers/adressController"
import Authenticate from "../utils/Authenticate"


export default (app) => {
  app.post('/adress/destroy', Authenticate, adressController.delet)
  app.get('/adress', Authenticate, adressController.getAll)
  app.post('/adress', Authenticate, adressController.persist)
  app.get('/adress/:id', Authenticate, adressController.getById)
  app.post('/adress/:id',Authenticate, adressController.persist)
}