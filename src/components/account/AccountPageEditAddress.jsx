// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet-async';

// data stubs
import theme from '../../data/theme';

export default function AccountPageEditAddress() {
    return (
        <div className="card">
            <Helmet>
                <title>{`Edit Address — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header">
                <h5>Edit Address</h5>
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-first-name">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-first-name"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-last-name">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-last-name"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkout-company-name">
                                Company Name
                                {' '}
                                <span className="text-muted">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-company-name"
                                placeholder="Company Name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-country">Country</label>
                            <select id="checkout-country" className="form-control form-control-select2">
                                <option>Select a country...</option>
                                <option>United States</option>
                                <option>Russia</option>
                                <option>Italy</option>
                                <option>France</option>
                                <option>Ukraine</option>
                                <option>Germany</option>
                                <option>Australia</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-street-address">Street Address</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-street-address"
                                placeholder="Street Address"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-address">
                                Apartment, suite, unit etc.
                                {' '}
                                <span className="text-muted">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-address"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-city">Town / City</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-city"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-state">State / County</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-state"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-postcode">Postcode / ZIP</label>
                            <input
                                type="text"
                                className="form-control"
                                id="checkout-postcode"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="checkout-email"
                                    placeholder="Email address"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-phone">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="checkout-phone"
                                    placeholder="Phone"
                                />
                            </div>
                        </div>

                        <div className="form-group mt-3 mb-0">
                            <button className="btn btn-primary" type="button">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
