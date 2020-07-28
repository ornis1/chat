<template>
	<v-list v-if="message" dense="" class="pa-0">
		<v-list-item dense="">
			<v-list-item-avatar>
				<v-avatar>
					<v-icon v-if="isEditMode || isAnswerMode" color="primary" large>
						{{ isEditMode ? 'mdi-pen' : null }}
						{{ isAnswerMode ? 'mdi-reply' : null }}
					</v-icon>
				</v-avatar>
			</v-list-item-avatar>
			<v-list-item-content class="pa-0">
				<v-list-item-title>{{ message.name }}</v-list-item-title>
				<v-list-item-subtitle>{{ message.content }}</v-list-item-subtitle>
			</v-list-item-content>
			<v-list-item-action>
				<v-icon @click="deleteSelectedMessage">
					mdi-close
				</v-icon>
			</v-list-item-action>
		</v-list-item>
	</v-list>
</template>

<script>
export default {
	name: 'ChatSelectedMessage',
	computed: {
		message() {
			return this.$store.getters['chats/selectedMessage']
		},
		isEditMode() {
			return this.$store.getters['chats/editingMode']
		},
		isAnswerMode() {
			return this.$store.getters['chats/answerMode']
		},
	},
	methods: {
		deleteSelectedMessage() {
			this.$store.dispatch('chats/setSelectedMessage', null)
			this.$store.dispatch('chats/setEditingMode', false)
			this.$store.dispatch('chats/setAnswerMode', false)
		},
	},
}
</script>
