import { auth, db } from '@/plugins/firebase.js'

const _transformUser = ({ uid, name = '', username = '', email }) => {
	return {
		name,
		email,
		id: uid,
		username: `@${username}`,
		avatar: '',
		online: false,
		lastVisit: null,
	}
}

export default {
	state: {
		user: null,
	},
	mutations: {
		SET_USER(state, payload) {
			state.user = payload
		},
	},

	actions: {
		onDisconnect({ getters }) {
			const { user } = getters
			const date = Date.now()
			const ref = db.ref(`users/${user.id}`)
			ref.off()
			const options = [
				{ child: 'online', value: false },
				{ child: 'lastVisit', value: date },
			]
			options.map(({ child, value }) => {
				ref
					.child(child)
					.onDisconnect()
					.set(value)
			})
		},

		onAuthStateChanged({ commit, dispatch }) {
			auth.onAuthStateChanged(async (user) => {
				if (user !== null) {
					const { uid } = user
					const res = await db.ref(`users/${uid}`).once('value')
					commit('SET_USER', res.val())
					dispatch('onDisconnect')
				} else {
					this.$router.push('/auth')
				}
			})
		},

		async login({ commit, dispatch }, { email, password }) {
			const firebaseUser = await auth.signInWithEmailAndPassword(
				email,
				password
			)
			const { uid } = firebaseUser?.user
			if (!uid) return false
			const user = await db.ref(`users/${uid}`).once('value')
			commit('SET_USER', user.val())
			dispatch('onDisconnect')
			return true
		},

		async logOut({ dispatch }) {
			dispatch('onDisconnect')
			await auth.signOut()
		},

		async registration(
			{ commit, dispatch },
			{ email, password, username, name }
		) {
			/** Отправляем запрос на регистрацию */
			await auth.createUserWithEmailAndPassword(email, password)
			const { uid } = auth.currentUser
			const user = _transformUser({ email, uid, username, name })
			commit('SET_USER', user)
			await db.ref(`users/${uid}`).set(user)
			dispatch('onDisconnect')
		},
	},

	getters: {
		user: (state) => state.user,
	},
}
