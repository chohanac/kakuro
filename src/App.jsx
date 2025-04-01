import React, { useState, useEffect, useRef } from 'react';
import './app.scss'

function App() {
    const [gridSize, setGridSize] = useState(5);
    const [grid, setGrid] = useState(makeGrid(5));
    const [selectedColor, setSelectedColor] = useState(true);
    const [selectedCell, setSelectedCell] = useState(null);
    const [number, setNumber] = useState(null);
    const [blink, setBlink] = useState(true);
    const [enterNum, setEnterNum] = useState(false);
    const hold = useRef(grid);

    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         console.log("chek")

    //         if (e.key === 'a') {
    //             setSelectedColor(true)
    //         }

    //         else if (e.key === 's') {
    //             setSelectedColor(false)
    //         }

    //         else if (e.key >= '1' && e.key <= '9') {
    //             // setNumber(parseInt(e.key));
    //             if (selectedCell !== null) {
    //                 const newGrid = grid.map(row =>
    //                     [...row].map(cell =>
    //                         [...cell]
    //                     )
    //                 );
    //                 if (selectedCell[2]) {
    //                     newGrid[selectedCell[0]][selectedCell[1]][0] = parseInt(e.key);
    //                 }
    //                 else {
    //                     newGrid[selectedCell[0]][selectedCell[1]][1] = parseInt(e.key);
    //                 }
    //                 newGrid[row][col][1] = 0;
    //                 console.log("workssss")
    //                 setGrid(newGrid);
    //                 setBlink(false);
    //             }
    //         }
    //     };
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => window.removeEventListener('keydown', handleKeyDown);
    // }, []);

    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         console.log("check");
    //     };
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => window.removeEventListener('keydown', handleKeyDown);
    // }, []);




    // useEffect(() => {
    //     const keyDown = (e) => {
    //         setSelectedCell(prev => {
    //             console.log("selected value for key is ", prev, e.key)
    //             setGrid(pre => {
    //                 console.log(pre, "howwww")
    //             })
    //             const newGrid = grid.map(row =>
    //                 [...row].map(cell =>
    //                     [...cell]
    //                 )
    //             );
    //             if (grid !== null) {
    //                 console.log(selectedCell);
    //                 console.log(newGrid[prev[0]][prev[1]][0]);
    //                 newGrid[prev[0]][prev[1]][0] = 9;
    //                 setGrid(newGrid);
    //                 console.log(newGrid);
    //                 console.log("call1")

    //             }


    //             return prev;
    //         });
    //     };

    //     window.addEventListener('keydown', keyDown);
    //     return () => window.removeEventListener('keydown', keyDown);
    // }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.className === "select__black select__black--active" || e.target.className === 'select__white select__white--active') {
                return
            }
            else {
                console.log("yessssss")
                setSelectedCell(null);
            }

        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick); // Cleanup
    }, []);


    useEffect(() => {
        const handleKeyDown = (e) => {
            setSelectedCell(prev => {
                console.log(prev, "prev");

                console.log('Current cell value:', prev);
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



                return prev; // Or modify as needed
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []); // Empty array means this runs once on mount





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
        console.log("this one")
    };

    const clearGrid = () => {
        const newGrid = makeGrid(gridSize)
        setGrid(newGrid)
        hold.current = newGrid
        console.log("call2")

        setSelectedCell(null);
        console.log("this one")

    };

    const cellClick = (row, col, triangle = false, above = true) => {
        console.log(above);
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
            console.log("set")
            if (row !== hold.current[0].length - 1 || newGrid[row][col][1] === 0 || selectedColor) {
                if ((above && row !== hold.current[0].length - 1)) {
                    if (col !== hold.current[0].length - 1) {
                        setSelectedCell([row, col, false])

                    }
                    else {
                        setSelectedCell([row, col, true])

                    }
                }
                else {
                    if (col !== hold.current.length - 1) {
                        setSelectedCell([row, col, true])
                    }
                    else {
                        setSelectedCell([row, col, false])

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
        console.log("call3")




        // if (cellType === 'black') {
        //     newGrid[row][col] = newGrid[row][col] === 'black' ? 'white' : 'black';
        //     setGrid(newGrid);

        //     if (newGrid[row][col] === 'black') {
        //         setSelectedCell({ row, col });
        //         setSelectedDiagonal('top');
        //     } else {
        //         setSelectedCell(null);
        //         setSelectedDiagonal(null);
        //     }
        // } else {
        //     setSelectedCell(selectedCell?.row === row && selectedCell?.col === col ? null : { row, col });
        //     setSelectedDiagonal(null);
        // }
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

            <p className={`enter-num ${enterNum && "enter-num--show"}`}>Enter a number</p>


            <section className='choose'>
                <h2>Choose grid</h2>
                <div className='options'>
                    <button className={`option__button ${gridSize === 3 && "option__button--active"}`} onClick={() => sizeChange(3)}>3x3</button>
                    <button className={`option__button ${gridSize === 5 && "option__button--active"}`} onClick={() => sizeChange(5)}>5x5</button>
                    <button className={`option__button ${gridSize === 7 && "option__button--active"}`} onClick={() => sizeChange(7)}>7x7</button>
                </div>
            </section>






            <p className={`select-color select-color--hidden`}>Enter a number</p>















        </div >
    );
}

export default App;
