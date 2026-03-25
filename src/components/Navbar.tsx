"use client"

import { CodeIcon } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { useAuth, UserButton } from "@clerk/nextjs"
import DashboardBtn from "./DashboardBtn"

const Navbar = () => {
    const { isSignedIn } = useAuth()

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
                >
                    <CodeIcon className="size-8 text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-600 to-violet-400 bg-clip-text text-transparent">
                        CodeSync
                    </span>
                </Link>

                {isSignedIn && (
                    <div className="flex items-center space-x-4 ml-auto">
                        <DashboardBtn />
                        <ModeToggle />
                        <UserButton />
                    </div>
                )}

            </div>
        </nav>
    )
}

export default Navbar