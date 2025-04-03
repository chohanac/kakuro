import React, { useState, useEffect, useRef } from 'react';
import './CreateGrid.scss'
function CreateGrid() {
    const [gridSize, setGridSize] = useState(5);
    const [grid, setGrid] = useState(makeGrid(5));
    const [selectedColor, setSelectedColor] = useState(true);
    const [selectedCell, setSelectedCell] = useState(null);
    const [number, setNumber] = useState(null);
    const [blink, setBlink] = useState(true);
    const [enterNum, setEnterNum] = useState(false);
    const gridInfo = useRef(grid);

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
                const newGrid = gridInfo.current.map(row =>
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
                    console.log(gridInfo.current[prev[0]][prev[1]][1]);
                    let key = parseInt(e.key);
                    if (e.key === "Backspace") {
                        key = -1;
                    }

                    if (newGrid[prev[0]][prev[1]][1] === 0) {
                        newGrid[prev[0]][prev[1]][0] = key;
                    }
                    else if (!prev[2]) {
                        if (newGrid[prev[0]][prev[1]][0] === -1) {
                            newGrid[prev[0]][prev[1]][0] = key;
                        }
                        else if (newGrid[prev[0]][prev[1]][0] < 10) {
                            let num = parseInt(`${newGrid[prev[0]][prev[1]][0]}${key}`);
                            if (key === -1) {
                                num = -1;
                            }
                            newGrid[prev[0]][prev[1]][0] = num;
                        }
                        else if (key == -1) {
                            newGrid[prev[0]][prev[1]][0] = parseInt((newGrid[prev[0]][prev[1]][0] + "")[0]);
                        }
                    }
                    else {
                        if (newGrid[prev[0]][prev[1]][1] === -1) {
                            newGrid[prev[0]][prev[1]][1] = key;
                        }
                        else if (newGrid[prev[0]][prev[1]][1] < 10) {
                            let num = parseInt(`${newGrid[prev[0]][prev[1]][1]}${key}`);
                            if (key === -1) {
                                num = -1;
                            }
                            newGrid[prev[0]][prev[1]][1] = num;
                        }
                        else if (key == -1) {
                            console.log((newGrid[prev[0]][prev[1]][1] + "").length, "length");
                            newGrid[prev[0]][prev[1]][1] = parseInt((newGrid[prev[0]][prev[1]][1] + "")[0]);
                        }
                    }
                    setGrid(newGrid);
                    gridInfo.current = newGrid;
                    if (newGrid[prev[0]][prev[1]][1] === 0 && key !== -1) {
                        newGrid[prev[0]][prev[1]][0] = key;
                        let start = -1;
                        let end = newGrid.length;
                        let err = false;
                        const arr = [];
                        let errArr = [];
                        for (let i = prev[0]; i >= 0; i--) {
                            if (newGrid[i][prev[1]][1] !== 0) {
                                start = i
                                break
                            }
                            else if (newGrid[i][prev[1]][0] === -1) {
                                break
                            }
                        }
                        for (let j = prev[0]; j < newGrid.length; j++) {
                            if (newGrid[j][prev[1]][1] !== 0) {
                                if (newGrid[j][prev[1]][1] === -1) {
                                    end = j
                                    break
                                }
                            }
                        }
                        console.log(start, "yyyyyyyyyyy");
                        let count = 0;
                        for (let m = start + 1; m < end; m++) {
                            console.log("yes", newGrid[m][prev[1]][0])
                            count += newGrid[m][prev[1]][0];
                            if (newGrid[m][prev[1]][0] === -1) {
                                count = -100;
                            }
                            if (arr.includes(newGrid[m][prev[1]][0])) {
                                if (!errArr.includes([m, prev[1]])) {
                                    errArr.push([m, prev[1]]);
                                }
                                for (let n = 0; n < arr.length; n++) {
                                    if (arr[n] === newGrid[m][prev[1]][0]) {
                                        if (!errArr.includes([parseInt(arr[n + 1]), parseInt(arr[n + 2])])) {
                                            errArr.push([parseInt(arr[n + 1]), parseInt(arr[n + 2])]);
                                        }
                                        break;
                                    }
                                }
                            }
                            else if (newGrid[m][prev[1]][0] !== -1) {
                                console.log(newGrid[m][prev[1]][0])
                                arr.push(newGrid[m][prev[1]][0]);
                                arr.push(m + "");
                                arr.push(prev[1] + "")
                            }
                        }
                        console.log(start, count);
                        if (start !== -1 && count != newGrid[start][prev[1]][0] && count >= 0) {
                            err = true;
                        }




                        errArr = Array.from(
                            new Set(errArr.map(subArray => JSON.stringify(subArray)))
                        ).map(str => JSON.parse(str));
                        console.log(err, "error")
                        console.log(errArr)
                    }
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
        gridInfo.current = newGrid;
        setSelectedCell(null);
    };

    const clearGrid = () => {
        const newGrid = makeGrid(gridSize)
        setGrid(newGrid)
        gridInfo.current = newGrid

        setSelectedCell(null);

    };

    const cellClick = (row, col, triangle = false, above = true) => {
        const newGrid = gridInfo.current.map(row =>
            [...row].map(cell =>
                [...cell]
            )
        );
        setBlink(true)
        if (triangle) {
            if (col !== gridInfo.current.length - 1 || selectedColor) {
                setSelectedCell([row, col, true])
            }
        }
        else {
            if (row !== gridInfo.current[0].length - 1 || newGrid[row][col][1] === 0 || selectedColor) {
                if ((above && row !== gridInfo.current[0].length - 1)) {
                    if (row !== gridInfo.current[0].length - 1) {
                        setSelectedCell([row, col, false])

                    }
                    else if (col !== gridInfo.current.length - 1) {
                        setSelectedCell([row, col, true])

                    }
                    else {
                        setSelectedCell(null)
                    }
                }
                else {
                    if (col !== gridInfo.current.length - 1) {
                        setSelectedCell([row, col, true])
                    }
                    else if (row !== gridInfo.current[0].length - 1) {
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
        gridInfo.current = newGrid;
        // console.log(JSON.stringify(newGrid));
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
        <div className='createPage'>
            <section className='select'>
                <div className='select__container'>
                    <div className={`select__white ${selectedColor && "select__white--active"}`} onClick={() => colorClick(true)}></div>
                    <div className={`select__black ${!selectedColor && "select__black--active"}`} onClick={() => colorClick(false)}></div>
                </div>
            </section>
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
                        ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === false && gridInfo.current[rowIndex][cellIndex][1] === 0 && "grid__cell-number--selected--dark"} ${selectedCell !== null && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex && selectedCell[2] === false && blink && "grid__cell-number--selected--blink"}`}>{cell[0]}</span>
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

            <p className={`enter-num ${enterNum && "enter-num--show"}`}>Enter a number</p>


            <section className='choose'>
                <h2>Choose grid</h2>
                <div className='options'>
                    <button className={`option__button ${gridSize === 3 && "option__button--active"}`} onClick={() => sizeChange(3)}>3x3</button>
                    <button className={`option__button ${gridSize === 5 && "option__button--active"}`} onClick={() => sizeChange(5)}>5x5</button>
                    <button className={`option__button ${gridSize === 7 && "option__button--active"}`} onClick={() => sizeChange(7)}>7x7</button>
                </div>
                <button className={`option__button`} onClick={() => clearGrid()}>Clear Grid</button>
            </section>
            <p className={`select-color select-color--hidden`}>Enter a number</p>
        </div >
    );
}

export default CreateGrid;
