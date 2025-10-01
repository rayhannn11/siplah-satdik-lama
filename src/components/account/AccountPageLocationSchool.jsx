import React from "react";
import GoogleMapReact from "google-map-react";
import { connect } from "react-redux";

const AccountPageLocationSchool = (props) => {
    const { customer } = props;
    const { school } = customer;

    return (
        <div style={{ height: "30vh", width: "100%", paddingBottom: "100px" }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCrm5iujdelEkPB2WSZicDO9B1tEbD0Ba8" }}
                defaultCenter={{
                    lat: Number(school?.location?.latitude),
                    lng: Number(school?.location?.longitude),
                }}
                defaultZoom={100}
            ></GoogleMapReact>
            <h6 className="mt-3">{school.name}</h6>
            <p>
                {school?.location?.address}, {school?.location?.village}, {school?.location?.city?.name},{" "}
                {school?.location?.province?.name}
            </p>
            <p>Telp. {school?.telephone}</p>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        customer: state.customer,
    };
};

export default connect(mapStateToProps, null)(AccountPageLocationSchool);
