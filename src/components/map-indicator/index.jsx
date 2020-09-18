import React from 'react';
import PropTypes from 'prop-types';

/**
 * Map indicator components
 *
 * @param
 * @return {JSX.Element}
 */
function MapIndicator ({ items, onChange }) {
  const render = (item) => (
    <div key={item}>
      <button onClick={() => onChange(item)}>{item}</button>
    </div>
  );

  return (
    <div className="map-indicator">
      {items.map(render)}
    </div>
  );
}

MapIndicator.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
}

MapIndicator.defaultProps = {
  items: [],
  onChange () {},
};

export { MapIndicator };
