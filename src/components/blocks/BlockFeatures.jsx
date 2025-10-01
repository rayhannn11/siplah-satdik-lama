// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { connect } from "react-redux";
import Skeleton from "react-loading-skeleton";

const BlockFeatures = React.memo((props) => {
    const { layout, profitUsing } = props;
    if (!profitUsing) {
        return <Skeleton />;
    }
    return (
        <div className={`block block-features block-features--layout--${layout} mt-3`}>
            <div className="container">
                <h5 className="text-center mb-3 block-header__title">{profitUsing.title}</h5>
                {/* <div className="block-features__list"> */}
                <div className="form-row">
                    {profitUsing.items.map((item, index) => (
                        <div className="col-6 col-sm-3 col-md-2 mb-2">
                            <div
                                style={{
                                    background: "linear-gradient(270deg, rgb(240, 164, 0) 30%, rgb(186, 139, 0) 100%)",
                                    height: "205px",
                                    borderRadius: "20px",
                                    paddingBottom: "5px",
                                }}
                                className="text-center text-white p-3"
                            >
                                <LazyLoadImage
                                    alt={item.title}
                                    effect="opacity"
                                    src={item.icon}
                                    style={{ width: "50px" }}
                                />
                                <h6 className="font-weight-bold mt-2 mb-1">{item.title}</h6>
                                <p style={{ fontSize: "14px", lineHeight: "17px" }}>{item.text}</p>
                            </div>

                            {index < profitUsing.items.length - 1 && <div className="block-features__divider" />}
                        </div>
                    ))}
                </div>
                {/* </div> */}
            </div>
        </div>
    );
});

BlockFeatures.propTypes = {
    layout: PropTypes.oneOf(["classic", "boxed"]),
};

BlockFeatures.defaultProps = {
    layout: "classic",
};

const mapStateToProps = (state) => ({ config: state.config });

export default connect(mapStateToProps, null)(BlockFeatures);
