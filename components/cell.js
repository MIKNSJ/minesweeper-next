"use client"

import React from "react";
import { useState } from "react";
import Image from 'next/image'



export default function Cell({value, onCellClick, type, bustedCell}) {
    return (
        <div onClick={onCellClick} className={`flex justify-center items-center aspect-square border-2 text-white text-xl font-bold select-none ${bustedCell == 1 ? "border-4 sm:border-8 border-red-700" : null}`}>
            {type == 0 ? value : (type == 1 ? <Image src="/mine_icon.png" width={50} height={50} alt="mine_icon"/> : <Image src="/flag_icon.png" width={40} height={40} alt="flag_icon"/>)}
        </div>
    )
}