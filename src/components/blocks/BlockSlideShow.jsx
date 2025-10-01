// react
import React, { PureComponent } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import departmentsAria from "../../services/departmentsArea";

class BlockSlideShow extends PureComponent {
    departmentsAreaRef = null;

    media = window.matchMedia("(min-width: 992px)");

    componentDidMount() {
        if (this.media.addEventListener) {
            this.media.addEventListener("change", this.onChangeMedia);
        } else {
            // noinspection JSDeprecatedSymbols
            this.media.addListener(this.onChangeMedia);
        }
    }

    componentWillUnmount() {
        departmentsAria.area = null;

        if (this.media.removeEventListener) {
            this.media.removeEventListener("change", this.onChangeMedia);
        } else {
            // noinspection JSDeprecatedSymbols
            this.media.removeListener(this.onChangeMedia);
        }
    }

    onChangeMedia = () => {
        if (this.media.matches) {
            departmentsAria.area = this.departmentsAreaRef;
        }
    };

    setDepartmentsAreaRef = (ref) => {
        this.departmentsAreaRef = ref;

        if (this.media.matches) {
            departmentsAria.area = this.departmentsAreaRef;
        }
    };

    render() {
        const { withDepartments } = this.props;

        const blockClasses = classNames("block-slideshow block", {
            "block-slideshow--layout--full": !withDepartments,
            "block-slideshow--layout--with-departments": withDepartments,
        });

        const layoutClasses = classNames("col-12", {
            "col-lg-12": !withDepartments,
            "col-lg-9": withDepartments,
        });

        const slideImages = [
            {
                url: "images/banner_2024.jpeg",
                caption: "Slide 5",
            },
            ,
            {
                url: "images/Template Banner Mitra - Panduan HPP@2x-100.jpg",
                caption: "Slide 4",
            },
            // {
            //     url: "images/banner-1.jpg",
            //     caption: "Slide 1",
            // },
            {
                url: "images/banner-2.jpg",
                caption: "Slide 2",
            },
            {
                url: "images/banner.jpg",
                caption: "Slide 3",
            },
        ];

        return (
            <div className={blockClasses}>
                <div className="container">
                    <div className="row">
                        {withDepartments && (
                            <div className="col-3 d-lg-block d-none" ref={this.setDepartmentsAreaRef} />
                        )}
                        <div className={layoutClasses}>
                            <div className="block-slideshow__body">
                                <div className="block-slideshow__slide">
                                    {slideImages.map((slideImage, index) => (
                                        <>
                                            <div
                                                className="block-slideshow__slide-image block-slideshow__slide-image--desktop"
                                                style={{
                                                    backgroundImage: `url(${slideImage.url})`,
                                                    border: "0",
                                                    backgroundSize: "cover",
                                                }}
                                            />
                                            <div
                                                className="block-slideshow__slide-image block-slideshow__slide-image--mobile"
                                                style={{
                                                    backgroundImage: `url(images/banner.jpg)`,
                                                    backgroundSize: "cover",
                                                }}
                                            />
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

BlockSlideShow.propTypes = {
    withDepartments: PropTypes.bool,
    /** current locale */
    locale: PropTypes.string,
};

BlockSlideShow.defaultProps = {
    withDepartments: false,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
});

export default connect(mapStateToProps)(BlockSlideShow);
