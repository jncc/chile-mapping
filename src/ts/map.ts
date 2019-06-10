
import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'

export function createMap(container: HTMLElement, config: Config) {
  
  let map = L.map(container).setView([-34.696461172723474, -71.09802246093751], 9)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // add base maps
  let baseMaps = {}
  content.base_layers.forEach(baseLayer => {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: baseLayer.layers,
      transparent: true,
      format: 'image/png',
      opacity: 0.5
    })

    // start with this as default
    if (baseLayer.id == 'dem') {
      layer.addTo(map)
    }

    Object.assign(baseMaps, {[baseLayer[config.language]]: layer})
  })

  // add overlays
  let overlayMaps = {}
  content.overlay_layers.forEach(overlay => {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: overlay.layers,
      transparent: true,
      format: 'image/png',
      opacity: 0.5
    })

    // start with this as default
    if (overlay.id == 'hillshade') {
      layer.addTo(map)
    }

    Object.assign(overlayMaps, {[overlay[config.language]]: layer})
  })
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map)
}
