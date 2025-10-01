// react
import React from "react";

export default function BlockLoader(props) {
    return (
        <div className="block-loader" {...props}>
            <div className="block-loader__spinner" />
        </div>
    );
}
