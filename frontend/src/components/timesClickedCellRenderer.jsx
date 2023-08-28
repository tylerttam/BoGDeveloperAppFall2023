import React from 'react';

export default (props) => {
    const clickCount = props.data.clickCount || 0;

    return <span>{clickCount}</span>;
};
