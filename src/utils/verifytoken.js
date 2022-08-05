import jwt from "jsonwebtoken";
import User from "../models/UserModel";

export default async (req, res, next) => {
  try {
    let { authorization } = req.body;
    console.log(authorization);

    if (!authorization) {
      return res.status(200).send({
        type: 'unauthorized',
        message: 'Token não informado'
      })
    }

    const token = authorization.split(' ')[1] || null;
    const decodedToken = jwt.decode(token);
    
    if (!decodedToken) {
      return res.status(200).send({
        type: 'unauthorized',
        message: 'Você não tem permissão para acessar esse recurso!'
      })
    }

    if (decodedToken.exp < (Date.now() / 1000)) {
      return res.status(200).send({
        type: 'unauthorized',
        message: 'Sua sessão expirou! Faça login novamente'
      })
    }

    

    const user = await User.findOne({
      where: {
        id: decodedToken.userId
      }
    })

    if (!user) {
      return res.status(200).send({
        type: 'unauthorized',
        message: 'Usuário não encontrado'
      })
    }


    return res.status(200).send({
      type: 'authorized'
    })
  } catch (unauthorized) {
    return res.status(200).send({
      type: 'unauthorized',
      message: 'Ocorreu um problema!'
    })
  }
};