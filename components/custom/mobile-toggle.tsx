import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import NavigationSidebar from "../navigation/navigation-sidebar";
import ServerSidebar from "../server/server-sidebar";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface MobileToggleProps {
    serverId: string;
}
const MobileToggle = async ({ serverId }: MobileToggleProps) => {
    const profile = await currentProfile();
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile?.id,
                },
            },
        },
    });
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="hamburger" size="icon" className="md:hidden">
                    <Menu className="w-7 h-7x" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex p-0 gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar servers={servers} />
                </div>

                <ServerSidebar {...{ serverId }} />
            </SheetContent>
        </Sheet>
    );
};

export default MobileToggle;
