import { Component } from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import isDeepEqual from 'fast-deep-equal';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import some from 'lodash/some';

import { NativeModules } from 'react-native';

import {
  eulerAngles,
  material,
  orientation,
  position,
  rotation,
  transition,
  light,
} from './propTypes';

import { processColorInMaterial } from './parseColor';
import generateId from './generateId';

const ARGeosManager = NativeModules.ARGeosManager;
const NODE_PROPS = [
  'position',
  'eulerAngles',
  'rotation',
  'orientation',
  'transition',
];
const KEYS_THAT_NEED_REMOUNT = ['material', 'shape', 'model'];

const nodeProps = (id, props) => ({
  id,
  ...pick(props, NODE_PROPS),
});

export default (mountConfig, propTypes = {}) => {

  /**
   for box: { shape: { width: 0.05, height: 0.05, length: 0.05, chamfer: 0.01 },
    material: { diffuse: 3431530376 } }
   for light: {
      { material: undefined }
   } 
   takes props as parameter thes props
  */
  const getShapeAndMaterialProps = props =>
    typeof mountConfig === 'string'
      ? {
          shape: props.shape,
          material: processColorInMaterial(props.material),
        }
      : {
          ...pick(props, mountConfig.pick),
          material: processColorInMaterial(props.material),
        };

      
  const mountFunc =
    typeof mountConfig === 'string'
      ? ARGeosManager[mountConfig]
      : mountConfig.mount;

  
  /* 
    input parameter props (properties set by the component markup)
    - for box:
    { position: { x: 0.1, y: 0.1, z: -0.2 },
        shape: { width: 0.05, height: 0.05, length: 0.05, chamfer: 0.01 },
        material: { diffuse: '#88ff88cc' } }
    - for light:
    { position: { x: 1, y: 1, z: 1 },
        lightSpec: { something: 0.5 } }  
    
    - internaly the function seperates the props into different objects
      -> gets the shape and material 
      -> gets the id and position by calling the nodeProps function,
         These function picks some properties out of the markup-props
         Porperties to pick are defined in the NODE_PROPS const
        -> return for box { id: '1Uk6XXvPBX', position: { x: 0.1, y: 0.1, z: -0.2 } }
        -> return for light { id: '1Uk6XXvPBW', position: { x: 1, y: 1, z: 1 } }
    - 
    - and the props of the node itself
    -> 
    -> 
  */
  const mount = (id, props) => {
    console.log('the props');
    console.log(props);
    let shapeAndMaterial = getShapeAndMaterialProps(props);
    console.log(shapeAndMaterial);
    let theNodeProps = nodeProps(id, props);
    console.log(theNodeProps);
    mountFunc(
      getShapeAndMaterialProps(props),
      nodeProps(id, props),
      props.frame,
    );
  };

  const ARComponent = class extends Component {
    identifier = null;

    componentDidMount() {
      this.identifier = this.props.id || generateId();
      mount(this.identifier, this.props);
    }

    componentWillUpdate(props) {
      const changedKeys = filter(
        keys(this.props),
        key => !isDeepEqual(props[key], this.props[key]),
      );

      if (isEmpty(changedKeys)) {
        return;
      }

      if (some(KEYS_THAT_NEED_REMOUNT, k => changedKeys.includes(k))) {
        // remount
        // TODO: we should be able to update
        mount(this.identifier, props);
      } else {
        // always include transition
        ARGeosManager.update(
          this.identifier,
          pick(props, ['transition', ...changedKeys]),
        );
      }
    }

    componentWillUnmount() {
      ARGeosManager.unmount(this.identifier);
    }

    render() {
      return null;
    }
  };
  ARComponent.propTypes = {
    frame: PropTypes.string,
    position,
    transition,
    eulerAngles,
    rotation,
    orientation,
    material,
    ...propTypes,
  };

  return ARComponent;
};
