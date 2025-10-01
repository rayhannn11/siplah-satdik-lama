import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Chat } from "../../svg";
import Indicator from "./Indicator";
import { connect } from "react-redux";
import { addChatList } from "../../store/chat";
import ChatPage from "../shared/ChatPage";

const IndicatorChat = (props) => {
    const [open, setOpen] = useState(false);
    const [totalUnread, setTotalUnread] = useState(0);

    useEffect(() => {
        setTotalUnread(props.newMessage);
    }, [props]);

    const toggle = () => {
        setOpen(!open);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    return (
        <>
            <Indicator onClick={toggle} icon={<Chat />} value={totalUnread === 0 ? undefined : totalUnread} />
            <Modal isOpen={open} style={{ overflowY: "hidden" }} size="xl" toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    <h5 className="title">Chat</h5>
                </ModalHeader>
                <ModalBody>
                    <ChatPage layout="modal" toggle={toggle} />
                </ModalBody>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer, chat: state.chat, newMessage: state.newMessage });

const mapDispatchToProps = {
    addChatList,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorChat);
