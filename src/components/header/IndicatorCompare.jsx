// react
import React from "react";

// third-party
import { connect } from "react-redux";
import Indicator from "./Indicator";
import { Compare16Svg } from "../../svg";

function IndicatorCompare(props) {
    return <Indicator url="/shop/compare" icon={<Compare16Svg />} />;
}

const mapStateToProps = (state) => ({
    compare: state.compare,
});

export default connect(mapStateToProps, null)(IndicatorCompare);
