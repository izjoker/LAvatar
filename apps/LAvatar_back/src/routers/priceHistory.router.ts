import ERR from "http-errors";
import _ from "lodash";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import priceHistory from "../core/priceHistory/PriceHistory";
import LAItem from "../models/lavatar/LAItem.model";
import PriceHistoryModel from "../models/lavatar/PriceHistory.model";
const router = express.Router();

router.get(
	"/",
	expressAsyncHandler(async function (req, res) {
		const ids = await LAItem.getAllIdNums();
		res.json(ids);
		return;
	})
);
router.get(
	"/:idNum",
	expressAsyncHandler(async function (req, res) {
		const prices = await priceHistory.getItemPrice(
			parseInt(req.params.idNum)
		);
		console.log(prices);
		res.json(prices);
		return;
	})
);

export default router;
