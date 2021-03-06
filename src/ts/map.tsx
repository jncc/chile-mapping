import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'
import * as layers from './layers'
import { keys } from './layers'
import '../js/leaflet-sidebar.min.js'

let overlayMaps = {} as any
let underlayMaps = {} as any
let baseMaps = {} as any
let map: L.Map
let tileLayer: L.TileLayer
export function createMap(container: HTMLElement, config: Config) {
           
  map = L.map(container, {
    zoomControl: false, 
    wheelDebounceTime: 300,
    maxZoom: 15,
    minZoom: 8
  })
  new L.Control.Zoom({ position: 'bottomright' }).addTo(map)

  var bounds = new L.LatLngBounds(
    new L.LatLng(-34.12828876137638, -70.23952124718542), 
    new L.LatLng(-35.007681075929895, -71.90348420892754)).pad(0.1)

  var maxBounds = bounds.pad(0.8)

  map.fitBounds(bounds)
  map.setMaxBounds(maxBounds)
  
  tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  // setup base maps
  for (let baseLayer of keys(layers.baseLayers)) {
    let layer = L.tileLayer.wms(process.env.GEOSERVER_URL+'/chile_mapper/wms?tiled=true', {
      layers: layers.baseLayers[baseLayer].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.6,
      attribution: content.base_layers[baseLayer].attribution[config.language]
    })
    Object.assign(baseMaps, {[baseLayer]: layer})
  }

  // setup overlays  
  for (let overlay of keys(layers.overlayLayers)) {
    let layer = L.tileLayer.wms(process.env.GEOSERVER_URL+'/chile_mapper/wms?tiled=true', {
      layers: layers.overlayLayers[overlay].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.9,
      attribution: content.overlay_layers[overlay].attribution[config.language]
    })
    Object.assign(overlayMaps, {[overlay]: layer})
  }

  // setup underlays  
  for (let underlay of keys(layers.underlayLayers)) {
    let layer = L.tileLayer.wms(process.env.GEOSERVER_URL+'/chile_mapper/wms?tiled=true', {
      layers: layers.underlayLayers[underlay].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 1,
      attribution: content.underlay_layers[underlay].attribution[config.language]
    })
    Object.assign(underlayMaps, {[underlay]: layer})
  }
  updateUnderlay('sentinel_2', true) // sentinel layer on as landing page view

  return map
}

export function refreshOverlay(layer : keyof typeof layers.overlayLayers) {
  overlayMaps[layer].bringToFront()
}

export function refreshBaseLayer(layer : keyof typeof layers.baseLayers) {
  baseMaps[layer].bringToFront()
}

export function updateOverlay(layer : keyof typeof layers.overlayLayers, checked : boolean) {
  if (checked) {
    overlayMaps[layer].addTo(map)
  } else {
    map.removeLayer(overlayMaps[layer])
  }
}

export function updateUnderlay(layer : keyof typeof layers.underlayLayers, checked : boolean) {
  if (checked) {
    underlayMaps[layer].addTo(map)
  } else {
    map.removeLayer(underlayMaps[layer])
  }
}

export function updateBaseLayer(layer : keyof typeof layers.baseLayers) {
  for (let baseLayer of keys(baseMaps)) {
    map.removeLayer(baseMaps[baseLayer])
  }
  if (layer !== 'no_layer') {
    baseMaps[layer].addTo(map)
  }
}

export function removeBaselayer() {
  for (let baseLayer of keys(baseMaps)) {
    map.removeLayer(baseMaps[baseLayer])
  }
}
