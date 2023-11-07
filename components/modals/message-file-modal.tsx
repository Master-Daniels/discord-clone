"use client";

import { useEffect, useState } from "react";

import { z } from "zod";
import qs from "query-string";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from "@components/ui/dialog";

import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { Button } from "@components/ui/button";
import FileUpload from "@/components/custom/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "attachment is required.",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const MessageFileModal = () => {
    const router = useRouter();
    const { close, isOpen, type, data } = useModal();

    const isModalOpen = isOpen && type === "fileMessage";

    const handleClose = () => {
        form.reset();
        close();
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    });

    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: FormSchema) => {
        const { apiUrl, query } = data;
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });
            await axios.post(url, { ...values, content: values.fileUrl });

            router.refresh();
            handleClose();
        } catch (error) {
            console.log("Error occured in file upload");
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0" showCancel>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold uppercase underline underline-offset-2">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">Send a file as message</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6 px-6">
                            <div className="flex-items-center justify center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex justify-center items-center">
                                                <FormControl className="text-center">
                                                    <FileUpload
                                                        endpoint="messageFile"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-grey-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading} size="lg">
                                {isLoading ? "Sending..." : "Send"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default MessageFileModal;
