// define the layers statically
export const baseLayers = {
  no_layer: {
    wms_name: '',
    legend_style: {
      en: null,
      es: null
    }
  },
  dem: {
    wms_name: 'chile_mapper:dem_aoi_10m',
    legend_style: {
      en: null,
      es: null
    }
  },
  habitat_map: {
    wms_name: 'chile_mapper:habitat_landuse_map',
    legend_style: {
      en: 'habitat_map_en',
      es: 'habitat_map_es'
    }
  },
  burn_avoidance: {
    wms_name: 'chile_mapper:burn_avoidance',
    legend_style: {
      en: 'burn_avoidance_en',
      es: 'burn_avoidance_es'
    }
  },
  ignition_susceptibility: {
    wms_name: 'chile_mapper:ignition_susceptibility',
    legend_style: {
      en: 'ignition_susceptibility_en',
      es: 'ignition_susceptibility_es'
    }
  },
  water_yield: {
    wms_name: 'chile_mapper:water_yield',
    legend_style: {
      en: 'water_yield_en',
      es: 'water_yield_es'
    }
  },
  rcp_45_water_yield: {
    wms_name: 'chile_mapper:rcp_45_water_yield',
    legend_style: {
      en: 'rcp_water_yield_en',
      es: 'rcp_water_yield_es'
    }
  },
  rcp_85_water_yield: {
    wms_name: 'chile_mapper:rcp_85_water_yield',
    legend_style: {
      en: 'rcp_water_yield_en',
      es: 'rcp_water_yield_es'
    }
  },
  baseline_water_stress: {
    wms_name: 'chile_mapper:baseline_water_stress_days',
    legend_style: {
      en: 'water_stress_days_en',
      es: 'water_stress_days_es'
    }
  },
  rcp_45_water_stress: {
    wms_name: 'chile_mapper:rcp_45_water_stress_days',
    legend_style: {
      en: 'water_stress_days_en',
      es: 'water_stress_days_es'
    }
  },
  rcp_85_water_stress: {
    wms_name: 'chile_mapper:rcp_85_water_stress_days',
    legend_style: {
      en: 'water_stress_days_en',
      es: 'water_stress_days_es'
    }
  },
  soil_water: {
    wms_name: 'chile_mapper:average_daily_soil_water_content',
    legend_style: {
      en: 'average_daily_soil_water_content_en',
      es: 'average_daily_soil_water_content_es'
    }
  },
  mean_percolation: {
    wms_name: 'chile_mapper:mean_percolation',
    legend_style: {
      en: 'mean_percolation_en',
      es: 'mean_percolation_es'
    }
  },
  nitrogen: {
    wms_name: 'chile_mapper:organic_nitrogen_yield',
    legend_style: {
      en: 'organic_nitrogen_yield_en',
      es: 'organic_nitrogen_yield_es'
    }
  },
  phosphorus: {
    wms_name: 'chile_mapper:organic_phosphorus_yield',
    legend_style: {
      en: 'organic_phosphorus_yield_en',
      es: 'organic_phosphorus_yield_es'
    }
  },
  soil_loss: {
    wms_name: 'chile_mapper:soil_loss',
    legend_style: {
      en: 'soil_loss_en',
      es: 'soil_loss_es'
    }
  }
}

export const overlayLayers = {
  hillshade: {
    wms_name: 'chile_mapper:dem_aoi_10m_hillshade',
    display_legend: false,
    legend_style: {
      en: '',
      es: ''
    }
  },
  roads: {
    wms_name: 'chile_mapper:roads',
    display_legend: false,
    legend_style: {
      en: '',
      es: ''
    }
  },
  subbasins: {
    wms_name: 'chile_mapper:subbasins',
    display_legend: false,
    legend_style: {
      en: '',
      es: ''
    }
  },
  rivers: {
    wms_name: 'chile_mapper:mean_daily_streamflow',
    display_legend: true,
    legend_style: {
      en: 'mean_daily_streamflow_en',
      es: 'mean_daily_streamflow_es'
    }
  }
}

export const underlayLayers = {
  sentinel_2: {
    wms_name: 'chile_mapper:sen2_20181021_mosaic_rendered',
    display_legend: false
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
