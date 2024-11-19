import Image from 'next/image'
import Link from "next/link"



export default function Navbar() {
    return (
        <>
            <div className="bg-zinc-800 text-white">
                <div className="container mx-auto max-w-screen-xl flex justify-between items-center shadow-md p-4">
                    <div className="flex gap-4 items-center">
                        <Image src="/mine_icon.png" width={50} height={50} alt="mine_icon"/>
                        <h1 className="text-white sm:text-4xl uppercase">Minesweeper</h1>
                    </div>
                    <button className="bg-white flex p-4 rounded">
                        <Link href="/" className="text-black uppercase">Log In</Link>
                    </button>
                </div>
            </div>
        </>
    )
}