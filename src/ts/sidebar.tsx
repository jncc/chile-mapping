import * as React from 'react'
import { getConfig } from './config'
import * as layers from './layers'
import * as content from '../content.json'
import * as map from './map'

export default class Sidebar extends React.Component {
  state = {
    baseLayer: 'dem' as keyof typeof layers.baseLayers,
    overlays: {
      'hillshade': true
    } as any
  } 

  changeBaseLayer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      baseLayer: event.target.value,
      overlays: this.state.overlays
    })
    map.updateBaselayer(event.target.value as keyof typeof layers.baseLayers)

    for (let overlay of layers.keys(this.state.overlays)) {
      if (this.state.overlays[overlay]){
        map.refreshOverlay(overlay as keyof typeof layers.overlayLayers)
      }
    }
  }

  changeOverlay = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedOverlays = this.state.overlays
    updatedOverlays[event.target.value] = event.target.checked

    this.setState({
      baseLayer: this.state.baseLayer,
      overlays: updatedOverlays
    })
    map.updateOverlay(event.target.value as keyof typeof layers.overlayLayers, event.target.checked)
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
        <div key={layer} className="checkbox">
          <div className="form-inline">
            <label className="form-check-label">
              <input className="form-check-input" type="checkbox"
                onChange={this.changeOverlay} value={layer} checked={this.state.overlays[layer]}/>
              {content.overlay_layers[layer].title[getConfig(layer).language]}
            </label>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="layers">
          {checkboxOptions}
          <hr />
          <select className="form-control" onChange={this.changeBaseLayer}>
            {dropdownOptions}
          </select>
        </div>
        <div className="legend">
          <img src={'https://ows.jncc.gov.uk/chile_mapper/wms?'
            + 'REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&LAYER='
            + layers.baseLayers[this.state.baseLayer as keyof typeof layers.baseLayers].wms_name} />
        </div>
        <div className="info">
          <p>
            {content.base_layers[this.state.baseLayer as keyof typeof layers.baseLayers]
            .description[getConfig(this.state.baseLayer).language]}
          </p>
        </div>
      </div>
    )
  }
}
