import type React from "react"
import { BRAND } from "@/config/appBrand"
import Image from "next/image"
import Link from "next/link"

interface AppShellProps {
  children: React.ReactNode
  showBackButton?: boolean
}

export function AppShell({ children, showBackButton = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <Image
                src={BRAND.assets.logo || "/placeholder.svg"}
                alt={BRAND.copy.companyName}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-none">{BRAND.copy.companyName}</h1>
              {BRAND.copy.city && <p className="text-xs text-muted-foreground">{BRAND.copy.city}</p>}
            </div>
          </Link>
          {showBackButton && (
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Volver
            </Link>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
      {/* Reutiliza Footer existente y añade enlaces legales RGPD */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          {BRAND.copy.footerNote && (
            <p className="text-center text-sm text-muted-foreground mb-4">
              {BRAND.copy.footerNote}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/terminos" className="hover:text-foreground underline">
              Términos y Condiciones
            </Link>
            <span>·</span>
            <Link href="/privacidad" className="hover:text-foreground underline">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
