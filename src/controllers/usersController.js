import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserByToken from "../utils/getUserByToken";

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

const getByToken = async (req, res) => {
  try{
    let userForget = await getUserByToken.getUserByToken(req.headers.authorization)
    let idUser = userForget.id 
    return await getById(idUser, req, res)
  }catch(err){
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: err.message
    });
  }
}




const getAll = async (req, res) => {
  try {
    const response = await User.findAll({
      order: [['id', 'ASC']]
    });
    return res.status(200).send({
      type: 'sucess', // sucess, error, warning, info
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


const getById = async (id, req, res) =>{
  try {
    let response = await User.findOne({
      where:{
        id
      }
    })

    if (!response) {
      return res.status(200).send({
        type: 'warning',
        message: 'Não foi encontrado usuario com este ID',
      });
    }
    
    return res.status(200).send({
      type: 'sucess',
      message: 'Usuario encontrado',
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

const persist = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) {
      return await register(req.body, res)
    }
    return await update(id, req.body, res)

  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}

const register = async (data, res) => {
  try {
    let { username, name, phone, password, role, cpf,email } = data;

    let userExists = await User.findOne({
      where: {
        username
      }
    });

    if (userExists) {
      return res.status(200).send({
        type: 'error',
        message: 'Já existe um usuário cadastrado com esse username!'
      });
    }

    let passwordHash = await bcrypt.hash(password, 10);

    let response = await User.create({
      username,
      name,
      phone,
      passwordHash,
      role,
      cpf,
      email
    });

    return res.status(200).send({
      type: 'sucess',
      message: 'Usuário cadastrastado com sucesso!',
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

const update = async (id, data, res) => {
  try {
    let response = await User.findOne({
      where: {
        id
      }
    })
    // console.log(response);
    if (!response) {
      return res.status(200).send({
        type: 'error',
        message: `Não foi encontrado categorias com o id ${id}`
      });
    }
    console.log(Object.keys(data));
    console.log(data);
    let usernameForget = false;
    Object.keys(data).forEach(datas => {
      response[datas] = data[datas]
      if (datas == "username") {
        usernameForget = true
      }
    })
    
    // console.log(response);
    await response.save()

    return res.status(200).send({
      type: 'sucess', // sucess, error, warning, info
      message: 'Registros atualizados com sucesso, logue novamente!', // mensagem para o front exibir
      usernameForget,
      data: response // json com informações de resposta
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error,
    });
  }
}

const login = async (req, res) => {
  try {
    let { username, password } = req.body;

    let user = await User.findOne({
      where: {
        username
      }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(200).send({
        type: 'error',
        message: 'Usuário ou senha incorretos!'
      });
    }

    let token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role }, //payload - dados utilizados na criacao do token
      process.env.TOKEN_KEY, //chave PRIVADA da aplicação 
      { expiresIn: '1h' } //options ... em quanto tempo ele expira...
    );

    user.token = token;
    await user.save();

    return res.status(200).send({
      type: 'sucess',
      message: 'Bem-vindo! Login realizado com sucesso!',
      data: user,
      token
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

    let response = await User.findOne({
      where: {
        id: id
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
      data: error
    });
  }
}

const updatePassword = async(req, res) =>{
  try {
    let userForget = await getUserByToken.getUserByToken(req.headers.authorization)
    let idUser = userForget.id 
    if(!idUser){
      let {id} = req.body
      idUser = id
    }
    let {currentPassword, newPassword} = req.body
    
    if(!idUser){
      return res.status(200).send({
        type: 'warning',
        message: 'Informe um id válido'
      });
    }
    
    let user = await User.findOne({
      where: {
        id: idUser
      }
    })
    
    if(!user){
      return res.status(200).send({
        type: 'warning',
        message: 'Não foi encontrado usuario com este id'
      });
    }
    // console.log(user);
    if(!(await bcrypt.compare(currentPassword, user.passwordHash))){
      return res.status(200).send({
        type: 'warning',
        message: 'Senha atual incorreta'
      });
    }
    console.log(user);
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.token = null
    await user.save()

    return res.status(200).send({
      type: 'info',
      message: 'Senha atualizada com sucesso, logue-se Novamente'
    });

  }catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error
    });
  }
}

const addCart = async (req, res) =>{
  try{
    let {quantidade, idProduct,description,idCategory, image, name, price} = req.body
    let userForget = await getUserByToken.getUserByToken(req.headers.authorization)
    let idUser = userForget.id 
    let currentCart = await User.findOne({
      where:{
        id: idUser
      }
    })
    let userJSON = currentCart.toJSON()
    let userCart= userJSON.cart
    if(!currentCart.cart){
      currentCart.cart = [{produto: idProduct, quantidade, description,idCategory,image,name,price}]
      await currentCart.save()
      return res.status(200).send({
        type: 'success',
        message: 'Produto Adicionado ao carrinho',
        data: currentCart
      });
    }else{
      for(let produto of userCart){
        console.log(produto);
        if (produto.produto == idProduct) {
          produto.quantidade += quantidade
          currentCart.cart = userCart
          await currentCart.save()
          return res.status(200).send({
          type: 'success',
          message: 'Produto Adicionado ao carrinho',
          data: currentCart
      });
        }
      }
      userCart.push({produto: idProduct, quantidade,description,idCategory,image,name,price})
      currentCart.cart = userCart
      await currentCart.save()
      return res.status(200).send({
        type: 'success',
        message: 'Produto Adicionado ao carrinho',
        data: currentCart
      });
    }
    console.log(`quantidade: ${quantidade}, produto: ${idProduct}`);
  }catch(error){
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}

const remove = async (req, res) =>{
  try{
    let {quantidade, produto} = req.body
    let userForget = await getUserByToken.getUserByToken(req.headers.authorization)
    let idUser = userForget.id 
    let currentCart = await User.findOne({
      where:{
        id: idUser
      }
    })
    let userJSON = currentCart.toJSON()
    let userCart= userJSON.cart
    if(userCart.length > 1 ){
      userCart.forEach((cartItem, i) =>{
        if (cartItem.produto == produto) {
          if(cartItem.quantidade <= quantidade){
            userCart.splice(i, 1)
          }else{
            cartItem.quantidade = cartItem.quantidade - quantidade
          }
        }
      })
    }else{
      if(userCart[0].quantidade <= quantidade){
        userCart = null
      }else{
        userCart[0].quantidade = userCart[0].quantidade - quantidade
      }
    }
    console.log(userCart);
    currentCart.cart = userCart
    await currentCart.save()
    return res.status(200).send({
      type: 'success',
      message: 'Produto removido',
      data: `Produto ${produto} removido`
    });Password
  }catch(error){
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro!',
      data: error.message
    });
  }
}

const resetCarrinho = async (req, res) =>{
  try {
    let userForget = await getUserByToken.getUserByToken(req.headers.authorization)
    let idUser = userForget.id 
    let currentCart = await User.findOne({
      where:{
        id: idUser
      }
    })
    currentCart.cart = null
    await currentCart.save()
    return res.status(200).send({
      type:"success"
    })
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
  login,
  delet,
  updatePassword,
  getByToken,
  addCart,
  remove,
  resetCarrinho
}