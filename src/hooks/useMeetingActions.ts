import { useRouter } from "next/navigation"
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "react-hot-toast"

const useMeetingActions = () => {
    const router = useRouter();
    const client = useStreamVideoClient(); // useStreamVideoClient is a hook that returns the client instance that we created in StreamVideoProvider, it will return undefined if a component that is situated outside the (root) will call useMeetingActions
    const createInstantMeeting = async () => {
        if (!client) return;
        try {
            const id = crypto.randomUUID();
            const call = client.call('default', id); // 1st arg tells the call type. What this means? Think of it like: DB analogy: client.collection("calls").doc(id)
            if (!call) throw new Error('Failed to create call');
            await call.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                    custom: {
                        description: "Instant meeting"
                    }
                }
            });
            router.push(`/meeting/${call.id}`);
            toast.success("Meeting created successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create meeting");
        }
    }

    const JoinMeeting = async (callId: string) => {
        if (!client) return toast.error("Failed to join meeting. Please try again.");
        router.push(`/meeting/${callId}`);
    }

    return {createInstantMeeting, JoinMeeting}
}

export default useMeetingActions;