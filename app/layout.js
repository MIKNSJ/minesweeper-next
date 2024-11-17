import localFont from "next/font/local";
import "./globals.css"



const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata = {
  title: "Minesweeper",
  description: 'Welcome to Minesweeper!',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geistMono.className}>{children}</body>
    </html>
  )
}
