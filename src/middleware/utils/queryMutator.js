const { ClientError, Client500Error } = require('../../libs/ClientError');

const sendObjMixin = (res, result = null, error = null) => {
  const isSuccess = !error;
  return res.send({ result, isSuccess, error });
};

const throwMixin = (res, error) => {
  if (!(error instanceof ClientError)) error = new Client500Error();
  return res.status(error.status).return(null, error.getError());
};

module.exports = (req, res) => {
  res.return = (result, error) => sendObjMixin(res, result, error);
  res.throw = (error) => throwMixin(res, error);
  return { req, res };
};
