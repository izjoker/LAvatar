import { BaseEntity, Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "la_items" })
export default class LAItem extends BaseEntity {
	@PrimaryColumn()
	id: string;

	@Column({ nullable: true, unique: true })
	id_num: number;

	@Column({ nullable: true })
	icon: string;

	@Column({ nullable: true })
	trade_count: boolean;

	@Column({ nullable: true })
	name: string;

	// static async addRow(laItem: LAItem) {
	// 	db.manager.insert(LAItem, laItem);
	// }
	static async getAllIdNums() {
		const r = [];
		let idLst_obj = await this.find({
			select: {
				id_num: true,
			},
		});
		idLst_obj.map((obj) => {
			r.push(obj["id_num"]);
		});
		return r;
	}
}
