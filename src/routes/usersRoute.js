import controller from '../controllers/usersController'

export default (app) => {
  app.get('/users', controller.dualGet)
  app.post('/users', controller.persist)
  app.post('/users/update-password', controller.updatePassword)
  app.post('/users/login', controller.login),
  app.post('/users/delete', controller.delet)
  app.post('/users/:id', controller.persist)
  app.get('/users/:id',controller.dualGet)
}