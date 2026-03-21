import { Metadata } from "next"
import { UsersTable } from "./_components/users-table"
import { UsersHeader } from "./_components/users-header"

export const metadata: Metadata = {
  title: "Users | DevPortfolio",
  description: "Manage system users",
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersTable />
    </div>
  )
}
