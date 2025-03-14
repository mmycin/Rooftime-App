import Pocketbase from 'pocketbase';

const URL = import.meta.env.VITE_API_URL;
export const pb =  new Pocketbase(URL);

class Database {
	private collection: string;

	constructor(collectionName: string) {
		this.collection = collectionName;
	}

	async findAll() {
		return await pb.collection(this.collection).getFullList();
	}

	async findOne(id: string) {
		return await pb.collection(this.collection).getOne(id);
	}

	async findMany(ids: string[]) {
		return await pb.collection(this.collection).getList(1, 100, {
			filter: `id IN (${ids.map((id) => `"${id}"`).join(',')})`
		});
	}

	async create(data: object) {
		return await pb.collection(this.collection).create(data);
	}

	async update(id: string, data: object) {
		return await pb.collection(this.collection).update(id, data, { $autoCancel: false });
	}

	async delete(id: string) {
		return await pb.collection(this.collection).delete(id);
	}
}

export default Database;