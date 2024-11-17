import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Board from "../components/board";
import Game from "../components/game";



export default function Home() {
  return (
    <main>
      <Navbar />
      <Game />
      <Footer />
    </main>
  );
}
