<template>
	<v-text-field
		v-model="content"
		solo
		hide-details=""
		class="chat-input"
		placeholder="Сообщение..."
		append-icon="mdi-send"
		tile
		@click:append="onSubmit"
		@keypress.enter="onSubmit"
	>
	</v-text-field>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import spotifyApi from '@/helpers/spotifyApi'

export default {
	name: 'ChatInput',
	data: () => ({ content: '', timeoutId: null, spotySearchText: '' }),
	computed: {
		...mapGetters({
			user: 'user/user',
			users: 'chats/users',
			isEditMode: 'chats/editingMode',
			isAnswerMode: 'chats/answerMode',
			selectedMessage: 'chats/selectedMessage',
			searchListResult: 'chats/searchListResult',
		}),
	},
	watch: {
		searchListResult(newVal) {
			if (newVal) {
				this.content = newVal
				this.setSearchListResult()
			}
		},
		content(newVal, prevVal) {
			this.setWriters(newVal, prevVal)
			this.userSearch(newVal, prevVal)
			this.spotifySearch(newVal)
		},
		user(newVal) {
			if (newVal !== null) {
				this.loadActiveWriters(this.user?.id)
			}
		},
	},
	mounted() {
		this.loadMessages({ chatId: 1 })
	},
	methods: {
		...mapActions({
			setSearchListResult: 'chats/setSearchListResult',
			loadActiveWriters: 'chats/loadActiveWriters',
			setActiveWriters: 'chats/setActiveWriters',
			setSearchList: 'chats/setSearchList',
			updateMessage: 'chats/updateMessage',
			loadMessages: 'chats/loadMessages',
			sendMessage: 'chats/sendMessage',
			setTracks: 'spoty/setTracks',
		}),
		setWriters(newVal, prevVal) {
			if (this.isEditMode && this.isAnswerMode) return
			const { id, name } = this.user
			const commands = ['/', '@']
			const includeCommand = commands.includes(newVal[0])

			// Когда только начали печатать
			// Добавляем в бд
			if (prevVal === '' && !includeCommand) {
				this.setActiveWriters({ id, name })
			}

			// Когда удалили текст из инпута
			// Удаляем из бд
			if (prevVal !== '' && newVal === '') {
				/** Передаем только id. По нему удалим нужные данные из бд   */
				this.setActiveWriters({ id })
			}
		},
		onSubmit() {
			if (!this.content) return
			if (this.isEditMode) {
				this.updateMessage(this.content)
				return
			}
			if (this.isAnswerMode) {
				this.send()
				return
			}
			this.send()
		},
		send() {
			const hours = new Date().getHours()
			let minutes = new Date().getMinutes()
			minutes = minutes < 10 ? '0' + minutes : minutes
			const date = hours + ':' + minutes
			const { avatar, name, id } = this.user
			const message = {
				avatar,
				name,
				content: this.content,
				date,
				chatId: 1,
				sender_id: id,
			}
			if (this.isAnswerMode) {
				message.recipient_message = this.selectedMessage
			}
			this.sendMessage({
				chatId: 1,
				message,
			})
			this.content = ''
		},
		onTimeout(fn) {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId)
			}
			this.timeoutId = setTimeout(() => {
				this.timeoutId = null

				fn()
			}, 1000)
		},
		spoty() {
			spotifyApi.searchTracks(this.spotySearchText).then(
				(data) => {
					console.log(data.body.tracks.items)
					const payload = data.body.tracks.items ?? []
					this.setTracks(payload)
				},
				(err) => {
					console.error(err)
				}
			)
		},
		userSearch(val, prevVal) {
			if (val[0] === '@') {
				if (val.length >= 1) {
					const username = val.toLowerCase()
					const r1 = this.users.filter((user) =>
						user.username.toLowerCase().includes(username)
					)
					const r2 = this.users.filter((user) =>
						user.username.toLowerCase().includes(username.slice(1))
					)
					const unique = [...new Set([...r1, ...r2])]

					this.setSearchList(unique)
					return
				}
			}
			if (prevVal === '@' && !val) {
				this.setSearchList([])
			}
		},
		spotifySearch(val) {
			if (val.length > 1 && val[0] === '/') {
				const avalibleCommands = ['spotify']
				const regExpr = /([a-z]+ )/
				let command = val.match(regExpr)
				if (command) {
					command = command[0].trim()
				} else {
					return
				}
				const result = avalibleCommands.includes(command)
				if (result) {
					this.spotySearchText = this.content.slice(9)
					this.onTimeout(this.spoty)
					// Код для реализации поиска песен в спотифай
				}
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.chat-input {
	// position: fixed;
	// bottom: 0;
	// left: 0;
	// right: 0;
}
</style>
