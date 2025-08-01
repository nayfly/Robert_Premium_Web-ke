import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 mt-4">Preparando tu checkout...</p>
      </div>
    </div>
  )
}
