import { text } from 'express';
import nodemailer from 'nodemailer'
import User from '../models/UserModel';
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
var http = require("https");

async function send(req, res){
  try {

    let { email } = req.body

    let response = await User.findOne({
      where:{
        email
      }
    })

    if(!response){
      return res.status(200).send({
        type: "error",
        message: "Account not found!"
      })
    }
    let resetToken = crypto.randomBytes(2).toString("hex");
    console.log(resetToken);
    // let account = nodemailer.createTransport({
    //   host: "smtp.netcorecloud.net",
    //   port: 25,
    //   secure: false,
    //   auth: {
    //     user: 'pepz1nmail',
    //     pass: 'pepz1nmail_f07afebd4480a49aa9f7a7a40606a3a8'
    //   }
    // });
    
    response.recuperation = resetToken
    await response.save()

    // let data = await account.sendMail({
    //   from: '"CRS Bernardo" <pepz1nmail@pepisandbox.com>',
    //   to: `${email}, bebezanetti@gmail.com`,
    //   subject: "Recuperação de Senha CRStore",
    //   text: `Seu Código para recuperar a senha é :
    //                 ${resetToken}
    //   `
    // })

    var options = {
      "method": "POST",
      "hostname": "emailapi.netcorecloud.net",
      "port": null,
      "path": "/v5/mail/send",
      "headers": {
        "api_key": "f07afebd4480a49aa9f7a7a40606a3a8",
        "content-type": "application/json"
      }
    };
    
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        var body = Buffer.concat(chunks);
       console.log(body.toString());
      });
    });
    
    req.write(JSON.stringify({
      from: {email: 'pepz1nmail@pepisandbox.com', name: 'pepz1nmail'},
      subject: `Recuperação de senha`,
      content: [{type: 'html', value: `Olá ${response.username} seu codigo de recuperação é: ${resetToken}`}],
      personalizations: [{to: [{email: email, name: response.username}]}]
    }));
    req.end();

    return res.status(200).send({
      type: 'success',
    })
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      data: error.message
    })
  }
}

const receiveCode = async (req, res) =>{
  try {
    let {code, email} = req.body
    let response = await User.findOne({
      where:{
        email
      }
    })

    console.log(code)
    console.log(response.recuperation)
    if(response.recuperation == code){
      response.recuperation = null
      await response.save()
      return res.status(200).send({
        type:"success"
      })
    }else{
      return res.status(200).send({
        type:"error"
      })
    }
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      data: error.message
    })
  }
}

const updatePassword = async(req, res) =>{
  try {
   
    let {newPassword, email} = req.body
    
    
    let user = await User.findOne({
      where: {
        email: email
      }
    })
    
    // console.log(user);
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

export default {
  send,
  receiveCode,
  updatePassword
}