/* eslint-disable @next/next/no-html-link-for-pages */
import { Metadata } from "next"
import { ProjectDetails } from "./_components/project-details"
import { Comments } from "./_components/comments"

export const metadata: Metadata = {
  title: "Project Details | DevPortfolio",
  description: "View project details and interact",
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

  if (!id) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Project ID</h1>
        <p className="mt-2">The project ID is missing or invalid.</p>
        <a href="/projects" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Projects
        </a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-8">
        <ProjectDetails projectId={id} />
        <Comments projectId={id} />
      </div>
    </div>
  )
}