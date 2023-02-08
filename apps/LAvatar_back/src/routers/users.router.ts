import ERR from 'http-errors'
import _ from 'lodash'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import authMw from '../middlewares/auth.mw'
import DB from '../models/lavatar/index'

 
 

const User = DB.model('User');

let router = express.Router();


router.get(
    '/me',
    authMw.jwt_authenticate, 
    expressAsyncHandler(async function (req, res) {
        const tokenUser = await User.findById(_.get(req, 'jwt.payload.id'));
        if (!tokenUser) {
            throw ERR(404, 'user not found', { details: { userId: _.get(req, 'jwt.payload.id') } });
        }
        res.json(tokenUser);
        return;
    }),
);

router.get(
    '/', 
    expressAsyncHandler(async function (req, res) {
        res.json(User);
        console.log(User)
        return;
    }),
);

router.post(
    '/',
    expressAsyncHandler(async function (req, res) {
        console.log('req', req)
        console.log('req.body: ', req.body)
        if (_.get(req, 'body.email') && _.get(req, 'body.password')) {
            
            const userInfo = _.pick(req.body, ['email', 'password', 'username']);
            const newUser = new User(userInfo);
            const createdUser = await newUser.save().catch((e) => {
                throw ERR(400, 'user creation failed', e);
            });
            res.json(createdUser);
            return;
        } else {
            throw ERR(400, 'password and email should be passed');
        }
    }),
);

// const allowedToUpdate = ['settings', 'username'];
// router.put(
//     '/:id',
//     authMw.jwt_authenticate,
//     expressAsyncHandler(async function (req, res) {
//         const tokenId = _.get(req, 'jwt.payload.id');
//         if (req.params.id !== tokenId) {
//             res.status(401).json({ msg: 'not authorized' });
//             return;
//         }
//         const updateBody = _.pick(req.body, allowedToUpdate);
//         const updated = await User.findByIdAndUpdate(tokenId, updateBody, { new: true });
//         if (updated) {
//             res.json(updated);
//             return;
//         } else {
//             throw ERR(400, 'badRequest');
//         }
//     }),
// );

export default router;