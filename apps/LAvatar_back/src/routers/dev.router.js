import express from 'express';
import apicache from 'apicache';

const router = express.Router();

if (process.env.NODE_ENV === 'development') {
    router.get('/cache/performance', (req, res) => {
        return res.json(apicache.getPerformance());
    });
    router.get('/cache/index', (req, res) => {
        return res.json(apicache.getIndex());
    });
}

export default router;
