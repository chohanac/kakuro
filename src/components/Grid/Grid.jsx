
import React, { useState, useEffect, useRef } from 'react';
import './Grid.scss'

function Grid({ gridList, solution }) {
    // let gridList = [[[1, 0], [-1, 0], [2, -1], [-1, 0], [4, -1]], [[-1, 0], [3, 0], [5, 0], [-1, 0], [3, 0]], [[4, 0], [-1, 0], [6, 0], [6, 0], [-1, 0]], [[3, 4], [4, 0], [-1, 0], [3, 0], [-1, 0]], [[-1, 0], [-1, 1], [5, 0], [-1, 0], [-1, 0]]]

    let gridLista = [[[-1, -1], [16, -1], [12, -1]], [[-1, 15], [7, 0], [8, 0]], [[-1, 13], [9, 0], [4, 0]]];


    const [gridSize, setGridSize] = useState(5);
    const [grid, setGrid] = useState(makeGrid());
    const [selectedColor, setSelectedColor] = useState(true);
    const [selectedCell, setSelectedCell] = useState(null);
    const [number, setNumber] = useState(null);
    const [blink, setBlink] = useState(true);
    const [enterNum, setEnterNum] = useState(false);
    const gridInfo = useRef(grid);
    const [cellErrors, setCellErrors] = useState([]);
    const [cellErrorsVertical, setCellErrorsVertical] = useState([]);
    const [duplicates, setDuplicates] = useState([]);
    const [duplicatesVertical, setDuplicatesVertical] = useState([]);
    const [solved, setSolved] = useState(false);


    useEffect(() => {
        clearGrid()
    }, [gridList]);

    useEffect(() => {
        if (solution) {
            setGrid(gridList);
        }
        else {
            setGrid(gridInfo.current);
        }
    }, [solution]);


    // useEffect(() => {
    //     const handleClick = (e) => {
    //         if (e.target.className === "select__black select__black--active" || e.target.className === 'select__white select__white--active') {
    //             return
    //         }
    //         else {
    //             setSelectedCell(null);
    //         }

    //     };
    //     document.addEventListener('click', handleClick);
    //     return () => document.removeEventListener('click', handleClick); // Cleanup
    // }, []);





    function makeGrid() {
        // console.log(gridList)
        const size = gridList.length
        let grid = [];
        let row = [];
        for (let i = 0; i < size; i++) {
            row.push([-1, 0])
        }
        for (let j = 0; j < size; j++) {
            grid.push(row);
        }
        let blankGrid = gridList.map(arr => arr.map(item => [...item]));
        blankGrid = blankGrid.map(arr =>
            arr.map(item => {
                if (item[1] === 0) {
                    item[0] = -1;
                }
                return item;
            })
        );
        // console.log(gridList)
        // console.log(blankGrid)
        return blankGrid;
        // return gridList;

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
        setCellErrors([]);
        setCellErrorsVertical([])
        setDuplicates([])
        setDuplicatesVertical([])

    };


    const isValidKey = (key, selected, grid) => {
        if ((key >= '0' && key <= '9') || key === "Backspace" && selected) {
            if (!(grid[selected.row][selected.col][1] === 0 && key === "0") && !(grid[selected.row][selected.col][0] === -1 && !selected.triangle && key === "0") && !(grid[selected.row][selected.col][1] === -1 && selected.triangle && key === "0")) {
                return true
            }
        }
        return false
    }



    // const checkRowError () => { }


    const cellClick = (row, col, triangle = false, above = true) => {
        if (gridInfo.current[row][col][1] !== 0 || solution) {
            if (solution) {
                setSelectedCell(null);
            }
            return
        }
        const newGrid = gridInfo.current.map(row =>
            [...row].map(cell =>
                [...cell]
            )
        );
        setBlink(true)
        if (triangle) {
            if (col !== gridInfo.current.length - 1 || selectedColor) {
                setSelectedCell({ row, col, triangle: true })
            }
        }
        else {
            if (row !== gridInfo.current[0].length - 1 || newGrid[row][col][1] === 0 || selectedColor) {
                if ((above && row !== gridInfo.current[0].length - 1)) {

                    if (row !== gridInfo.current[0].length - 1) {
                        setSelectedCell({ row, col, triangle: false })

                    }
                    else if (col !== gridInfo.current.length - 1) {
                        setSelectedCell({ row, col, triangle: true })

                    }
                    else {
                        setSelectedCell(null)
                    }

                }
                else {

                    if (col !== gridInfo.current.length - 1) {
                        setSelectedCell({ row, col, triangle: true })
                    }
                    else if (row !== gridInfo.current[0].length - 1) {
                        setSelectedCell({ row, col, triangle: false })

                    }
                    else if (col === row) {
                        setSelectedCell({ row, col, triangle: false })

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
    };

    function checkSolution(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
                if (!checkSolution(arr1[i], arr2[i])) {
                    return false;
                }
            } else {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
        }
        return true;
    }


    const colorClick = (white) => {
        if (white) {
            setSelectedColor(true);
        }
        else {
            setSelectedColor(false);
        }
    }

    const checkDuplicatesHorizontal = (grid, selected) => {
        let start = -1;
        let end = grid.length;
        let err = true;
        const arr = [];
        let errArr = [];
        const cells = [];
        let duplicateArray = [...duplicates];
        let cellErrorArray = [...cellErrors];
        let count = 0;
        let value = -1;
        function loop(start, condition, step) {
            for (let i = start; condition(i); i += step) {
                const cell = grid[i][selected.col];
                duplicateArray = duplicateArray.filter(
                    (item) => !(item[0] === i && item[1] === selected.col)
                );
                duplicateArray = duplicateArray.filter(
                    (item) => {
                        // if (item[0] === selected.row && item[1] === selected.col) {
                        //     return item
                        // }
                        return !((item[0] === i && item[1] === selected.col))
                    }
                );
                cellErrorArray = cellErrorArray.filter(
                    (item) => !(item[0] === i && item[1] === selected.col)
                );
                if (cell[1] !== 0) {


                    if (value === -1) {
                        value = cell[0]
                    }



                    return i;
                } else if (cell[0] === -1) {
                    err = false;
                } else {
                    count += cell[0];

                    cells.push([i, selected.col, cell[0]]);
                }
            }
            return null;
        }
        start = loop(selected.row, i => i >= 0, -1) ?? start;
        end = loop(selected.row + 1, i => i < grid.length, 1) ?? end;
        const result = cells.filter((item, index, array) =>
            array.some((otherItem, otherIndex) => otherIndex !== index && otherItem[2] === item[2])
        );

        result.forEach((i, j) => {
            duplicateArray.push([i[0], i[1]]);
        }
        )
        setDuplicates(duplicateArray)
        console.log("horzontal", value);
        if (value === -1 || count === value) {
            err = false
        }



        if (result.length !== 0) {
            err = true
        }



        if (start !== -1 && err) {
            for (let j = start; j < end; j++) {
                if (grid[j][selected.col][1] === 0) {
                    cellErrorArray.push([j, selected.col])
                }
            }
        }
        setCellErrors(cellErrorArray);
    }

    const checkDuplicatesVertical = (grid, selected) => {
        console.log("hi");
        let start = -1;
        let end = grid.length;
        let err = true;
        const arr = [];
        let errArr = [];
        const cells = [];
        let duplicateArray = [...duplicatesVertical];
        let cellErrorArray = [...cellErrorsVertical];
        let count = 0;
        let value = -1;
        function loop(start, condition, step) {
            for (let i = start; condition(i); i += step) {
                const cell = grid[selected.row][i];
                duplicateArray = duplicateArray.filter(
                    (item) => {
                        // if (item[0] === selected.row && item[1] === selected.col) {
                        //     return item
                        // }
                        return !((item[0] === selected.row && item[1] === i))
                    }
                );
                cellErrorArray = cellErrorArray.filter(
                    (item) => !(item[0] === selected.row && item[1] === i)
                );
                if (cell[1] !== 0) {
                    console.log(cell[1], "cell2");
                    if (value === -1) {
                        value = cell[1]
                    }
                    return i;
                } else if (cell[0] === -1) {
                    err = false;
                } else {
                    count += cell[0];

                    cells.push([selected.row, i, cell[0]]);
                }
            }
            return null;
        }
        start = loop(selected.col, i => i >= 0, -1) ?? start;
        end = loop(selected.col + 1, i => i < grid.length, 1) ?? end;
        const result = cells.filter((item, index, array) =>
            array.some((otherItem, otherIndex) => otherIndex !== index && otherItem[2] === item[2])
        );
        result.forEach((i, j) => {
            duplicateArray.push([i[0], i[1]]);
        }
        )
        console.log(count, "countVert", value);
        setDuplicatesVertical(duplicateArray)
        if (value === -1 || count === value) {
            err = false
        }
        if (result.length !== 0) {
            err = true
        }
        if (start !== -1 && err) {
            for (let j = start; j < end; j++) {
                if (grid[selected.row][j][1] === 0) {
                    cellErrorArray.push([selected.row, j])
                }
            }
        }
        setCellErrorsVertical(cellErrorArray);
        return
    }





    const gridKeyPress = (e) => {
        if (solution) {
            return
        }
        e.stopPropagation();

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
        else if (isValidKey(e.key, selectedCell, newGrid)) {
            let key = parseInt(e.key);
            if (e.key === "Backspace") {
                key = -1;
                checkDuplicatesHorizontal(newGrid, selectedCell);
                checkDuplicatesVertical(newGrid, selectedCell);


            }
            if (newGrid[selectedCell.row][selectedCell.col][1] === 0) {
                newGrid[selectedCell.row][selectedCell.col][0] = key;
                checkDuplicatesHorizontal(newGrid, selectedCell);
                checkDuplicatesVertical(newGrid, selectedCell);
            }
            else if (selectedCell.row === newGrid.length - 1 && selectedCell.col === newGrid.length - 1) {
                return;
            }
            else if (!selectedCell.triangle) {
                if (newGrid[selectedCell.row][selectedCell.col][0] === -1) {
                    newGrid[selectedCell.row][selectedCell.col][0] = key;
                }
                else if (newGrid[selectedCell.row][selectedCell.col][0] < 10) {
                    let num = parseInt(`${newGrid[selectedCell.row][selectedCell.col][0]}${key}`);

                    if (key === -1) {
                        num = -1;
                    }
                    newGrid[selectedCell.row][selectedCell.col][0] = num;
                }
                else if (key == -1) {
                    newGrid[selectedCell.row][selectedCell.col][0] = parseInt((newGrid[selectedCell.row][selectedCell.col][0] + "")[0]);
                }
            }
            else {
                if (newGrid[selectedCell.row][selectedCell.col][1] === -1) {
                    newGrid[selectedCell.row][selectedCell.col][1] = key;
                }
                else if (newGrid[selectedCell.row][selectedCell.col][1] < 10) {
                    let num = parseInt(`${newGrid[selectedCell.row][selectedCell.col][1]}${key}`);
                    if (key === -1) {
                        num = -1;
                    }
                    newGrid[selectedCell.row][selectedCell.col][1] = num;
                }
                else if (key == -1) {
                    newGrid[selectedCell.row][selectedCell.col][1] = parseInt((newGrid[selectedCell.row][selectedCell.col][1] + "")[0]);
                }
            }
            setGrid(newGrid);
            gridInfo.current = newGrid;
            if (checkSolution(gridInfo.current, gridList)) {
                setSolved(true);
            }
            else {
                setSolved(false);
            }
            // console.log(JSON.stringify(gridInfo.current));
            // console.log(JSON.stringify(gridList), "how");

        }
    }
    return (
        <div className='gridPage'>
            <section className='grid'>
                <div className='grid__container'>
                    {grid.map((row, rowIndex) => (<div key={rowIndex} className='grid__row'>{row.map((cell, cellIndex) => (
                        <div tabIndex="0" onKeyDown={gridKeyPress} key={cellIndex} className={`grid__cell ${grid[rowIndex][cellIndex][1] === 0 && solved && "grid__cell--solved"} ${grid[rowIndex][cellIndex][1] === 0 && solution && "grid__cell--solution"}  ${duplicates.some(([x, y]) => x === rowIndex && y === cellIndex) ? "grid__cell--duplicate" : ""
                            } ${duplicatesVertical.some(([x, y]) => x === rowIndex && y === cellIndex) ? "grid__cell--duplicate" : ""
                            } ${cellErrors.some(([x, y]) => x === rowIndex && y === cellIndex) ? "grid__cell--errors" : ""
                            }  ${cellErrorsVertical.some(([x, y]) => x === rowIndex && y === cellIndex) ? "grid__cell--errors" : ""
                            } ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === false && grid[rowIndex][cellIndex][1] != 0 && "grid__cell--selected-tri"} ${grid[0].length === rowIndex + 1 && grid[rowIndex][cellIndex][1] !== 0 && "grid__cell--grey"} ${grid[rowIndex][cellIndex][1] == 0 && "grid__cell--white"}  ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && grid[rowIndex][cellIndex][1] == 0 && "grid__cell--selected"}`} onClick={(e) => {
                                e.stopPropagation();
                                const square = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - square.left;
                                const y = e.clientY - square.top;
                                cellClick(rowIndex, cellIndex, false, x > y)
                            }}>  <span className={`grid__cell-number   ${grid[rowIndex][cellIndex][1] === 0 && "grid__cell-number--center"} ${(grid[rowIndex][cellIndex][1] === 0 && grid[rowIndex][cellIndex][0] === -1) && "grid__cell-number--hidden"} ${(grid[rowIndex][cellIndex][1] !== 0 && grid[rowIndex][cellIndex][0] === -1) && "grid__cell-number--hidden"}  ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === false && "grid__cell-number--selected"}
                        ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === false && gridInfo.current[rowIndex][cellIndex][1] === 0 && "grid__cell-number--selected--dark"} ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === false && blink && "grid__cell-number--selected--blink"}`}>{cell[0]}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`grid__arrow-right ${(grid[rowIndex][cellIndex][1] === 0 || grid[rowIndex][cellIndex][0] === -1) && "grid__arrow-right--hidden"} ${grid[0].length === rowIndex + 1 && "grid__arrow-right--hidden"} ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === false && "grid__arrow-right--selected"}  `}>
                                <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                            </svg>
                            <svg
                                viewBox="0 0 200 200"
                                className={`grid__triangle ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === true && "grid__triangle--selected"} ${(grid[rowIndex][cellIndex][1] === 0) && "grid__triangle--hidden"}  ${grid.length === cellIndex + 1 && "grid__triangle--grey"}`}
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
                            <span className={`grid__triangle-number ${(grid[rowIndex][cellIndex][1] === 0 || grid[rowIndex][cellIndex][1] === -1) && "grid__triangle-number--hidden"} ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === true && "grid__triangle-number--selected"} ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === true && blink && "grid__triangle-number--selected--blink"}`} onClick={(e) => {
                                e.stopPropagation();
                                cellClick(rowIndex, cellIndex, true)
                            }} >{cell[1]}</span>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`grid__arrow-down ${(grid[rowIndex][cellIndex][1] === 0 || grid[rowIndex][cellIndex][1] === -1) && "grid__arrow-down--hidden"}  ${grid.length === cellIndex + 1 && "grid__arrow-down--hidden"} ${selectedCell !== null && selectedCell.row === rowIndex && selectedCell.col === cellIndex && selectedCell.triangle === true && "grid__arrow-down--selected"} `} onClick={(e) => {
                                e.stopPropagation();
                                cellClick(rowIndex, cellIndex, true)
                            }}>
                                <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                            </svg>
                        </div>
                    ))}</div>))}
                </div>
            </section >

        </div >
    );
}

export default Grid;
