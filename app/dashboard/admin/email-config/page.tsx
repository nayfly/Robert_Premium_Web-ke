import EmailConfigDashboard from "@/components/email-config-dashboard"

export default function EmailConfigPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración de Emails</h1>
        <p className="text-muted-foreground">Gestiona y prueba el sistema de emails automáticos</p>
      </div>

      <EmailConfigDashboard />
    </div>
  )
}
