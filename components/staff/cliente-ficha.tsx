"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import type { Cliente, Evento, EstadoSellos } from "@/types"
import { Mail, Phone, Gift, Percent, ShoppingBag, X, Award } from "lucide-react"
import { useFidelizacion } from "@/stores/useFidelizacion"
import { useToast } from "@/hooks/use-toast"
import { COMERCIO } from "@/config/commerce"
import { useState, useEffect } from "react"

interface ClienteFichaProps {
  cliente: Cliente
  onClose: () => void
  onUpdate?: () => void
}

export function ClienteFicha({ cliente, onClose, onUpdate }: ClienteFichaProps) {
  const { toast } = useToast()
  const { obtenerEstadoSellos, obtenerEventosCliente, agregarSello, registrarEvento } = useFidelizacion()

  const [sellos, setSellos] = useState<EstadoSellos | null>(null)
  const [eventos, setEventos] = useState<Evento[]>([])

  const cargarDatos = () => {
    setSellos(obtenerEstadoSellos(cliente.id))
    const eventosData = obtenerEventosCliente(cliente.id)
    setEventos(eventosData.slice(-5).reverse()) // Últimos 5 eventos
  }

  useEffect(() => {
    cargarDatos()
  }, [cliente.id])

  const handleAgregarSello = () => {
    const resultado = agregarSello(cliente.id, COMERCIO.programas.sellos.requisito)

    if (resultado.canje) {
      toast({
        title: "¡Canje realizado!",
        description: `${cliente.nombre} ha canjeado su recompensa`,
      })
    } else {
      toast({
        title: "Sello añadido",
        description: `Progreso: ${resultado.nuevoProgreso}/${COMERCIO.programas.sellos.requisito}`,
      })
    }

    cargarDatos()
    onUpdate?.()
  }

  const handleAplicarDescuento = () => {
    registrarEvento({
      clienteId: cliente.id,
      tipo: "descuento_aplicado",
      meta: { porcentaje: COMERCIO.programas.descuento.porcentaje },
    })

    toast({
      title: "Descuento aplicado",
      description: `${COMERCIO.programas.descuento.porcentaje}% aplicado a ${cliente.nombre}`,
    })

    cargarDatos()
    onUpdate?.()
  }

  const handleRegistrarCompra = () => {
    registrarEvento({
      clienteId: cliente.id,
      tipo: "compra",
    })

    toast({
      title: "Compra registrada",
      description: `Compra añadida al historial de ${cliente.nombre}`,
    })

    cargarDatos()
    onUpdate?.()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{cliente.nombre}</CardTitle>
            <CardDescription>
              Cliente desde{" "}
              {new Date(cliente.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información de contacto */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Contacto</h3>
          <div className="flex flex-wrap gap-2">
            {cliente.email && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {cliente.email}
              </Badge>
            )}
            {cliente.telefono && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {cliente.telefono}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Progreso de sellos */}
        {sellos && COMERCIO.programas.sellos.activo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Progreso de Sellos</h3>
              <Badge variant={sellos.progreso >= sellos.requisito ? "default" : "secondary"}>
                {sellos.progreso}/{sellos.requisito}
              </Badge>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.min((sellos.progreso / sellos.requisito) * 100, 100)}%`,
                }}
              />
            </div>
            {sellos.progreso >= sellos.requisito && (
              <Alert>
                <Award className="h-4 w-4" />
                <AlertDescription>Este cliente tiene una recompensa lista para canjear</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Separator />

        {/* Acciones rápidas */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm mb-3">Acciones rápidas</h3>
          <div className="grid grid-cols-1 gap-2">
            {COMERCIO.programas.sellos.activo && (
              <Button onClick={handleAgregarSello} className="w-full">
                <Gift className="w-4 h-4 mr-2" />
                Añadir sello
              </Button>
            )}
            {COMERCIO.programas.descuento.activo && (
              <Button onClick={handleAplicarDescuento} variant="secondary" className="w-full">
                <Percent className="w-4 h-4 mr-2" />
                Aplicar descuento ({COMERCIO.programas.descuento.porcentaje}%)
              </Button>
            )}
            <Button onClick={handleRegistrarCompra} variant="outline" className="w-full bg-transparent">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Registrar compra
            </Button>
          </div>
        </div>

        {/* Mini historial */}
        {eventos.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Actividad reciente</h3>
              <div className="space-y-2">
                {eventos.map((evento) => (
                  <div key={evento.id} className="text-xs flex items-center justify-between p-2 bg-muted rounded">
                    <span className="capitalize">{evento.tipo.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground">
                      {new Date(evento.fecha).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
