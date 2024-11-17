"use client"

import React from "react";
import { useState } from "react";
import Square from "./square"



export default function Board() {
    const [squares, setSquares] = useState(Array(64).fill(0));

    var generate_squares = []
    for (let i = 0; i < squares.length; i++) {
        generate_squares.push(
            <Square key={i} onSquareClick={() => {handleClick(i)}} value={squares[i]}></Square>
        )
    }

    function handleClick(i) {
        const nextSquares = squares.slice();
        nextSquares[i]+=1;
        setSquares(nextSquares);
    }

    return (
        <>
            <div>
                <div className= "container mx-auto max-w-screen-sm mt-20 p-4">
                    <div className="grid grid-cols-8 justify-center items-center">
                        {generate_squares}
                    </div>
                </div>
            </div>
        </>
    )
}