import React from 'react';

const StatusCellRenderer = ({ value }) => {
    const statusText = value ? 'Active' : 'Inactive';
    return <span>{statusText}</span>;
};

export default StatusCellRenderer;
