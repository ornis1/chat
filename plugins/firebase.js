import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
	apiKey: '',
	authDomain: '',
	databaseURL: '',
	projectId: '',
	storageBucket: '',
	messagingSenderId: '',
	appId: '',
}
!firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
// firebase.initializeApp(config)
// export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const db = firebase.database()
export default firebase
