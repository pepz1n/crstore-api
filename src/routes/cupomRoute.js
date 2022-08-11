import Controller from "../controllers/cupomController"
import adminValidator from "../utils/adminValidator"
import Authenticate from "../utils/Authenticate"


export default (app) => {
  app.get('/cupom', Authenticate, adminValidator ,Controller.dualGet)
  app.post('/cupom/verify', Authenticate, Controller.verify)
  app.post('/cupom', Authenticate,adminValidator, Controller.persist)
  app.post('/cupom/destroy',Authenticate,adminValidator, Controller.delet)
  app.get('/cupom/:id',Authenticate, adminValidator, Controller.dualGet)
  app.post('/cupom/:id',Authenticate,adminValidator, Controller.persist)
}