import React, { useState, useEffect, useRef } from 'react';
import Grid from '../../components/Grid/Grid';
import './PlayGrid.scss'

import { supabase } from "../../Supabase";

const example = [[[-1, -1], [11, -1], [10, -1], [-1, -1], [-1, -1]], [[-1, 4], [3, 0], [1, 0], [13, -1], [-1, -1]], [[-1, 23], [8, 0], [6, 0], [9, 0], [3, -1]], [[-1, -1], [-1, 6], [3, 0], [1, 0], [2, 0]], [[-1, -1], [-1, -1], [-1, 4], [3, 0], [1, 0]]];


function PlayGrid() {
    const [solution, setSolution] = useState(false);
    const [gridList, setGridList] = useState([[[-1, -1], [16, -1], [12, -1]], [[-1, 15], [7, 0], [8, 0]], [[-1, 13], [9, 0], [4, 0]]]);
    const [testing, setTesting] = useState(false);

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
            console.log('Grids with size 3:', data);
        }
    }

    useEffect(() => {
        fetchGrids();

    }, []);

    const three = () => {

        fetchGrids(3);

    }
    const five = () => {
        // setGridList([[[-1, -1], [11, -1], [10, -1], [-1, -1], [-1, -1]], [[-1, 4], [3, 0], [1, 0], [13, -1], [-1, -1]], [[-1, 23], [8, 0], [6, 0], [9, 0], [3, -1]], [[-1, -1], [-1, 6], [3, 0], [1, 0], [2, 0]], [[-1, -1], [-1, -1], [-1, 4], [3, 0], [1, 0]]])
        fetchGrids(5);

    }
    const seven = () => {
        // setGridList([[[-1, -1], [3, -1], [4, -1], [24, -1], [-1, -1], [11, -1], [16, -1]], [[-1, 10], [1, 0], [3, 0], [6, 0], [-1, 8], [1, 0], [7, 0]], [[-1, 11], [2, 0], [1, 0], [8, 0], [10, 11], [2, 0], [9, 0]], [[-1, -1], [-1, -1], [19, 21], [9, 0], [4, 0], [8, 0], [-1, -1]], [[-1, -1], [9, 6], [2, 0], [1, 0], [3, 0], [4, -1], [17, -1]], [[-1, 10], [2, 0], [8, 0], [-1, 13], [1, 0], [3, 0], [9, 0]], [[-1, 16], [7, 0], [9, 0], [-1, 11], [2, 0], [1, 0], [8, 0]]])
        fetchGrids(7);
    }
    const next = () => {
        setGridList([[[-1, -1], [12, -1], [3, -1]], [[-1, 11], [9, 0], [2, 0]], [[-1, 4], [3, 0], [1, 0]]])
    }
    const previous = () => {
        setGridList([[[-1, -1], [15, -1], [4, -1]], [[-1, 11], [8, 0], [3, 0]], [[-1, 8], [7, 0], [1, 0]]])
    }

    const testreal = async () => {

        if (!testing) {
            let size = 3;
            const { data, error } = await supabase
                .from('grids')
                .select('*')
                .eq('size', size);
            if (error) {
                console.error('Error retrieving grids with size 3:', error);
            } else {
                setGridList(data[0].grid);
                console.log('Grids with size 3:', data);
            }
        }
        setTesting(!testing)

    }

    const add = async () => {

        console.log("works")

    }

    return (
        <section className='playPage'>
            <ul className='playPage__buttons'><li className='playPage__button' onClick={previous}>previous</li> <li className='playPage__button' onClick={next}>next</li></ul>
            <Grid gridList={gridList} solution={solution} />
            <div className='group'>
                <button className={`solution ${solution && "solution--active"}`} onClick={() => setSolution(!solution)}>Solution</button>
                <div className='grid-select'><button onClick={three}>3x3</button><button onClick={five}>5x5</button><button onClick={seven}>7x7</button></div>
            </div>
            <button className={`solution ${testing && "solution--active"}`} onClick={testreal}>Testing</button>
            <button className={`solution`} onClick={add}>Add</button>

        </section >
    );
}
export default PlayGrid;
