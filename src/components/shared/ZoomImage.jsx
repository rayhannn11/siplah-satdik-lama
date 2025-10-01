import React from "react";
import { Component } from "react";

import StroykaSlick from "./StroykaSlick";
import languages from "../../i18n";
import { connect } from "react-redux";

const slickSettingsFeatured = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
};
class ZoomImage extends Component {
    gallery;

    /** @var {Promise} */
    createGallery = null;

    imagesRefs = [];

    unmounted = false;

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0,
            transition: false,
        };
    }

    componentDidMount() {
        this.createGallery = import("../../photoswipe").then((module) => module.createGallery);

        // this is necessary to reset the transition state, because sometimes
        // react-slick does not trigger an afterChange event after a beforeChange event
        setTimeout(() => {
            this.setState(() => ({
                transition: false,
            }));
        }, 0);
    }

    componentDidUpdate(prevProps) {
        const { locale: prevLocale } = prevProps;
        const { direction: prevDirection } = languages[prevLocale];
        const { locale: currLocale } = this.props;
        const { direction: currDirection } = languages[currLocale];

        if (currDirection !== prevDirection) {
            // this is necessary to reset the transition state,
            // because when the direction changes, the afterChange event does not fire
            setTimeout(() => {
                this.setState(() => ({
                    transition: false,
                }));
            }, 0);
        }
    }

    componentWillUnmount() {
        if (this.gallery) {
            this.gallery.destroy();
        }

        this.unmounted = true;
    }

    getIndexDependOnDir(index) {
        const { images, locale } = this.props;
        const { direction } = languages[locale];

        // we need to invert index id direction === 'rtl' due to react-slick bug
        if (direction === "rtl") {
            return images.length - 1 - index;
        }

        return index;
    }

    handleFeaturedClick = (event, index) => {
        const { layout } = this.props;

        if (!this.createGallery || layout === "quickview") {
            return;
        }

        event.preventDefault();

        this.openPhotoswipe(index);
    };

    handleThumbnailClick = (index) => {
        const { transition } = this.state;

        if (transition) {
            return;
        }

        this.setState(() => ({ currentIndex: index }));

        if (this.slickFeaturedRef) {
            this.slickFeaturedRef.slickGoTo(this.getIndexDependOnDir(index));
        }
    };

    handleFeaturedBeforeChange = (oldIndex, newIndex) => {
        this.setState(() => ({
            currentIndex: this.getIndexDependOnDir(newIndex),
            transition: true,
        }));
    };

    handleFeaturedAfterChange = (index) => {
        this.setState(() => ({
            currentIndex: this.getIndexDependOnDir(index),
            transition: false,
        }));
    };

    handleZoomButtonClick = () => {
        const { currentIndex } = this.state;

        this.openPhotoswipe(currentIndex);
    };

    setSlickFeaturedRef = (ref) => {
        this.slickFeaturedRef = ref;
    };

    openPhotoswipe(index) {
        const { images, locale } = this.props;
        const { direction } = languages[locale];

        const items = this.imagesRefs.map((tag, index) => {
            const width = parseFloat(tag.dataset.width) || tag.naturalWidth;
            const height = parseFloat(tag.dataset.height) || tag.naturalHeight;

            return {
                src: images[index],
                msrc: images[index],
                w: width,
                h: height,
            };
        });

        if (direction === "rtl") {
            items.reverse();
        }

        // noinspection JSUnusedGlobalSymbols
        const options = {
            getThumbBoundsFn: (index) => {
                const dirDependentIndex = this.getIndexDependOnDir(index);

                if (!this.imagesRefs[dirDependentIndex]) {
                    return null;
                }

                const tag = this.imagesRefs[dirDependentIndex];
                const width = tag.naturalWidth;
                const height = tag.naturalHeight;
                const rect = tag.getBoundingClientRect();
                const ration = Math.min(rect.width / width, rect.height / height);
                const fitWidth = width * ration;
                const fitHeight = height * ration;

                return {
                    x: rect.left + (rect.width - fitWidth) / 2 + window.pageXOffset,
                    y: rect.top + (rect.height - fitHeight) / 2 + window.pageYOffset,
                    w: fitWidth,
                };
            },
            index: this.getIndexDependOnDir(index),
            bgOpacity: 0.9,
            history: false,
        };

        this.createGallery.then((createGallery) => {
            if (this.unmounted) {
                return;
            }

            this.gallery = createGallery(items, options);

            this.gallery.listen("beforeChange", () => {
                if (this.gallery && this.slickFeaturedRef) {
                    this.slickFeaturedRef.slickGoTo(this.gallery.getCurrentIndex(), true);
                }
            });
            this.gallery.listen("destroy", () => {
                this.gallery = null;
            });

            this.gallery.init();
        });
    }

    render() {
        const { images } = this.props;
        const featured = images.map((image, index) => (
            <div
                key={index}
                className="product-image product-image--location--gallery mt-2"
                style={{ maxHeight: "78px" }}
            >
                <a
                    rel="noopener noreferrer"
                    href={`${image}`}
                    className="product-image__body d-flex justify-content-center"
                    onClick={(event) => this.handleFeaturedClick(event, index)}
                    target="_blank"
                >
                    {/*
                    The data-width and data-height attributes must contain the size of a larger
                    version of the product image.

                    If you do not know the image size, you can remove the data-width and data-height
                    attribute, in which case the width and height will be obtained from the
                    naturalWidth and naturalHeight property of img.product-image__img.
                    */}
                    <img
                        className="product-image__img"
                        src={`${process.env.PUBLIC_URL}/images/img-open.png`}
                        alt=""
                        style={{ width: "100%", height: "78px" }}
                        ref={(element) => {
                            this.imagesRefs[index] = element;
                        }}
                        // data-width="100"
                        // data-height="100"
                    />
                    <span className="product-image__img text-center" style={{ paddingTop: "71px", fontSize: "10.5px" }}>
                        Lihat Gambar
                    </span>
                </a>
            </div>
        ));

        return (
            <StroykaSlick
                ref={this.setSlickFeaturedRef}
                {...slickSettingsFeatured}
                beforeChange={this.handleFeaturedBeforeChange}
                afterChange={this.handleFeaturedAfterChange}
            >
                {featured}
            </StroykaSlick>
        );
    }
}

const mapStateToProps = (state) => ({
    locale: state.locale,
});

export default connect(mapStateToProps)(ZoomImage);
