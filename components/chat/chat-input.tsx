"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus, Send } from "lucide-react";
import { Input } from "@components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@components/ui/button";
import EmojiPicker from "@components/custom/emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
    apiUrl: string;
    query: {
        [key: string]: any;
    };
    // same  as Record<string, any>
    name: string;
    type: "conversation" | "channel";
}

const formSchema = z.object({
    content: z.string().min(1, { message: "Message cannot be blank" }),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const router = useRouter();
    const { open } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            content: "",
        },
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });
            await axios.post(url, values);
            form.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            open("fileMessage", { apiUrl, query });
                                        }}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                                    >
                                        <Plus className="text-white dark:text-[#313333]" />
                                    </button>
                                    <Input
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                        {...field}
                                        disabled={isLoading}
                                        placeholder={`Message ${type === "channel" && "#"}${name}`}
                                    />
                                    <div className="absolute top-7 right-20">
                                        <EmojiPicker
                                            onChange={(emoji: string) => {
                                                field.onChange(`${field.value} ${emoji}`);
                                            }}
                                        />
                                    </div>
                                    <Button title="send" className="absolute top-5 right-5" variant="send" size="icon">
                                        <Send className="h-6 w-6 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                                    </Button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default ChatInput;
