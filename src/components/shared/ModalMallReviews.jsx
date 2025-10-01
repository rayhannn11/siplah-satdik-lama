import React, { useEffect, useState } from "react";
import { ModalBody, Modal, ModalHeader, ModalFooter } from "reactstrap";
import shopApi from "../../api/shop";
import Rating from "./Rating";
import Pagination from "./Pagination";

const ModalMallReviews = (props) => {
    const { toggle, isOpen, storeId } = props;
    const [state, setState] = useState({ items: [] });
    const [options, setOptions] = useState({ page: 1, limit: 5 });

    useEffect(() => {
        shopApi.getMallReviews(storeId, options).then((res) => {
            setState(res.data);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    let reviewList = [];
    if (state.items) {
        reviewList = state.items.map((review, index) => (
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
        <Modal isOpen={isOpen} toggle={() => toggle(!isOpen)} size="xl">
            <ModalHeader toggle={() => toggle(!isOpen)}>
                <h5>Ulasan Toko</h5>
            </ModalHeader>
            <ModalBody>
                <div
                    className="reviews-view"
                    style={{
                        maxHeight: "50vh",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    <div className="reviews-view__list">
                        <div className="reviews-list">
                            {reviewList.length > 0 ? (
                                <>
                                    <ol className="reviews-list__content">{reviewList}</ol>
                                </>
                            ) : (
                                <h5 className="text-center">Belum Ada Ulasan</h5>
                            )}
                        </div>
                    </div>
                </div>
            </ModalBody>
            {reviewList.length > 0 && (
                <ModalFooter className="align-items-center justify-content-center">
                    <div className="reviews-list__pagination">
                        <Pagination
                            onPageChange={(page) => setOptions({ ...options, page })}
                            current={state.page}
                            siblings={2}
                            total={state.pages}
                        />
                    </div>
                </ModalFooter>
            )}
        </Modal>
    );
};

export default ModalMallReviews;
