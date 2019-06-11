
import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'

export function createMap(container: HTMLElement, config: Config) {
  
  let map = L.map(container, {zoomControl: false}).setView([-34.696461172723474, -71.09802246093751], 9)
  new L.Control.Zoom({ position: 'bottomleft' }).addTo(map)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
  
  let legend = new L.Control({position: 'topright'})
  let overlayLegend = new L.Control({position: 'topright'})

  // add default legend
  let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=' +
    content.base_layers.find(x => x.id == 'dem')!.layers
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend')

    div.innerHTML += '<img src="' + legendUrl + '" />'
    return div
  }
  legend.addTo(map)

  // change legend depending on base layer
  map.on('baselayerchange', (e) => {
    let event = e as L.LayersControlEvent
    let layer = event.layer as L.TileLayer.WMS
    let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER='
      + layer.options.layers

    map.removeControl(legend)
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend')

        div.innerHTML += '<img src="' + legendUrl + '" />'
        return div
    }

    legend.addTo(map)
  })

  // the rivers overlay also needs a legend
  map.on('overlayadd', function(e) {
    let event = e as L.LayersControlEvent
    let layer = event.layer as L.TileLayer.WMS
    if (content.overlay_layers.find(x => x.layers == layer.wmsParams.layers)!.display_legend) {
      let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER='
        + layer.wmsParams.layers

      overlayLegend.onAdd = function () {
          let div = L.DomUtil.create('div', 'info legend')

          div.innerHTML += '<img src="' + legendUrl + '" />'
          return div
      }

      overlayLegend.addTo(map)
    }
  })

  map.on('overlayremove', function(e) {
    let event = e as L.LayersControlEvent
    let layer = event.layer as L.TileLayer.WMS
    if (content.overlay_layers.find(x => x.layers == layer.wmsParams.layers)!.display_legend) {
      map.removeControl(overlayLegend)
    }
  })

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    position: 'topleft'
  }).addTo(map)

}
