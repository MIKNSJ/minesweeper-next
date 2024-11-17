"use client"

import React from "react";
import { useState } from "react";



export default function Square({value, onSquareClick}) {
    return (
        <div onClick={onSquareClick} className="flex justify-center items-center aspect-square p-4 border text-white select-none">{value}</div>
    )
}