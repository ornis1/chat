// const SpotifyWebApi = require('spotify-web-api-node')
import SpotifyWebApi from 'spotify-web-api-node'

// credentials are optional
const api = new SpotifyWebApi({
	clientId: '547d5b8dcb6a4c6294d4f91494bed801',
	clientSecret: 'fbf00795073742278c4212138a00a500',
	redirectUri: 'http://www.localhost:3000',
	accessToken:
		'BQDcHIbmgYMbx_E_IpyFM0qDkIBFYKx3WNiJzLP5YGcHGpjxApeU-1wbPr5jaK2g-Fu1pbQuX4WGoVTy8bU',
})

// Установить новый accessToken если старый протухнет
// api.clientCredentialsGrant().then(
// 	(data) => {
// 		console.log('The access token has been refreshed!')

// 		// Save the access token so that it's used in future calls
// 		api.setAccessToken(data.body.access_token)
// 	},
// 	(e) => {
// 		console.log(e)
// 	}
// )
export default api
