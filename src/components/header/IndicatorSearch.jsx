// react
import React, { Component } from 'react';

// application
import Indicator from './Indicator';
import Search from './Search';
import { Cross20Svg, Search20Svg } from '../../svg';

class IndicatorSearch extends Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();
        this.indicator = React.createRef();
    }

    handleOpen = () => {
        if (this.input.current) {
            this.input.current.focus();
        }
    };

    handleClose = () => {
        if (this.indicator.current) {
            this.indicator.current.close();
        }
    };

    render() {
        const searchIcon = (
            <React.Fragment>
                <Search20Svg className="indicator__icon" />
                <Cross20Svg className="indicator__icon indicator__icon--open" />
            </React.Fragment>
        );

        const searchDropdown = (
            <Search context="indicator" inputRef={this.input} onClose={this.handleClose} />
        );

        return (
            <Indicator
                ref={this.indicator}
                dropdown={searchDropdown}
                icon={searchIcon}
                onOpen={this.handleOpen}
            />
        );
    }
}

export default IndicatorSearch;
