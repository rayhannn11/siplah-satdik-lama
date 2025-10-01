// react
import React, { useEffect, useState } from "react";

// third-party
import PropTypes from "prop-types";

// application
import Pagination from "../shared/Pagination";
import Rating from "../shared/Rating";
import shopApi from "../../api/shop";
import { connect } from "react-redux";
import BlockLoader from "../blocks/BlockLoader";

function ProductTabReviews(props) {
    const { data } = props;
    const [reviews, setReviews] = useState({ items: [] });
    const [options, setOptions] = useState({ page: 1, limit: 10 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        shopApi.getProductReviews(data.id, options).then((res) => {
            setReviews(res.data);
            setLoading(false);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    let reviewsList = [];

    if (loading) {
        return <BlockLoader />;
    }

    if (reviews.items) {
        reviewsList = reviews.items.map((review, index) => (
            <li key={index} className="reviews-list__item">
                <div className="review">
                    <div className=" review__content">
                        <div className=" review__author">{review.customerName}</div>
                        <div className=" review__rating">
                            <Rating value={review.rate} />
                        </div>
                        <div className=" review__text">{review.text}</div>
                        <div className=" review__date">{review.createdAt}</div>
                    </div>
                </div>
            </li>
        ));
    }

    return (
        <div className="reviews-view">
            <div className="reviews-view__list">
                <h3 className="reviews-view__header">Ulasan Pelanggan</h3>

                <div className="reviews-list">
                    {reviews.items.length > 0 ? (
                        <>
                            <ol className="reviews-list__content">{reviewsList}</ol>
                            <div className="reviews-list__pagination">
                                <Pagination
                                    onPageChange={(page) => setOptions({ ...options, page })}
                                    current={reviews.page}
                                    siblings={2}
                                    total={reviews.pages}
                                />
                            </div>
                        </>
                    ) : (
                        <h5 className="text-center">Belum Ada Ulasan</h5>
                    )}
                </div>
            </div>
        </div>
    );
}

ProductTabReviews.propTypes = {
    data: PropTypes.object,
};

const mapStateToProps = (state) => ({ customer: state.customer, auth: state.auth });

export default connect(mapStateToProps, null)(ProductTabReviews);
