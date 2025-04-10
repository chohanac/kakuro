import React, { useState, useEffect, useRef } from 'react';
import './Instructions.scss'
function Instructions() {
    return (
        <div className="instructions-container">
            <header className="instructions-header">
                <div className='title'>
                    <h2 className='title__kakuro'>Kakuro</h2>
                    <h4>Cross sums</h4>
                </div>
                <h1>How to play</h1>
            </header>
            <section className="instructions">
                <div className="objective">
                    <div>
                        <h2>Objective</h2>
                        <p>In the white blocks, fill in numbers so that the sum of the numbers in each row or column equal the target number. The numbers must be between 1 and 9, and no number can be repeated for a section.</p>
                    </div>
                    <div>
                        <h2>Tip</h2>
                        <p>The blue target numbers are target numbers with a unique combination for sums. Hover your mouse over the blue triangle to see what they are.</p>
                    </div>
                </div>
                <div className="rules">
                    <h2>Rules</h2>
                    <p>
                        1. You can only use the numbers 1 to 9 in each block.
                    </p>
                    <p>
                        2. Numbers can't be repeated in the rows or columns.
                    </p>
                    <p>
                        3. The sum of the numbers in the rows and columns must equal the target number.
                    </p>
                </div>
            </section>
            <footer className="footer">
                <p>Created by Anas Chohan - <a href="https://www.linkedin.com/in/anas-chohan/">Linkedin</a> - <a href="https://github.com/chohanac">Github</a></p>
            </footer>
        </div>
    );
}

export default Instructions;
