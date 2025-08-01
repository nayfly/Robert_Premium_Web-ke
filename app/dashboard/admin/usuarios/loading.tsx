import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function UsuariosLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>

      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}
