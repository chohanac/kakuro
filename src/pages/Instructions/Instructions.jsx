import React, { useState, useEffect, useRef } from 'react';
import './Instructions.scss'
function Instructions() {
    return (
        <div className="instructions-container">
            <header className="instructions-header">
                <div className='title'>
                    <h1>Kakuro</h1>
                    <h4>Cross sums</h4>
                </div>
                <h1>How to play</h1>
            </header>
            <section className="instructions">
                <div className="objective">
                    <div>
                        <h2>Objective</h2>
                        <p>Fill in numbers in the white cells so that the sums of the numbers in each row/column block match the target number for that row or column. The numbers must be between 1 and 9, and no number can be repeated for a section.</p>
                    </div>
                    <div>
                        <h2>Tip</h2>
                        <p>The blue target numbers are target numbers with a unique combination for sums. Hover your mouse over the blue triangle to see what they are.</p>
                    </div>
                </div>
                <div className="rules">
                    <h2>Rules</h2>
                    <p>
                        1. You can only use the numbers 1-9 in each block
                    </p>
                    <p>
                        2. Numbers can't be repeated in any target number row or column.
                    </p>
                    <p>
                        3. The numbers in each row or column must sum to the target number
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Instructions;
