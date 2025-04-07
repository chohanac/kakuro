import React from 'react';
import './Test3.scss';

const Test3 = () => {
    // Create an array of numbers from 1 to 9
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

    return (
        <div className="grid-container">
            {numbers.map((num) => (
                <div key={num} className="grid-item">
                    {num}
                    <div className="extra-squares">
                        <div className="extra-square"></div>
                        <div className="extra-square"></div>
                        <div className="extra-square"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Test3;
