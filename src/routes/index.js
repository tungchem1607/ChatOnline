import express from 'express';
import { home, auth } from './../controllers';
import { authValid } from './../validation'
let router = express.Router();
/* 
  Init all routes
  param @app from exactly module
*/
let initRoutes = (app) => {
    router.get('/', home.getHome);
    router.get('/login-register', auth.getLoginRegister);
    router.post('/register', authValid.register, auth.postRegister);
    return app.use('/', router);
};
module.exports = initRoutes;