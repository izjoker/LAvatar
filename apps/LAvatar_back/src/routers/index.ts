
import express from 'express'
import authRouter from './auth.router'
// import devRouter from './dev.router';
import usersRouter from './users.router'
import packageDictRouter from './packageDict.router'


const rootRouter = express.Router();
rootRouter.use('/auth', authRouter);
// rootRouter.use('/dev', devRouter);
rootRouter.use('/users', usersRouter);
rootRouter.use('/packageDict', packageDictRouter)

export default rootRouter;