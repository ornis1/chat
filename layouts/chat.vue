<template>
	<v-app>
		<ChatToolbar />

		<nuxt />
		<div class="relative">
			<div class="chat-footer">
				<ChatSearchList />
				<ChatSelectedMessage />
				<ChatInput />
			</div>
		</div>
	</v-app>
</template>

<script>
export default {
	name: 'ChatLayout',
	components: {
		ChatInput: () => import('@/components/Chat/ChatInput'),
		ChatToolbar: () => import('@/components/Chat/ChatToolbar'),
		ChatSearchList: () => import('@/components/Chat/ChatSearchList'),
		ChatSelectedMessage: () => import('@/components/Chat/ChatSelectedMessage'),
	},
	beforeMount() {
		this.$store.dispatch('user/onAuthStateChanged')
	},
}
</script>
<style lang="scss" scoped>
.relative {
	position: relative;
}
.chat-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
