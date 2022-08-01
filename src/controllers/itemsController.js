import Item from "../models/ProductModel";

const get = (req, res) => {
  res.send({
    type: 'success',
    message: 'Voce conseguiu chegar no GET!!'
  });
}

const persist = (req, res) => {
  res.send({
    type: 'success',
    message: 'Voce conseguiu chegar no PERSIST!!'
  });
}

const destroy = (req, res) => {
  res.send({
    type: 'success',
    message: 'Voce conseguiu no DESTROY!!'
  });
}

export default {
  get,
  persist,
  destroy
}