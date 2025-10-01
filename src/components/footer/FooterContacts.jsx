// react
import React from "react";

// data stubs
import theme from "../../data/theme";

function FooterContacts() {
    return (
        <div className="site-footer__widget footer-contacts">
            <h5 className="footer-contacts__title">Kontak Kami</h5>

            <div className="footer-contacts__text">PT. Eureka Bookhouse</div>

            <ul className="footer-contacts__contacts">
                <li>
                    <i className="footer-contacts__icon fas fa-globe-americas" />
                    {theme.contacts.address}
                </li>

                <li>
                    <i className="footer-contacts__icon fas fa-mobile-alt" />
                    {`${theme.contacts.phone}`}
                </li>
                <li>
                    <a rel="noopener noreferrer" href="https://wa.me/6282111972195" target="_blank">
                        <i className="footer-contacts__icon fab fa-whatsapp" />
                        {`${theme.contacts.whatsapp}`}
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default React.memo(FooterContacts);
