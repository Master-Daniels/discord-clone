export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="grid place-content-center h-full">{children}</div>;
}
