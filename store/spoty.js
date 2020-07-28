export default {
	state: {
		tracks: [],
	},
	mutations: {
		SET_TRACKS(state, payload) {
			state.tracks = payload
		},
	},

	actions: {
		setTracks({ commit }, payload) {
			commit('SET_TRACKS', payload)
		},
	},
	getters: {
		tracks: (state) => state.tracks,
	},
}
