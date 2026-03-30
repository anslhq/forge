import { auth } from "@platform/auth/server";
import { api } from "@platform/backend/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { notFound, redirect } from "next/navigation";
import { env } from "@/env";
import { Header } from "../components/header";

interface PageRecord {
  _id: string;
  title: string;
}

interface SearchPageProperties {
  searchParams: Promise<{
    q: string;
  }>;
}

const convex = env.NEXT_PUBLIC_CONVEX_URL
  ? new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL)
  : null;

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;
  const pages = convex
    ? ((await convex.query(api.pages.list)) as PageRecord[]).filter((page) =>
        page.title.toLowerCase().includes(q.toLowerCase())
      )
    : [];
  const { orgId } = await auth();

  if (!orgId) {
    notFound();
  }

  if (!q) {
    redirect("/");
  }

  return (
    <>
      <Header page="Search" pages={["Building Your Application"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {pages.map((page) => (
            <div className="aspect-video rounded-xl bg-muted/50" key={page._id}>
              {page.title}
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default SearchPage;
