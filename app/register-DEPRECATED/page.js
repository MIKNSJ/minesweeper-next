import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Link from "next/link"
import Form from 'next/form'



export default function Register() {
    return (
        <>
            <Navbar />
                <div className="text-white p-3">
                    <div className="container mx-auto max-w-screen-sm bg-zinc-800 flex flex-col shadow-md p-10 gap-10 mt-5 md:mt-16">
                        <h1>Create your account.</h1>

                        <Form className="flex flex-col gap-10">
                            <div className="flex flex-col gap-3">
                                <label>Username</label>
                                <input type="text" className="text-black px-1" autoComplete = "off" required></input>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label>Password</label>
                                <input type="text" className="text-black px-1" autoComplete = "off" required></input>
                            </div>

                            <input type="submit" value="Register" className="text-black mt-5 bg-white self-center px-10 py-1"></input>
                        </Form>

                        <h5 className="text-xs self-center sm:self-end"><Link href="../login" className="hover:text-blue-500">Login to your account here.</Link></h5>
                    </div>
                </div>
            <Footer />
        </>
    )
}
