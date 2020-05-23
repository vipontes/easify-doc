const db = require("../../database/conn")();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  const controller = {};

  //
  // getUser
  //
  controller.getUser = (req, res) => {
    const { usuarioId } = req.params;

    let sql = `SELECT 
    u.usuario_id, 
    u.usuario_nome, 
    u.usuario_email, 
    u.usuario_ativo, 
    u.empresa_id,
    e.empresa_nome,
    u.usuario_token
    FROM usuario u
    INNER JOIN empresa e ON u.empresa_id = e.empresa_id
    WHERE u.usuario_id = ${usuarioId}`;

    let query = db.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ message: "Unknown error" });
      } else {
        res.status(200).send(result[0]);
      }
    });
  };

  //
  // getCompanyUsers
  //
  controller.getCompanyUsers = (req, res) => {
    const { empresaId } = req.params;

    let sql = `SELECT 
    u.usuario_id, 
    u.usuario_nome, 
    u.usuario_email, 
    u.usuario_ativo, 
    u.empresa_id,
    e.empresa_nome,
    u.usuario_token
    FROM usuario u
    INNER JOIN empresa e ON u.empresa_id = e.empresa_id
    WHERE u.empresa_id = ${empresaId}`;

    let query = db.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ message: "Unknown error" });
      } else {
        res.status(200).send(result);
      }
    });
  };

  //
  // login
  //
  controller.login = (req, res, next) => {
    const email = req.body.usuario_email;
    const password = req.body.usuario_senha;

    if (email == undefined || password == undefined) {
      res.status(400).send({ message: "Please pass email and password" });
      return;
    }

    const secret = process.env.SECRET;
    const pasword_hash = crypto
      .createHmac("sha512", secret)
      .update(password)
      .digest("hex");

    var sql = `SELECT usuario_id, usuario_ativo FROM usuario WHERE usuario_email = '${email}' AND usuario_senha = '${pasword_hash}'`;

    var query = db.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ message: "Unknown error" });
      } else if (result.length == 0) {
        res.status(401).send({ message: "Invalid credentials" });
      } else {
        var data = result[0];
        if (data.usuario_ativo == 0) {
          res.status(400).send({ message: "Access denied" });
        } else {
          const usuarioId = data.usuario_id;
          var token = jwt.sign({ id: usuarioId }, secret, {
            expiresIn: 3600, // 1 hour
          });

          sql = `UPDATE usuario SET usuario_token = '${token}' WHERE usuario_id = ${usuarioId}`;
          query = db.query(sql, (err, result) => {
            if (err) {
              res.status(400).send({ message: "Unknown error" });
            } else {
              sql = `SELECT 
                u.usuario_id, 
                u.usuario_nome, 
                u.usuario_email, 
                u.usuario_ativo, 
                u.empresa_id,
                e.empresa_nome,
                u.usuario_token
                FROM usuario u
                INNER JOIN empresa e ON u.empresa_id = e.empresa_id
                WHERE u.usuario_id = ${usuarioId}`;

              query = db.query(sql, (err, result) => {
                if (err) {
                  res.status(400).send({ message: "Unknown error" });
                } else {
                  data = result[0];
                  res.status(200).send(data);
                }
              });
            }
          });
        }
      }
    });
  };

  return controller;
};
