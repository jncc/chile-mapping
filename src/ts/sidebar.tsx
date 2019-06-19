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
          {content.base_layers[layer].title[getConfig(window.location.search).language]}
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
              {content.overlay_layers[layer].title[getConfig(window.location.search).language]}
            </label>
          </div>
        </div>
      )
    }

    let legend = []
    if (this.state.baseLayer === 'dem') {
      for (let i = 1; i < layers.keys(layers.legends.dem).length+1; i++) {
        let style: React.CSSProperties = {
          backgroundColor: layers.legends.dem[i as keyof typeof layers.legends.dem].colour
        }
        legend.push(
          <div key={'step'+i} className="legend-step">
            <i style={style}></i>
            {layers.legends.dem[i as keyof typeof layers.legends.dem].label}
          </div>
        )
      }
    } else {
      legend.push(
        <img src={'https://ows.jncc.gov.uk/chile_mapper/wms'
          + '?REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&WIDTH=20'
          + '&LEGEND_OPTIONS=dx:10;fontName:Arial;fontSize:12;fontStyle:normal&LAYER='
          + layers.baseLayers[this.state.baseLayer as keyof typeof layers.baseLayers].wms_name} />
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
          {legend}
        </div>
        <div className="info">
          <p>
            {content.base_layers[this.state.baseLayer as keyof typeof layers.baseLayers]
            .description[getConfig(window.location.search).language]}
          </p>
        </div>
      </div>
    )
  }
}
