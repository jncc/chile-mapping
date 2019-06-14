
import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'
import * as layers from './layers'
import { keys } from './layers'
import * as React from 'react'
import { render } from 'react-dom'
import Sidebar from './Sidebar'

export function createMap(container: HTMLElement, config: Config) {
  
  let map = L.map(container, {zoomControl: false}).setView([-34.696461172723474, -71.09802246093751], 9)
  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  // add base maps
  let baseMaps = {}
  for (let baseLayer of keys(layers.baseLayers)) {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: layers.baseLayers[baseLayer].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.5
    })

    // start with this as default
    if (baseLayer == 'dem') {
      layer.addTo(map)
    }

    Object.assign(baseMaps, {[content.base_layers[baseLayer]['title'][config.language]]: layer})
  }

  // add overlays
  let overlayMaps = {}
  for (let overlay of keys(layers.overlayLayers)) {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: layers.overlayLayers[overlay].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.5
    })

    // start with this as default
    if (overlay == 'hillshade') {
      layer.addTo(map)
    }

    Object.assign(overlayMaps, {[content.overlay_layers[overlay]['title'][config.language]]: layer})
  }

  let sidebarControl = new L.Control()
  sidebarControl.onAdd = function (map) : HTMLElement {
    let sidebar: HTMLElement = L.DomUtil.create('div', 'sidebar')

    render(<Sidebar />, sidebar)
    return sidebar
  }
  sidebarControl.addTo(map)
  
  let overlayLegend = new L.Control({position: 'topright'})

  // change legend depending on base layer
  // map.on('baselayerchange', (e) => {
  //   let event = e as L.LayersControlEvent
  //   let layer = event.layer as L.TileLayer.WMS
  //   let baseLayer = keys(baseLayers)
  //     .find(l => baseLayers[l].wms_name === layer.wmsParams.layers)

  //   if (baseLayer) {
  //     updateinfo(baseLayer)
  //   }
  // })

  // the rivers overlay also needs a legend
  // map.on('overlayadd', function(e) {
  //   let event = e as L.LayersControlEvent
  //   let layer = event.layer as L.TileLayer.WMS
  //   let requiresLegend = Object.values(overlayLayers)
  //     .find(l => l.wms_name === layer.wmsParams.layers && l.display_legend)
      
  //   if (requiresLegend) {
  //     let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER='
  //     + layer.wmsParams.layers

  //     overlayLegend.onAdd = function () {
  //       let div = L.DomUtil.create('div', 'sidebar')
  //       div.innerHTML += '<img src="' + legendUrl + '" />'
  //       return div
  //     }

  //     overlayLegend.addTo(map)
  //   }
  // })

  // map.on('overlayremove', function(e) {
  //   let event = e as L.LayersControlEvent
  //   let layer = event.layer as L.TileLayer.WMS
  //   let requiresLegendRemoval = Object.values(overlayLayers)
  //     .find(l => l.wms_name === layer.wmsParams.layers && l.display_legend)

  //   if (requiresLegendRemoval) {
  //     map.removeControl(overlayLegend)
  //   }
  // })

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    position: 'topleft'
  }).addTo(map)

}
