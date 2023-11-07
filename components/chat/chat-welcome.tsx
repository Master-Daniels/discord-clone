import { Hash } from "lucide-react";

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "conversation";
}

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
    return (
        <div className="space-y-2 px-4 mb-4">
            {type === "channel" && (
                <div className="rounded-full bg-zinc-500 dark:bg-zinc-700 h-[75px] w-[75px] flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white" />
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">{type === "channel" ? `Welcome to #${name}` : `${name}`}</p>
            <p className="text-sm dark:text-zinc-400 text-zinc-700">
                {type === "channel"
                    ? "This is the start of the #" + name + " channel"
                    : "This is the start of yout conversation with the" + name}
            </p>
        </div>
    );
};

export default ChatWelcome;
