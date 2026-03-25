"use client"
import { useParams } from "next/navigation"
function MeetingPage() {
const {id} = useParams();
    return (
        <div>
            <h1>Meeting</h1>
        </div>
    )
}

export default MeetingPage