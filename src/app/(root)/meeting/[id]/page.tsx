"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { VideoOffIcon, PhoneOffIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

function MeetingPage() {
    const { id } = useParams();
    const { isLoaded } = useUser();
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const { call, isCallLoading } = useGetCallById(id);

    // Check interview status from Convex — runs in parallel with call loading
    const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
        streamCallId: Array.isArray(id) ? id[0] : id ?? "",
    });

    if (!isLoaded || isCallLoading) return <LoaderUI />;

    // Meeting already ended — block rejoining
    if (interview?.status === "completed") {
        return (
            <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none"
                    style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col items-center gap-5 text-center px-6"
                >
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(251,191,36,0.07)",
                            border: "1px solid rgba(251,191,36,0.15)",
                            boxShadow: "0 0 40px rgba(251,191,36,0.08)",
                        }}
                    >
                        <PhoneOffIcon className="size-9 text-amber-400/60" strokeWidth={1.4} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-zinc-200 tracking-tight">
                            This meeting has ended
                        </h1>
                        <p className="text-[13px] text-zinc-500 max-w-xs leading-relaxed">
                            The interview session is no longer active. You cannot join a completed meeting.
                        </p>
                    </div>
                    <a
                        href="/"
                        className="mt-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                        style={{
                            background: "rgba(251,191,36,0.10)",
                            border: "1px solid rgba(251,191,36,0.25)",
                            color: "#fbbf24",
                        }}
                    >
                        Back to Home
                    </a>
                </motion.div>
            </div>
        );
    }

    // Call not found
    if (!call) {
        return (
            <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none"
                    style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col items-center gap-5 text-center"
                >
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(251,191,36,0.07)",
                            border: "1px solid rgba(251,191,36,0.15)",
                        }}
                    >
                        <VideoOffIcon className="size-9 text-amber-400/60" strokeWidth={1.4} />
                    </div>
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold text-zinc-200 tracking-tight">Meeting Not Found</h1>
                        <p className="text-[13px] text-zinc-600">This session may have ended or the link is invalid</p>
                    </div>
                    <a
                        href="/"
                        className="mt-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                        style={{
                            background: "rgba(251,191,36,0.10)",
                            border: "1px solid rgba(251,191,36,0.25)",
                            color: "#fbbf24",
                        }}
                    >
                        Back to Home
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <StreamCall call={call}>
            <StreamTheme>
                <div className={isSetupComplete ? "block" : "hidden"}>
                    <MeetingRoom />
                </div>
                <div className={isSetupComplete ? "hidden" : "block"}>
                    <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
                </div>
            </StreamTheme>
        </StreamCall>
    );
}

export default MeetingPage;