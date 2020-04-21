const jwt = require("jsonwebtoken");
const moment = require("moment");
const db = require("../../database/conn")();

module.exports = (app) => {
  const auth = {};

  auth.authorization = (req, res, next) => {
    var token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "Token não informado." });
    }

    let secret = process.env.SECRET;
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res
          .status(401)
          .send({ auth: false, message: "Token inválido." });
      } else {
        const expiresAt = decoded.exp;
        var now = new Date();
        var expireDate = moment(expiresAt * 1000).toDate();
        if (expireDate < now) {
          res.status(401).json({ message: "Token expirado." });
        } else {
          let usuarioId = decoded.id;
          let sql = `SELECT usuario_token FROM usuario WHERE usuario_id = ${usuarioId}`;
          let query = db.query(sql, (err, result) => {
            if (err) {
              res.status(400).json({ message: "Unknown error" });
            } else {
              if (result.length > 0) {
                next();
              } else {
                res
                  .status(400)
                  .json({ message: "Token inválido. Usuário não encontrado." });
              }
            }
          });
        }
      }
    });
  };

  return auth;
};
