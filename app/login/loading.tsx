import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
