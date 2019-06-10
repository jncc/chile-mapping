
// styles
import '../styles.less'
import 'leaflet/dist/leaflet.css'

// polyfills
import 'url-search-params-polyfill'

import { getConfig } from './config'
import { createMap } from './map'

let config = getConfig(window.location.search)

// draw the leaflet map in the div
let div = document.getElementById('map') as HTMLElement
createMap(div, config)
