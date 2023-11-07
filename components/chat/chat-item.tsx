"use client";

import { z as zod } from "zod";
import qs from "query-string";

import { Member, Profile, ROLE } from "@prisma/client";
import UserAvatar from "../custom/user-avatar";
import ActionToolTip from "../custom/action-tooltip";
import { Edit, FileIcon, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    isUpdated: boolean;
    fileUrl?: string | null;
    deleted: boolean;
    currentMember: Member;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconsMap = {
    ADMIN: <ShieldCheck className="h-4 w-4 ml-2 mt-1 text-indigo-500" />,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-rose-500" />,
    GUEST: null,
};

const formSchema = zod.object({
    content: zod.string().min(1),
});

const ChatItem = ({
    id,
    content,
    member,
    currentMember,
    timestamp,
    isUpdated,
    fileUrl,
    deleted,
    socketUrl,
    socketQuery,
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { open } = useModal();

    const form = useForm<zod.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content,
        },
    });

    const fileType = fileUrl && fileUrl.split(".").pop();

    const isAdmin = currentMember.role === ROLE.ADMIN;
    const isModerator = currentMember.role === ROLE.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMesssage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileUrl && fileType === "pdf";
    const isImage = fileUrl && !isPDF;

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: zod.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });
            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };

    const onMemberClick = () => {
        if (member.id === currentMember.id) return;
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    };

    useEffect(() => {
        form.reset({
            content: content,
        });
    }, [form, content]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [form, content]);

    return (
        <div className="relative group flex items-center hover:bg-black/[0.02] dark:hover:bg-zinc-50/[0.05] p-4 transition w-full">
            <div className="group flex gap-2 items-start w-full">
                <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} alt={member.profile.name} />
                </div>

                <div className="space-y-1 w-full">
                    <div className="flex items-center gap-x-1 w-full">
                        <div className="flex items-center">
                            <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionToolTip label={member.role}>{roleIconsMap[member.role]}</ActionToolTip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{timestamp}</span>
                    </div>

                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md overflow-hidden border flex items-center bg-secondary h-48 w-48 !mt-[1.5rem]"
                        >
                            <Image src={fileUrl} alt={fileUrl.split(".")[0]} fill className="object-cover" />
                        </a>
                    )}

                    {isPDF && (
                        <div className="relative flex gap-x-2 items-center w-fit py-2 pr-5 rounded-md bg-zinc-200/80 dark:bg-zinc-50/10 dark:hover:bg-zinc-50/20 hover:bg-zinc-300/70 mt-[1.5rem] text-sky-700 dark:text-white transition">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferer"
                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                <FileIcon className="h-10 w-10 fill-indigo-400 stroke-indigo-400" />
                            </a>
                            PDF File
                        </div>
                    )}

                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300",
                                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1 line-through"
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form className="flex flex-col !w-full gap-x-2 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                                <span className="text-[.8rem] my-1 text-zinc-400">
                                    Press excape to cancel and enter to save
                                </span>
                                <div className="flex items-center gap-x-4">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input
                                                            disabled={isLoading}
                                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/80 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                            placeholder="Edited Message"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        size="default"
                                        variant="primary"
                                        disabled={isLoading}
                                        className="basis-[10%]"
                                    >
                                        save
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMesssage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-3 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionToolTip label="Edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="w-4 h-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionToolTip>
                    )}
                    <ActionToolTip label="Delete">
                        <Trash
                            onClick={() => open("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
                            className="w-4 h-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionToolTip>
                </div>
            )}
        </div>
    );
};

export default ChatItem;
