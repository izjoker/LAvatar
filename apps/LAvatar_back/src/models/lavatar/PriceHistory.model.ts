import { BaseEntity, Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "price_history" })
export default class PriceHistory extends BaseEntity {
	@PrimaryColumn()
	idNum: Number;

	@Column({ nullable: true })
	tradeCount: boolean;

	@Column({ nullable: false })
	date: Date;

	@Column({ nullable: true })
	dealt_price_0: Number;

	@Column({ nullable: true })
	dealt_price_1: Number;

	@Column({ nullable: true })
	dealt_price_2: Number;

	@Column({ nullable: true })
	dealt_price_3: Number;

	@Column({ nullable: true })
	sale_price_0: Number;

	@Column({ nullable: true })
	sale_price_1: Number;

	@Column({ nullable: true })
	sale_price_2: Number;

	@Column({ nullable: true })
	sale_price_3: Number;

	@Column({ nullable: true })
	volume_0: Number;

	@Column({ nullable: true })
	volume_1: Number;

	@Column({ nullable: true })
	volume_2: Number;

	@Column({ nullable: true })
	volume_3: Number;
}
