
// styles
import '../styles.less'
import 'leaflet/dist/leaflet.css'

import * as L from 'leaflet'

let map = L.map('map').setView([51.505, -0.09], 12)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable from Typescript.')
    .openPopup()
    