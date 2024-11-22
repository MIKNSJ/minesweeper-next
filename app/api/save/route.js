import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect.js";
import User from "../../../models/User.js";



export async function POST(req) {
    await dbConnect();

    const {
        saveSessionId,
        cells,
        hiddenCells,
        flagCells,
        visitedCells,
        flagCount,
        flagMode,
        mines,
        numbers,
        replaceZeroes,
        firstMine,
        score
    } = await req.json();

    const existingSave = await User.findOne({saveSessionId});

    if (existingSave) {
        return NextResponse.json({message: "Save file already exists."}, {status: 401})
    }

    const newUser = new User({
        saveSessionId,
        cells,
        hiddenCells,
        flagCells,
        visitedCells,
        flagCount,
        flagMode,
        mines,
        numbers,
        replaceZeroes,
        firstMine,
        score
    });

    await newUser.save();
    return NextResponse.json({message: "This game has been saved."}, {status: 200});
}


export async function GET(req) {
    await dbConnect();
    const saveSessionId = req.nextUrl.searchParams.get("saveSessionId");
  
    if (saveSessionId) {
        // Fetch specific save by saveSessionId
        const existingSave = await User.findOne({saveSessionId});

        if (!existingSave) {
            return NextResponse.json({ message: "Save not found." }, { status: 404 });
        }

        return NextResponse.json(existingSave, { status: 200 });
    }
}