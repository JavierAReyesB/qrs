import { AppShell } from "@/components/app-shell"
import { RegistroForm } from "@/components/RegistroForm"

export default function GetQRPage() {
  return (
    <AppShell showBackButton>
      <div className="max-w-md mx-auto py-8">
        <RegistroForm />
      </div>
    </AppShell>
  )
}
