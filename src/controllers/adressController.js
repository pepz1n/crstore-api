import Adress from "../models/AdressModel";
import  Jwt  from "jsonwebtoken";
import Util  from "../utils/getUserByToken";


const getAll = async (req, res) => {
  try {
    let user = await Util.getUserByToken(req.headers.authorization)

    const response = await Adress.findAll({
      where: {
        idUser: user.id
      }
    })

    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Registros recuperados com sucesso', // mensagem para o front exibir
      data: response // json com informações de resposta
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message 
    });
  }
}

const getById = async (req, res) => {
  try {
    let user = await Util.getUserByToken(req.headers.authorization)
    let { id } = req.params
    id = id.toString()
    id = id.replace(/\D/g, '');

    if (!id) {
      return res.status(200).send({
        type: 'warning',
        message: 'Informe um ID valido para consulta'
      });
    }

    const response = await Adress.findOne({
      where: {
        id,
        idUser: user.id
      }
    })
    if (!response) {
      return res.status(200).send({
        type: 'warning',
        message: `Não foi encontrado registro com o id = ${id}`
      });
    }

    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Registro recuperado com sucesso', // mensagem para o front exibir
      data: response // json com informações de resposta
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}


const persist = async (req, res) => {
  try {
    let user = await Util.getUserByToken(req.headers.authorization)
    let { id } = req.params;
    if (!id) {

      return await create(user.id, req.body, res)
    }
    return await update(id, user.id ,req.body, res)
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}

const create = async (token, data, res) => {
  try {
    let { zip_code, state, city, street, district, number } = data;
   

    console.log(data);
    let response = await Adress.create({
      zip_code,
      state,
      city,
      street,
      district,
      number_forget: number,
      idUser: token
    })
    console.log(response);

    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Registro criado com sucesso', // mensagem para o front exibir
      data: response // json com informações de resposta
    });

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}

const update = async (id,token, datas, res) => {
  try {
    let user = {"id": token}
    let response = await Adress.findOne({
      where: {
        id,
        idUser: user.id
      }
    })
    if (!response) {
      return res.status(200).send({
        type: 'error',
        message: `Não foi encontrado categorias com o id ${id}`
      });
    }

    Object.keys(datas).forEach(data => response[data] = datas[data])

    await response.save()

    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Registros atualizados com sucesso', // mensagem para o front exibir
      data: response // json com informações de resposta
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}


const delet = async (req, res) => {
  try {
    let user = await Util.getUserByToken(req.headers.authorization)
    let { id } = req.body
    id = id.toString()
    id = id ? id.replace(/\D/g, '') : null
    if (!id) {
      return res.status(200).send({
        type: 'warning',
        message: 'Informe um id válido para deletar a categoria',
      });
    }

    let response = await Adress.findOne({
      where: {
        id: id,
        idUser: user.id
      }
    })

    if (!response) {
      return res.status(200).send({
        type: 'warning',
        message: `Não foi encontrada categoria com o id ${id}`,
      });
    }


    await response.destroy()
    return res.status(200).send({
      type: 'sucess',
      message: `registro com o id ${id} deletado com sucesso`,
    });

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}

export default {
  getAll,
  persist,
  getById,
  delet
}