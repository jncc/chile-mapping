
import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'
import * as layers from './layers'
import { keys } from './layers'
import * as React from 'react'
import { render } from 'react-dom'
import Sidebar from './sidebar'

let overlayMaps = {} as any
let baseMaps = {} as any
let map: L.Map
let streamflowLegend: L.Control
export function createMap(container: HTMLElement, config: Config) {
  
  map = L.map(container, {zoomControl: false}).setView([-34.696461172723474, -71.09802246093751], 9)
  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  // setup base maps
  for (let baseLayer of keys(layers.baseLayers)) {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: layers.baseLayers[baseLayer].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.6
    })
    Object.assign(baseMaps, {[baseLayer]: layer})
  }
  updateBaselayer('dem') // default base layer

  // setup overlays  
  for (let overlay of keys(layers.overlayLayers)) {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: layers.overlayLayers[overlay].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.9
    })
    Object.assign(overlayMaps, {[overlay]: layer})
  }
  updateOverlay('hillshade', true) // default overlay

  // set up sidebar using react component
  let sidebarControl = new L.Control({position: 'topleft'})
  sidebarControl.onAdd = function (map) : HTMLElement {
    let div: HTMLElement = L.DomUtil.create('div', 'sidebar')
    render(<Sidebar />, div)
    L.DomEvent.disableClickPropagation(div)
    L.DomEvent.disableScrollPropagation(div)
    return div
  }
  sidebarControl.addTo(map)
  
  // set up a separate legend for the streamflow overlay
  streamflowLegend = new L.Control({position: 'topright'})
  let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?'
    + 'REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&LAYER='
    + layers.overlayLayers.rivers.wms_name
  streamflowLegend.onAdd = function () {
    let div = L.DomUtil.create('div', 'sidebar')
    div.innerHTML += '<p>'+content.overlay_layers.rivers.title[config.language]+'</p>'
    div.innerHTML += '<img class="overlay-legend" src="' + legendUrl + '" />'
    L.DomEvent.disableClickPropagation(div)
    L.DomEvent.disableScrollPropagation(div)
    return div
  }

}

export function refreshOverlay(layer : keyof typeof layers.overlayLayers) {
  overlayMaps[layer].bringToFront()
}

export function updateOverlay(layer : keyof typeof layers.overlayLayers, checked : boolean) {
  if (checked) {
    overlayMaps[layer].addTo(map)

    if (layer === 'rivers') {
      streamflowLegend.addTo(map)
    }
  } else {
    map.removeLayer(overlayMaps[layer])

    if (layer === 'rivers') {
      streamflowLegend.remove()
    }
  }
}

export function updateBaselayer(layer : keyof typeof layers.baseLayers) {

  for (let baseLayer of keys(baseMaps)) {
    map.removeLayer(baseMaps[baseLayer])
  }

  baseMaps[layer].addTo(map)
}
