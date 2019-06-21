
import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'
import * as layers from './layers'
import { keys } from './layers'
import * as React from 'react'
import { render } from 'react-dom'
import Sidebar from './sidebar'
import '../js/leaflet-sidebar.min.js'

let overlayMaps = {} as any
let baseMaps = {} as any
let map: L.Map
let streamflowLegend: L.Control
export function createMap(container: HTMLElement, config: Config) {
  
  map = L.map(container, {zoomControl: false}).setView([-34.696461172723474, -71.09802246093751], 9)
  new L.Control.Zoom({ position: 'bottomright' }).addTo(map)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  // setup base maps
  for (let baseLayer of keys(layers.baseLayers)) {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: layers.baseLayers[baseLayer].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.6,
      attribution: content.base_layers[baseLayer].attribution[config.language]
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
      opacity: 0.9,
      attribution: content.overlay_layers[overlay].attribution[config.language]
    })
    Object.assign(overlayMaps, {[overlay]: layer})
  }
  updateOverlay('hillshade', true) // default overlay

  let sidebarControl = L.control.sidebar('sidebar', {position: 'left'})
  // set up sidebar using react component
  // let sidebarControl = new L.Control({position: 'topleft'})
  // sidebarControl.onAdd = function (map) : HTMLElement {
  //   let div: HTMLElement = L.DomUtil.create('div', 'sidebar')
  //   render(<Sidebar/>, div)
  //   L.DomEvent.disableClickPropagation(div)
  //   L.DomEvent.disableScrollPropagation(div)
  //   return div
  // }
  // sidebarControl.addTo(map)
  sidebarControl.addTo(map)
  let sidebarHome: HTMLElement | null = document.getElementById('home')
  if (sidebarHome) {
    render(<Sidebar/>, sidebarHome)
  }

  let sidebarAbout: HTMLElement | null = document.getElementById('about')
  if (sidebarAbout) {
    let about: HTMLElement | null = L.DomUtil.get('about')
    if (about) {
      let aboutContainer = L.DomUtil.create('div', 'sidebar-about')
      aboutContainer.innerHTML += '<h2>'+content.info_panel.title[config.language]+'</h2>'
      aboutContainer.innerHTML += '<p>'+content.info_panel.description[config.language]+'</p>'

      let getStartedButton = L.DomUtil.create('button', 'btn btn-primary')
      getStartedButton.innerHTML += 'Get started'
      getStartedButton.addEventListener('click', function() {
        let sidebarHome: HTMLElement | null = document.getElementsByClassName('fa fa-bars')[0] as HTMLElement
        if (sidebarHome) {
          sidebarHome.click()
        }
      })
      aboutContainer.appendChild(getStartedButton)

      about.appendChild(aboutContainer)
    }
  }

  let aboutTab: HTMLElement | null = document.getElementById('about-tab')
  if (aboutTab) {
    aboutTab.click() // default
  }

  // set up a separate legend for the streamflow overlay
  streamflowLegend = new L.Control({position: 'topright'})
  let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?'
    + 'REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&LAYER='
    + layers.overlayLayers.rivers.wms_name
  streamflowLegend.onAdd = function () {
    let div = L.DomUtil.create('div', 'overlay-legend')
    div.innerHTML += '<p>'+content.overlay_layers.rivers.title[config.language]+'</p>'
    div.innerHTML += '<img src="' + legendUrl + '" />'
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
