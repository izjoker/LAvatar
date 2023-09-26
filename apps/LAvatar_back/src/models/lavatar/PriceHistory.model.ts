import { BaseEntity, Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "price_history" })
export default class PriceHistoryModel extends BaseEntity {
	@PrimaryColumn()
	idNum: Number;

	@Column({ nullable: true, default: null })
	tradeCount: boolean;

	@Column({ nullable: false, default: null })
	date: Date;

	@Column({ nullable: true, default: null })
	dealt_price_0: Number;

	@Column({ nullable: true, default: null })
	dealt_price_1: Number;

	@Column({ nullable: true, default: null })
	dealt_price_2: Number;

	@Column({ nullable: true, default: null })
	dealt_price_3: Number;

	@Column({ nullable: true, default: null })
	sale_price_0: Number;

	@Column({ nullable: true, default: null })
	sale_price_1: Number;

	@Column({ nullable: true, default: null })
	sale_price_2: Number;

	@Column({ nullable: true, default: null })
	sale_price_3: Number;

	@Column({ nullable: true, default: null })
	volume_0: Number;

	@Column({ nullable: true, default: null })
	volume_1: Number;

	@Column({ nullable: true, default: null })
	volume_2: Number;

	@Column({ nullable: true, default: null })
	volume_3: Number;

	static async addRow(priceHistory: PriceHistoryModel) {
		this.upsert(priceHistory, ["idNum", "date"]);
	}
}
