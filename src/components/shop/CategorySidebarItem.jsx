// react
import React from 'react';

// third-party
import classNames from 'classnames';

export default function CategorySidebarItem(props) {
    const { children, className } = props;
    const classes = classNames('block-sidebar__item', className);

    return (
        <div className={classes}>
            {children}
        </div>
    );
}
