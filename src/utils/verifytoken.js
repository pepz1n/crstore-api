import jwt from "jsonwebtoken";
import User from "../models/UserModel";

export default async (req, res, next) => {
  try {
    let { authorization } = req.body;
    if(!authorization){
      authorization = req.headers.authorization;
    }
    console.log(authorization);

    if (!authorization || authorization == "Bearer") {
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
        type: 'expired',
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

    if(user.role == "deliver"){
      return res.status(200).send({
        type: 'unauthorized',
        message: 'User sem permissão',
        role: "deliver",
        name: user.username
      })
    }

    if(user.role !== 'admin') {
      return res.status(200).send({
        type: 'unauthorized',
        message: 'User sem permissão',
        name: user.username
      })
    }
    

    return res.status(200).send({
      type: 'authorized',
      name: user.username
    })
  } catch (unauthorized) {
    return res.status(200).send({
      type: 'unauthorized',
      message: 'Ocorreu um problema!'
    })
  }
};