import React, { useState, useEffect, useRef } from 'react';
import Grid from '../../components/Grid/Grid';
import './PlayGrid.scss'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "../../Supabase";
import defaultGrid from '../../assets/defaultGrid.json';
function PlayGrid({ gridURL = false }) {
    const [solution, setSolution] = useState(false);
    const [gridList, setGridList] = useState([[[-1, -1], [16, -1], [12, -1]], [[-1, 15], [7, 0], [8, 0]], [[-1, 13], [9, 0], [4, 0]]]);
    const [realGrid, setRealGrid] = useState(null);
    const { name } = useParams();
    const [entername, setEnterName] = useState('');
    const navigate = useNavigate();
    const [userGrids, setUserGrids] = useState([]);
    const [url, setUrl] = useState("");
    const [twoGrid, setTwoGrid] = useState(1);
    const location = useLocation();
    useEffect(() => {
        setSolution(false);
        setUrl(window.location.href);
        if (!name) {
            const makeNewGrid = defaultGrid.find(obj => obj.number === 1);
            setGridList(makeNewGrid.grid);
        }
    }, [location]);
    useEffect(() => {
        if (!name) {
            const fetchGrids = async () => {
                const { data, error } = await supabase
                    .from('grids')
                    .select('*')
                    .order('size', { ascending: true });

                if (error) {
                    console.error(error);
                } else {
                    setUserGrids(data);
                }
            };
            fetchGrids();
        }

    }, []);
    const sizeGroups = {
        3: userGrids.filter((grid) => grid.size === 3),
        5: userGrids.filter((grid) => grid.size === 5),
        7: userGrids.filter((grid) => grid.size === 7),
        9: userGrids.filter((grid) => grid.size === 9),
    };
    function clearGrid(grid) {
        const newGrid = grid.map(row =>
            row.map(cell =>
                cell[1] === 0 ? [-1, 0] : [...cell]
            )
        );
        return newGrid;

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('gridrealtime')
            .select('name')
            .eq('name', entername)
        if (data.length === 0) {
            const { data, error } = await supabase
                .from('gridrealtime')
                .insert([{
                    name: entername,
                    gridsolution: JSON.stringify(gridList),
                    gridedit: JSON.stringify(clearGrid(gridList))
                }]);
            if (error) {
                console.error(error);
                return;
            }
            navigate(`/${entername}`);
            window.location.reload();
        }
    };
    useEffect(() => {
        if (name && !gridURL) {
            access();
        }
        else if (gridURL && !isNaN(name) && parseInt(name) > 6 && parseInt(name) <= 20) {
            const makeNewGrid = defaultGrid.find(obj => obj.number === parseInt(name));
            setGridList(makeNewGrid.grid);
        }
        else if (gridURL) {
            getUserGrid();
        }
    }, []);
    const getUserGrid = async (str) => {
        const { data, error } = await supabase
            .from('grids')
            .select('*')
            .eq('name', str)
            .single();
        if (error) {
            console.error(error);
        } else {
            setGridList(JSON.parse(data.grid));
            navigate(`/grid/${str}`);

        }
    }
    const five = () => {
        navigate(`/grid/6`);
        const makeNewGrid = defaultGrid.find(obj => obj.number === parseInt(6));
        setGridList(makeNewGrid.grid);
    }
    const seven = () => {
        navigate(`/grid/11`);
        const makeNewGrid = defaultGrid.find(obj => obj.number === parseInt(11));
        setGridList(makeNewGrid.grid);
    }
    const nine = () => {
        navigate(`/grid/16`);
        const makeNewGrid = defaultGrid.find(obj => obj.number === parseInt(16));
        setGridList(makeNewGrid.grid);
    }
    const next = () => {
        if (gridURL && !isNaN(name) && parseInt(name) >= 6 && parseInt(name) <= 20) {
            if (parseInt(name) === 10) {
                navigate(`/grid/6`);
                const makeNewGrid = defaultGrid.find(obj => obj.number === 6);
                setGridList(makeNewGrid.grid);

            }
            else if ((parseInt(name) === 15)) {
                navigate(`/grid/11`);

                const makeNewGrid = defaultGrid.find(obj => obj.number === 11);
                setGridList(makeNewGrid.grid);

            }
            else if ((parseInt(name) === 20)) {
                navigate(`/grid/16`);

                const makeNewGrid = defaultGrid.find(obj => obj.number === 16);
                setGridList(makeNewGrid.grid);

            }
            else {
                navigate(`/grid/${parseInt(name) + 1}`);
                const makeNewGrid = defaultGrid.find(obj => obj.number === parseInt(name) + 1);
                setGridList(makeNewGrid.grid);
            }

        }
        else {
            if (twoGrid < 5) {
                const makeNewGrid = defaultGrid.find(obj => obj.number === twoGrid + 1);
                setTwoGrid(prev => twoGrid + 1);
                setGridList(makeNewGrid.grid);
            }
            else {
                const makeNewGrid = defaultGrid.find(obj => obj.number === 1);
                setTwoGrid(prev => 1);
                setGridList(makeNewGrid.grid);
            }
        }
    }
    const previous = () => {
        if (gridURL && !isNaN(name) && parseInt(name) >= 6 && parseInt(name) <= 20) {
            if (parseInt(name) === 6) {
                navigate(`/grid/10`);
                const makeNewGrid = defaultGrid.find(obj => obj.number === 10);
                setGridList(makeNewGrid.grid);

            }
            else if ((parseInt(name) === 11)) {
                navigate(`/grid/15`);

                const makeNewGrid = defaultGrid.find(obj => obj.number === 15);
                setGridList(makeNewGrid.grid);

            }
            else if ((parseInt(name) === 16)) {
                navigate(`/grid/20`);

                const makeNewGrid = defaultGrid.find(obj => obj.number === 20);
                setGridList(makeNewGrid.grid);

            }
            else {
                navigate(`/grid/${parseInt(name) - 1}`);
                const makeNewGrid = defaultGrid.find(obj => obj.number === parseInt(name) - 1);
                setGridList(makeNewGrid.grid);
            }
        }
        else {
            if (twoGrid > 1) {
                const makeNewGrid = defaultGrid.find(obj => obj.number === twoGrid - 1);
                setTwoGrid(prev => twoGrid - 1);
                setGridList(makeNewGrid.grid);
            }
            else {
                const makeNewGrid = defaultGrid.find(obj => obj.number === 5);
                setTwoGrid(prev => 5);
                setGridList(makeNewGrid.grid);
            }
        }
    }
    const access = async () => {
        const { data, error } = await supabase
            .from('gridrealtime')
            .select('gridsolution, gridedit')
            .eq('name', name);
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            data[0].name = name;
            data[0].gridsolution = JSON.parse(data[0].gridsolution);
            data[0].gridedit = JSON.parse(data[0].gridedit);
            setGridList(data[0].gridsolution)
            setRealGrid(data[0])
        }
    }
    return (
        <section className={`playPage ${!name && "home"}`}>
            <ul className={`playPage__buttons ${!name && "home"} ${((name && !gridURL) || (gridURL && !(!isNaN(name) && parseInt(name) >= 6 && parseInt(name) <= 20))) && "playPage__buttons--hide"}`}><li className={`playPage__button`} onClick={previous}><button>Previous</button></li> <li className={`playPage__button`} onClick={next}><button>Next</button></li></ul>
            {name && !gridURL &&
                <div><p>Share this link to play with others in real time</p><p>{url}</p></div>}
            <div className={`main-grid ${!name && "home"} ${gridList.length === 3 && "main-grid--three"} ${gridList.length === 5 && "main-grid--five"}    ${gridList.length === 7 && "main-grid--seven"} ${gridList.length === 9 && "main-grid--nine"} `}>
                <Grid gridList={gridList} solution={solution} realGrid={realGrid} />
            </div>
            <div className={`group ${!name && "home"}`}>
                <button className={`solution ${solution && "solution--active"}`} onClick={() => setSolution(!solution)}>Solution</button>

                <div className={`grid-select ${(name && !gridURL) && "grid-select--hide"}`}><button onClick={five}>5x5</button><button onClick={seven}>7x7</button><button onClick={nine}>9x9</button></div>
            </div>
            {!(name && !gridURL) &&
                <div className={`playgrid-form ${!name && "home"}`}>
                    <form onSubmit={handleSubmit}>
                        <p>Play Online</p>
                        <label className='form__name text'>
                            Enter grid name:
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
                </div>}
            {!name &&
                <section className='user-grid-container'>
                    <div>
                        <h1>User Grids</h1>
                        <div className='user-grid'>
                            <div>
                                <h2>3X3</h2>
                                {sizeGroups[3].map((grid) => (
                                    <div key={grid.id}>
                                        <button onClick={() => getUserGrid(grid.name)}>{grid.name}</button>
                                    </div>
                                ))}
                            </div>
                            <div className='user-grid__border'></div>
                            <div>
                                <h2>5X5</h2>
                                {sizeGroups[5].map((grid) => (
                                    <div key={grid.id}>
                                        <button onClick={() => getUserGrid(grid.name)}>{grid.name}</button>
                                    </div>
                                ))}
                            </div>
                            <div className='user-grid__border'></div>
                            <div>
                                <h2>7X7</h2>
                                {sizeGroups[7].map((grid) => (
                                    <div key={grid.id}>
                                        <button onClick={() => getUserGrid(grid.name)}>{grid.name}</button>
                                    </div>
                                ))}
                            </div>
                            <div className='user-grid__border'></div>
                            <div>
                                <h2>9X9</h2>
                                {sizeGroups[9].map((grid) => (
                                    <div key={grid.id}>
                                        <button>{grid.name}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            }
            <footer className={`footer footer--home ${name && "footer--hide"}`}>
                <p>Created by Anas Chohan - <a href="https://www.linkedin.com/in/anas-chohan/">Linkedin</a> - <a href="https://github.com/chohanac">Github</a></p>
            </footer>
        </section >
    );
}
export default PlayGrid;
