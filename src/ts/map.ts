
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
  for (let baseLayer of keys(baseLayers)) {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: baseLayers[baseLayer].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.5
    })

    // start with this as default
    if (baseLayer == 'dem') {
      layer.addTo(map)
    }

    Object.assign(baseMaps, {[content.base_layers[baseLayer][config.language]]: layer})
  }

  // add overlays
  let overlayMaps = {}
  for (let overlay of keys(overlayLayers)) {
    let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
      layers: overlayLayers[overlay].wms_name,
      transparent: true,
      format: 'image/png',
      opacity: 0.5
    })

    // start with this as default
    if (overlay == 'hillshade') {
      layer.addTo(map)
    }

    Object.assign(overlayMaps, {[content.overlay_layers[overlay][config.language]]: layer})
  }

  let info = new L.Control()
  info.onAdd = function (map) : HTMLElement {
    let div = L.DomUtil.create('div', 'info')
    return div
  }
  info.addTo(map)
  updateinfo('dem')

  //todo: get this type automatically somehow
  function updateinfo (baseLayer : 'dem' | 'burn_avoidance' | 'ignition_susceptibility'
  | 'water_yield' | 'rcp_45_water_yield' | 'rcp_85_water_yield' | 'habitat_map' | 'soil_loss'
  | 'nitrogen' | 'phosphorus' | 'soil_water' | 'mean_percolation') {
    let infoElement: Element = document.getElementsByClassName('info')[0]
    let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?'
      + 'REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&LAYER='
      + baseLayers[baseLayer].wms_name

    infoElement.innerHTML = '<h4>' + content.base_layers[baseLayer][config.language] + '</h4>'
    infoElement.innerHTML += '<img src="' + legendUrl + '" />'
    // tslint:disable-next-line:max-line-length
    infoElement.innerHTML += '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
  }
  
  let overlayLegend = new L.Control({position: 'topright'})

  // change legend depending on base layer
  map.on('baselayerchange', (e) => {
    let event = e as L.LayersControlEvent
    let layer = event.layer as L.TileLayer.WMS
    let baseLayer = keys(baseLayers)
      .find(l => baseLayers[l].wms_name === layer.wmsParams.layers)

    if (baseLayer) {
      updateinfo(baseLayer)
    }
  })

  // the rivers overlay also needs a legend
  map.on('overlayadd', function(e) {
    let event = e as L.LayersControlEvent
    let layer = event.layer as L.TileLayer.WMS
    let requiresLegend = Object.values(overlayLayers)
      .find(l => l.wms_name === layer.wmsParams.layers && l.display_legend)
      
    if (requiresLegend) {
      let legendUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms?REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER='
      + layer.wmsParams.layers

      overlayLegend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info')
        div.innerHTML += '<img src="' + legendUrl + '" />'
        return div
      }

      overlayLegend.addTo(map)
    }
  })

  map.on('overlayremove', function(e) {
    let event = e as L.LayersControlEvent
    let layer = event.layer as L.TileLayer.WMS
    let requiresLegendRemoval = Object.values(overlayLayers)
      .find(l => l.wms_name === layer.wmsParams.layers && l.display_legend)

    if (requiresLegendRemoval) {
      map.removeControl(overlayLegend)
    }
  })

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    position: 'topleft'
  }).addTo(map)
}

const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[]

// define the layers statically
const baseLayers = {
  dem: {
    wms_name: 'chile_mapper:dem_aoi_10m_tiled'
  },
  burn_avoidance: {
    wms_name: 'chile_mapper:burn_avoidance'
  },
  ignition_susceptibility: {
    wms_name: 'chile_mapper:ignition_susceptibility'
  },
  water_yield: {
    wms_name: 'chile_mapper:baseline_hruresults'
  },
  rcp_45_water_yield: {
    wms_name: 'chile_mapper:rcp_45_hruresults'
  },
  rcp_85_water_yield: {
    wms_name: 'chile_mapper:rcp_85_hruresults'
  },
  habitat_map: {
    wms_name: 'chile_mapper:habitat_landuse_map'
  },
  soil_loss: {
    wms_name: 'chile_mapper:soil_loss'
  },
  nitrogen: {
    wms_name: 'chile_mapper:organic_nitrogen_yield'
  },
  phosphorus: {
    wms_name: 'chile_mapper:organic_phosphorus_yield'
  },
  soil_water: {
    wms_name: 'chile_mapper:average_daily_soil_water_content'
  },
  mean_percolation: {
    wms_name: 'chile_mapper:mean_percolation'
  }
}

const overlayLayers = {
  hillshade: {
    wms_name: 'chile_mapper:dem_aoi_10m_hillshade',
    display_legend: false
  },
  roads: {
    wms_name: 'chile_mapper:roads',
    display_legend: false
  },
  subbasins: {
    wms_name: 'chile_mapper:subbasins',
    display_legend: false
  },
  rivers: {
    wms_name: 'chile_mapper:baseline_rchresults',
    display_legend: true
  }
}
