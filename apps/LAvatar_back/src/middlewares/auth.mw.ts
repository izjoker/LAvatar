import _ from 'lodash'
import express, { Request, Response, NextFunction } from 'express'
import ERR from 'http-errors'
import jwtHelper from '../utils/jwtHelper'
/**
 * Verify JWT Token, and inject parsed payload on `req.jwt.payload`
 */
function jwt_authenticate(req: Request, res: Response, next: NextFunction) {
    let jwtToken = null;
    console.log("req.headers.authorization: ", req.headers.authorization)
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwtToken = req.headers.authorization.split(' ')[1];
    } else {
        console.log(req.headers.authorization)
        return next(ERR(401, 'invalid authentication token', { exception_code: 1, path: req.path }));
    }
    console.log("req.headers.authorization: ", req.headers.authorization)
    console.log("jwtToken: ", jwtToken)
    const tokenPayload = jwtHelper.verify(jwtToken);
    if (tokenPayload) {
        _.set(req, 'jwt.payload', tokenPayload);
        // TODO put logger here
        // console.log('token parsed', req.jwt.payload);
        return next();
    } else {
        return next(
            ERR(401, 'invalid authentication token', {
                exception_code: 2,
                payload: tokenPayload,
                path: req.path,
            }),
        );
    }
}
exports.jwt_authenticate = jwt_authenticate


const authMw = {
    jwt_authenticate
};
export default authMw;