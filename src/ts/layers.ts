// define the layers statically
export const baseLayers = {
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
    wms_name: 'chile_mapper:water_yield'
  },
  rcp_45_water_yield: {
    wms_name: 'chile_mapper:rcp_45_water_yield'
  },
  rcp_85_water_yield: {
    wms_name: 'chile_mapper:rcp_85_water_yield'
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

export const overlayLayers = {
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

export const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[]
