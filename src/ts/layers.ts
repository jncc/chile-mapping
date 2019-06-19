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

export const legends = {
  dem: {
    1: {
      colour: '#73F775',
      label: '50-500m'
    },
    2: {
      colour: '#BDFE8C',
      label: '500-1000m'
    },
    3: {
      colour: '#E7FE95',
      label: '1000-1500m'
    },
    4: {
      colour: '#FEF895',
      label: '1500-2000m'
    },
    5: {
      colour: '#FDDB7F',
      label: '2000-2500m'
    },
    6: {
      colour: '#F8C583',
      label: '2500-3000m'
    },
    7: {
      colour: '#EBBC99',
      label: '3000-3500m'
    },
    8: {
      colour: '#DFC6B3',
      label: '3500-4000m'
    },
    9: {
      colour: '#EBE2DB',
      label: '4000-4500m'
    },
    10: {
      colour: '#FAF9F8',
      label: '4500-5000m'
    }
  }
}

export const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[]
