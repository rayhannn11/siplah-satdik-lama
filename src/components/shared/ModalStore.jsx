import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Stores from "../store/PageStores";

const ModalStore = (props) => {
    const { isOpen, toggle, doHandleChooseStore } = props;
    return (
        <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
            <ModalHeader toggle={toggle}>Daftar Toko</ModalHeader>
            <ModalBody>
                <Stores layout="modal" doHandleChooseStore={doHandleChooseStore} />
            </ModalBody>
        </Modal>
    );
};

export default ModalStore;
