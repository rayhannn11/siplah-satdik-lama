import React from "react";

const RequestPostLoader = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center flex-column"
            style={{
                position: "fixed",
                background: "white",
                left: 0,
                top: 0,
                zIndex: 9999,
                width: "100%",
                height: "100%",
            }}
        >
            <iframe
                title="loading"
                height="600"
                width="400"
                style={{ marginTop: "-10px" }}
                src="images/avatars/6230-loading-37-brochure.gif"
                frameBorder={0}
            />
            <h5 style={{ marginTop: "-300px", zIndex: 99 }}>Permintaan sedang diproses</h5>
            <h5 style={{ marginTop: "1px", zIndex: 99 }}>Mohon tunggu beberapa saat . . .</h5>
        </div>
    );
};

export default RequestPostLoader;
