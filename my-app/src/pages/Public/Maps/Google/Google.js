import React from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import Widget from '../../../../components/Widget';
import s from './Google.module.scss';



const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 3.2028, // Maldives approximate center
  lng: 73.2207,
};
const BasicMap = withScriptjs(withGoogleMap(() =>
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: parseFloat(-37.813179), lng: parseFloat(144.950259) }}
  >
    <Marker position={{ lat: 4.1755, lng: 73.5093 }} /> {/* Malé */}
  </GoogleMap>
));


class Maps extends React.Component {
  render() {
    return (
      <div>
        <h1 className="page-title">
          Google <span className="fw-semi-bold">Maps</span>
        </h1>
        <Widget
          title={
            <h4>
              Google Maps <small className="text-muted">Default and customized</small>
            </h4>
          }
          collapse
          close
        >
          <div className={s.MapContainer}>
            <BasicMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg"
              loadingElement={<div style={{ height: 'inherit', width: 'inherit' }} />}
              containerElement={<div style={{ height: 'inherit' }} />}
              mapElement={<div style={{ height: 'inherit' }} />}
            />
          </div>
        </Widget>
      </div>
    );
  }
}

export default Maps;
