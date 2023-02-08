import jwt from 'jsonwebtoken'
import _ from 'lodash'
import config from './config'

const JWT_SECRET = config.get('authentication.jwt_secret');
function verify(token: any) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        console.log('failed to verify token', e)
        return null;
    }
}

function sign(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: config.get('authentication.jwt_expireIn')});
}

function extractToken(reqOrBearer: any) {
    let bearerString = reqOrBearer;
    if (reqOrBearer) {
        bearerString = _.get(reqOrBearer, 'headers.authorization');
    }
    if (bearerString) {
        return (bearerString).substring(7, (bearerString).length);
    } else {
        return null;
    }
}

const jwtHelper = {
    verify,
    sign,
    extractToken,
};
export default jwtHelper;