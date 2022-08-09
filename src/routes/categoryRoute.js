import categoryController from "../controllers/categoryController"
import adminValidator from "../utils/adminValidator"
import Authenticate from "../utils/Authenticate"


export default (app) => {
  app.post('/category/destroy',Authenticate, adminValidator, categoryController.delet)
  app.get('/category', categoryController.getAll)
  app.get('/category/get-all-categories', categoryController.getAllCategories)
  app.post('/category',Authenticate, adminValidator,categoryController.persist)
  app.get('/category/:id', categoryController.getById)
  app.post('/category/:id',Authenticate, adminValidator, categoryController.persist)
}