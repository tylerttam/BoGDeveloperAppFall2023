import React from 'react';

const AvatarCellRenderer = ({ value }) => {
    return <img src={value} alt="Avatar" style={{ width: '100%', height: '100%' }} />;
};

export default AvatarCellRenderer;
