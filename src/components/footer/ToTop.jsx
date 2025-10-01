// react
import React, { useEffect, useState } from 'react';

// third-party
import classNames from 'classnames';

// application
import { ArrowRoundedUp13x8Svg } from '../../svg';

export default function ToTop() {
    const [show, setShow] = useState(false);

    const showFrom = 300;
    const classes = classNames('totop', {
        'totop--show': show,
    });

    const onClick = () => {
        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } catch {
            window.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        let state = false;
        const onScroll = () => {
            const newState = window.pageYOffset >= showFrom;

            if (state !== newState) {
                setShow(state = newState);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll, { passive: true });
    }, [setShow]);

    return (
        <div className={classes}>
            <div className="totop__body">
                <div className="totop__start" />
                <div className="totop__container container" />
                <div className="totop__end">
                    <button type="button" className="totop__button" onClick={onClick}>
                        <ArrowRoundedUp13x8Svg />
                    </button>
                </div>
            </div>
        </div>
    );
}
