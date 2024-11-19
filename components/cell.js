"use client"

import React from "react";
import { useState } from "react";



export default function Cell({value, onCellClick}) {
    return (
        <div onClick={onCellClick} className="flex justify-center items-center aspect-square border text-white text-xl font-bold select-none">{value}</div>
    )
}