//responsavel por executar o que tiver que ser executado
//as funcoes de lidar com o banco de dados
//os cruds - GetAll, GetById, Persistir, Delete
import Order from "../models/OrderModel";
import OrderProducts from "../models/OrderProductsModel";
import Product from "../models/ProductModel";
import { sequelize } from "../config/";
import { Op, Utils } from "sequelize";
import Jwt from "jsonwebtoken";
import getUserByToken from "../utils/getUserByToken";
import Cupom from "../models/CupomModel";

const getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({})
    // console.log(orders[0]);
    let response = []
    for (let order of orders) {
      console.log(order);
      let customer = await order.getUserCostumer()
      let deliver = await order.getUserDeliver()
      let product = await order.getProducts()
      // console.log(order);
      order = order.toJSON()
      console.log(order);
      order.product = product
      order.idUserCostumer = customer
      order.idUserDeliver = deliver
      response.push(order)
    }
    console.log(response)
    return res.status(200).send({
      type: 'sucess',
      message: `Registros Recuperados com sucesso`,
      data: response
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}

const getAllByToken = async (req, res) => {
  try {
    let user = await getUserByToken.getUserByToken(req.headers.authorization)
    console.log(user);
    const orders = await Order.findAll({
      where: {
        idUserCostumer: user.id
      }
    })
    // console.log(orders[0]);
    let response = []
    for (let order of orders) {
      console.log(order);
      let customer = await order.getUserCostumer()
      let deliver = await order.getUserDeliver()
      let product = await order.getProducts()
      // console.log(order);
      order = order.toJSON()
      console.log(order);
      order.product = product
      order.idUserCostumer = customer
      order.idUserDeliver = deliver
      response.push(order)
    }
    return res.status(200).send({
      type: 'sucess',
      message: `Registros Recuperados com sucesso`,
      data: response
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}




//getById
const getById = async (req, res) => {
  try {
    let { id } = req.params;

    //garante que o id só vai ter NUMEROS;
    id = id ? id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(200).send({
        type: 'warning',
        message: 'Informe um id valido'
      });
    }

    let order = await Order.findOne({
      where: {
        id
      }
    });

    if (!order) {
      return res.status(200).send({
        type: 'warning',
        message: `Não foi encontrado order com o id: ${id} `,
      });
    }

    let response = order.toJSON();
    let adress = await order.getAdress()
    order.idAdress = adress
    let customer = await order.getUserCostumer()
    let deliver = await order.getUserDeliver()
    let product = await order.getProducts()
    response.product = product
    response.idUserCostumer = customer
    response.idUserDeliver = deliver
    response.idAdress = adress
      // console.log(order);

    return res.status(200).send({
      type: 'sucess',
      message: 'aqui está:',
      data: response
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}

const persistir = async (req, res) => {
  try {
    let { id } = req.params;
    //caso nao tenha id, cria um novo registro
    let user = await getUserByToken.getUserByToken(req.headers.authorization)
    if (!id) {
      return await create(user.id, req.body, res)
    }

    return await update(user.id,id, req.body, res)
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}


const create = async (id, dados, res) => {

  let { products, idPayment, idCupom, idAdress } = dados;
  let totalvalue = 0
  let data = []


  for (let index = 0; index < products.length; index++) {
    let productValueForget = await Product.findOne({
      where: {
        id: products[index].produto
      }
    })
    if(!products[index].quantidade){
      products[index].quantidade = 1
    }
    totalvalue += Number(productValueForget.dataValues.price)*Number(products[index].quantidade)
  }
  let cupomIndex = null
  let totalDiscount = null
  if(idCupom){
    let cupom = await Cupom.findOne({
      where:{
        code: idCupom
      }
    })
    cupomIndex = cupom.id
    
    if(!cupomIndex){
      cupomIndex = null
    }else{
      let uses = await Order.findAll({
        where:{
          idCupom: cupomIndex
        }
      })
      if (uses.length >= cupom.uses) {
        return res.status(200).send({
          type: "error",
          message: `O cupom de codigo ${idCupom} ja foi utilizado diversas vezes!`
        })
      }else{
        if (cupom.type == "percent") {
          totalDiscount = totalvalue * (cupom.value/100)
          totalvalue -= totalvalue * (cupom.value/100)
        }else{
          totalvalue -= cupom.value
          totalDiscount = cupom.value
        }
      }
    }
  }
  

  let order = await Order.create({
    idUserCostumer: id, total: totalvalue, idPayment, idCupom: cupomIndex, totalDiscount: totalDiscount, idAdress
  })

  for (let index = 0; index < products.length; index++) {

    let productExistente = await Product.findOne({
      where: {
        id: products[index].produto
      }
    })

    //livro não existente não pode ser emprestado
    //com isso o order é cancelado/excluido
    if (!productExistente) {
      await order.destroy()
      return res.status(400).send({
        message: `O produto id ${products[index]} não existe. O empréstimo não foi salvo!!`
      })
    }


    data.push({
      nome: productExistente.name,
      preço: productExistente.price,
      quantidade: products[index].quantidade
    })
    await OrderProducts.create({
      idOrder: order.id,
      price_products: productExistente.price,
      idProduct: products[index].produto,
      quantity: products[index].quantidade
    });
  }
  return res.status(200).send({
    type: 'success', // success, error, warning, info
    message: 'Registro criado com sucesso', // mensagem para o front exibir
    data: {
      pedido: order,
      itens: data
    }
  });
}


const update = async (userId,id, dados, res) => {
  let order = await Order.findOne({
    where: {
      id,
      idUserCostumer: userId
    }
  });

  if (!order) {
    return res.status(400).send({ type: 'error', message: `Não foi encontrada order com o id ${id}` })
  }

  Object.keys(dados).forEach(field => order[field] = dados[field])


  await order.save()
  return res.status(200).send({
    message: `Order ${id} atualizada com sucesso`,
    data: order
  });
}



const deletar = async (req, res) => {
  try {
    let { id } = req.body;
    //garante que o id só vai ter NUMEROS;
    id = id ? id.toString() : null;
    id = id ? id.replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send({
        message: 'Informe um id válido para deletar o order'
      });
    }

    let order = await Order.findOne({
      where: {
        id
      }
    });

    if (!order) {
      return res.status(400).send({ message: `Não foi encontrada order com o id ${id}` })
    }

    await order.destroy();
    return res.status(200).send({
      message: `Order id ${id} deletada com sucesso`
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}


//implementar uma funcionalidade -empRoute:
//enviar um JSON
// {"idlivro": 1}
// retornar se está emprestado
// caso sim, retornar esse order

const avaiableCatchOrders = async (req, res) => {
  try {
    let orders = await Order.findAll({
      where: {
        idUserDeliver: null,
        status: {
          [Op.ne]: 'cancelado'
        },
        idAdress:{
          [Op.ne]: null
        }
      }
    })
    let response = []
    for (let order of orders) {
      console.log(order);
      let customer = await order.getUserCostumer()
      let adress = await order.getAdress()
      // console.log(order);
      order = order.toJSON()
      console.log(order);
      order.idAdress = adress
      order.idUserCostumer = customer
      response.push(order)
    }
    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Orders Disponiveis para entrega', // mensagem para o front exibir
      data: response
    })
  } catch (error) {
    return res.status(200).send({
      type: 'error', // success, error, warning, info
      message: 'OPS! erro', // mensagem para o front exibir
      data: error
    })
  }
}


const getOrder = async (req, res) => {
  try {
    let { orderId } = req.body
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1] || null;
    const decodedToken = Jwt.decode(token);

    let response = await Order.findOne({
      where: {
        id: orderId
      }
    })
    response.idUserDeliver = decodedToken.userId
    response.status = "A caminho"
    await response.save()

    return res.status(200).send({
      type: 'sucess', // success, error, warning, info
      message: 'Você pegou o pedido', // mensagem para o front exibir
      data: response
    })

  } catch (error) {
    return res.status(200).send({
      type: 'error', // success, error, warning, info
      message: 'OPS! erro', // mensagem para o front exibir
      data: error.message
    })
  }
}

const ordersCatchedByU = async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1] || null;
    const decodedToken = Jwt.decode(token);
    let orders = await Order.findAll({
      where: {
        idUserDeliver: decodedToken.userId,
        status: {
          [Op.ne]: 'cancelado'
        },
        status: {
          [Op.ne]: 'entregue'
        }
      }
    })
    let orderNotDelivered = []
    for (let order of orders){
      let customer = await order.getUserCostumer()
      let adress = await order.getAdress()
      // console.log(order);
      order = order.toJSON()
      console.log(order);
      order.idAdress = adress
      order.idUserCostumer = customer
      orderNotDelivered.push(order)
    }
    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Orders que voce pegou:', // mensagem para o front exibir
      data: orderNotDelivered
    })
  } catch (error) {
    return res.status(200).send({
      type: 'error', // success, error, warning, info
      message: 'OPS! erro', // mensagem para o front exibir
      data: error
    })
  }
}

const cancelCatchOrder = async (req, res) => {
  try {
    let user = await getUserByToken.getUserByToken(req.headers.authorization)
    let { orderId } = req.body

    let response = await Order.findOne({
      where: {
        id: orderId,
        idUserDeliver: user.id
      }
    })
    response.idUserDeliver = null
    response.status = "Buscando novo entregador"
    await response.save()
    return res.status(200).send({
      type: 'sucess', // success, error, warning, info
      message: 'Você cancelou a corrida', // mensagem para o front exibir
      data: response
    })
  } catch (error) {
    return res.status(200).send({
      type: 'error', // success, error, warning, info
      message: 'OPS! erro', // mensagem para o front exibir
      data: error
    })
  }
}

const cancelCustomerOrder = async (req, res) => {
  try {
    let {orderId} = req.body
    let user = await getUserByToken.getUserByToken(req.headers.authorization)
    let response = await Order.findOne({
      where:{
        idUserCostumer: user.id,
        id: orderId
      }
    })

    response.status = "cancelado"
    await response.save();
    return res.status(200).send({
      type: 'sucess', // success, error, warning, info
      message: 'Você cancelou o pedido', // mensagem para o front exibir
      data: response
    })
  } catch (error) {
    return res.status(200).send({
      type: 'error', // success, error, warning, info
      message: 'OPS! erro', // mensagem para o front exibir
      data: error.message
    })
  }
}

const getAllDelivered = async (req, res) =>{
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1] || null;
    const decodedToken = Jwt.decode(token);
    let orders = await Order.findAll({
      where: {
        idUserDeliver: decodedToken.userId,
        status: 'entregue'
      }
    })
    let orderDelivered = []
    for (let order of orders){
      let customer = await order.getUserCostumer()
      let adress = await order.getAdress()
      // console.log(order);
      order = order.toJSON()
      console.log(order);
      order.idAdress = adress
      order.idUserCostumer = customer
      orderDelivered.push(order)
    }
    return res.status(200).send({
      type: 'success', // success, error, warning, info
      message: 'Orders que voce pegou:', // mensagem para o front exibir
      data: orderDelivered
    })
  }catch(error){
    return res.status(200).send({
      type: 'error', // success, error, warning, info
      message: 'OPS! erro', // mensagem para o front exibir
      data: error.message
    })
  }
}

const confirmOrder = async (req, res) => {
  try {
    let { orderId } = req.body
    let response = await Order.findOne({
      where: {
        id: orderId
      }
    })
    response.status = "entregue"
    await response.save()

    return res.status(200).send({
      type: 'sucess', // success, error, warning, info
      message: 'Entregou o pedido', // mensagem para o front exibir
      data: response
    })

  } catch (error) {
    return res.status(200).send({
      type: 'error', // success, error, warning, info
      message: 'OPS! erro', // mensagem para o front exibir
      data: error.message
    })
  }
}



export default {
  getAll,
  getById,
  persistir,
  deletar,
  avaiableCatchOrders,
  getOrder,
  ordersCatchedByU,
  cancelCatchOrder,
  getAllByToken,
  cancelCustomerOrder,
  getAllDelivered,
  confirmOrder,
};