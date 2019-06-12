
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

  // example of looping through statically-known layers (check out the type of `layer`!)
  for (let layer of keys(baseLayers)) {
    let code = baseLayers[layer].code
    let foo = baseLayers[layer].foo
    let displayName = content2.baseLayers[layer][config.language]
    console.log(code + ' - ' + displayName + ' - ' + foo)
  }
}

const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[]

// define the layers statically
const baseLayers = {
  dem: {
    code: 'chile_mapper:dem_aoi_10m_tiled',
    foo: true
  },
  burn_avoidance: {
    code: 'chile_mapper:burn_avoidance',
    foo: false
  },
}

// editable json file just contains localised content
// although could get rid of json file and put in the layers data structure
// it's nice to have all user-facing internalised content separate from code
const content2 = {
  baseLayers: {
    dem: {
      en: 'DEM (Digital Elevation Model)',
      es: 'DEM (Modelo de elevación digital)',
    },
    burn_avoidance: {
      en: 'Burn Avoidance',
      es: 'Prevención de Incendio',
    },
  },
  footerContent: {
    en: 'Hello, I\'m in English',
    es: 'Hola, estoy en español',
  }
}
