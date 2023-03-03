import express from 'express';
// import authRouter from './auth.router'
// import devRouter from './dev.router';
// import usersRouter from './users.router'
import packageDictRouter from './packageDict.router';
import priceHistoryRouter from './packageDict.router';

const rootRouter = express.Router();
rootRouter.use('/packageDict', packageDictRouter);

rootRouter.use('/priceHistory', priceHistoryRouter);

export default rootRouter;
