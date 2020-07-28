import { db } from '@/plugins/firebase'
export default {
	state: {
		users: [],
		answerMode: false,
		searchList: [],
		editingMode: false,
		currentChat: [],
		activeWriters: [],
		selectedMessage: null,
		searchListResult: null,
	},
	mutations: {
		SET_SEARCH_LIST(state, payload) {
			state.searchList = payload
		},
		SET_SEARCH_LIST_RESULT(state, payload) {
			state.searchListResult = payload
		},
		SET_CHAT(state, payload) {
			if (Array.isArray(payload)) {
				state.currentChat = payload
				return
			}
			state.currentChat = [...state.currentChat, payload]
		},
		SET_SELECTED_MESSAGE(state, payload) {
			state.selectedMessage = payload
		},
		SET_EDITING_MODE(state, payload) {
			state.editingMode = payload
		},
		SET_ANSWER_MODE(state, payload) {
			state.answerMode = payload
		},
		SET_ACTIVE_WRITERS(state, payload) {
			if (Array.isArray(payload)) {
				state.activeWriters = payload
				return
			}
			state.activeWriters = [...state.activeWriters, payload]
		},
	},

	actions: {
		//
		setSearchListResult({ commit }, payload) {
			commit('SET_SEARCH_LIST_RESULT', payload)
		},
		setSearchList({ commit }, payload) {
			commit('SET_SEARCH_LIST', payload)
		},
		loadActiveWriters({ commit, getters, rootGetters }, id) {
			if (!id) return
			const chatId = 1
			const ref = db.ref(`chats/${chatId}/writers`)

			ref.off()
			ref.limitToLast(100).on('child_added', (data) => {
				const user = rootGetters['user/user']
				if (user.id !== data.val().id) {
					commit('SET_ACTIVE_WRITERS', data.val())
				}
			})
			ref.limitToLast(100).on('child_changed', (data) => {
				commit('SET_ACTIVE_WRITERS', data.val())
			})
			ref.limitToLast(100).on('child_removed', (data) => {
				const res = getters.activeWriters.filter((v) => {
					return v.id !== data?.val().id
				})
				commit('SET_ACTIVE_WRITERS', res)
			})
			ref
				.child(id)
				.onDisconnect()
				.remove()
		},
		setActiveWriters({ commit }, { id, name }) {
			const chatId = 1
			const ref = db.ref(`chats/${chatId}/writers`)

			if (!name) {
				ref.child(id).remove()
				return
			}
			ref.child(id).set({ name, id })
		},

		setAnswerMode({ commit }, payload) {
			commit('SET_ANSWER_MODE', payload)
		},
		setEditingMode({ commit }, payload) {
			commit('SET_EDITING_MODE', payload)
		},
		setSelectedMessage({ commit }, payload) {
			commit('SET_SELECTED_MESSAGE', payload)
		},
		updateMessage({ getters, commit }, content) {
			const { selectedMessage } = getters
			const message = { ...selectedMessage, content, changed: true }
			const id = message.message_id
			const chatId = 1
			db.ref(`chats/${chatId}/messages/${id}`).update(message)
			commit('SET_SELECTED_MESSAGE', null)
			commit('SET_EDITING_MODE', false)
		},
		sendMessage({ commit }, { chatId, message }) {
			const key = db.ref().push().key
			db.ref(`chats/${chatId}/messages/${key}`).set({
				message_id: key,
				...message,
				changed: false,
			})
			commit('SET_SELECTED_MESSAGE', null)
			commit('SET_ANSWER_MODE', false)
		},
		deleteMessage(context, { id, chatId }) {
			db.ref(`chats/${chatId}/messages/${id}`).remove()
		},
		deleteAllMessages({ commit }) {
			db.ref('chats/1/messages').remove()
		},
		loadMessages({ commit, getters }, { chatId }) {
			const messagesRef = db.ref(`chats/${chatId}/messages`)
			messagesRef.off()

			messagesRef.on('child_added', (data) => {
				console.log('child_added')

				commit('SET_CHAT', data.val())
			})
			messagesRef.on('child_changed', (data) => {
				console.log('child_changed')
				const result = getters.currentChat.map((msg) => {
					const id = msg.message_id
					const _id = data.val().message_id
					if (id === _id) {
						return data.val()
					}
					return msg
				})
				commit('SET_CHAT', result)
			})
			messagesRef.on('child_removed', (data) => {
				console.log('child_removed')
				const result = getters.currentChat.filter(
					(msg) => msg.message_id !== data.val().message_id
				)
				commit('SET_CHAT', result)
			})
		},
	},

	getters: {
		users: (state) => state.users,
		chats: (state) => state.chats,
		searchList: (state) => state.searchList,
		answerMode: (state) => state.answerMode,
		currentChat: (state) => state.currentChat,
		editingMode: (state) => state.editingMode,
		currentChatId: (state) => state.currentChatId,
		activeWriters: (state) => state.activeWriters,
		selectedMessage: (state) => state.selectedMessage,
		searchListResult: (state) => state.searchListResult,
	},
}
