import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import classNames from "classnames";
import { addChatList } from "../../store/chat";
import fire from "../../services/fire";
import createRandomString from "../../services/randomString";

const ModalChat = (props) => {
    const { isOpen, toggle, store, customer } = props;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");

    const doHandleSetMessages = useCallback((messages) => {
        setMessages(messages);
    }, []);

    const setRef = useCallback((node) => {
        if (node) {
            node.scrollIntoView({ smoth: true });
        }
    }, []);

    // get room
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_CHAT}room?customerId=${customer.id}&sellerId=${store.id}`)
            .then((res) => res.json())
            .then((res) => {
                fire.database()
                    .ref(`/contact/customer/${res.room}`)
                    .on("value", (snapshot) => {
                        if (snapshot.val() === null) {
                            fire.database().ref(`/contact/customer/${res.room}`).set(`${createRandomString()}`);
                        }
                    });
                setRoom(res.room);
            });
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer.id, store.id]);

    // read chat
    useEffect(() => {
        if (customer.id === undefined && store.id === undefined) return;

        var formdata = new FormData();
        formdata.append("customerId", customer.id);
        formdata.append("seller_id", store.id);
        formdata.append("role", "seller");

        var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };

        fetch(`${process.env.REACT_APP_URL_SIPLAH}backendseller/Mychat/readChat`, requestOptions).then((response) => {
            fire.database().ref(`/unread-message/customer/${customer.id}`).set(`${createRandomString()}`);
            response.text();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.id]);

    //get message
    useEffect(() => {
        fire.database()
            .ref(`/contact/customer/${room}`)
            .on("value", (snapshot) => {
                fetch(`${process.env.REACT_APP_API_CHAT}message?customerId=${customer.id}&sellerId=${store.id}`)
                    .then((res) => res.json())
                    .then((res) => {
                        doHandleSetMessages(res);
                    });
            });
    }, [store.id, customer.id, doHandleSetMessages, room]);

    useEffect(() => {
        let canceled = false;
        if (canceled) return;
        var myHeaders = new Headers();

        var formdata = new FormData();
        formdata.append("customerId", customer.id);
        formdata.append("seller_id", store.id);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch(`${process.env.REACT_APP_URL_SIPLAH}backendseller/Mychat/checkRoom`, requestOptions).then((response) => {
            response.text();
        });

        return () => {
            canceled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const doHandleSendMessage = () => {
        if (message !== "") {
            var myHeaders = new Headers();

            var formdata = new FormData();
            formdata.append("customerId", customer.id);
            formdata.append("seller_id", store.id);
            formdata.append("message", message);
            formdata.append("role", "customer");

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow",
            };

            fetch(`${process.env.REACT_APP_URL_SIPLAH}backendseller/mychat/addchattoRoom`, requestOptions).then(
                async (response) => {
                    fire.database().ref(`/unread-message/seller/${store.id}`).set(`${createRandomString()}`);
                    fire.database().ref(`/contact/seller/${room}`).set(`${createRandomString()}`);
                    setMessages([...messages, await response.json()]);
                    setMessage("");
                }
            );
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="xl" style={{ overflowY: "hidden" }}>
            <ModalHeader toggle={toggle}>
                <h6>{store.name}</h6>
            </ModalHeader>
            <ModalBody>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="chat-container">
                        <ul
                            className="chat-box chatContainerScroll"
                            style={{
                                maxHeight: "40vh",
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                        >
                            {messages.map((item, index) => {
                                const lastMessage = messages.length - 1 === index;
                                return (
                                    <>
                                        <li
                                            key={index}
                                            ref={lastMessage ? setRef : null}
                                            className={classNames("", {
                                                "chat-left": item.role === "seller",
                                                "chat-right mr-2": item.role === "customer",
                                            })}
                                        >
                                            {item.role === "customer" && <div className="chat-hour">{item.time}</div>}
                                            <div
                                                // style={{ background: "#3e5b8a" }}
                                                className={classNames("chat-text text-light", {
                                                    "bg-info": item.role === "seller",
                                                    "bg-secondary": item.role === "customer",
                                                })}
                                                style={{ whiteSpace: "pre-line" }}
                                            >
                                                <h6 className="font-weight-bold mb-1 text-capitalize">
                                                    {item.role === "seller" ? item.sellerName : item.customerName}
                                                </h6>
                                                <span style={{ wordWrap: "anywhere" }}>{item.text}</span>
                                            </div>
                                            {item.role === "seller" && <div className="chat-hour">{item.time}</div>}
                                        </li>
                                    </>
                                );
                            })}
                        </ul>
                        <div className="form-group mt-3 mb-1">
                            <textarea
                                className="form-control"
                                rows={3}
                                style={{ resize: "none" }}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                autoFocus
                                placeholder="Tulis Pesan Anda..."
                            />
                        </div>
                        <div className="form-group">
                            {/* <AsyncAction
                                action={doHandleSendMessage}
                                render={({ run, loading }) => ( */}
                            <button
                                type="button"
                                onClick={doHandleSendMessage}
                                className={classNames("btn btn-primary btn-lg btn-block")}
                            >
                                Kirim Pesan
                            </button>
                            {/* )}
                            /> */}
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer });

const mapDispatchToProps = {
    addChatList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalChat);
