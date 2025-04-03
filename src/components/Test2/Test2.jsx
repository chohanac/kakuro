import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./Test2.scss";

function Test2() {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="container"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="box">1</div>
            <div className="box-row">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className={`sliding-box ${hovered ? 'visible' : ''}`}
                        style={{ '--delay': `${index * 0.1}s` }}
                    >
                        {index + 2}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Test2




