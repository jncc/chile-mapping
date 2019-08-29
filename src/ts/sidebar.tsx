import * as React from 'react'
import { render } from 'react-dom'
import { Config, getConfig, parseLanguage } from './config'
import * as layers from './layers'
import * as content from '../content.json'
import * as map from './map'

const legendBaseUrl = 'https://ows.jncc.gov.uk/chile_mapper/wms'
  + '?REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&WIDTH=20'
  + '&LEGEND_OPTIONS=dx:10;fontName:Arial;fontSize:12;fontStyle:normal'

export function createSidebar(map: L.Map, config: Config) {
  let sidebarControl = L.control.sidebar('sidebar', {position: 'left'})
  sidebarControl.addTo(map)

  // setup home tab
  let sidebarHome: HTMLElement | null = document.getElementById('home')
  if (sidebarHome) {
    let home: HTMLElement | null = L.DomUtil.get('home')
    if (home) {
      let homeContainer = L.DomUtil.create('div', 'sidebar-home')
      homeContainer.innerHTML += '<h2>'+content.info_panel.title[config.language]+'</h2>'
      homeContainer.innerHTML += '<p>'+content.info_panel.description[config.language]+'</p>'

      let getStartedButton = L.DomUtil.create('button', 'btn btn-primary start')
      getStartedButton.innerHTML += 'Get started'
      getStartedButton.addEventListener('click', function() {
        let sidebarLayers: HTMLElement | null = document.getElementsByClassName('fa fa-cog')[0] as HTMLElement
        if (sidebarLayers) {
          sidebarLayers.click()
        }
      })
      homeContainer.appendChild(getStartedButton)

      home.appendChild(homeContainer)
    }

    // set up layers tab using react component
    let layerControls: HTMLElement | null = document.getElementById('layers')
    if (layerControls) {
      render(<LayerControls/>, layerControls)
    }
  }

  let homeTab: HTMLElement | null = document.getElementById('home-tab')
  if (homeTab) {
    homeTab.click() // default
  }
}

export default class LayerControls extends React.Component {
  state = {
    hideBaseLayer: true,
    baseLayer: 'no_layer' as keyof typeof layers.baseLayers,
    overlays: {
      'hillshade': false
    } as any,
    underlays: {
      'sentinel_2': true
    } as any
  }

  changeBaseLayer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value == 'no_layer') {
      map.removeBaselayer()
      this.setState({
        hideBaseLayer: true,
        baseLayer: event.target.value,
        overlays: this.state.overlays,
        underlays: this.state.underlays
      })
    } else {
      this.setState({
        hideBaseLayer: false,
        baseLayer: event.target.value,
        overlays: this.state.overlays,
        underlays: this.state.underlays
      })
      map.updateBaselayer(event.target.value as keyof typeof layers.baseLayers)
      for (let overlay of layers.keys(this.state.overlays)) {
        if (this.state.overlays[overlay]){
          map.refreshOverlay(overlay as keyof typeof layers.overlayLayers)
        }
      }
    }
  }

  changeOverlay = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedOverlays = this.state.overlays
    updatedOverlays[event.target.value] = event.target.checked

    this.setState({
      baseLayer: this.state.baseLayer,
      overlays: updatedOverlays,
      underlays: this.state.underlays
    })
    map.updateOverlay(event.target.value as keyof typeof layers.overlayLayers, event.target.checked)
  }

  changeUnderlay = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedUnderlays = this.state.underlays
    updatedUnderlays[event.target.value] = event.target.checked

    this.setState({
      baseLayer: this.state.baseLayer,
      overlays: this.state.overlays,
      underlays: updatedUnderlays
    })
    map.updateUnderlay(event.target.value as keyof typeof layers.underlayLayers, event.target.checked)
  }

  render() {
    let baseLayerOptions = []
    // let selectText = ''
    // if (getConfig(window.location.search).language == 'en') {
    //   selectText = 'Select a layer'
    // } else {
    //   selectText = 'Select a layer'
    // }
    // baseLayerOptions.push(
    //   <option selected disabled hidden>
    //     {selectText}
    //   </option>
    // )
    for (let layer of layers.keys(layers.baseLayers)){
      baseLayerOptions.push(
        <option key={layer} value={layer}>
          {content.base_layers[layer].title[getConfig(window.location.search).language]}
        </option>
      )
    }

    let overlayOptions = []
    for (let layer of layers.keys(layers.overlayLayers)) {
      overlayOptions.push(
        <div key={layer} className="checkbox">
          <div className="form-inline">
            <label className="form-check-label">
              <input id={layer+'-checkbox'} className="form-check-input" type="checkbox"
                onChange={this.changeOverlay} value={layer} checked={this.state.overlays[layer]}/>
              {content.overlay_layers[layer].title[getConfig(window.location.search).language]}
            </label>
          </div>
        </div>
      )
      if (this.state.overlays[layer] && layers.overlayLayers[layer].display_legend) {
        let legendUrl = legendBaseUrl+'&LAYER='
          + layers.overlayLayers.rivers.wms_name
          + '&STYLE='
          + layers.overlayLayers.rivers.legend_style[getConfig(window.location.search).language]
        overlayOptions.push(
          <div className="overlay-legend">
            <img src={legendUrl} />
            <p>{content.overlay_layers.rivers.description[getConfig(window.location.search).language]}</p>
          </div>
        )
      }
    }

    let underlayOptions = []
    for (let layer of layers.keys(layers.underlayLayers)) {
      underlayOptions.push(
        <div key={layer} className="checkbox">
          <div className="form-inline">
            <label className="form-check-label">
              <input id={layer+'-checkbox'} className="form-check-input" type="checkbox"
                onChange={this.changeUnderlay} value={layer} checked={this.state.underlays[layer]}/>
              {content.underlay_layers[layer].title[getConfig(window.location.search).language]}
            </label>
          </div>
        </div>
      )
    }

    let legend = []
    if (!this.state.hideBaseLayer) {
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
          <img key={this.state.baseLayer+'-legend'} src={
            legendBaseUrl
            +'&LAYER='
            + layers.baseLayers[this.state.baseLayer as keyof typeof layers.baseLayers].wms_name
            + '&STYLE='
            + layers.baseLayers[this.state.baseLayer as keyof typeof layers.baseLayers]
              .legend_style[getConfig(window.location.search).language]} />
        )
      }
    }

    let info = []
    if (!this.state.hideBaseLayer) {
      info.push(
        <p dangerouslySetInnerHTML={{__html: content.base_layers[this.state.baseLayer as keyof typeof layers.baseLayers]
          .description[getConfig(window.location.search).language]}}>
        </p>
      )
    }

    return (
      <div className="sidebar-layers">
        <div className="layer-select">
          {underlayOptions}
          {overlayOptions}
          <hr />
          <select id="baselayer-select" className="form-control" onChange={this.changeBaseLayer}>
            {baseLayerOptions}
          </select>
        </div>
        <div className="legend">
          {legend}
        </div>
        
        <div className="info">
          {info}
        </div>
      </div>
    )
  }
}
