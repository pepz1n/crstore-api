import Payment from "../models/PaymentsModel";


const getAll = async (req, res) => {
  try {

    const response = await Payment.findAll({
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

const getById = async (req, res) => {
  try {
    let { id } = req.params
    id = id.toString()
    id = id.replace(/\D/g, '');

    if (!id) {
      return res.status(200).send({
        type: 'warning',
        message: 'Informe um ID valido para consulta'
      });
    }

    const response = await Payment.findOne({
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
    let { name } = data;

    let response = await Payment.create({
      name
    })

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

const update = async (id, datas, res) => {
  try {
    let response = await Payment.findOne({
      where: {
        id
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
    let { id } = req.body
    id = id.toString()
    id = id ? id.replace(/\D/g, '') : null
    if (!id) {
      return res.status(200).send({
        type: 'warning',
        message: 'Informe um id válido para deletar o pagamento',
      });
    }

    let response = await Payment.findOne({
      where: {
        id: id
      }
    })

    if (!response) {
      return res.status(200).send({
        type: 'warning',
        message: `Não foi encontrada pagamento com o id ${id}`,
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
      data: error
    });
  }
}

export default {
  getAll,
  persist,
  getById,
  delet
}