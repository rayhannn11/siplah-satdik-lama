import React from "react";

// third-party
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import ShopProducts from "../shop/ShopProducts";
import PageHeader from "./PageHeader";

const ModalProducts = (props) => {
    const { toggle,isOpen, doHandleChooseProduct, forAct, productCompare, doHandleFetchCompareList } = props;
    let breadcumb = productCompare.category.name
        .split(" > ")
        .map((item) => ({ url: `/products/category/${productCompare.category.slug}`, title: item }));
    return (
        <Modal isOpen={isOpen} toggle={() => toggle(null)} size="xl">
            <ModalHeader toggle={() => toggle(null)}>{productCompare.storeName || ""}</ModalHeader>
            <ModalBody>
                {productCompare.storeName === undefined && (
                    <PageHeader breadcrumb={breadcumb} header={breadcumb[1].title} style={{ marginBottom: "-50px" }} />
                )}
                <ShopProducts
                    mainProduct={productCompare}
                    doHandleChooseProduct={doHandleChooseProduct}
                    doHandleFetchCompareList={doHandleFetchCompareList}
                    forAct={forAct}
                    store={productCompare.storeSlug || productCompare.category.slug}
                />
            </ModalBody>
        </Modal>
    );
};

export default ModalProducts;
