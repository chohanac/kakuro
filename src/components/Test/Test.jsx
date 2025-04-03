import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./Test.scss";

function Test() {
    const number = "127"
    const digits = number.toString().split("");
    const digitCount = digits.length;
    const rowsAndCols = Math.ceil(Math.sqrt(digitCount));
    return (
        <div className="fixed-size-box">
            {digits.map((digit, index) => (
                <div
                    key={index}
                    className="digit"
                    style={{
                        width: `${100 / rowsAndCols}%`,
                        height: `${100 / rowsAndCols}%`,
                        fontSize: `${300 / rowsAndCols}px`,
                    }}
                >
                    {digit}
                </div>
            ))}
        </div>
    );
}

export default Test;