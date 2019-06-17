import * as React from 'react'
import { getConfig } from './config'
import * as layers from './layers'
import * as content from '../content.json'
import * as map from './map'

export default class Sidebar extends React.Component {
  state = {
    baseLayer: 'dem' as 'dem' | 'burn_avoidance' | 'ignition_susceptibility'
    | 'water_yield' | 'rcp_45_water_yield' | 'rcp_85_water_yield' | 'habitat_map' | 'soil_loss'
    | 'nitrogen' | 'phosphorus' | 'soil_water' | 'mean_percolation',
    overlays: {
      'hillshade': true
    }
  } as any

  changeBaseLayer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      baseLayer: event.target.value,
      overlays: this.state.overlays
    })
    map.changeBaselayer(event.target.value as 'dem' | 'burn_avoidance' | 'ignition_susceptibility'
    | 'water_yield' | 'rcp_45_water_yield' | 'rcp_85_water_yield' | 'habitat_map' | 'soil_loss'
    | 'nitrogen' | 'phosphorus' | 'soil_water' | 'mean_percolation')
  }

  changeOverlay = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedOverlays = this.state.overlays
    updatedOverlays[event.target.value] = event.target.checked

    this.setState({
      baseLayer: this.state.baseLayer,
      overlays: updatedOverlays
    })
    map.changeOverlay(event.target.value as 'hillshade' | 'roads' | 'subbasins' | 'rivers', event.target.checked)
  }

  render() {
    let dropdownOptions = []
    for (let layer of layers.keys(layers.baseLayers)){
      dropdownOptions.push(
        <option key={layer} value={layer}>
          {content.base_layers[layer].title[getConfig(layer).language]}
        </option>
      )
    }

    let checkboxOptions = []
    for (let layer of layers.keys(layers.overlayLayers)) {
      checkboxOptions.push(
        <label>
          <div>
            <input type="checkbox" onChange={this.changeOverlay} value={layer} checked={this.state.overlays[layer]}/>
            <span>{content.overlay_layers[layer].title[getConfig(layer).language]}</span>
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
            + layers.baseLayers[this.state.baseLayer as 'dem' | 'burn_avoidance' | 'ignition_susceptibility'
            | 'water_yield' | 'rcp_45_water_yield' | 'rcp_85_water_yield' | 'habitat_map' | 'soil_loss'
            | 'nitrogen' | 'phosphorus' | 'soil_water' | 'mean_percolation'].wms_name} />
        </div>
        <div className="info">
          <p>
            {content.base_layers[this.state.baseLayer as 'dem' | 'burn_avoidance' | 'ignition_susceptibility'
          | 'water_yield' | 'rcp_45_water_yield' | 'rcp_85_water_yield' | 'habitat_map' | 'soil_loss'
          | 'nitrogen' | 'phosphorus' | 'soil_water' | 'mean_percolation']
            .description[getConfig(this.state.baseLayer).language]}
          </p>
        </div>
      </div>
    )
  }
}
