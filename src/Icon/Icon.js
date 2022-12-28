import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Icon = ({ className }) => <i className={cx(className)} />;

Icon.propTypes = {
  className: PropTypes.string,
};

export default Icon;
