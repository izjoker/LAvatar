import express, {Request, RequestHandler, Response } from 'express'
import asyncHandler from 'express-async-handler'
import ERR from 'http-errors'
import DB from '../models/lavatar/index'
import { UserDocument, UserModel } from '../models/lavatar/User.model';

const User = DB.model('User') as UserModel;
const router = express.Router();

router.post(
    '/',
    asyncHandler(async function (req, res) {
        const user = await User.findOne({ email: req.body.email })
            .select('+password')
            .select('+permissions');
        if (user) {
            let isPasswordCorrect = await user.comparePassword(req.body.password);
            if (isPasswordCorrect) {
                res.json({ token: user.createAuthToken(req.query.withPermissions) });
                return;
            } else {
                throw ERR(400, 'password is not correct');
            }
        } else {
            throw ERR(404, 'user is not exist');
        }
    }),
);

router.post(
    '/token',
    asyncHandler(async function (req, res) {
        res.json(await User.getUser(req.body.email, req.body.password));
    }),
);
export default router;