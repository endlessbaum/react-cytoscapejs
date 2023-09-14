import { useEffect, useRef, useState } from 'react';
// import { types } from './types';
import { defaults } from './defaults';
import Cytoscape from 'cytoscape';
import { patch } from './patch';

/**
 * The `CytoscapeComponent` is a React component that allows for the declarative creation
 * and modification of a Cytoscape instance, a graph visualisation.
 */
// export default class CytoscapeComponent extends React.Component {
//   static get propTypes() {
//     return types;
//   }

//   static get defaultProps() {
//     return defaults;
//   }

//   static normalizeElements(elements) {
//     const isArray = elements.length != null;

//     if (isArray) {
//       return elements;
//     } else {
//       let { nodes, edges } = elements;

//       if (nodes == null) {
//         nodes = [];
//       }

//       if (edges == null) {
//         edges = [];
//       }

//       return nodes.concat(edges);
//     }
//   }

//   constructor(props) {
//     super(props);
//     this.displayName = 'CytoscapeComponent';
//     this.containerRef = React.createRef();
//   }

//   componentDidMount() {
//     const container = this.containerRef.current;

//     const {
//       global,
//       headless,
//       styleEnabled,
//       hideEdgesOnViewport,
//       textureOnViewport,
//       motionBlur,
//       motionBlurOpacity,
//       wheelSensitivity,
//       pixelRatio,
//     } = this.props;

//     const cy = (this._cy = new Cytoscape({
//       container,
//       headless,
//       styleEnabled,
//       hideEdgesOnViewport,
//       textureOnViewport,
//       motionBlur,
//       motionBlurOpacity,
//       wheelSensitivity,
//       pixelRatio,
//     }));

//     if (global) {
//       window[global] = cy;
//     }

//     this.updateCytoscape(null, this.props);
//   }

//   updateCytoscape(prevProps, newProps) {
//     const cy = this._cy;
//     const { diff, toJson, get, forEach } = newProps;

//     patch(cy, prevProps, newProps, diff, toJson, get, forEach);

//     if (newProps.cy != null) {
//       newProps.cy(cy);
//     }
//   }

//   componentDidUpdate(prevProps) {
//     this.updateCytoscape(prevProps, this.props);
//   }

//   componentWillUnmount() {
//     this._cy.destroy();
//   }

//   render() {
//     const { id, className, style } = this.props;

//     return React.createElement('div', {
//       ref: this.containerRef,
//       id,
//       className,
//       style,
//     });
//   }
// }

const CytoscapeComponent = (props) => {
  const ref = useRef(null);
  const prevProps = useRef(null);
  const [innerCy, setInnerCy] = useState(null);
  const _props = { ...defaults, ...props };

  const updateCytoscape = (prevProps, newProps) => {
    const cy = innerCy;
    const { diff, toJson, get, forEach } = newProps;

    patch(cy, prevProps, newProps, diff, toJson, get, forEach);

    setInnerCy(cy);
  };

  useEffect(() => {
    if (!ref) return;
    const container = ref.current;

    const {
      global,
      headless,
      styleEnabled,
      hideEdgesOnViewport,
      textureOnViewport,
      motionBlur,
      motionBlurOpacity,
      wheelSensitivity,
      pixelRatio,
    } = _props;

    if (!innerCy) {
      const cy = new Cytoscape({
        container,
        headless,
        styleEnabled,
        hideEdgesOnViewport,
        textureOnViewport,
        motionBlur,
        motionBlurOpacity,
        wheelSensitivity,
        pixelRatio,
      });

      setInnerCy(cy);
    }

    if (window && global && !window[global] && innerCy) {
      window[global] = innerCy;
    }

    updateCytoscape(prevProps.current, _props);

    prevProps.current = _props;

    return () => {
      if (!innerCy) return;
      innerCy.destroy();
      setInnerCy(null);
    };
  });

  return (
    <div
      ref={ref}
      id={props.id}
      className={props.className}
      style={props.style}
    ></div>
  );
};

export default CytoscapeComponent;
