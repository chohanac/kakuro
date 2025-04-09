import React, { useState, useEffect, useRef } from 'react';
import './Grid.scss'
import { CalculationInterpolation } from 'sass';
import { supabase } from "../../Supabase";
function Grid({ gridList, solution, realGrid }) {
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
    const [hoverCell, setHoverCell] = useState(null);
    const [shouldRerender, setShouldRerender] = useState(false);
    const [mount, setMount] = useState(false);
    const unique = { 3: [{ 2: 12 }], 4: [{ 2: 13 }], 6: [{ 3: 123 }], 7: [{ 3: 124 }], 10: [{ 4: 1234 }], 11: [{ 4: 1235 }], 15: [{ 5: 12345 }], 16: [{ 2: 79 }, { 5: 12346 }], 17: [{ 2: 89 }], 21: [{ 6: 123456 }], 22: [{ 6: 123457 }], 23: [{ 3: 689 }], 24: [{ 3: 789 }], 28: [{ 7: 1234567 }], 29: [{ 4: 5789 }, { 7: 1234568 }], 30: [{ 4: 6789 }], 34: [{ 5: 46789 }], 35: [{ 5: 56789 }], 36: [{ 8: 12345678 }], 37: [{ 8: 12345679 }], 38: [{ 6: 356789 }, { 8: 12345689 }], 39: [{ 6: 456789 }, { 8: 12345789 }], 40: [{ 8: 12346789 }], 41: [{ 7: 2456789 }, { 8: 12356789 }], 42: [{ 7: 3456789 }, { 8: 12456789 }], 43: [{ 8: 13456789 }], 44: [{ 8: 23456789 }], 45: [{ 9: 123456789 }] };
    useEffect(() => {
        setSolved(false);
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
    const setMistakes = () => {
        const editgrid = realGrid.gridedit;
        let cellErrorArray = [...cellErrors];
        let duplicateArray = [...duplicates];
        let cellErrorArrayVertical = [...cellErrorsVertical];
        let duplicateArrayVertical = [...duplicatesVertical];
        const errorHandle = (arr, i, j, vertical = false) => {
            let target = editgrid[i][j][0];
            if (vertical) {
                target = editgrid[i][j][1];
            }
            const hasEmptyCell = arr.some(item => item[0] === -1);
            if (!hasEmptyCell) {
                let countNum = arr.reduce((acc, item) => acc + item[0], 0);
                if (countNum !== target) {
                    arr.forEach(item => {
                        if (vertical) {
                            cellErrorArrayVertical.push([item[1], item[2]])
                        }
                        else {
                            cellErrorArray.push([item[1], item[2]])
                        }
                    });
                }
            }
            const firstElementCheck = {};
            arr.forEach(item => {
                const firstElement = item[0];
                firstElementCheck[firstElement] = (firstElementCheck[firstElement] || 0) + 1;
            });
            const loggedPairs = {};
            arr.forEach(item => {
                const firstElement = item[0];
                const pair = `${item[1]},${item[2]}`;
                if (firstElementCheck[firstElement] > 1) {
                    if (!loggedPairs[firstElement]) {
                        loggedPairs[firstElement] = new Set();
                    }
                    if (!loggedPairs[firstElement].has(pair) && editgrid[item[1]][item[2]][0] !== -1) {
                        if (vertical) {
                            (grid[item[1], item[2]])
                            duplicateArrayVertical.push([item[1], item[2]]);
                        }
                        else {
                            duplicateArray.push([item[1], item[2]]);
                        }
                        loggedPairs[firstElement].add(pair);
                    }
                }
            });
        }
        for (let i = 0; i < editgrid.length; i++) {
            for (let j = 0; j < editgrid[i].length; j++) {
                if (editgrid[i][j][1] !== 0) {
                    if (editgrid[i][j][0] !== -1) {
                        let length = editgrid.length;
                        let arr = [];
                        for (let m = i + 1; m < editgrid.length; m++) {
                            if (editgrid[m][j][1] === 0) {
                                arr.push([editgrid[m][j][0], m, j]);
                            }
                            else {
                                break
                            }
                        }
                        errorHandle(arr, i, j)
                    }
                }
            }
        }
        for (let i = 0; i < editgrid.length; i++) {
            for (let j = 0; j < editgrid[i].length; j++) {
                if (editgrid[i][j][1] !== 0) {
                    if (editgrid[i][j][1] !== -1) {
                        let length = editgrid.length;
                        let arr = [];
                        for (let m = j + 1; m < editgrid.length; m++) {
                            if (editgrid[i][m][1] === 0) {
                                arr.push([editgrid[i][m][0], i, m]);
                            }
                            else {
                                break
                            }
                        }
                        errorHandle(arr, i, j, true)
                    }
                }
            }
        }
        setDuplicates(duplicateArray);
        setCellErrors(cellErrorArray);
        setDuplicatesVertical(duplicateArrayVertical);
        setCellErrorsVertical(cellErrorArrayVertical);
    }
    useEffect(() => {
        if (realGrid && realGrid.gridedit && !mount) {
            setMistakes();
            setMount(true)
        }
    }, [realGrid]);
    function makeGrid() {
        if (realGrid) {
            return realGrid.gridedit;
        }
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
        return blankGrid;
    };
    function compareGrids(grid1, grid2) {
        const differences = [];

        for (let i = 0; i < grid1.length; i++) {
            for (let j = 0; j < grid1[i].length; j++) {
                for (let k = 0; k < grid1[i][j].length; k++) {
                    if (grid1[i][j][k] !== grid2[i][j][k]) {
                        differences.push(i, j);
                    }
                }
            }
        }
        return differences;
    }
    function gridChanges(name) {
        const channel = supabase
            .channel('grid-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'gridrealtime',
                    filter: `name=eq.${name}`,
                },
                (payload) => {
                    const info = payload.new.gridedit;
                    const difference = compareGrids(info, gridInfo.current);
                    if (difference.length !== 0) {
                        checkMistakes(info, { row: difference[0], col: difference[1], triangle: false })
                        checkMistakes(info, { row: difference[0], col: difference[1], triangle: false }, true)
                    }
                    setGrid(info)
                    gridInfo.current = info;
                    if (checkSolution(gridInfo.current, gridList)) {
                        setSelectedCell(null);
                        setSolved(true);
                    }
                    else {
                        setSolved(false);
                    }
                }
            )
            .subscribe();
        channel.on('subscribed', () => {
        });
        channel.on('CHANNEL_ERROR', (error) => {
            console.error(error);
        });
        channel.on('RECONNECTING', () => {
            console.log('reconnecting');
        });
        channel.on('RECONNECTED', () => {
            console.log('reconnected');
        });
        channel.on('CLOSED', () => {
            console.log('closed');
        });
    }
    if (realGrid) {
        gridChanges(realGrid.name);
    }
    async function updateGridEdit(name, gridData) {
        const serializedData = JSON.stringify(gridData);
        const { data, error } = await supabase
            .from('gridrealtime')
            .update({ gridedit: serializedData })
            .eq('name', name);

        if (error) {
            console.error('Error updating gridEdit:', error);
        }
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'gridrealtime',
                    filter: `name=eq.${name}`,
                },
                (payload) => {
                }
            )
            .subscribe();
        channel.on('SUBSCRIBED', () => {
            console.log("subscribe");
        });

        channel.on('CHANNEL_ERROR', (error) => {
            console.error(error);
        });

        channel.on('RECONNECTING', () => {
            console.log("reconnect");
        });

        channel.on('RECONNECTED', () => {
            console.log("reconnect");
        });

        channel.on('CLOSED', () => {
            console.log("close");
        });
    }
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
    const checkMistakes = (grid, selected, vertical = false) => {
        let start = -1;
        let end = grid.length;
        let err = true;
        const arr = [];
        let errArr = [];
        const cells = [];
        let duplicateArray = [...duplicates];
        let cellErrorArray = [...cellErrors];
        if (vertical) {
            duplicateArray = [...duplicatesVertical];
            cellErrorArray = [...cellErrorsVertical];
        }
        let count = 0;
        let value = -1;
        function loop(start, condition, step) {
            for (let i = start; condition(i); i += step) {
                const cell = vertical ? grid[selected.row][i] : grid[i][selected.col];
                duplicateArray = duplicateArray.filter((item) => {
                    return vertical ? !(item[0] === selected.row && item[1] === i) : !(item[0] === i && item[1] === selected.col);
                });
                cellErrorArray = cellErrorArray.filter((item) => {
                    return vertical ? !(item[0] === selected.row && item[1] === i) : !(item[0] === i && item[1] === selected.col);
                });
                if (cell[1] !== 0) {
                    if (value === -1) {
                        value = vertical ? cell[1] : cell[0];
                    }
                    return i;
                } else if (cell[0] === -1) {
                    err = false;
                } else {
                    count += cell[0];
                    cells.push(vertical ? [selected.row, i, cell[0]] : [i, selected.col, cell[0]]);
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
        if (grid[selected.row][selected.col][1] === 0 && grid[selected.row][selected.col][0] === -1) {
            duplicateArray = duplicateArray.filter((item) => {
                return !(item[0] === selected.row && item[1] === selected.col);
            });
            err = false;
        }
        if (value === -1 || count === value) {
            err = false
        }
        if (start !== -1 && err) {
            for (let j = start; j < end; j++) {

            }
        }
        if (start !== -1 && err) {
            for (let j = start; j < end; j++) {
                if (vertical) {
                    if (grid[selected.row][j][1] === 0) {
                        cellErrorArray.push([selected.row, j])
                    }
                }
                else {
                    if (grid[j][selected.col][1] === 0) {
                        cellErrorArray.push([j, selected.col])
                    }
                }

            }
        }
        if (vertical) {
            setDuplicatesVertical(duplicateArray);
            setCellErrorsVertical(cellErrorArray);
        }
        else {
            setDuplicates(duplicateArray);
            setCellErrors(cellErrorArray);
        }
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
                checkMistakes(newGrid, selectedCell);
                checkMistakes(newGrid, selectedCell, true);
            }
            if (newGrid[selectedCell.row][selectedCell.col][1] === 0) {
                newGrid[selectedCell.row][selectedCell.col][0] = key;
                checkMistakes(newGrid, selectedCell);
                checkMistakes(newGrid, selectedCell, true);
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
            if (realGrid) {
                updateGridEdit(realGrid.name, gridInfo.current);
            }
            if (checkSolution(gridInfo.current, gridList)) {
                setSolved(true);
            }
            else {
                setSolved(false);
            }
        }
    }
    const checkUnique = (row, col) => {
        let length = 0;
        let lengthVertical = 0;
        const uniqueNums = [-1, -1];
        if (grid[row][col][0] !== -1) {
            while (row + length + 1 < grid.length && grid[row + length + 1][col][1] === 0) {
                length++;
            }
        }
        if (grid[row][col][1] !== -1)

            while (col + lengthVertical + 1 < grid[row].length && grid[row][col + lengthVertical + 1][1] === 0) {
                lengthVertical++;
            }
        const isUnique = (sum, length) => {
            let num = -1
            unique[sum]?.map(i => {
                if (i[length]) {
                    num = i[length];
                }
            })
            return num;
        }
        return ([isUnique(grid[row][col][0], length), isUnique(grid[row][col][1], lengthVertical)])
    }
    const cellClasses = (row, col) => {
        const classes = ['grid__cell'];
        if (grid[row][col][1] === 0 && solved) {

            classes.push('grid__cell--solved');

        }
        if (grid[row][col][1] === 0 && solution) {
            classes.push('grid__cell--solution');

        }
        if (duplicates.some(([x, y]) => x === row && y === col)) {
            classes.push('grid__cell--duplicate');
        }
        if (duplicatesVertical.some(([x, y]) => x === row && y === col)) {
            classes.push('grid__cell--duplicate');

        }
        if (cellErrors.some(([x, y]) => x === row && y === col)) {
            classes.push('grid__cell--errors');
        }
        if (cellErrorsVertical.some(([x, y]) => x === row && y === col)) {

            classes.push('grid__cell--errors');

        }
        if (selectedCell !== null && selectedCell.row === row && selectedCell.col === col && !selectedCell.triangle && grid[row][col][1] !== 0) {
            classes.push('grid__cell--selected-tri');
        }
        if (grid[0].length === row + 1 && grid[row][col][1] !== 0) {
            classes.push('grid__cell--grey');
        }
        if (grid[row][col][1] === 0) {
            classes.push('grid__cell--white');
            if (hoverCell) {
                let length = grid.length;
                if (checkUnique(hoverCell.row, hoverCell.col)[0] !== -1) {

                    for (let i = hoverCell.row + 1; i < grid.length; i++) {
                        if (grid[i][hoverCell.col][1] !== 0) {
                            length = i;
                            break
                        }
                    }
                    if (hoverCell.triangle && hoverCell.bounds) {
                        if (hoverCell.col === col) {
                            if (row > hoverCell.row && row < length) {
                                classes.push("grid__cell--hover-active");
                            }
                        }
                    }
                }
                if (checkUnique(hoverCell.row, hoverCell.col)[1] !== -1) {
                    length = grid.length
                    for (let i = hoverCell.col + 1; i < grid.length; i++) {
                        if (grid[hoverCell.row][i][1] !== 0) {
                            length = i;
                            break
                        }
                    }
                    if (!hoverCell.triangle && hoverCell.bounds) {
                        if (hoverCell.row === row) {
                            if (col > hoverCell.col && col < length) {
                                classes.push("grid__cell--hover-active");
                            }
                        }
                    }
                }
            }
        }
        else {
            classes.push('grid__cell--target');

            if (checkUnique(row, col)[0] !== -1) {
                classes.push('grid__cell--unique')
            }
        }
        if (selectedCell !== null && selectedCell.row === row && selectedCell.col === col && grid[row][col][1] === 0) {
            classes.push('grid__cell--selected');
        }
        return classes.join(' ');
    };
    const cellNumberClasses = (row, col) => {
        const classes = ['grid__cell-number'];
        if (grid[row][col][1] === 0) {
            classes.push('grid__cell-number--center');
            if (grid[row][col][0] === -1) {
                classes.push('grid__cell-number--hidden');
            }
        } else if (grid[row][col][1] !== 0 && grid[row][col][0] === -1) {
            classes.push('grid__cell-number--hidden');
        }
        if (selectedCell !== null && selectedCell.row === row && selectedCell.col === col && selectedCell.triangle === false) {
            classes.push('grid__cell-number--selected');
            if (gridInfo.current[row][col][1] === 0) {
                classes.push('grid__cell-number--selected--dark');
            }
            if (blink) {
                classes.push('grid__cell-number--selected--blink');
            }
        }

        return classes.join(' ');
    };
    const TriangleClasses = (row, col) => {
        const classes = ['grid__triangle'];
        if (selectedCell !== null && selectedCell.row === row && selectedCell.col === col && selectedCell.triangle === true) {
            classes.push('grid__triangle--selected');
        }
        if (grid[row][col][1] === 0) {
            classes.push('grid__triangle--hidden');
        }
        if (grid.length === col + 1) {
            classes.push('grid__triangle--grey');
        }
        if (checkUnique(row, col)[1] !== -1) {
            classes.push('grid__triangle--uniqueVertical')
        }
        return classes.join(' ');
    };
    const RightArrowClasses = (row, col) => {
        const classes = ['grid__arrow-right'];
        if (grid[row][col][1] === 0 || grid[row][col][0] === -1) {
            classes.push('grid__arrow-right--hidden');
        }
        if (grid[0].length === row + 1) {
            classes.push('grid__arrow-right--hidden');
        }
        if (selectedCell !== null && selectedCell.row === row && selectedCell.col === col && selectedCell.triangle === false) {
            classes.push('grid__arrow-right--selected');
        }
        return classes.join(' ');
    };
    const TriangleNumberClasses = (row, col) => {
        const classes = ['grid__triangle-number'];
        if (grid[row][col][1] === 0 || grid[row][col][1] === -1) {
            classes.push('grid__triangle-number--hidden');
        }
        if (selectedCell !== null && selectedCell.row === row && selectedCell.col === col && selectedCell.triangle === true) {
            classes.push('grid__triangle-number--selected');
            if (blink) {
                classes.push('grid__triangle-number--selected--blink');
            }
        }
        return classes.join(' ');
    };
    const DownArrowClasses = (row, col) => {
        const classes = ['grid__arrow-down'];
        if (grid[row][col][1] === 0 || grid[row][col][1] === -1) {
            classes.push('grid__arrow-down--hidden');
        }
        if (grid.length === col + 1) {
            classes.push('grid__arrow-down--hidden');
        }
        if (selectedCell !== null && selectedCell.row === row && selectedCell.col === col && selectedCell.triangle === true) {
            classes.push('grid__arrow-down--selected');
        }
        return classes.join(' ');
    };
    const mouseEnter = (row, col, triangle, bounds) => {
        setHoverCell({ row, col, triangle, bounds })
    };
    const mouseLeave = () => {
        setHoverCell(null)
    };
    return (
        <div className='gridPage' >
            <section className={`grid ${solved && "grid--solved"}`}>
                <div className='grid__container'>
                    {grid.map((row, rowIndex) => (<div key={rowIndex} className='grid__row'>{row.map((cell, cellIndex) => (
                        <div tabIndex="0" onKeyDown={gridKeyPress} key={cellIndex} className={cellClasses(rowIndex, cellIndex)} onClick={(e) => {
                            e.stopPropagation();
                            const square = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - square.left;
                            const y = e.clientY - square.top;
                            cellClick(rowIndex, cellIndex, false, x > y)

                        }}
                            onMouseMove={(e) => {
                                e.stopPropagation();
                                const square = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - square.left;
                                const y = e.clientY - square.top;
                                mouseEnter(rowIndex, cellIndex, x > y, x <= 100 && y <= 100)
                            }
                            }
                            onMouseLeave={() => mouseLeave()}>
                            <span className={cellNumberClasses(rowIndex, cellIndex)}>{cell[0]}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={RightArrowClasses(rowIndex, cellIndex)}>
                                <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                            </svg>
                            <svg
                                viewBox="0 0 200 200"
                                className={TriangleClasses(rowIndex, cellIndex)}
                                preserveAspectRatio="none" onClick={(e) => {
                                    e.stopPropagation();
                                    cellClick(rowIndex, cellIndex, true)
                                }}
                                onMouseEnter={() => mouseEnter(rowIndex, cellIndex, true)}
                                onMouseLeave={() => mouseLeave()}
                            >
                                <path
                                    d="M 0 0 L 200 200 L 200 200 Z"
                                    fill="#ff6b6b"
                                    stroke="black"
                                    strokeWidth="2"
                                />
                            </svg>
                            <span className={TriangleNumberClasses(rowIndex, cellIndex)} onClick={(e) => {
                                e.stopPropagation();
                                cellClick(rowIndex, cellIndex, true)
                            }} >{cell[1]}</span>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={DownArrowClasses(rowIndex, cellIndex)} onClick={(e) => {
                                e.stopPropagation();
                                cellClick(rowIndex, cellIndex, true)
                            }}>
                                <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                            </svg>
                            <div className={`grid__unique ${solution && "grid__unique--hide"}`}>
                                {
                                    checkUnique(rowIndex, cellIndex)[0] !== -1 && grid[rowIndex][cellIndex][1] !== 0 && checkUnique(rowIndex, cellIndex)[0].toString().split("").map((i, index) => (
                                        <div
                                            key={index}
                                            className={`grid__cell grid__unique-cell ${hoverCell?.row === rowIndex && hoverCell?.col === cellIndex && hoverCell?.triangle && hoverCell?.bounds && "grid__unique-cell--show"}`}
                                            style={{
                                                '--delay': `${index * 0.1}s`,
                                                '--distance': `${index}`
                                            }}
                                        >
                                            {i}
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                checkUnique(rowIndex, cellIndex)[1] !== -1 && grid[rowIndex][cellIndex][1] !== 0 && checkUnique(rowIndex, cellIndex)[1].toString().split("").map((i, index) => (
                                    <div
                                        key={index}
                                        className={`grid__cell grid__unique-cell grid__unique-cell--vertical ${hoverCell?.row === rowIndex && hoverCell?.col === cellIndex && !hoverCell?.triangle && hoverCell?.bounds && "grid__unique-cell--vertical--show"}`}
                                        style={{
                                            '--delay': `${index * 0.1}s`,
                                            '--distance': `${index}`
                                        }}
                                    >
                                        {i}
                                    </div>
                                ))
                            }
                        </div>
                    ))}</div>))}
                </div>
            </section >
        </div >
    );
}
export default Grid;




