import React, { useState, useEffect, useRef } from 'react';
import './Grid.scss'
function Grid({ grid, setGrid, hold, selectedCell, setSelectedCell, selectedColor, setSelectedColor }) {
    const [number, setNumber] = useState(null);
    const [blink, setBlink] = useState(true);
    const [enterNum, setEnterNum] = useState(false);

    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.className === "select__black select__black--active" || e.target.className === 'select__white select__white--active') {
                return
            }
            else {
                setSelectedCell(null);
            }

        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick); // Cleanup
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            setSelectedCell(prev => {

                const newGrid = hold.current.map(row =>
                    [...row].map(cell =>
                        [...cell]
                    )
                );

                if (e.key === 'a') {
                    setSelectedColor(true)
                }

                else if (e.key === 's') {
                    setSelectedColor(false)
                }

                else if (((e.key >= '1' && e.key <= '9') || e.key === "Backspace") && prev) {
                    let key = parseInt(e.key);
                    if (e.key === "Backspace") {
                        key = -1;
                    }

                    if (newGrid[prev[0]][prev[1]][1] === 0 || !prev[2]) {
                        newGrid[prev[0]][prev[1]][0] = key;
                    }
                    else {
                        newGrid[prev[0]][prev[1]][1] = key;

                    }
                    setGrid(newGrid);
                    hold.current = newGrid;
                }
                return prev;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    function makeGrid(size) {
        let grid = [];
        let row = [];
        for (let i = 0; i < size; i++) {
            row.push([-1, 0])
        }
        for (let j = 0; j < size; j++) {
            grid.push(row);
        }
        return grid;
    };

    const sizeChange = (size) => {
        setGridSize(size);
        const newGrid = makeGrid(size);
        setGrid(newGrid);
        hold.current = newGrid;
        setSelectedCell(null);
    };
    const clearGrid = () => {
        const newGrid = makeGrid(gridSize)
        setGrid(newGrid)
        hold.current = newGrid

        setSelectedCell(null);

    };
    const cellClick = (row, col, triangle = false, above = true) => {
        const newGrid = hold.current.map(row =>
            [...row].map(cell =>
                [...cell]
            )
        );
        setBlink(true)
        if (triangle) {
            if (col !== hold.current.length - 1 || selectedColor) {
                setSelectedCell([row, col, true])
            }
        }
        else {
            if (row !== hold.current[0].length - 1 || newGrid[row][col][1] === 0 || selectedColor) {
                if ((above && row !== hold.current[0].length - 1)) {
                    if (row !== hold.current[0].length - 1) {
                        setSelectedCell([row, col, false])

                    }
                    else if (col !== hold.current.length - 1) {
                        setSelectedCell([row, col, true])

                    }
                    else {
                        setSelectedCell(null)
                    }
                }
                else {
                    if (col !== hold.current.length - 1) {
                        setSelectedCell([row, col, true])
                    }
                    else if (row !== hold.current[0].length - 1) {
                        setSelectedCell([row, col, false])

                    }
                    else {
                        setSelectedCell(null)
                    }
                }
            }

        }
        if (newGrid[row][col][1] !== 0 && selectedColor) {
            newGrid[row][col][1] = 0;
            newGrid[row][col][0] = -1;
        }
        else if (newGrid[row][col][1] === 0 && !selectedColor) {
            newGrid[row][col][0] = -1;
            newGrid[row][col][1] = -1;
        }
        setGrid(newGrid);
        hold.current = newGrid;
    };
    const colorClick = (white) => {
        if (white) {
            setSelectedColor(true);
        }
        else {
            setSelectedColor(false);
        }
    }
    return (
        <section className='grid'>
            <div className='grid__container'>
                {grid.map((row, rowIndex) => (<div key={rowIndex} className='grid__row'>{row.map((cell, cellIndex) => (
                    <div key={cellIndex} className={`grid__cell ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === false && grid[rowIndex][cellIndex][1] != 0 && "grid__cell--selected-tri"} ${grid[0].length === rowIndex + 1 && grid[rowIndex][cellIndex][1] !== 0 && "grid__cell--grey"} ${grid[rowIndex][cellIndex][1] == 0 && "grid__cell--white"}  ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && grid[rowIndex][cellIndex][1] == 0 && "grid__cell--selected"}`} onClick={(e) => {
                        e.stopPropagation();
                        const square = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - square.left;
                        const y = e.clientY - square.top;
                        cellClick(rowIndex, cellIndex, false, x > y)
                    }}>  <span className={`grid__cell-number   ${grid[rowIndex][cellIndex][1] === 0 && "grid__cell-number--center"} ${(grid[rowIndex][cellIndex][1] === 0 && grid[rowIndex][cellIndex][0] === -1) && "grid__cell-number--hidden"} ${(grid[rowIndex][cellIndex][1] !== 0 && grid[rowIndex][cellIndex][0] === -1) && "grid__cell-number--hidden"}  ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === false && "grid__cell-number--selected"}
                        ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === false && hold.current[rowIndex][cellIndex][1] === 0 && "grid__cell-number--selected--dark"} ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === false && blink && "grid__cell-number--selected--blink"}`}>{cell[0]}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`grid__arrow-right ${(grid[rowIndex][cellIndex][1] === 0 || grid[rowIndex][cellIndex][0] === -1) && "grid__arrow-right--hidden"} ${grid[0].length === rowIndex + 1 && "grid__arrow-right--hidden"} ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === false && "grid__arrow-right--selected"}  `}>
                            <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                        </svg>
                        <svg
                            viewBox="0 0 200 200"
                            className={`grid__triangle ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === true && "grid__triangle--selected"} ${(grid[rowIndex][cellIndex][1] === 0) && "grid__triangle--hidden"}  ${grid.length === cellIndex + 1 && "grid__triangle--grey"}`}
                            preserveAspectRatio="none" onClick={(e) => {
                                e.stopPropagation();
                                cellClick(rowIndex, cellIndex, true)
                            }}
                        >

                            <path
                                d="M 0 0 L 200 200 L 200 200 Z"
                                fill="#ff6b6b"
                                stroke="black"
                                strokeWidth="2"
                            />
                        </svg>
                        <span className={`grid__triangle-number ${(grid[rowIndex][cellIndex][1] === 0 || grid[rowIndex][cellIndex][1] === -1) && "grid__triangle-number--hidden"} ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === true && "grid__triangle-number--selected"} ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === true && blink && "grid__triangle-number--selected--blink"}`} onClick={(e) => {
                            e.stopPropagation();
                            cellClick(rowIndex, cellIndex, true)
                        }} >{cell[1]}</span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`grid__arrow-down ${(grid[rowIndex][cellIndex][1] === 0 || grid[rowIndex][cellIndex][1] === -1) && "grid__arrow-down--hidden"}  ${grid.length === cellIndex + 1 && "grid__arrow-down--hidden"} ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === true && "grid__arrow-down--selected"} `} onClick={(e) => {
                            e.stopPropagation();
                            cellClick(rowIndex, cellIndex, true)
                        }}>
                            <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                        </svg>

                    </div>

                ))}</div>))}
            </div>
        </section >
    );
}

export default Grid;
