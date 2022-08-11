import Cupom from "../models/CupomModel";
import Order from "../models/OrderModel";

const dualGet = async (req,res) =>{ 
  try{
    let { id } = req.params

    id = id ? id.toString().replace(/\D/g, '') :null

    if(!id){
      return await getAll(req, res)
    }else{
      return await getById(id, req, res)
    }
  }catch(error){
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}

const verify = async (req, res) =>{
  try{
    let {cupom} = req.body
    let responseCupom = await Cupom.findOne({
      where:{
        code: cupom
      }
    })
    if (!responseCupom) {
      return res.status(200).send({
        type: 'error',
        message: 'Não foi encontrado cupom com o codigo',
      });
    }
    let responseOrder = await Order.findAll({
      where: {
        idCupom: responseCupom.id
      }
    })
    if(responseOrder.length >= responseCupom.uses){
      return res.status(200).send({
        type: 'error',
        message: 'Cupom Com muitos usos',
      });
    }else{
      return res.status(200).send({
        type: 'success',
        message: responseCupom,
      });
    }
    return res.status(200).send({
      type: 'error',
      message: "erro",
    });
  }catch(error){
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}


const getAll = async (req, res) => {
  try {

    const response = await Cupom.findAll({
      order: [['id', 'asc']]
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
      data: error
    });
  }
}

const getById = async (id, req, res) => {
  try {
    const response = await Cupom.findOne({
      where: {
        id
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
    let { id } = req.params;
    if (!id) {
      return await create(req.body, res)
    }
    return await update(id, req.body, res)
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}

const create = async (data, res) => {
  try {
    let { code, type, value, uses } = data;

    let response = await Cupom.create({
      code,
      type,
      value,
      uses
    })

    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Cupom criado com sucesso', // mensagem para o front exibir
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

const update = async (id, datas, res) => {
  try {
    let cupom = await Cupom.findOne({
      where: {
        id
      }
    })
    if (!cupom) {
      return res.status(200).send({
        type: 'error',
        message: `Não foi encontrado categorias com o id ${id}`
      });
    }

    Object.keys(datas).forEach(data => cupom[data] = datas[data])

    await cupom.save()

    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Registros atualizados com sucesso', // mensagem para o front exibir
      data: cupom // json com informações de resposta
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}


const delet = async (req, res) => {
  try {
    let { id } = req.body
    id = id.toString()
    id = id ? id.replace(/\D/g, '') : null
    if (!id) {
      return res.status(200).send({
        type: 'warning',
        message: 'Informe um id válido para deletar a categoria',
      });
    }

    let cupom = await Cupom.findOne({
      where: {
        id: id
      }
    })

    if (!cupom) {
      return res.status(200).send({
        type: 'warning',
        message: `Não foi encontrada categoria com o id ${id}`,
      });
    }


    await cupom.destroy()
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
  dualGet,
  persist,
  dualGet,
  delet,
  verify
}