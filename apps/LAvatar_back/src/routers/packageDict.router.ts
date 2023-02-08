import ERR from 'http-errors'
import _ from 'lodash'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import packageDict from '../models/lavatar/PackageDict.model'

let router = express.Router();

router.get(
    '/', 
    expressAsyncHandler(async function (req, res) {
        let items = await packageDict.getItems()
        res.json(items)
        return;
    }),
);



export default router;