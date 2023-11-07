import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@components/ui/dialog";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import FileUpload from "@/components/custom/file-upload";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { CHANNELTYPE } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import qs from "query-string";
import { useEffect } from "react";

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Channel name is required.",
        })
        .refine((name) => name !== "general", {
            message: "Channel name cannot be 'general'",
        }),
    type: z.nativeEnum(CHANNELTYPE),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateChannelModal = () => {
    const modal = useModal();
    const router = useRouter();
    const params = useParams();

    const { channelType } = modal?.data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || CHANNELTYPE.TEXT,
        },
    });

    useEffect(() => {
        if (channelType) {
            form.setValue("type", channelType);
        }
    }, [form, channelType]);

    const isModalOpen = modal.isOpen && modal.type === "createChannel";
    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: FormSchema) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels`,
                query: {
                    serverId: params?.serverId,
                },
            });
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
            });

            // const data = await res.json();
            // console.log(data);

            form.reset();
            router.refresh();
            modal.close();
        } catch (error) {
            console.log({ error });
        }
    };

    const handleClose = () => {
        form.reset();
        modal.close();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0" showCancel>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold uppercase underline underline-offset-2">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Channel Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                    placeholder="enter channel name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Channel Type</FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 outline-none">
                                                        <SelectValue placeholder="Select a channel type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(CHANNELTYPE).map((type) => (
                                                        <SelectItem key={type} value={type} className="capitalize">
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <DialogFooter className="bg-grey-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;