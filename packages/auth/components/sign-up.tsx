import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import { isClerkConfigured, isDevelopmentAuthFallback } from "../config";

export const SignUp = () => {
  if (!isClerkConfigured()) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="font-semibold text-2xl tracking-tight">
          Authentication is not configured
        </h1>
        <p className="text-muted-foreground text-sm">
          {isDevelopmentAuthFallback()
            ? "The scaffold is running in development fallback mode. Configure Clerk to enable the hosted sign-up flow."
            : "Add Clerk environment variables to enable the hosted sign-up flow."}
        </p>
      </div>
    );
  }

  return (
    <ClerkSignUp
      appearance={{
        elements: {
          header: "hidden",
        },
      }}
    />
  );
};
