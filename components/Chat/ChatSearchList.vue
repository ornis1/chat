<template>
	<v-list dense :class="{ active: isShow }">
		<v-list-item-group v-model="model">
			<v-list-item
				v-for="(item, index) in items"
				:key="index"
				:value="`${item.username}`"
				class="pr-0"
				:ripple="false"
			>
				<v-list-item-avatar class="my-0">
					<img src="~/static/avatar.jpg" alt srcset />
				</v-list-item-avatar>
				<v-list-item-content class="">
					<v-list-item-title>{{ item.name }}</v-list-item-title>
					<v-list-item-subtitle>{{ item.username }}</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-list-item-group>
	</v-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'ChatSearchList',
	data: () => ({ model: '' }),
	computed: {
		...mapGetters({
			items: 'chats/searchList',
		}),
		isShow() {
			return !!this.items.length
		},
	},
	watch: {
		model(newVal) {
			if (newVal) {
				this.handleClick()
			}
		},
	},
	methods: {
		...mapActions({
			setSearchList: 'chats/setSearchList',
			setSearchListResult: 'chats/setSearchListResult',
		}),
		handleClick() {
			this.setSearchListResult(this.model)
			this.setSearchList([])
			this.model = ''
		},
	},
}
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
	width: 0;
	background: transparent;
}
.active {
	max-height: 150px !important;
	opacity: 1 !important;
	transition: opacity 0.25s ease-in;
}
.v-list {
	max-height: 0px;
	opacity: 0;
	transition: opacity 0.15s ease-out;
	overflow-y: scroll;
	scrollbar-width: none;
	padding-top: 0;
	padding-bottom: 0;
	&-item {
		&:hover {
			& .v-list-item__content:before {
				display: none;
			}
		}
		&__content {
			position: relative;
			&:before {
				content: '';
				display: block;
				position: absolute;
				bottom: 0;
				right: 0;
				left: 0;
				height: 1px;
				opacity: 0.2;
				background-color: #333;
			}
		}
	}
}
</style>
