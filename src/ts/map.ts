
import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'

export function createMap(container: HTMLElement, config: Config) {
  
  let map = L.map(container).setView([51.505, -0.09], 12)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  
  L.marker([51.5, -0.09]).addTo(map)
    .bindPopup(content.layers.layer1[config.language])
    .openPopup()
}
