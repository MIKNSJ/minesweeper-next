import Link from "next/link"



export default function Footer() {
    return (
        <>
            <div className="bg-zinc-800 text-white">
                <div className="container mx-auto max-w-screen-xl mt-[100vh] shadow-md p-5">
                    <div className="flex justify-between items-center">
                        <p> @MIKNSJ 2024 </p>
                        <Link href = "https://github.com/MIKNSJ/minesweeper-next" target = "_blank" rel = "noopener noreferrer" id = "source">View Source</Link>
                    </div>
                </div>
            </div>
        </>
    )
}