import {
	Not,
	IsNull,
	BaseEntity,
	Entity,
	Column,
	PrimaryColumn,
	OneToMany,
} from "typeorm";
import PriceHistoryModel from "./PriceHistory.model";

@Entity({ name: "la_items" })
export default class LAItem extends BaseEntity {
	@PrimaryColumn()
	id: String;

	@Column({ nullable: true, unique: true })
	id_num: Number;

	@Column({ nullable: true })
	icon: String;

	@Column({ nullable: true })
	trade_count: Boolean;

	@Column({ nullable: true })
	name: String;

	@OneToMany(() => PriceHistoryModel, (priceHistory) => priceHistory.laitem)
	prices: PriceHistoryModel[];

	static async addRow(laItem: LAItem) {
		this.upsert(laItem, ["id"]);
	}

	static async getAllIdNums() {
		const r = [];
		let idLst_obj = await this.find({
			where: {
				id_num: Not(IsNull()),
			},
		});
		idLst_obj.map((obj) => {
			r.push(obj["id_num"]);
		});
		return r;
	}
}
