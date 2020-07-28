<template>
	<v-card class="transparent auth-container" flat>
		<v-card class="mx-auto" max-width="400">
			<v-tabs v-model="tab" fixed-tabs>
				<v-tab>
					Войти
				</v-tab>
				<v-tab>
					Зарегестрироваться
				</v-tab>
			</v-tabs>
			<v-img
				class="white--text align-end"
				height="200px"
				src="https://cdn-images-1.medium.com/max/1600/1*Ho5xpgZmdG2CU51sA9uGrA.jpeg"
			>
			</v-img>

			<v-card-text class="text--primary">
				<div class="title mb-8 mt-4 text-center">
					{{ !tab ? 'Войти' : 'Зарегестрироваться' }}
					{{ !tab ? 'в приложение' : null }}
				</div>
				<v-form ref="form" v-model="form">
					<v-text-field
						v-if="tab"
						v-model="name"
						solo
						autofocus=""
						type="text"
						placeholder="Имя"
						:append-icon="'mdi-account'"
					></v-text-field>

					<v-text-field
						v-if="tab"
						v-model="username"
						solo
						type="text"
						placeholder="Имя пользователя"
					></v-text-field>

					<v-text-field
						v-model="email"
						autocomplete
						solo
						type="email"
						placeholder="Email"
						:append-icon="'mdi-email'"
					></v-text-field>

					<v-text-field
						v-model="password"
						:type="showPassword ? 'text' : 'password'"
						solo
						placeholder="Password"
						:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
						@click:append="showPassword = !showPassword"
					></v-text-field>

					<v-btn class="white black--text" block @click.prevent="submit">
						{{ !tab ? 'Войти' : 'Зарегестрироваться' }}
					</v-btn>
				</v-form>
			</v-card-text>
		</v-card>
	</v-card>
</template>

<script>
export default {
	name: 'Login',
	data: () => ({
		tab: null,
		form: false,
		name: '',
		username: '',
		email: '',
		password: '',
		showPassword: false,
		rules: {
			email: [],
			password: [],
		},
	}),
	methods: {
		async login(payload) {
			const res = await this.$store.dispatch('user/login', payload)
			if (res) this.$router.push('/')
		},
		registration(payload) {
			const res = this.$store.dispatch('user/registration', payload)
			if (res) this.$router.push('/')
		},
		submit() {
			const formRef = this.$refs.form
			formRef.validate()

			if (formRef.value) {
				const payload = {
					name: this.name,
					email: this.email,
					username: this.username,
					password: this.password,
				}
				// registration : login
				this.tab ? this.registration(payload) : this.login(payload)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.auth-container {
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -14px;
}
.divider {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	$margin: 20px;
	margin-top: $margin;
	margin-bottom: $margin;
	opacity: 0.5;
	&:before,
	&:after {
		content: '';
		display: block;
		width: 100%;
		height: 2px;
		background-color: #333;
	}
	&:before {
		margin-right: $margin;
	}
	&:after {
		margin-left: $margin;
	}
}
</style>
