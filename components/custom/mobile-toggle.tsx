import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import NavigationSidebar from "../navigation/navigation-sidebar";
import ServerSidebar from "../server/server-sidebar";

interface MobileToggleProps {
    serverId: string;
}
const MobileToggle = ({ serverId }: MobileToggleProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="hamburger" size="icon" className="md:hidden">
                    <Menu className="w-7 h-7x" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex p-0 gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar {...{ serverId }} />
            </SheetContent>
        </Sheet>
    );
};

export default MobileToggle;
