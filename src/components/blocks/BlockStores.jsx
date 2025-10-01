import React, { PureComponent } from "react";
import StroykaSlick from "../shared/StroykaSlick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BlockLoader from "./BlockLoader";
import BlockHeader from '../shared/BlockHeader';

const slickSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 400,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
            },
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            },
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
    ],
};
export default class BlockStores extends PureComponent {
    state = {
        stores: [],
        title: "",
        viewMore: false,
        linkViewMore: "",
    };

    handleNextClick = () => {
        if (this.slickRef) {
            this.slickRef.slickNext();
        }
    };

    handlePrevClick = () => {
        if (this.slickRef) {
            this.slickRef.slickPrev();
        }
    };
    
    setSlickRef = (ref) => {
        this.slickRef = ref;
    };

    render() {
        const {  title, stores, isLoadingStore } = this.props;
        const brandsList = stores.map((store, index) => (
            <div key={index} className="block-brands__item" >
                <Link className="d-flex flex-column justify-content-between" to={`/store/${store.slug}`} style={{background:'white',borderRadius:'10px',padding:'10px',height:'150px'}}>
                    <LazyLoadImage
                        src={store.image.primary}
                        alt={store.name}
                        style={{maxWidth:'100%'}}
                        effect="opacity"
                        className="img-contain"
                    />
                    <h6 style={{
                        fontSize:'14px',
                        WebkitLineClamp:2,
                        WebkitBoxOrient:'vertical',
                        overflow:'hidden' ,
                        height:'31px',display:'flex',alignItems:'flex-end',justifyContent:'center'
                    }} className="text-center font-weight-bold text-dark">{store.name}</h6>
                </Link>
            </div>
        ));
        if (isLoadingStore) {
            return <BlockLoader />;
        }

        return (
            <div className="block block-brands mt-4">
                <div className="container">
                    {/* <BlockHeader arrows title={title} onNext={this.handleNextClick} onPrev={this.handlePrevClick} /> */}
                    {/* <span className="mb-3 text-white font-weight-bold d-inline-block" style={{background:'rgb(24,115,191)',padding:'8px 15px',borderTopRightRadius:'15px',borderBottomRightRadius:'15px'}}>Toko Penyedia Terdaftar</span> */}
                   
                <BlockHeader title={title} />
                    <div className="block-brands__slider">
                        <StroykaSlick ref={this.setSlickRef} {...slickSettings}>
                            {brandsList}
                        </StroykaSlick>
                        <Link to="/store">
                            <h6 className="text-center text-white">Lihat Penyedia Lainnya</h6>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

BlockStores.propTypes = {
    title: PropTypes.string.isRequired,
    layout: PropTypes.oneOf(["list-sm", "grid-nl"]),
    stores: PropTypes.array,
    viewMore: PropTypes.bool,
    isLoadingStore: PropTypes.bool,
    linkViewMore: PropTypes.string,
};

BlockStores.defaultProps = {
    layout: "list-sm",
    stores: [],
    viewMore: false,
};
