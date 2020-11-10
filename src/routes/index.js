import express from 'express';
import { home, auth, user, contact, notification } from './../controllers';
import { authValid, userValid, contactValid } from './../validation';
import passport from 'passport';
import initPassportLocal from './../controllers/passportController/local';
import initPassportFacebook from './../controllers/passportController/facebook';
import initPassportGoogle from './../controllers/passportController/google';
// Init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();
let router = express.Router();
/* 
  Init all routes
  param @app from exactly module
*/
let initRoutes = (app) => {

    router.get('/login-register', auth.checkLoggedOut, auth.getLoginRegister);
    router.post('/register', auth.checkLoggedOut, authValid.register, auth.postRegister);
    router.get('/verify/:token', auth.checkLoggedOut, auth.verifyAccount);
    router.post('/login', auth.checkLoggedOut, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login-register',
        successFlash: true,
        failureFlash: true
    }));
    router.get('/auth/facebook', auth.checkLoggedOut, passport.authenticate('facebook', {
        scope: ['email']
    }));
    router.get('/auth/facebook/callback', auth.checkLoggedOut, passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login-register',
    }));

    router.get('/auth/google', auth.checkLoggedOut, passport.authenticate('google', {
        scope: ['email']
    }));
    router.get('/auth/google/callback', auth.checkLoggedOut, passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login-register',
    }));

    router.get('/', auth.checkLoggedIn, home.getHome);
    router.get('/logout', auth.checkLoggedIn, auth.getLogOut);

    router.put('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar);
    router.put('/user/update-info', auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
    router.put('/user/update-password', auth.checkLoggedIn, userValid.updatePassword, user.updatePassword);


    router.get('/contact/find-users/:keyword', auth.checkLoggedIn, contact.findUsersContact);
    router.post('/contact/add-new', auth.checkLoggedIn, contact.addNew);
    router.delete('/contact/remove-request-contact', auth.checkLoggedIn, contact.removeRequestContact);

    router.get('/notification/read-more', auth.checkLoggedIn, notification.readMore);

    return app.use('/', router);
};
module.exports = initRoutes;