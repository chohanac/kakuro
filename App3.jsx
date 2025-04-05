import React, { useState, useEffect } from 'react';

function App() {
    const [gridSize, setGridSize] = useState(5);
    const [grid, setGrid] = useState(createGrid(5));
    const [numbers, setNumbers] = useState(createNumberGrid(5));
    const [cellType, setCellType] = useState('black');
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedDiagonal, setSelectedDiagonal] = useState(null);

    function createGrid(size) {
        let grid = [];
        let row = [];
        for (let i = 0; i < size; i++) {
            row.push([0, 0])
        }
        for (let j = 0; j < size; j++) {

            grid.push(row);
        }
        return (Array(size).fill().map(() => Array(size).fill('white')))
    }

    function createNumberGrid(size) {
        return Array(size).fill().map(() => Array(size).fill({ top: '', bottom: '' }));
    }

    const handleSizeChange = (size) => {
        setGridSize(size);
        setGrid(createGrid(size));
        setNumbers(createNumberGrid(size));
        setSelectedCell(null);
        setSelectedDiagonal(null);
    };

    const clearGrid = () => {
        setGrid(createGrid(gridSize));
        setNumbers(createNumberGrid(gridSize));
        setSelectedCell(null);
        setSelectedDiagonal(null);
    };

    const handleCellClick = (row, col) => {
        const newGrid = grid.map(r => [...r]);

        if (cellType === 'black') {
            newGrid[row][col] = newGrid[row][col] === 'black' ? 'white' : 'black';
            setGrid(newGrid);

            if (newGrid[row][col] === 'black') {
                setSelectedCell({ row, col });
                setSelectedDiagonal('top');
            } else {
                setSelectedCell(null);
                setSelectedDiagonal(null);
            }
        } else {
            setSelectedCell(selectedCell?.row === row && selectedCell?.col === col ? null : { row, col });
            setSelectedDiagonal(null);
        }
    };

    const handleDiagonalClick = (row, col, diagonal, e) => {
        e.stopPropagation();
        setSelectedCell({ row, col });
        setSelectedDiagonal(diagonal);
    };

    const handleKeyDown = (e) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const newNumbers = numbers.map(r => [...r]);

        if (/^[1-9]$/.test(e.key)) {
            if (grid[row][col] === 'black' && selectedDiagonal) {
                newNumbers[row][col] = {
                    ...newNumbers[row][col],
                    [selectedDiagonal]: e.key
                };
            } else {
                newNumbers[row][col] = {
                    top: e.key,
                    bottom: ''
                };
            }
            setNumbers(newNumbers);
        }
        else if (e.key === 'Backspace' || e.key === 'Delete') {
            if (grid[row][col] === 'black' && selectedDiagonal) {
                newNumbers[row][col] = {
                    ...newNumbers[row][col],
                    [selectedDiagonal]: ''
                };
            } else {
                newNumbers[row][col] = { top: '', bottom: '' };
            }
            setNumbers(newNumbers);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, selectedDiagonal, grid, numbers]);

    const styles = {
        app: {
            textAlign: 'center',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        controls: {
            // margin: '20px 0',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px'
        },
        button: {
            padding: '8px 12px',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            border: '1px solid #999',
            borderRadius: '4px',
        },
        activeButton: {
            backgroundColor: '#333',
            color: 'white',
        },
        instructions: {
            margin: '15px 0',
            fontSize: '14px',
            color: '#555',
            // maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'left',
            padding: '10px',
            backgroundColor: '#f8f8f8',
            borderRadius: '5px'
        },
        gridContainer: {
            display: 'inline-block',
            border: '2px solid #000',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '15px'
        },
        row: {
            display: 'flex',
        },
        cell: {
            width: '50px',
            height: '50px',
            border: '1px solid #999',
            cursor: 'pointer',
            margin: '1px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        black: {
            backgroundColor: '#333',
            position: 'relative',
            overflow: 'hidden',
        },
        white: {
            backgroundColor: 'white',
        },
        selected: {
            border: '3px solid blue',
            margin: '0',
        },
        diagonalTop: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: '5px',
        },
        diagonalBottom: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            padding: '5px',
        },
        diagonalSelected: {
            backgroundColor: 'rgba(0, 0, 255, 0.3)',
        },
        number: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
        },
        whiteNumber: {
            color: 'black',
        }
    };

    return (
        <div style={styles.app}>
            <h1>Puzzle Grid Builder</h1>

            <div style={styles.controls}>
                {[3, 5, 7, 9].map((size) => (
                    <button
                        key={size}
                        style={styles.button}
                        onClick={() => handleSizeChange(size)}
                    >
                        {size}x{size}
                    </button>
                ))}
                <button
                    style={styles.button}
                    onClick={clearGrid}
                >
                    Clear All
                </button>
            </div>

            <div style={styles.controls}>
                <button
                    style={{
                        ...styles.button,
                        ...(cellType === 'black' && styles.activeButton),
                    }}
                    onClick={() => setCellType('black')}
                >
                    Place Black Cells
                </button>
                <button
                    style={{
                        ...styles.button,
                        ...(cellType === 'white' && styles.activeButton),
                    }}
                    onClick={() => setCellType('white')}
                >
                    Place White Cells
                </button>
            </div>

            <div style={styles.instructions}>
                <h3>Instructions:</h3>
                <p><strong>Black Cells:</strong></p>
                <ol>
                    <li>Click to place a black cell (divided diagonally)</li>
                    <li>Click on either diagonal half to select it (highlighted blue)</li>
                    <li>Type a number (1-9) to place in selected diagonal</li>
                    <li>Press Delete/Backspace to remove number</li>
                </ol>
                <p><strong>White Cells:</strong></p>
                <ol>
                    <li>Click to place/select white cell</li>
                    <li>Type a number (1-9) to place in cell</li>
                    <li>Press Delete/Backspace to remove number</li>
                </ol>
            </div>

            <div style={styles.gridContainer}>
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} style={styles.row}>
                        {row.map((cell, colIndex) => (
                            <div
                                key={colIndex}
                                style={{
                                    ...styles.cell,
                                    ...(cell === 'black' ? styles.black : styles.white),
                                    ...(selectedCell?.row === rowIndex &&
                                        selectedCell?.col === colIndex &&
                                        styles.selected)
                                }}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {cell === 'black' ? (
                                    <>
                                        <div
                                            style={{
                                                ...styles.diagonalTop,
                                                ...(selectedCell?.row === rowIndex &&
                                                    selectedCell?.col === colIndex &&
                                                    selectedDiagonal === 'top' &&
                                                    styles.diagonalSelected)
                                            }}
                                            onClick={(e) => handleDiagonalClick(rowIndex, colIndex, 'top', e)}
                                        >
                                            {numbers[rowIndex][colIndex].top && (
                                                <span style={styles.number}>{numbers[rowIndex][colIndex].top}</span>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                ...styles.diagonalBottom,
                                                ...(selectedCell?.row === rowIndex &&
                                                    selectedCell?.col === colIndex &&
                                                    selectedDiagonal === 'bottom' &&
                                                    styles.diagonalSelected)
                                            }}
                                            onClick={(e) => handleDiagonalClick(rowIndex, colIndex, 'bottom', e)}
                                        >
                                            {numbers[rowIndex][colIndex].bottom && (
                                                <span style={styles.number}>{numbers[rowIndex][colIndex].bottom}</span>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    numbers[rowIndex][colIndex].top && (
                                        <span style={styles.whiteNumber}>{numbers[rowIndex][colIndex].top}</span>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
