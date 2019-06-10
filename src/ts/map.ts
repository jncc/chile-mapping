
import * as L from 'leaflet'
import { Config } from './config.js'
import * as content from '../content.json'

export function createMap(container: HTMLElement, config: Config) {
  
  let map = L.map(container).setView([-34.696461172723474, -71.09802246093751], 9)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  //base layers

  let dem = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:dem_aoi_10m_tiled',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  }).addTo(map)

  let waterYield = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:baseline_hruresults',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let rcp45waterYield = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:rcp_45_hruresults',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let rcp85waterYield = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:rcp_85_hruresults',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let burnAvoidance = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:burn_avoidance',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let ignitionSusceptibility = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:ignition_susceptibility',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let habitatMap = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:habmap_landuse_wvineyards',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let soilLoss = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:usle_v2_mean_easymap',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let baseMaps = {
    [content.layers.dem[config.language]]: dem,
    [content.layers.water_yield[config.language]]: waterYield,
    [content.layers.rcp_45_water_yield[config.language]]: rcp45waterYield,
    [content.layers.rcp_85_water_yield[config.language]]: rcp85waterYield,
    [content.layers.burn_avoidance[config.language]]: burnAvoidance,
    [content.layers.habitat_map[config.language]]: habitatMap,
    [content.layers.soil_loss[config.language]]: soilLoss
  }

  // overlays
  let hillshade = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:dem_aoi_10m_hillshade',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let roads = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:roads',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let subbasins = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:subbasins',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })

  let rivers = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
    layers: 'chile_mapper:baseline_rchresults',
    transparent: true,
    format: 'image/png',
    opacity: 0.5
  })
    
  let overlayMaps = {
    [content.layers.hillshade[config.language]]: hillshade,
    [content.layers.roads[config.language]]: roads,
    [content.layers.subbasins[config.language]]: subbasins,
    [content.layers.rivers[config.language]]: rivers,
  }

  L.control.layers(baseMaps, overlayMaps).addTo(map)
}
