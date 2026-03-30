import { JsonLd } from "@platform/seo/json-ld";
import { createMetadata } from "@platform/seo/metadata";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { blogPosts } from "../../content";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const url = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

interface BlogPostProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: BlogPostProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.title,
    description: post.description,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  return blogPosts.map(({ slug }) => ({ slug }));
};

const BlogPost = async ({ params }: BlogPostProperties) => {
  const { slug } = await params;
  const page = blogPosts.find((entry) => entry.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        code={{
          "@type": "BlogPosting",
          "@context": "https://schema.org",
          datePublished: page.date,
          description: page.description,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": new URL(`/blog/${page.slug}`, url).toString(),
          },
          headline: page.title,
          dateModified: page.date,
          isAccessibleForFree: true,
        }}
      />
      <div className="container mx-auto py-16">
        <Link
          className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
          href="/blog"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blog
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
    </>
  );
};

export default BlogPost;
