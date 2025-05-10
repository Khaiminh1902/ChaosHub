import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="auth-page flex items-center justify-center min-h-screen p-4 overflow-hidden">
      <div className="flex items-center justify-center w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-[rgb(59,130,246)] hover:bg-[rgb(96,165,250)] text-white",
              card: "bg-white/90 dark:bg-black/90 text-black dark:text-white shadow-lg rounded-lg",
              headerTitle: "text-2xl font-bold text-center",
              headerSubtitle: "text-gray-600 dark:text-gray-400 text-center",
              formFieldInput:
                "border-[rgb(59,130,246)] focus:ring-[rgb(59,130,246)] dark:border-[rgb(96,165,250)] dark:focus:ring-[rgb(96,165,250)]",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
            },
          }}
        />
      </div>
    </div>
  );
}
