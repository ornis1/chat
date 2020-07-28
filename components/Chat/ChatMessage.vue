<template>
	<v-menu v-model="menu" absolute>
		<template v-slot:activator="{ on }">
			<v-list-item :id="message.message_id" :ripple="false" v-on="on">
				<v-list-item-avatar class="avatar mb-0">
					<v-avatar v-if="!message.avatar">
						<img src="~/static/avatar.jpg" alt srcset />
					</v-avatar>
					<v-avatar v-else class="pink white--text">
						{{ message.name[0].toUpperCase() }}
					</v-avatar>
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-subtitle class="text--primary d-flex align-center">
						<span class="mr-auto">
							{{ message.name }}
						</span>
						<span
							v-if="canAnswer"
							class="body-2 mr-2 btn-answer"
							@click.stop="sendAnswer"
						>
							Ответить
						</span>
						{{ message.date }}
					</v-list-item-subtitle>

					<v-list-item
						v-if="!!message.recipient_message"
						class="ma-0"
						:ripple="false"
						link
					>
						<v-list-item-content>
							<v-divider vertical class="pink"></v-divider>
							<v-list-item-subtitle class="text--primary">
								{{ message.recipient_message.name }}
							</v-list-item-subtitle>
							<v-list-item-subtitle>
								{{ message.recipient_message.content }}
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>

					<v-list-item-subtitle class="message">
						{{ message.content }}
						<span v-if="isChanged" class="changed">Изменено</span>
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</template>
		<v-list>
			<v-list-item v-if="canAnswer" @click="sendAnswer">
				Ответить
			</v-list-item>
			<v-list-item v-if="canChange" @click="changeMessage">
				Изменить
			</v-list-item>
			<v-list-item @click="copyText">Копировать текст</v-list-item>
			<v-list-item @click="deleteMessage">Удалить</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'ChatMessage',
	props: {
		message: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return { menu: false }
	},
	computed: {
		// randomColor() {
		// 	const rand1 = Math.ceil(Math.random() * 4)
		//   const rand2 = Math.ceil(Math.random() * 4)
		//   const arrColors = ['red', 'purple', 'green', 'blue', 'orange'];
		//   return `${arrColors[rand1]} darken-${rand2}`
		// },
		isChanged() {
			return this.message.changed
		},
		canChange() {
			const { sender_id: senderId } = this.message
			const userId = this.$store.getters['user/user'].id
			return userId === senderId
		},
		canAnswer() {
			return !this.canChange
		},
	},
	methods: {
		...mapActions({
			delMsg: 'chats/deleteMessage',
			setAnswerMode: 'chats/setAnswerMode',
			setEditingMode: 'chats/setEditingMode',
			setSelectedMessage: 'chats/setSelectedMessage',
		}),
		deleteMessage() {
			const { chatId, message_id: id } = this.message
			this.delMsg({ id, chatId })
		},
		copyText() {
			const text = this.message.content
			navigator.clipboard.writeText(text)
		},
		changeMessage() {
			/**
			 * Установить флаг что идет редактирование
			 * Сохранить выбранное сообщение в стор
			 * Изменить сообщение
			 * Если флаг стоит, делаем update сообщения
			 */
			this.setEditingMode(true)
			this.setSelectedMessage(this.message)
		},
		sendAnswer() {
			this.setAnswerMode(true)
			this.setSelectedMessage(this.message)
		},
	},
}
</script>

<style lang="scss" scoped>
.pos-r {
	position: relative;
}
.message {
	white-space: normal;
}
.avatar {
	// align-self: flex-end;
	align-self: flex-start;
}
.date {
	align-self: flex-start;
}
.btn-answer {
	opacity: 0;
	&:hover {
		text-decoration: underline;
	}
}
.changed {
	float: right;
}
.v-menu__content {
	& .v-list-item {
		width: 100%;
		margin-top: 0;
	}
}
.v-list-item {
	width: fit-content;
	margin-top: 10px;
	&:hover .btn-answer {
		opacity: 1;
	}
	&__avatar {
		align-self: flex-end;
	}
	&__content {
		position: relative;
		overflow: initial;
		&:before {
			content: '';
			position: absolute;
			display: block;

			border: 10px solid transparent;
			border-bottom: 8px solid #333;
			bottom: 0;
			z-index: 0;
			left: -8px;
		}
		border-radius: 6px;
		background-color: #333;
		padding: 10px;
		& .v-list-item__content {
			border-left: 2px solid #2196f3;
			border-radius: 0;
			padding: 0;
			padding-left: 10px;
			&:before {
				display: none;
			}
		}
	}
}
</style>
