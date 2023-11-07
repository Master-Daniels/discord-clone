import { z } from "zod";
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

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import FileUpload from "@/components/custom/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required.",
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required.",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateServerModal = () => {
    const modal = useModal();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const isModalOpen = modal.isOpen && modal.type === "createServer";
    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: FormSchema) => {
        fetch("/api/servers", {
            method: "POST",
            body: JSON.stringify(values),
        }).then((res) => {
            if (res.status === 500) {
                alert("Error creating server");
            } else {
                form.reset();
                router.refresh();
                modal.close();
            }
        });
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
                        Create your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Add a touch of personality to your server, you can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6 px-6">
                            <div className="flex-items-center justify center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex flex-col justify-center items-center">
                                                <FormControl className="text-center">
                                                    <FileUpload
                                                        endpoint="serverImage"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Server Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                    placeholder="Enter server name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
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

export default CreateServerModal;
