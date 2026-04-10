// Entry when Expo is started from this folder: same as repo root index.js, but App lives one level up.
import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'

import App from '../App'

registerRootComponent(App)
