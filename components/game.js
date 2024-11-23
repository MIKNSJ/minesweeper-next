"use client"

import React from "react";
import { useState, useEffect } from "react";
import Form from "next/form.js"
import Image from 'next/image';
import Board from "./board.js";
import Cell from "./cell.js";
import { generateToken } from "../components/token.js";
import dbConnect from "../lib/dbConnect.js";
import User from "../models/User.js";



/* 
    [i-1][j-1] 	[i-1][j] 	[i-1][j+1]
    [i][j-1]	[i][j]		[i][j+1]
    [i+1][j-1]	[i+1][j]	[i+1][j+1]
*/
const DIMENSION_BOUNDS = 8;
const MINES_COUNT = 10;
//const visitedCells = new Set([]);


function rand() {
    return Math.floor(Math.random() * (DIMENSION_BOUNDS));
}


export default function Game() {
    //const [cells, setCells] = useState(Array(8).fill(Array(8).fill(0))); Does not work!
    // const [cells, setCells] = useState(Array.from({length: 8}, () => Array(8).fill(0)));
    const [cells, setCells] = useState(Array(8).fill(null).map(() => Array(8).fill("")));
    const [hiddenCells, setHiddenCells] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
    const [visitedCells, setVisitedCells] = useState(new Set());
    const [flagCells, setFlagCells] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
    const [flagCount, setFlagCount] = useState(10);
    const [flagMode, setFlagMode] = useState(0);
    const [mines, setMines] = useState(0);
    const [bustedMine, setBustedMine] = useState([-1,-1]);
    const [numbers, setNumbers] = useState(0);
    const [replaceZeroes, setReplaceZeroes] = useState(0);
    const [firstMine, setFirstMine] = useState(0);
    const [win, setWin] = useState(null);
    const [score, setScore] = useState(0);
    const [startReset, setStartReset] = useState(0);
    const [currSaveSessionId, setCurrSaveSessionId] = useState(null);
    const [displaySessionId, setDisplaySessionId] = useState(null);


    function generateMines() {
        let idx = 0
        const modifiedHiddenCells = [...hiddenCells]; // or hiddenCells.slice()
        while (idx < MINES_COUNT) {
            let row = rand();
            let col = rand();

            if (modifiedHiddenCells[row][col] != "*") {
                modifiedHiddenCells[row][col] = "*";
                idx++
            }
        }
        setHiddenCells(modifiedHiddenCells);
        setMines(1);
    }


    function applyNumbersToCells() {
        const modifiedHiddenCells = [...hiddenCells]; // or cells.slice()
        for (let i = 0; i < modifiedHiddenCells.length; i++) {
            for (let j = 0; j < modifiedHiddenCells[i].length; j++) {
                if (hiddenCells[i][j] == "*") {
                    if (i - 1 >= 0 && j - 1 >= 0) {
                        if (modifiedHiddenCells[i-1][j-1] != "*") {
                            modifiedHiddenCells[i-1][j-1]+=1;
                        }

                        /*if (modifiedHiddenCells[i][j-1] != "*") {
                            modifiedHiddenCells[i][j-1]+=1;
                        }*/

                        /*if (modifiedHiddenCells[i-1][j] != "*") {
                            modifiedHiddenCells[i-1][j]+=1;
                        }*/
                    }

                    if (j - 1 >= 0) {
                        if (modifiedHiddenCells[i][j-1] != "*") {
                            modifiedHiddenCells[i][j-1]+=1;
                        }
                    }

                    if (i - 1 >= 0) {
                        if (modifiedHiddenCells[i-1][j] != "*") {
                            modifiedHiddenCells[i-1][j]+=1;
                        }
                    }

                    if (i + 1 < modifiedHiddenCells.length && j + 1 < modifiedHiddenCells.length) {
                        /*if (modifiedHiddenCells[i][j+1] != "*") {
                            modifiedHiddenCells[i][j+1]+=1;
                        }*/
                        
                        /*if (modifiedHiddenCells[i+1][j] != "*") {
                            modifiedHiddenCells[i+1][j]+=1;
                        }*/
                        
                        if (modifiedHiddenCells[i+1][j+1] != "*") {
                            modifiedHiddenCells[i+1][j+1]+=1;
                        }
                    }

                    if (j + 1 < modifiedHiddenCells.length) {
                        if (modifiedHiddenCells[i][j+1] != "*") {
                            modifiedHiddenCells[i][j+1]+=1;
                        }
                    }

                    if (i + 1 < modifiedHiddenCells.length) {
                        if (modifiedHiddenCells[i+1][j] != "*") {
                            modifiedHiddenCells[i+1][j]+=1;
                        }
                    }

                    if (i + 1 < modifiedHiddenCells.length && j - 1 >= 0) {
                        if (modifiedHiddenCells[i+1][j-1] != "*") {
                            modifiedHiddenCells[i+1][j-1]+=1;
                        }
                    }

                    if (i - 1 >= 0 && j + 1 < modifiedHiddenCells.length) {
                        if (modifiedHiddenCells[i-1][j+1] != "*") {
                            modifiedHiddenCells[i-1][j+1]+=1;
                        }
                    }
                }
            }
        }
        setHiddenCells(modifiedHiddenCells);
        setNumbers(1);
    }


    function replaceZeroesToDashes() {
        const modifiedHiddenCells = [...hiddenCells]; // or cells.slice()
        for (let i = 0; i < modifiedHiddenCells.length; i++) {
            for (let j = 0; j < modifiedHiddenCells[i].length; j++) {
                if (modifiedHiddenCells[i][j] == 0) {
                    modifiedHiddenCells[i][j] = "-";
                }
            }
        }
        setHiddenCells(modifiedHiddenCells)
        setReplaceZeroes(1);
    }


    function replaceDashesToZeroes() {
        const modifiedHiddenCells = [...hiddenCells]; // or cells.slice()
        for (let i = 0; i < modifiedHiddenCells.length; i++) {
            for (let j = 0; j < modifiedHiddenCells[i].length; j++) {
                if (modifiedHiddenCells[i][j] == "-") {
                    modifiedHiddenCells[i][j] = 0;
                }
            }
        }
        setHiddenCells(modifiedHiddenCells)
    }

    
    function setNumbersToZeroes() {
        const modifiedHiddenCells = [...hiddenCells]; // or cells.slice()
        for (let i = 0; i < modifiedHiddenCells.length; i++) {
            for (let j = 0; j < modifiedHiddenCells[i].length; j++) {
                if (typeof modifiedHiddenCells[i][j] === "number") {
                    modifiedHiddenCells[i][j] = 0;
                }
            }
        }
        setHiddenCells(modifiedHiddenCells)
    }


    function remapFirstMine(row, col) {
        setNumbersToZeroes();
        const modifiedHiddenCells = [...hiddenCells]; // or cells.slice()
        modifiedHiddenCells[row][col] = "-"

        while (true) {
            let new_row = rand();
            let new_col = rand();

            if (modifiedHiddenCells[new_row][new_col] != "*") {
                modifiedHiddenCells[new_row][new_col] = "*";
                break;
            }
        }

        replaceDashesToZeroes();
        applyNumbersToCells();
        replaceZeroesToDashes();
        setFirstMine(1);
    }


    function traverseCells(x, y) {
        const modifiedCells = [...cells]; // or cells.slice()
        const modifiedFlagCells = [...flagCells];
        const modifiedVisitedCells = new Set(visitedCells);

        if (x < 0 || x >= DIMENSION_BOUNDS || y < 0 || y >= DIMENSION_BOUNDS || modifiedVisitedCells.has(`${x},${y}`)) {
            return;
        }

        if (hiddenCells[x][y] === "*") {
            return;
        }

        visitedCells.add(`${x},${y}`); // was not here
        setVisitedCells(modifiedVisitedCells); // was not here
        setScore(score => score + 1); // was not here

        if (hiddenCells[x][y] !== '-') {
            modifiedCells[x][y] = hiddenCells[x][y];
            //setScore(score => score + 1);
            //modifiedVisitedCells.add(`${x},${y}`);
            //visitedCells.add(`${x},${y}`);
            //setVisitedCells(modifiedVisitedCells);
            setCells(modifiedCells);

            if (flagCells[x][y] == 1) {
                modifiedFlagCells[x][y] = 0;
                setFlagCells(modifiedFlagCells);
                setFlagCount(flagCount => flagCount + 1);
            }
            return;
        }

        modifiedCells[x][y] = hiddenCells[x][y];
        //setScore(score => score + 1);
        //modifiedVisitedCells.add(`${x},${y}`);
        //visitedCells.add(`${x},${y}`);
        //setVisitedCells(modifiedVisitedCells);
        setCells(modifiedCells);

        if (flagCells[x][y] == 1) {
            modifiedFlagCells[x][y] = 0;
            setFlagCells(modifiedFlagCells);
            setFlagCount(flagCount => flagCount + 1);
        }

        traverseCells(x, y-1);
        traverseCells(x, y+1);
        traverseCells(x-1, y);
        traverseCells(x+1, y);
        traverseCells(x-1, y-1);
        traverseCells(x-1, y+1);
        traverseCells(x+1, y-1);
        traverseCells(x+1, y+1);
    }


    var id = 0;
    const board = [];
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            board.push(
                <Cell key={id} onCellClick={() => {handleClick(i, j)}} value={cells[i][j]} type={flagCells[i][j] == 0 ? 0 : 2} bustedCell = {0}/>
            )
            id+=1
        }
    }

    const board2 = [];
    for (let i = 0; i < hiddenCells.length; i++) {
        for (let j = 0; j < hiddenCells[i].length; j++) {
            board2.push(
                <Cell key={id} value={hiddenCells[i][j]} type={hiddenCells[i][j] == "*" ? 1 : 0} bustedCell = {bustedMine[0] == i && bustedMine[1] == j ? 1 : 0}/>
            )
            id+=1
        }
    }


    useEffect(() => {
        if (startReset === 0) {
            reset();
        }

        if (mines != 1) {
            generateMines();
        }

        if (numbers != 1) {
            applyNumbersToCells();
        }

        if (replaceZeroes != 1) {
            replaceZeroesToDashes();
        }

        if (score >= 54) {
            setWin(1);
            return;
        }
    }, [startReset, mines, numbers, replaceZeroes, score]);


    function handleClick(row, col) {
        if (win == null) {
            if (flagMode != 1 && flagCells[row][col] == 0) { // not in flag mode and cell is not a flag
                if (hiddenCells[row][col] == "*" && firstMine == 0) {
                    remapFirstMine(row, col);
                } else {
                    setFirstMine(1);
                }

                if (hiddenCells[row][col] == "*") {
                    setBustedMine([row, col]);
                    setWin(0);
                    return;
                }

                traverseCells(row, col);
            } else if (flagMode != 1 && flagCells[row][col] === 1) { // not in flag mode and cell is a flag
                if (flagCells[row][col] === 1 && cells[row][col] === "") { // cell is flagged
                    const modifiedFlagCells = [...flagCells];
                    modifiedFlagCells[row][col] = 0;
                    setFlagCells(modifiedFlagCells);
                    setFlagCount(flagCount => flagCount + 1);
                }
            } else { // in flag mode
                if (flagCount > 0) { // we have enough flags
                    if (flagCells[row][col] === 0 && cells[row][col] === "") { // cell is not flagged
                        const modifiedFlagCells = [...flagCells];
                        modifiedFlagCells[row][col] = 1;
                        setFlagCells(modifiedFlagCells);
                        setFlagCount(flagCount => flagCount - 1);
                    }
                }
            }
        }
    }


    function handleFlags() {
        if (flagMode == 0) {
            setFlagMode(1);
        } else {
            setFlagMode(0);
        }
    }


    function reset() {
        const modifiedCells = [...cells];
        for (let i = 0; i < modifiedCells.length; i++) {
            for (let j = 0; j < modifiedCells[i].length; j++) {
                modifiedCells[i][j] = "";
            }
        }

        const modifiedHiddenCells = [...hiddenCells];
        for (let i = 0; i < modifiedHiddenCells.length; i++) {
            for (let j = 0; j < modifiedHiddenCells[i].length; j++) {
                modifiedHiddenCells[i][j] = 0;
            }
        }

        const modifiedFlagCells = [...flagCells];
        for (let i = 0; i < modifiedFlagCells.length; i++) {
            for (let j = 0; j < modifiedFlagCells[i].length; j++) {
                modifiedFlagCells[i][j] = 0;
            }
        }

        setCells(modifiedCells);
        setHiddenCells(modifiedHiddenCells);
        setVisitedCells(new Set());
        //visitedCells.clear();
        setFlagCells(modifiedFlagCells);
        setFlagCount(10);
        setFlagMode(0);
        setMines(0);
        setBustedMine([-1,-1]);
        setNumbers(0);
        setReplaceZeroes(0);
        setFirstMine(0);
        setWin(null);
        setScore(0);
        setStartReset(1);
        setCurrSaveSessionId(null);
        setDisplaySessionId(null);
    }


    async function handleSave() {
        if (win === null && score > 0) {
            const token = generateToken();
            await dbConnect();
            const userSave = await new User({
                saveSessionId: token,
                cells: cells,
                hiddenCells: hiddenCells,
                visitedCells: Array.from(visitedCells),
                flagCells: flagCells,
                flagCount: flagCount,
                flagMode: flagMode,
                mines: mines,
                numbers: numbers,
                replaceZeroes: replaceZeroes,
                firstMine: firstMine,
                score: score,
            });

            console.log(token);
            
            // Send the data to the backend API
            const response = await fetch("/api/save", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userSave),
            });

            const data = await response.json();

            if (response.status === 200) {
                setDisplaySessionId(token);
                alert("Your game has been saved.\nSession ID: " + token);
            } else if (response.status === 401) {
                handleSave();
            } else {
                alert(data.message || "An error occurred while saving your game.");
            }
        } else {
            alert("You cannot save your game at this time.");
        }
    }


    async function findSession() {
        const response = await fetch(`api/save?saveSessionId=${currSaveSessionId}`);
        const data = await response.json();

        if (response.status === 200) {
            reset();
            setCells(data.cells);
            setHiddenCells(data.hiddenCells);
            setVisitedCells(new Set(data.visitedCells));
            setFlagCells(data.flagCells);
            setFlagCount(data.flagCount);
            setFlagMode(data.flagMode)
            setMines(data.mines);
            setNumbers(data.numbers);
            setFirstMine(data.firstMine);
            setScore(data.score);
            setDisplaySessionId(data.saveSessionId);
            alert("Your game has loaded.");
        } else if (response.status === 404) {
            alert("Your save could not be found.");
        } else {
            alert(data.message || "An error occurred while loading your game.");
        }
    }

    
    return (
        <>
            {win == null ? <Board value={board}/> : <Board value={board2}/>}
            <div className="container mx-auto max-w-screen-sm px-4 py-3 flex flex-col justify-center items-center gap-5 text-white">
                <div className="w-[100%] flex justify-between items-center">
                    <button onClick={handleFlags} className={`text-sm md:text-lg flex border-2 hover:bg-slate-500 ${flagMode == 1 ? "bg-slate-500" : null}`}>
                        <Image src="/flag_icon.png" width={40} height={40} alt="flag_icon"/>
                    </button>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-sm sm:text-lg">Score: {score}</h1>
                        <h1 className="text-sm sm:text-lg">Flags: {flagCount}</h1>
                    </div>
                    <div className="flex gap-10">
                        <button onClick={handleSave} className="text-sm md:text-lg flex border-2 hover:bg-slate-500">
                            <Image src="/save_icon.png" width={40} height={40} alt="refresh_icon"/>
                        </button>
                        <button onClick={reset} className="text-sm md:text-lg flex border-2 hover:bg-slate-500">
                            <Image src="/refresh_icon.png" width={40} height={40} alt="refresh_icon"/>
                        </button>
                    </div>
                </div>
                {win == 1 ? <h1 className="text-lg md:text-xl mt-10">You have Win!</h1> : null}
                {win == 0 ? <h1 className="text-lg md:text-xl mt-10">You have Lost!</h1>: null}
                <Form className="w-[100%] flex justify-center mt-10">
                    <input onChange={e => setCurrSaveSessionId(e.target.value)} type="text" name="saveSessionId" placeholder="Load a previous session. Ex: UMeATUXIVmPqqvQCbwBZ" className="flex-1 text-black px-1"/>
                    <button onClick={findSession} type="button" className="text-sm md:text-lg flex border-2 hover:bg-slate-500">
                        <Image src="/load_icon.png" width={40} height={40} alt="load_icon"/>
                    </button>
                </Form>
                <h3 className="self-start text-xs sm:text-base">Session ID: {displaySessionId}</h3>
            </div>
            <Board value={board2}/>
        </>
    )
}