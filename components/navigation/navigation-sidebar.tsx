import NavigationAction from "@components/navigation/navigation-action";
import { Separator } from "@components/ui/separator";
import { ScrollArea } from "@components/ui/scroll-area";
import NavigationItem from "@components/navigation/navigation-item";
import { ModeToggle } from "@components/custom/mode-toggle";
import { UserButton } from "@clerk/nextjs";

function NavigationSidebar({ servers }: { servers: any }) {
    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-neutral-200 dark:bg-[#1e1f22] py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {servers?.map((server: any) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem {...server} />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/create-server"
                    appearance={{
                        elements: {
                            avatarBox: "h-[40px] w-[40px]",
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default NavigationSidebar;
