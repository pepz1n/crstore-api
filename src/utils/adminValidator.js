import jwt from "jsonwebtoken";

export default async (req, res, next) =>{
  try {
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1] || null
    const decodedToken = jwt.decode(token);

    if(decodedToken.role != "admin"){
      return res.status(200).send({
        type: 'warning',
        message: 'Você não tem permissão para acessar essa página!'
      })
    }
    
    next()
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! ocorreu um erro',
      data: error.message
    })
  }
}