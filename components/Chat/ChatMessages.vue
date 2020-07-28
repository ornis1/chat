<template>
	<v-list v-if="user" flat="" color="transparent fill-height my-10 list">
		<v-row class="fill-height">
			<v-col cols="6" class="column">
				<ChatMessage
					v-for="message in data"
					:key="message.message_id"
					:message="message"
				/>
			</v-col>
		</v-row>
	</v-list>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatMessage from '@/components/Chat/ChatMessage'

export default {
	name: 'ChatMessages',
	components: { ChatMessage },
	computed: {
		...mapGetters({
			data: 'chats/currentChat',
			user: 'user/user',
		}),
	},
}
</script>
<style lang="scss" scoped>
.column {
	height: max-content;
	margin-top: auto;
}
</style>
