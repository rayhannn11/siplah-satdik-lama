import React from "react";

// third party
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import propTypes from "prop-types";

const ModalPaymentHistory = (props) => {
    const { isOpen, toggle, paymentHistory } = props;
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                <h5>History Pembayaran</h5>
            </ModalHeader>
            <ModalBody>
                <ul class="list-group">
                    {paymentHistory.map((item) => (
                        <li class="list-group-item">
                            <h6>{item.title}</h6>
                            <small>{item.text}</small> <br />
                            <small>
                                {item.createdAt} {item.timeAt}
                            </small>
                        </li>
                    ))}
                </ul>
            </ModalBody>
        </Modal>
    );
};

ModalPaymentHistory.propTypes = {
    isOpen: propTypes.bool,
    toggle: propTypes.func,
    paymentHistory: propTypes.array,
};

export default ModalPaymentHistory;
