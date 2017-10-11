import { NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import createArComponent from './lib/createArComponent';

const ARLight = createArComponent(
  { mount: NativeModules.ARLightManager.mount, 
    pick: ['light'] },
  {
    light: PropTypes.shape({
      color: PropTypes.string
    }),
  },
);

module.exports = ARLight;