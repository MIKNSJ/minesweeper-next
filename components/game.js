"use client"

import React from "react";
import { useState, useEffect } from "react";
import Board from "./board.js";
import Cell from "./cell.js";

const DIMENSION_BOUNDS = 8;
const MINES_COUNT = 10;
const WINNING_SCORE = 64;
var GENERATED_MINES = 0;
var APPLIED_NUMBERS = 0;
var REPLACE_ZEROES = 0;
var REMAP_FIRST_MINE_CELL = 0;
const visitedCells = new Set([]);



function rand() {
    return Math.floor(Math.random() * (DIMENSION_BOUNDS));
}


export default function Game() {
    //const [cells, setCells] = useState(Array(8).fill(Array(8).fill(0))); Does not work!
    // const [cells, setCells] = useState(Array.from({length: 8}, () => Array(8).fill(0)));
    const [cells, setCells] = useState(Array(8).fill(null).map(() => Array(8).fill("")));
    const [hiddenCells, setHiddenCells] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
    const [win, setWin] = useState(null);
    const [score, setScore] = useState(0);


    function generateMines() {
        let idx = 0
        const modifiedHiddenCells = [...hiddenCells]; // or hiddenCells.slice()
        while (idx < MINES_COUNT) {
            let row = rand();
            let col = rand();

            if (modifiedHiddenCells[row][col] != "<^>") {
                modifiedHiddenCells[row][col] = "<^>";
                idx++
            }
        }
        setHiddenCells(modifiedHiddenCells);
        GENERATED_MINES = 1;
    }


    function applyNumbersToCells() {
        const modifiedHiddenCells = [...hiddenCells]; // or cells.slice()
        for (let i = 0; i < modifiedHiddenCells.length; i++) {
            for (let j = 0; j < modifiedHiddenCells[i].length; j++) {
                if (hiddenCells[i][j] == "<^>") {
                    if (i - 1 >= 0 && j - 1 >= 0) {
                        if (modifiedHiddenCells[i-1][j-1] != "<^>") {
                            modifiedHiddenCells[i-1][j-1]+=1;
                        }

                        if (modifiedHiddenCells[i][j-1] != "<^>") {
                            modifiedHiddenCells[i][j-1]+=1;
                        }

                        if (modifiedHiddenCells[i-1][j] != "<^>") {
                            modifiedHiddenCells[i-1][j]+=1;
                        }
                    }

                    if (i + 1 < hiddenCells.length && j + 1 < hiddenCells.length) {
                        if (modifiedHiddenCells[i][j+1] != "<^>") {
                            modifiedHiddenCells[i][j+1]+=1;
                        }
                        
                        if (modifiedHiddenCells[i+1][j] != "<^>") {
                            modifiedHiddenCells[i+1][j]+=1;
                        }
                        
                        if (modifiedHiddenCells[i+1][j+1] != "<^>") {
                            modifiedHiddenCells[i+1][j+1]+=1;
                        }
                    }

                    if (i + 1 < hiddenCells.length && j - 1 >= 0) {
                        if (modifiedHiddenCells[i+1][j-1] != "<^>") {
                            modifiedHiddenCells[i+1][j-1]+=1;
                        }
                    }

                    if (i - 1 >= 0 && j + 1 < hiddenCells.length) {
                        if (modifiedHiddenCells[i-1][j+1] != "<^>") {
                            modifiedHiddenCells[i-1][j+1]+=1;
                        }
                    }
                }
            }
        }
        setHiddenCells(modifiedHiddenCells);
        APPLIED_NUMBERS = 1;
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
        REPLACE_ZEROES = 1;
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

            if (modifiedHiddenCells[new_row][new_col] != "<^>") {
                modifiedHiddenCells[new_row][new_col] = "<^>";
                break;
            }
        }

        replaceDashesToZeroes();
        applyNumbersToCells();
        replaceZeroesToDashes();
    }


    function traverseCells(x, y) {
        const modifiedCells = [...cells]; // or cells.slice()
        if (score == 54) {
            setWin(1);
        }

        if (x < 0 || x >= DIMENSION_BOUNDS || y < 0 || y >= DIMENSION_BOUNDS || visitedCells.has(`${x},${y}`)) {
            return;
        }

        if (hiddenCells[x][y] == "<^>") {
            return;
        }

        if (hiddenCells[x][y] != '-') {
            modifiedCells[x][y] = hiddenCells[x][y];
            setScore(score => score + 1);
            visitedCells.add(`${x},${y}`);
            setCells(modifiedCells);
            return;
        }

        modifiedCells[x][y] = hiddenCells[x][y];
        setScore(score => score + 1);
        visitedCells.add(`${x},${y}`);

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
                <Cell key={id} onCellClick={() => {handleClick(i, j)}} value={cells[i][j]}></Cell>
            )
            id+=1
        }
    }

    const board2 = [];
    for (let i = 0; i < hiddenCells.length; i++) {
        for (let j = 0; j < hiddenCells[i].length; j++) {
            board2.push(
                <Cell key={id} onCellClick={() => {handleClick(i, j)}} value={hiddenCells[i][j]}></Cell>
            )
            id+=1
        }
    }

    useEffect(() => {
        if (GENERATED_MINES != 1) {
            generateMines();
        }

        if (APPLIED_NUMBERS != 1) {
            applyNumbersToCells();
        }

        if (REPLACE_ZEROES != 1) {
            replaceZeroesToDashes();
        }
    })


    function handleClick(row, col) {
        if (win == null) {
            if (hiddenCells[row][col] == "<^>" && REMAP_FIRST_MINE_CELL == 0) {
                remapFirstMine(row, col);
            } else {
                REMAP_FIRST_MINE_CELL = 1;
            }

            if (hiddenCells[row][col] == "<^>") {
                setWin(0);
                return;
            }

            traverseCells(row, col);
        }
    }
   
    
    return (
        <>
            {win == null ? <Board value={board}/> : <Board value={board2}></Board>}
            <h1 className="container mx-auto text-white self-center">Score: {score}</h1>
            <Board value={board2}/>
            {win == 1 ? <h1 className="container mx-auto text-white self-center">You Win!</h1> : null}
            {win == 0 ? <h1 className="container mx-auto text-white self-center">You Lost!</h1>: null}
        </>
    )
}