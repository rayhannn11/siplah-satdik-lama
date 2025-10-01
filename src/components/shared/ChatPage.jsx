import React, { useCallback, useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import propTypes from "prop-types";
import { addChatList } from "../../store/chat";
import queryString from "query-string";
import { Messaging } from "../../svg";
import { useHistory } from "react-router-dom";
import fire from "../../services/fire";
import createRandomString from "../../services/randomString";
import BlockLoader from "../blocks/BlockLoader";
import AsyncAction from "./AsyncAction";

const initialState = {
    room: null,
};

function buildQuery(room) {
    const params = {};

    if (room !== null) {
        params.room = room;
    }

    return queryString.stringify(params, { encode: false });
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_ROOM":
            return { ...state, room: action.value };
        default:
            throw new Error();
    }
};

const ChatPage = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [messages, setMessages] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [sellerId, setSellerId] = useState(null);
    const [message, setMessage] = useState();
    const [room, setRoom] = useState("");
    const [fetchMessages, setFetchMessages] = useState(false);
    const history = useHistory();
    const { id } = props.customer;
    const { layout, toggle } = props;

    const setRef = useCallback((node) => {
        if (node) {
            node.scrollIntoView({ smoth: true });
        }
    }, []);

    useEffect(() => {
        const query = buildQuery(state.room);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
        return () => {};
    }, [state.room]);

    // const doHandleSetMessages = useCallback((message) => {
    //     setMessages(message);
    // }, []);

    // get contact
    useEffect(() => {
        fire.database()
            .ref(`/unread-message/customer/${id}`)
            .on("value", (snapshot) => {
                fetch(`${process.env.REACT_APP_API_CHAT}get-users?id=${id}&from=customer`)
                    .then((res) => res.json())
                    .then((res) => {
                        setChatList(res);
                    });
            });
    }, [id]);

    useEffect(() => {
        setFetchMessages(true);
        let fir = fire
            .database()
            .ref(`contact/customer/${state.room}`)
            .on("value", (snapshot) => {
                fetch(`${process.env.REACT_APP_API_CHAT}message?customerId=${id}&sellerId=${sellerId}`)
                    .then((res) => res.json())
                    .then((res) => {
                        setMessages(res);
                        setFetchMessages(false);
                    });
            });

        return () => fire.database().ref(`contact/customer/${state.room}`).off("value", fir);
    }, [sellerId, id, state.room]);

    const handleChooseChat = (chat) => {
        setSellerId(chat.sellerId);
        dispatch({ type: "SET_ROOM", value: chat.room });
        setRoom(chat.room);
    };

    // read chat
    useEffect(() => {
        if (id === undefined && sellerId === undefined) return;

        var formdata = new FormData();
        formdata.append("customerId", id);
        formdata.append("seller_id", sellerId);
        formdata.append("role", "seller");

        var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };

        fetch(`${process.env.REACT_APP_URL_SIPLAH}backendseller/Mychat/readChat`, requestOptions).then((response) => {
            fire.database().ref(`/unread-message/customer/${id}`).set(`${createRandomString()}`);

            response.text();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sellerId, id]);

    // send message
    const doHandleSendMessage = () => {
        return new Promise((resolve) => {
            if (message !== "") {
                var myHeaders = new Headers();

                var formdata = new FormData();
                formdata.append("customerId", id);
                formdata.append("seller_id", sellerId);
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
                        fire.database().ref(`/unread-message/seller/${sellerId}`).set(`${createRandomString()}`);
                        fire.database().ref(`/contact/seller/${room}`).set(`${createRandomString()}`);
                        setMessages([...messages, await response.json()]);
                        setMessage("");
                        resolve();
                    }
                );
            } else {
                resolve();
            }
        });
    };

    let renderChatList = (
        <div className="row justify-content-center align-items-center p-0 m-0">
            <div className="col-md-12">
                <button
                    onClick={() => {
                        if (typeof toggle === "function") {
                            toggle();
                        }
                        history.push("/store");
                    }}
                    className="btn btn-primary btn-block"
                >
                    Mulai Percakapan
                </button>
            </div>
        </div>
    );
    if (chatList != null && chatList.length > 0) {
        renderChatList = chatList.map((item, index) => {
            return (
                <li
                    key={index}
                    style={{
                        background: Number(item.sellerId) === Number(sellerId) && "#EBEBEB",
                    }}
                    className="person"
                    data-chat={item.sellerId}
                    onClick={() => handleChooseChat(item)}
                >
                    <div className="user" style={{ borderRadius: "50%", border: "1px solid black" }}>
                        <img
                            style={{
                                objectFit: "contain",
                            }}
                            src={`https://cdn.eurekabookhouse.co.id/ebh/mall/${item.image}`}
                            alt=""
                        />
                    </div>
                    <p className="name-time">
                        <p
                            className="name d-flex justify-content-between"
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                wordBreak: "break-all",
                                whiteSpace: "nowrap !important",
                                marginBottom: "0",
                            }}
                        >
                            <div>{item.sellerName}</div>
                            {item.countUnread > 0 && (
                                <div
                                    class="badge badge-primary ml-3"
                                    style={{
                                        fontSize: "15px",
                                        // borderRadius: "50%",
                                        background: "lightsalmon",
                                        height: "15px",
                                        padding: " 0 10px",
                                        borderRadius: " 1000px",
                                        fontWeight: "700",
                                    }}
                                >
                                    {item.countUnread}
                                </div>
                            )}
                        </p>
                        {/* <span className="time">15/02/2019</span> */}
                    </p>
                </li>
            );
        });
    }

    let renderMessages = fetchMessages ? (
        <BlockLoader />
    ) : (
        messages.map((item, index) => {
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
        })
    );

    if (renderMessages.length === 0) {
        renderMessages = (
            <div className="row justify-content-center align-items-center">
                <div className="col-md-6">
                    <Messaging />
                    <h5 className="text-center my-3">Belum ada percakapan</h5>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card chat m-0">
                            <div className="row no-gutters">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                    <div className="users-container">
                                        <ul
                                            className="users"
                                            style={{
                                                maxHeight: layout === "modal" ? "60vh" : "100vh",
                                                minHeight: layout === "modal" ? "60vh" : "100vh",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {renderChatList}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div className="chat-container">
                                        <ul
                                            className="chat-box chatContainerScroll"
                                            style={{
                                                maxHeight: layout === "modal" ? "40vh" : "80vh",
                                                minHeight: layout === "modal" ? "40vh" : "80vh",
                                                overflowY: "auto",
                                                overflowX: "hidden",
                                            }}
                                        >
                                            {renderMessages}
                                        </ul>
                                        {messages.length > 0 && (
                                            <>
                                                <div className="form-group mt-3 mb-1">
                                                    <textarea
                                                        className="form-control"
                                                        rows={3}
                                                        style={{ resize: "none" }}
                                                        autoFocus
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        placeholder="Tulis Pesan Anda..."
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <AsyncAction
                                                        action={doHandleSendMessage}
                                                        render={({ run, loading }) => (
                                                            <button
                                                                type="button"
                                                                className={classNames(
                                                                    "btn btn-primary btn-lg btn-block",
                                                                    {
                                                                        "btn-loading": loading,
                                                                    }
                                                                )}
                                                                onClick={run}
                                                            >
                                                                Kirim Pesan
                                                            </button>
                                                        )}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ChatPage.propTypes = {
    layout: propTypes.string,
};

ChatPage.defaultProps = {
    layout: "modal",
};

const mapStateToProps = (state) => ({ customer: state.customer, chat: state.chat });

const mapDispatchToProps = {
    addChatList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
