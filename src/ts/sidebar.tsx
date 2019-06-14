import * as React from 'react'
import { getConfig } from './config'
import * as layers from './layers'
import { keys } from './layers'
import * as content from '../content.json'
import * as L from 'leaflet'

export default class Sidebar extends React.Component {
  state = {
    baseLayer: 'dem' as 'dem' | 'burn_avoidance' | 'ignition_susceptibility'
    | 'water_yield' | 'rcp_45_water_yield' | 'rcp_85_water_yield' | 'habitat_map' | 'soil_loss'
    | 'nitrogen' | 'phosphorus' | 'soil_water' | 'mean_percolation'
  }
  baseMaps = {}
  overlayMaps = {}
  
  constructor(props: any) {
    super(props)

    for (let layerName of keys(layers.baseLayers)) {
      let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
        layers: layers.baseLayers[layerName].wms_name,
        transparent: true,
        format: 'image/png',
        opacity: 0.5
      })
      Object.assign(this.baseMaps, {layerName: layer})
    }

    for (let layerName of keys(layers.overlayLayers)) {
      let layer = L.tileLayer.wms('https://ows.jncc.gov.uk/chile_mapper/wms?', {
        layers: layers.overlayLayers[layerName].wms_name,
        transparent: true,
        format: 'image/png',
        opacity: 0.5
      })
      Object.assign(this.overlayMaps, {layerName: layer})
    }
  }

  changeBaseLayer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      baseLayer: event.target.value
    })
  }

  changeOverlay = (event: React.ChangeEvent<HTMLInputElement>) => {

  }

  render() {
    let dropdownOptions = []
    for (let layer of keys(layers.baseLayers)){
      dropdownOptions.push(
        <option key={layer} value={layer}>
          {content.base_layers[layer]['title'][getConfig(layer).language]}
        </option>
      )
    }

    let checkboxOptions = []
    for (let layer of keys(layers.overlayLayers)) {
      checkboxOptions.push(
        <label>
          <div>
            <input type="checkbox" onChange={this.changeOverlay} value={layer}/>
            <span>{content.overlay_layers[layer]['title'][getConfig(layer).language]}</span>
          </div>
        </label>
      )
    }

    return (
      <div>
        <div className="layers">
          <h4>Overlays</h4>
          {checkboxOptions}
          <br />
          <h4>Base layer</h4>
          <select id="baselayer-select" onChange={this.changeBaseLayer}>{dropdownOptions}</select>
        </div>
        <div className="legend">
          <img src={'https://ows.jncc.gov.uk/chile_mapper/wms?'
            + 'REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&LAYER='
            + layers.baseLayers[this.state.baseLayer].wms_name} />
        </div>
        <div className="info">
          <p>
            {content.base_layers[this.state.baseLayer]['description'][getConfig(this.state.baseLayer).language]}
          </p>
        </div>
      </div>
    )
  }
}
