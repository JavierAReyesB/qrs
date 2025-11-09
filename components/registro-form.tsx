"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useClientes } from "@/stores/useClientes"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const registroSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(9, "Teléfono inválido").optional().or(z.literal("")),
  aceptarTerminos: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
})

type RegistroFormData = z.infer<typeof registroSchema>

export function RegistroForm() {
  const { crearSiNoExiste, recuperarPorEmail } = useClientes()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
  })

  const onSubmit = (data: RegistroFormData) => {
    setIsSubmitting(true)
    try {
      const existente = recuperarPorEmail(data.email)

      if (existente) {
        toast({
          title: "Ya tenías tu QR",
          description: "Te redirigimos a tu código QR personal",
        })
        router.push(`/mi-qr?cid=${existente.id}&t=${existente.token}`)
        return
      }

      const cliente = crearSiNoExiste(data.email, {
        nombre: data.nombre,
        telefono: data.telefono || undefined,
      })

      toast({
        title: "¡Bienvenido!",
        description: "Tu QR ha sido creado exitosamente",
      })

      router.push(`/mi-qr?cid=${cliente.id}&t=${cliente.token}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear tu QR. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Únete al programa</CardTitle>
        <CardDescription>Crea tu QR y comienza a acumular beneficios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" placeholder="Juan Pérez" {...register("nombre")} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="juan@ejemplo.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono (opcional)</Label>
            <Input id="telefono" type="tel" placeholder="612345678" {...register("telefono")} />
            {errors.telefono && <p className="text-sm text-destructive">{errors.telefono.message}</p>}
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" id="aceptarTerminos" {...register("aceptarTerminos")} className="mt-1" />
            <Label htmlFor="aceptarTerminos" className="text-sm font-normal">
              Acepto los términos y condiciones del programa de fidelización
            </Label>
          </div>
          {errors.aceptarTerminos && <p className="text-sm text-destructive">{errors.aceptarTerminos.message}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando tu QR..." : "Obtener mi QR"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
