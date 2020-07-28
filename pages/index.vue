<template>
	<ChatMessages />
</template>

<script>
import ChatMessages from '@/components/Chat/ChatMessages'

export default {
	name: 'Main',
	layout: 'chat',
	components: { ChatMessages },
}
</script>
