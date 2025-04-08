import React, { useState, useEffect, useRef } from 'react';
import './CreateGrid.scss'
import { supabase } from "../../Supabase";
function CreateGrid() {
    const [gridSize, setGridSize] = useState(5);
    const [grid, setGrid] = useState(makeGrid(5));
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
    const [entername, setEnterName] = useState('');

    useEffect(() => {

        const keyDownPress = (e) => {

            if (e.key === 'a') {
                setSelectedColor(true)
            }
            else if (e.key === 's') {
                setSelectedColor(false)
            }
        }
        window.addEventListener('keydown', keyDownPress);
        return () => window.removeEventListener('keydown', keyDownPress);
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
        clearGrid()
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
    const cellClick = (row, col, triangle = false, above = true) => {
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
        if (value === -1 || count === value) {
            err = false
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
                        return !((item[0] === selected.row && item[1] === i))
                    }
                );
                cellErrorArray = cellErrorArray.filter(
                    (item) => !(item[0] === selected.row && item[1] === i)
                );
                if (cell[1] !== 0) {
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
        setDuplicatesVertical(duplicateArray)
        if (value === -1 || count === value) {
            err = false
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

    async function insertData(b) {
        const { data, error } = await supabase
            .from('grids')
            .insert([
                { grid: b, size: b.length }
            ]);
    }
    async function fetchGrids(size) {
        const { data, error } = await supabase
            .from('grids')
            .select('*')
            .eq('size', size);

        if (error) {
            console.error('Error retrieving grids with size 3:', error);
        } else {
            setGridList(data[0].grid);
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('grids')
            .select('name')
            .eq('name', entername)
        if (data.length === 0) {

            const { data, error } = await supabase
                .from('grids')
                .insert([
                    { name: entername, grid: JSON.stringify(gridInfo.current), size: gridInfo.current.length }
                ]);
            if (error) {
                console.error(error);
                return;
            }
            // navigate(`/${entername}`);
        }
        else {
            console.log("already exists")
        }
    };





    const gridKeyPress = (e) => {

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
            // console.log(JSON.stringify(newGrid));
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
                        <div tabIndex="0" onKeyDown={gridKeyPress} key={cellIndex} className={`grid__cell ${duplicates.some(([x, y]) => x === rowIndex && y === cellIndex) ? "grid__cell--duplicate" : ""
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
            <p className={`enter-num ${enterNum && "enter-num--show"}`}>Enter a number</p>
            <section className='choose'>
                <div className='options'>
                    <p>Choose grid</p>
                    <button className={`option__button ${gridSize === 3 && "option__button--active"}`} onClick={() => sizeChange(3)}>3x3</button>
                    <button className={`option__button ${gridSize === 5 && "option__button--active"}`} onClick={() => sizeChange(5)}>5x5</button>
                    <button className={`option__button ${gridSize === 8 && "option__button--active"}`} onClick={() => sizeChange(7)}>7x7</button>
                    <button className={`option__button ${gridSize === 10 && "option__button--active"}`} onClick={() => sizeChange(9)}>9x9</button>
                </div>
                <button className={`choose__button`} onClick={() => clearGrid()}>Clear Grid</button>

            </section>
            <p className={`select-color select-color--hidden`}>Enter a number</p>

            <form onSubmit={handleSubmit}>
                <label>
                    Enter a name:
                    <input
                        type="text"
                        value={entername}
                        onChange={(e) => setEnterName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">
                    Submit
                </button>
            </form>
        </div >
    );
}

export default CreateGrid;
