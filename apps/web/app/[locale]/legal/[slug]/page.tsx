import { createMetadata } from "@platform/seo/metadata";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { legalPages } from "../../content";

interface LegalPageProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = legalPages.find((entry) => entry.slug === slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.title,
    description: post.description,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  return legalPages.map(({ slug }) => ({ slug }));
};

const LegalPage = async ({ params }: LegalPageProperties) => {
  const { slug } = await params;
  const page = legalPages.find((entry) => entry.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container max-w-5xl py-16">
      <Link
        className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
        href="/"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Home
      </Link>
      <div className="prose prose-neutral dark:prose-invert max-w-3xl">
        <h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-5xl">
          {page.title}
        </h1>
        <p className="text-balance leading-7 [&:not(:first-child)]:mt-6">
          {page.description}
        </p>
        {page.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default LegalPage;
