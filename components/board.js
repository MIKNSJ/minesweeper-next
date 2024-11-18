import React from "react";



export default function Board({value}) {
    return (
        <>
            <div>
                <div className= "container mx-auto max-w-screen-sm mt-20 p-4">
                    <div className="grid grid-cols-8 justify-center items-center">
                        {value}
                    </div>
                </div>
            </div>
        </>
    )
}