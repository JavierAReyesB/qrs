"use client"

import { useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { OfertaCard } from "@/components/oferta-card"
import { Button } from "@/components/ui/button"
import { COMERCIO } from "@/config/commerce"
import { BRAND } from "@/config/appBrand"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  // Force clear localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("promos:v1")
    }
  }, [])

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="text-center py-8 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            {BRAND.copy.tagline || COMERCIO.textos.bienvenida}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            {COMERCIO.textos.descripcionHero} {BRAND.copy.companyName && `en ${BRAND.copy.companyName}`}
          </p>
          <div className="pt-4 space-y-3">
            <Button asChild size="lg">
              <Link href="/get-qr">{BRAND.copy.ctaGetQR || "Obtener mi QR"}</Link>
            </Button>
            <div>
              <Link href="/recuperar" className="text-sm text-muted-foreground hover:text-foreground underline">
                {BRAND.copy.ctaRecover || "¿Ya tienes QR? Recupéralo"}
              </Link>
            </div>
          </div>
        </section>

        {/* Ofertas Section */}
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-center">Nuestras ofertas</h3>
          <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
            {COMERCIO.programas.sellos.activo && (
              <OfertaCard
                tipo="sellos"
                titulo={COMERCIO.programas.sellos.titulo}
                requisito={COMERCIO.programas.sellos.requisito}
              />
            )}
            {COMERCIO.programas.descuento.activo && (
              <OfertaCard
                tipo="descuento"
                titulo={COMERCIO.programas.descuento.titulo}
                porcentaje={COMERCIO.programas.descuento.porcentaje}
              />
            )}
          </div>
        </section>

        <section className="bg-muted rounded-lg p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold">¿Cómo funciona?</h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                1
              </div>
              <p className="font-medium">Regístrate gratis</p>
              <p className="text-muted-foreground">Crea tu cuenta en segundos</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                2
              </div>
              <p className="font-medium">Muestra tu QR</p>
              <p className="text-muted-foreground">En cada compra en tienda</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold">
                3
              </div>
              <p className="font-medium">Obtén recompensas</p>
              <p className="text-muted-foreground">Acumula y canjea beneficios</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
