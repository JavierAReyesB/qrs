"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Phone, Eye } from "lucide-react"
import type { Cliente } from "@/types"
import { useEffect, useState } from "react"
import { listarClientes } from "@/lib/dataAdapter"
import { useFidelizacion } from "@/stores/useFidelizacion"

interface ClientesTablaProps {
  onVerCliente?: (cliente: Cliente) => void
}

export function ClientesTabla({ onVerCliente }: ClientesTablaProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const { obtenerEstadoSellos, obtenerEventosCliente } = useFidelizacion()

  useEffect(() => {
    setClientes(listarClientes())
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes registrados</CardTitle>
        <CardDescription>
          Total de {clientes.length} cliente{clientes.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clientes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay clientes registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Sellos</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => {
                  const sellos = obtenerEstadoSellos(cliente.id)
                  const eventos = obtenerEventosCliente(cliente.id)
                  const ultimoEvento =
                    eventos.length > 0 ? new Date(eventos[eventos.length - 1].fecha) : new Date(cliente.createdAt)

                  return (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nombre}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {cliente.email && (
                            <Badge variant="outline" className="text-xs w-fit">
                              <Mail className="w-3 h-3 mr-1" />
                              {cliente.email}
                            </Badge>
                          )}
                          {cliente.telefono && (
                            <Badge variant="outline" className="text-xs w-fit">
                              <Phone className="w-3 h-3 mr-1" />
                              {cliente.telefono}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{sellos ? `${sellos.progreso}/${sellos.requisito}` : "0/10"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ultimoEvento.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => onVerCliente?.(cliente)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
