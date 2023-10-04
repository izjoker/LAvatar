import {
	BaseEntity,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	PrimaryColumn,
	ManyToOne,
	Unique,
	JoinColumn,
} from "typeorm";
import LAItem from "./LAItem.model";
@Entity({ name: "price_history" })
@Unique(["date", "laitem"])
export default class PriceHistoryModel extends BaseEntity {
	@Column({ nullable: true, default: null })
	trade_count: boolean;

	@PrimaryColumn()
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

	@PrimaryColumn({ name: "laitem_id", type: "text" })
	@ManyToOne(() => LAItem, (laitem) => laitem.id)
	@JoinColumn({ name: "laitem_id" })
	laitem: LAItem;

	static addRow(priceHistory: PriceHistoryModel) {
		this.upsert(priceHistory, ["date", "laitem"]);
	}
}
