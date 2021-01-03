import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';

import sheet from '../styles/sheet';
import {SF_OFFICE_COORDINATE} from '../utils';
import Page from './common/Page';

const layerStyles = {
  singlePoint: {
    circleColor: 'green',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },

  clusteredPoints: {
    circlePitchAlignment: 'map',

    circleColor: [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1',
    ],

    circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],

    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
  },

  clusterCount: {
    textField: '{point_count}',
    textSize: 12,
    textPitchAlignment: 'map',
  },
};

const EarthQuakes = (props) => {
  const sourceRef = React.useRef();

  /**
   * This is called when the user has moved the map and when the map has
   * been fully rendered for the first time.
   */
  const regionChanged = React.useCallback(async () => {
    const singleFeatures = await sourceRef.current.features([
      '!',
      ['has', 'point_count'],
    ]);
    console.log('Single features not clustered:', singleFeatures);
  }, []);

  return (
    <Page {...props}>
      <MapboxGL.MapView
        style={sheet.matchParent}
        onRegionDidChange={regionChanged}
        styleURL={MapboxGL.StyleURL.Dark}>
        <MapboxGL.Camera
          zoomLevel={6}
          pitch={45}
          centerCoordinate={SF_OFFICE_COORDINATE}
        />

        <MapboxGL.ShapeSource
          id="earthquakes"
          ref={sourceRef}
          cluster
          clusterRadius={50}
          clusterMaxZoom={14}
          url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson">
          <MapboxGL.SymbolLayer
            id="pointCount"
            style={layerStyles.clusterCount}
          />

          <MapboxGL.CircleLayer
            id="clusteredPoints"
            belowLayerID="pointCount"
            filter={['has', 'point_count']}
            style={layerStyles.clusteredPoints}
          />

          <MapboxGL.CircleLayer
            id="singlePoint"
            filter={['!', ['has', 'point_count']]}
            style={layerStyles.singlePoint}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </Page>
  );
};

export default EarthQuakes;
