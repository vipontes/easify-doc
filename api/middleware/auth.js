const jwt = require("jsonwebtoken");
const moment = require("moment");
const db = require("../../database/conn")();

function julianIntToDate(n) {
    var a = n + 32044;
    var b = Math.floor(((4*a) + 3)/146097);
    var c = a - Math.floor((146097*b)/4);
    var d = Math.floor(((4*c) + 3)/1461);
    var e = c - Math.floor((1461 * d)/4);
    var f = Math.floor(((5*e) + 2)/153);

    var D = e + 1 - Math.floor(((153*f) + 2)/5);
    var M = f + 3 - 12 - Math.round(f/10);
    var Y = (100*b) + d - 4800 + Math.floor(f/10);

    return new Date(Y,M,D);
}

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
