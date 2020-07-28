<template>
	<v-app-bar dense app>
		<v-list-item class="toolbar" two-line="">
			<v-list-item-avatar>
				<v-avatar>
					<img src="~/static/v.png" alt="" srcset="" />
				</v-avatar>
			</v-list-item-avatar>
			<v-list-item-content>
				<v-list-item-title>
					Simple Vue chat
				</v-list-item-title>
				<v-list-item-subtitle>
					<span :class="{ 'blue--text': subtitle }">
						{{ subtitle }}
					</span>
				</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<v-btn @click="deleteAllMessages">Удалить все сообщения</v-btn>
		<v-btn @click="logOut">Выйти</v-btn>
	</v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'ChatToolbar',
	computed: {
		...mapGetters({
			activeWriters: 'chats/activeWriters',
			users: 'chats/users',
		}),
		subtitle() {
			if (this.activeWriters?.length) {
				return `${this.activeWriters.map((v) => v.name).join(', ')} печатает...`
			}
			return ''
		},
	},
	methods: {
		...mapActions({
			deleteAllMessages: 'chats/deleteAllMessages',
			logOut: 'user/logOut',
		}),
	},
}
</script>
<style lang="scss" scoped></style>
