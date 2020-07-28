import { db } from '@/plugins/firebase'

export const createChannel = async ({ name, description }) => {
	const key = await db.ref().push().key
	await db.ref(`chats/${key}`).set({ name, description })
	return key
}
