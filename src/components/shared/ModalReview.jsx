import React from "react";
import { Collapse } from "reactstrap";
import classNames from "classnames";
import AsyncAction from "./AsyncAction";
// import ModalFooter from "reactstrap/lib/ModalFooter";
import { useState } from "react";

const ModalReview = (props) => {
    const { doHandleAddProductReview, toggle, isOpen, item } = props;
    // const [productReviews, setProductReviews] = useState(
    //     products
    //         .map((p) => ({
    //             productId: p.productId,
    //             name: p.name,
    //             image: p.image,
    //             manufacturer: p.manufacturer,
    //             rate: "5",
    //             note: "",
    //         }))
    //         .sort() ?? []
    // );
    const [productReviews, setProductReviews] = useState(
        // products
        //     .map((p) => ({
        [
            {
                productId: item.productId,
                name: item.name,
                image: item.image,
                manufacturer: item.manufacturer,
                rate: "5",
                note: "",
            },
        ]
        // }))
        // .sort() ?? []
    );

    const doHandleChange = (e, productId) => {
        const { name, value } = e.target;
        const findProduct = productReviews.find((p) => p.productId === productId);
        const indexProduct = productReviews.indexOf(findProduct);
        productReviews[indexProduct] = { ...findProduct, [name]: value };
        setProductReviews(productReviews);
    };
    return (
        <tr>
            <td colSpan={6}>
                <Collapse isOpen={isOpen} toggle={toggle}>
                    <div>
                        <div class="form-group">
                            <label for="">Pilih Bintang</label>
                            <select
                                class="form-control"
                                name="rate"
                                id=""
                                onChange={(e) => doHandleChange(e, item.productId)}
                            >
                                <option>Pilih Bintang</option>
                                {["5", "4", "3", " 2", "1"].map((item) => (
                                    <option
                                        selected={productReviews[0].rate === item}
                                        value={item}
                                    >{`Bintang ${item}`}</option>
                                ))}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">Tulis Ulasan</label>
                            <textarea
                                onChange={(e) => doHandleChange(e, item.productId)}
                                name="note"
                                class="form-control"
                                rows="3"
                            ></textarea>
                        </div>
                        <AsyncAction
                            action={() => doHandleAddProductReview(productReviews)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    onClick={run}
                                    className={classNames("btn btn-primary btn-block btn-sm", {
                                        "btn-loading": loading,
                                    })}
                                >
                                    Kirim Ulasan
                                </button>
                            )}
                        />
                    </div>
                </Collapse>
            </td>
        </tr>
    );

    // return (
    //     <Modal isOpen={isOpen} toggle={toggle} size="xl">
    //         <ModalHeader toggle={toggle}>Ulasan</ModalHeader>
    //         <ModalBody style={{ maxHeight: "60vh", overflowY: "auto" }}>
    //             <div class="card">
    //                 {productReviews.map((item, index) => (
    //                     <>
    //                         <div className="card-body">
    //                             <div className="row">
    //                                 <div className="col-md-2">
    //                                     <img
    //                                         src={item.image}
    //                                         alt=""
    //                                         style={{ width: "100%", maxHeight: "30vh", objectFit: "contain" }}
    //                                     />
    //                                 </div>
    //                                 <div className="col-md-10">
    //                                     <h5>{item.name}</h5>
    //                                     <p>{item.manufacturer}</p>
    //                                 </div>
    //                                 <div className="col-md-12 mt-2">
    //                                     <div class="form-group">
    //                                         <label for="">Pilih Bintang</label>
    //                                         <select
    //                                             class="form-control"
    //                                             name="rate"
    //                                             id=""
    //                                             onChange={(e) => doHandleChange(e, item.productId)}
    //                                         >
    //                                             <option>Pilih Bintang</option>
    //                                             {["5", "4", "3", " 2", "1"].map((item) => (
    //                                                 <option
    //                                                     selected={productReviews[index].rate === item}
    //                                                     value={item}
    //                                                 >{`Bintang ${item}`}</option>
    //                                             ))}
    //                                         </select>
    //                                     </div>
    //                                     <div class="form-group">
    //                                         <label for="">Tulis Ulasan</label>
    //                                         <textarea
    //                                             onChange={(e) => doHandleChange(e, item.productId)}
    //                                             name="note"
    //                                             class="form-control"
    //                                             rows="3"
    //                                         ></textarea>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         {productReviews.length - 1 < index && <div className="card-divider mb-3"></div>}
    //                     </>
    //                 ))}
    //             </div>
    //         </ModalBody>
    //         <ModalFooter>
    //             <AsyncAction
    //                 action={() => doHandleAddProductReview(productReviews)}
    //                 render={({ run, loading }) => (
    //                     <button
    //                         type="button"
    //                         onClick={run}
    //                         className={classNames("btn btn-primary btn-block btn-lg", {
    //                             "btn-loading": loading,
    //                         })}
    //                     >
    //                         Kirim Ulasan
    //                     </button>
    //                 )}
    //             />
    //         </ModalFooter>
    //     </Modal>
    // );
};

export default ModalReview;
