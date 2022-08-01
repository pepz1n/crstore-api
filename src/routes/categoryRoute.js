import categoryController from "../controllers/categoryController"


export default (app) => {
  app.post('/category/destroy', categoryController.delet)
	app.get('/category', categoryController.getAll)
	app.post('/category', categoryController.persist)
  app.get('/category/:id', categoryController.getById)
  app.post('/category/:id', categoryController.persist)
}