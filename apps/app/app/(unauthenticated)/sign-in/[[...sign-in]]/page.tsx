import { createMetadata } from "@platform/seo/metadata";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const title = "Welcome back";
const description = "Enter your details to sign in.";
const SignIn = dynamic(() =>
  import("@platform/auth/components/sign-in").then((mod) => mod.SignIn)
);

export const metadata: Metadata = createMetadata({ title, description });

const SignInPage = () => <SignIn />;

export default SignInPage;
