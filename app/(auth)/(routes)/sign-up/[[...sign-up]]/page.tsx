import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return <SignUp afterSignUpUrl='/create-server' redirectUrl='/create-server' />;
}
