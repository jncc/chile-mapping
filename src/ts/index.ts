
// styles
import '../styles.less'
import 'leaflet/dist/leaflet.css'
import '../css/leaflet-sidebar.min.css'

// polyfills
import 'ts-polyfill/lib/es2016-array-include'
import 'ts-polyfill/lib/es2017-object'
import 'ts-polyfill/lib/es2017-string'
import 'url-search-params-polyfill'

import { getConfig } from './config'
import { createMap } from './map'

let config = getConfig(window.location.search)

// draw the leaflet map in the div
let div = document.getElementById('map') as HTMLElement
createMap(div, config)
