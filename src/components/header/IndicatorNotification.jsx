// react
import React, { useEffect } from "react";

// third-party
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// application
import Indicator from "./Indicator";
import { cartRemoveItem } from "../../store/cart";
import { closeNotif } from "../../store/notif";
import { addMiniCart } from "../../store/mini-cart";
import { useState } from "react";
import { Link } from "react-router-dom";

import customerApi from "../../api/customer";
import { NotificationIcon } from "../../svg";
import { toast } from "react-toastify";
import ReactGA from "react-ga";
import AsyncAction from "../shared/AsyncAction";
import classNames from "classnames";

function IndicatorCart(props) {
    const { customer } = props;

    const [notificationReminder, setNotificationReminder] = useState(() => {
        const saved = localStorage.getItem("notificationReminder");
        return saved ? JSON.parse(saved) : [];
    });

    const [notification, setNotification] = useState(() => {
        const saved = localStorage.getItem("notification");
        return saved ? JSON.parse(saved) : [];
    });

    const history = useHistory();
    const [reload, setReload] = useState(true);

    let dropdown;

    // useEffect(() => {
    //     customerApi.getNotification({ page: 1, limit: 3, isNotifReminder: 1 }, {}, customer?.token).then((res) => {
    //         if (res.status.code === 200) {
    //             setNotificationReminder(res.data);
    //         }
    //     });
    //     setHasSwalShown(true);
    //     localStorage.setItem("notifShownApi", "true");
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [hasSwalShown]);

    // useEffect(() => {
    //     customerApi.getNotification({ page: 1, limit: 3, isNotifReminder: 0 }, {}, customer?.token).then((res) => {
    //         if (res.status.code === 200) {
    //             setNotification(res.data);
    //         }
    //     });
    //     setHasSwalShown(true);
    //     localStorage.setItem("notifShownApi", "true");
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [hasSwalShown]);

    useEffect(() => {
        const hasSwalShown = localStorage.getItem("notifShownApi") === "true";

        if (!hasSwalShown) {
            Promise.all([
                customerApi.getNotification({ page: 1, limit: 3, isNotifReminder: 1 }, {}, customer?.token),
                customerApi.getNotification({ page: 1, limit: 3, isNotifReminder: 0 }, {}, customer?.token),
            ]).then(([resReminder, resNotif]) => {
                if (resReminder.status.code === 200) {
                    console.log(resReminder.data);
                    setNotificationReminder(resReminder.data);
                    localStorage.setItem("notificationReminder", JSON.stringify(resReminder.data));
                }
                if (resNotif.status.code === 200) {
                    console.log(resNotif.data);
                    setNotification(resNotif.data);
                    localStorage.setItem("notification", JSON.stringify(resNotif.data));
                }
                localStorage.setItem("notifShownApi", "true");
            });
        }
    }, []);

    const handleReadAllNotification = () => {
        return customerApi.readAllNotification(customer?.token).then((res) => {
            if (res.status.code === 200) {
                toast.success("Semua notifikasi telah dibaca");
                setReload((state) => !state);
            } else {
                toast.error("Terjadi kesalaha pada sistem");
            }
        });
    };

    const urlRedirect = (item) => {
        switch (item.type) {
            case "nego":
                return `/account/negotiation/${item.linkRedirect}`;

            default:
                return `/account/orders/${item.linkRedirect}`;
        }
    };

    // const handleRedirect = (item) => {
    //     customerApi.readNotification({ id: item.id }, customer?.token);

    //     customerApi.getNotification({ page: 1, limit: 3, isNotifReminder: 1 }, {}, customer?.token).then((res) => {
    //         if (res.status.code === 200) {
    //             setNotificationReminder(res.data);
    //         }
    //     });

    //     customerApi.getNotification({ page: 1, limit: 3, isNotifReminder: 0 }, {}, customer?.token).then((res) => {
    //         if (res.status.code === 200) {
    //             setNotification(res.data);
    //         }
    //     });

    //     ReactGA.event({
    //         category: "School Notification",
    //         action: "Show Order Detail From Notification",
    //     });
    //     history.push(urlRedirect(item));
    // };

    const handleRedirect = async (item) => {
        await customerApi.readNotification({ id: item.id }, customer?.token);

        setNotification((prev) => {
            const updatedItems = prev?.items?.map((notif) =>
                notif.id === item.id ? { ...notif, isRead: true } : notif
            );
            const updated = { ...prev, items: updatedItems };
            localStorage.setItem("notification", JSON.stringify(updated));
            return updated;
        });

        setNotificationReminder((prev) => {
            const updatedItems = prev?.items?.map((notif) =>
                notif.id === item.id ? { ...notif, isRead: true } : notif
            );
            const updated = { ...prev, items: updatedItems };
            localStorage.setItem("notificationReminder", JSON.stringify(updated));
            return updated;
        });

        ReactGA.event({
            category: "School Notification",
            action: "Show Order Detail From Notification",
        });

        history.push(urlRedirect(item));
    };

    if (notification?.items?.length > 0 || notificationReminder?.items?.length > 0) {
        const items = notification?.items?.map((item) => {
            let image;

            if (item.icon) {
                image = (
                    <div
                        className="product-image dropcart__product-image d-flex justify-content-center align-items-center"
                        style={{ width: "45px", height: "50px" }}
                    >
                        <span onClick={() => handleRedirect(item)} className="product-image__body">
                            <img className="product-image__img" src={item.icon} alt="icon" />
                        </span>
                    </div>
                );
            }

            return (
                <div
                    key={item.id}
                    onClick={() => handleRedirect(item)}
                    className="dropcart__product my-1"
                    style={
                        !item.isRead
                            ? {
                                  background: "rgba(14, 51, 109, 0.11) none repeat scroll 0% 0%",
                                  padding: "10px 0",
                                  cursor: "pointer",
                              }
                            : { padding: "10px 0", cursor: "pointer" }
                    }
                >
                    {image}
                    <div className="dropcart__product-info">
                        <div
                            className="dropcart__product-name d-flex justify-content-between flex-column"
                            style={{ fontSize: "12px", height: "100%" }}
                        >
                            <span
                                className="font-weight-bold mb-1"
                                style={{
                                    overflowY: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "100%",
                                    overflowX: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: "1",
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {item.title}
                            </span>
                            <span
                                dangerouslySetInnerHTML={{ __html: item.text }}
                                style={{
                                    overflowY: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "100%",
                                    overflowX: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: "2",
                                    WebkitBoxOrient: "vertical",
                                }}
                            ></span>
                        </div>
                    </div>
                </div>
            );
        });
        const items2 = notificationReminder?.items?.map((item) => {
            let image;

            if (item.icon) {
                image = (
                    <div
                        className="product-image dropcart__product-image d-flex justify-content-center align-items-center"
                        style={{ width: "45px", height: "50px" }}
                    >
                        <span onClick={() => handleRedirect(item)} className="product-image__body">
                            <img className="product-image__img" src={item.icon} alt="icon" />
                        </span>
                    </div>
                );
            }

            return (
                <div
                    key={item.id}
                    onClick={() => handleRedirect(item)}
                    className="dropcart__product my-1"
                    style={
                        !item.isRead
                            ? {
                                  background: "rgba(14, 51, 109, 0.11) none repeat scroll 0% 0%",
                                  padding: "10px 0",
                                  cursor: "pointer",
                              }
                            : { padding: "10px 0", cursor: "pointer" }
                    }
                >
                    {image}
                    <div className="dropcart__product-info">
                        <div
                            className="dropcart__product-name d-flex justify-content-between flex-column"
                            style={{ fontSize: "12px", height: "100%" }}
                        >
                            <span
                                className="font-weight-bold mb-1"
                                style={{
                                    overflowY: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "100%",
                                    overflowX: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: "1",
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {item.title}
                            </span>
                            <span
                                dangerouslySetInnerHTML={{ __html: item.text }}
                                style={{
                                    overflowY: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "100%",
                                    overflowX: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: "2",
                                    WebkitBoxOrient: "vertical",
                                }}
                            ></span>
                            {item.mustFollowUp && (
                                <small className="text-primary d-block text-right">
                                    Tindaklanjuti <i class="fa fa-angle-right" aria-hidden="true"></i>
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            );
        });

        dropdown = (
            <div className="dropcart" style={{ overflowY: "auto", maxHeight: "400px" }}>
                <div style={{ padding: "10px 0 0 10px" }}>
                    <small className="text-muted">Perlu Ditindaklajuti</small>
                </div>
                {items2?.length > 0 ? (
                    <>
                        <div className="dropcart__products-list dropnotification__list mb-0">{items2}</div>
                        <div className="d-flex justify-content-center py-1">
                            <Link className="text-center d-inline-block" to="/account/notification?isNotifReminder=1">
                                Lihat Selengkapnya
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="dropcart__empty">Tidak ada notifikasi</div>
                )}

                <div
                    style={{ padding: "5px 10px", marginTop: "5px" }}
                    className="d-flex justify-content-between align-items-center"
                >
                    <small className="text-muted">Informasi untuk anda</small>
                    <AsyncAction
                        action={handleReadAllNotification}
                        render={({ run, loading }) => (
                            <button
                                style={{
                                    fontSize: "12px",
                                    padding: "5px",
                                    height: "calc(1.543rem + 2px)",
                                }}
                                type="button"
                                onClick={run}
                                className={classNames("btn btn-primary btn-sm", {
                                    "btn-loading": loading,
                                })}
                            >
                                Tandai sudah dibaca
                            </button>
                        )}
                    />
                </div>

                {items?.length > 0 ? (
                    <>
                        <div className="dropcart__products-list dropnotification__list">{items}</div>
                        <div className="d-flex justify-content-center pb-2">
                            <Link className="text-center d-inline-block" to="/account/notification?type=notif">
                                Lihat Selengkapnya
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="dropcart__empty">Tidak ada notifikasi</div>
                )}
            </div>
        );
    } else {
        dropdown = (
            <div className="dropcart">
                <div className="dropcart__empty">Tidak ada notifikasi</div>
            </div>
        );
    }

    return (
        <Indicator
            url="/account/notification"
            closeNotif={props.closeNotif}
            openNotif={props.openNotif}
            dropdown={dropdown}
            value={customer?.totalNotifReminder || undefined}
            icon={<NotificationIcon style={{ width: "20px" }} />}
        />
    );
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    miniCart: state.miniCart,
    customer: state.customer,
    openNotif: state.openNotif,
});

const mapDispatchToProps = {
    cartRemoveItem,
    addMiniCart,
    closeNotif,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorCart);
