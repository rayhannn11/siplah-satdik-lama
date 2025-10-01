import { combineReducers } from "redux";

// reducers
import cartReducer from "./cart";
import compareReducer from "./compare";
import currencyReducer from "./currency";
import localeReducer from "./locale";
import mobileMenuReducer from "./mobile-menu";
import quickviewReducer from "./quickview";
import sidebarReducer from "./sidebar";
import version from "./version";
import wishlistReducer from "./wishlist";
import authReducer from "./auth";
import customerReducer from "./customer";
import configReducer from "./config";
import miniCartReducer from "./mini-cart";
import checkoutReducer from "./checkout"; 
import chatReducer from "./chat";
import categoryReducer from "./category";
import newMessageReducer from "./new-message";
import firstLoginReducer from "./first-login/firstLoginReducer";
import notifReducer from "./notif";

export default combineReducers({
    version: (state = version) => state,
    cart: cartReducer,
    compare: compareReducer,
    currency: currencyReducer,
    locale: localeReducer,
    mobileMenu: mobileMenuReducer,
    quickview: quickviewReducer,
    sidebar: sidebarReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    customer: customerReducer,
    config: configReducer,
    miniCart: miniCartReducer,
    checkout: checkoutReducer,
    chat: chatReducer,
    categories:categoryReducer,
    newMessage:newMessageReducer,
    firstLogin:firstLoginReducer,
    openNotif:notifReducer
});
