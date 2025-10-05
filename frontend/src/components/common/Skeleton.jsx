import React from 'react';

const Skeleton = ({ className = '', style = {} }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 rounded ${className}`}
    style={style}
  />
);

export default Skeleton;
