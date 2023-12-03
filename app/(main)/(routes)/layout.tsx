import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import NavigationSidebar from "@components/navigation/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
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
        <div className="h-full">
            <div className="hide h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar servers={servers} />
            </div>
            <main className="md:pl-[72px] h-full">{children}</main>
        </div>
    );
};

export default MainLayout;
