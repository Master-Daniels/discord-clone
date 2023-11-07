"use client";

import Image from "next/image";

import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { useState } from "react";

interface FileUploadProps {
    value: string;
    endpoint: "serverImage" | "messageFile";
    onChange(url?: string): void;
}

const FileUpload = ({ value, endpoint, onChange }: FileUploadProps) => {
    const [fileName, setFileName] = useState("");

    const fileType = value.split(".").pop();
    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-28 w-28">
                <Image src={value} alt="uploaded" fill className="rounded-full" sizes="100vw" />
                <button
                    type="button"
                    className="p-1 bg-rose-500 text-white rounded-full shadow-md absolute top-2 right-0"
                    onClick={() => onChange("")}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }
    if (value && fileType === ("pdf" || "txt")) {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
                <FileIcon
                    className="h-10 w-10 fill-indigo-400 stroke-indigo-400" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {fileName ? fileName : value}
                </a>
                <button
                    type="button"
                    className="p-1 bg-rose-500 text-white rounded-full shadow-md absolute -top-2 -right-2"
                    onClick={() => onChange("")}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }
    return (
        <div>
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    onChange(res?.[0].url);
                    setFileName(res?.[0].name as string);
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </div>
    );
};

export default FileUpload;
