module.exports = app => {
    const controller = app.controllers.usuario;
    const middleware = app.middleware.auth;

    app.route('/v1/usuario/:usuarioId').all(middleware.authorization).get(controller.getUser);
    app.route('/v1/usuario/empresa/:empresaId').all(middleware.authorization).get(controller.getCompanyUsers);
    app.route('/v1/login').post(controller.login);
}