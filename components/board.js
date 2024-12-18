import React from "react";



export default function Board({value}) {
    return (
        <>
            <div>
                <div className= "container mx-auto max-w-screen-sm mt-5 md:mt-16 p-4">
                    <div className="grid grid-cols-8 justify-center items-center gap-1">
                        {value}
                    </div>
                </div>
            </div>
        </>
    )
}