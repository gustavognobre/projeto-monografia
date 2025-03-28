"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Save, FileDown, FileUp } from "lucide-react"

export type ReferenceParameter = {
  id: string
  name: string
  unit: string
  category: string
  gender?: "male" | "female" | "child" | "all"
  minValue: number
  maxValue: number
  borderlineMin?: number
  borderlineMax?: number
  description?: string
}

export default function ParameterManager() {
  const [parameters, setParameters] = useState<ReferenceParameter[]>([
    {
      id: "glicemia",
      name: "Glicemia em jejum",
      unit: "mg/dL",
      category: "Exames de Sangue",
      gender: "all",
      minValue: 70,
      maxValue: 99,
      borderlineMin: 100,
      borderlineMax: 125,
      description: "Valores de referência para glicemia em jejum",
    },
    {
      id: "colesterol-total",
      name: "Colesterol Total",
      unit: "mg/dL",
      category: "Exames de Sangue",
      gender: "all",
      minValue: 0,
      maxValue: 199,
      borderlineMin: 200,
      borderlineMax: 239,
      description: "Valores de referência para colesterol total",
    },
    {
      id: "hdl-homem",
      name: "HDL",
      unit: "mg/dL",
      category: "Exames de Sangue",
      gender: "male",
      minValue: 40,
      maxValue: 999,
      description: "Valores de referência para HDL em homens",
    },
  ])

  const [newParameter, setNewParameter] = useState<Partial<ReferenceParameter>>({
    category: "Exames de Sangue",
    gender: "all",
    unit: "mg/dL",
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    "Exames de Sangue",
    "Exames de Urina",
    "Exames de Fezes",
    "Medidas Físicas",
    "Exames Cardíacos",
    "Função Hepática",
    "Outros",
  ]

  const handleAddParameter = () => {
    if (!newParameter.name || !newParameter.unit) {
      alert("Nome e unidade são obrigatórios")
      return
    }

    const id = newParameter.id || newParameter.name.toLowerCase().replace(/\s+/g, "-")

    const parameterToAdd: ReferenceParameter = {
      id,
      name: newParameter.name,
      unit: newParameter.unit,
      category: newParameter.category || "Outros",
      gender: newParameter.gender || "all",
      minValue: Number(newParameter.minValue) || 0,
      maxValue: Number(newParameter.maxValue) || 0,
      borderlineMin: newParameter.borderlineMin !== undefined ? Number(newParameter.borderlineMin) : undefined,
      borderlineMax: newParameter.borderlineMax !== undefined ? Number(newParameter.borderlineMax) : undefined,
      description: newParameter.description,
    }

    if (editingId) {
      setParameters(parameters.map((p) => (p.id === editingId ? parameterToAdd : p)))
      setEditingId(null)
    } else {
      setParameters([...parameters, parameterToAdd])
    }

    setNewParameter({
      category: "Exames de Sangue",
      gender: "all",
      unit: "mg/dL",
    })
  }

  const handleEditParameter = (parameter: ReferenceParameter) => {
    setNewParameter(parameter)
    setEditingId(parameter.id)
  }

  const handleDeleteParameter = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este parâmetro?")) {
      setParameters(parameters.filter((p) => p.id !== id))
    }
  }

  const handleExportParameters = () => {
    const dataStr = JSON.stringify(parameters, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "parametros-referencia.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleImportParameters = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedParameters = JSON.parse(e.target?.result as string)
        if (Array.isArray(importedParameters)) {
          setParameters(importedParameters)
          alert("Parâmetros importados com sucesso!")
        } else {
          alert("Formato de arquivo inválido")
        }
      } catch (error) {
        alert("Erro ao importar parâmetros: " + error)
      }
    }
    reader.readAsText(file)
  }

  const filteredParameters = parameters.filter((param) => {
    const matchesSearch =
      param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      param.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || param.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedParameters = filteredParameters.reduce(
    (acc, param) => {
      if (!acc[param.category]) {
        acc[param.category] = []
      }
      acc[param.category].push(param)
      return acc
    },
    {} as Record<string, ReferenceParameter[]>,
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="list">Lista de Parâmetros</TabsTrigger>
          <TabsTrigger value="add">Adicionar/Editar Parâmetro</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Referência</CardTitle>
              <CardDescription>Gerencie os parâmetros de referência para os exames</CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar</Label>
                  <Input
                    id="search"
                    placeholder="Buscar parâmetros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-64">
                  <Label htmlFor="category-filter">Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(groupedParameters).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum parâmetro encontrado com os filtros atuais
                  </p>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(groupedParameters).map(([category, params]) => (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger>
                          {category} ({params.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nome</TableHead>
                                  <TableHead>Unidade</TableHead>
                                  <TableHead>Gênero</TableHead>
                                  <TableHead>Valores Normais</TableHead>
                                  <TableHead>Valores Limítrofes</TableHead>
                                  <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {params.map((param) => (
                                  <TableRow key={param.id}>
                                    <TableCell className="font-medium">{param.name}</TableCell>
                                    <TableCell>{param.unit}</TableCell>
                                    <TableCell>
                                      {param.gender === "male"
                                        ? "Masculino"
                                        : param.gender === "female"
                                          ? "Feminino"
                                          : param.gender === "child"
                                            ? "Infantil"
                                            : "Todos"}
                                    </TableCell>
                                    <TableCell>
                                      {param.minValue !== undefined && param.maxValue !== undefined
                                        ? `${param.minValue} - ${param.maxValue}`
                                        : param.minValue !== undefined
                                          ? `> ${param.minValue}`
                                          : param.maxValue !== undefined
                                            ? `< ${param.maxValue}`
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      {param.borderlineMin !== undefined && param.borderlineMax !== undefined
                                        ? `${param.borderlineMin} - ${param.borderlineMax}`
                                        : param.borderlineMin !== undefined
                                          ? `> ${param.borderlineMin}`
                                          : param.borderlineMax !== undefined
                                            ? `< ${param.borderlineMax}`
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditParameter(param)}>
                                          Editar
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleDeleteParameter(param.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportParameters}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <div className="relative">
                  <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
                    <FileUp className="h-4 w-4 mr-2" />
                    Importar
                  </Button>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportParameters}
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  setEditingId(null)
                  setNewParameter({
                    category: "Exames de Sangue",
                    gender: "all",
                    unit: "mg/dL",
                  })
                  document.querySelector('[data-value="add"]')?.click()
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Parâmetro
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Editar Parâmetro" : "Adicionar Novo Parâmetro"}</CardTitle>
              <CardDescription>
                {editingId
                  ? "Modifique os valores do parâmetro selecionado"
                  : "Defina um novo parâmetro de referência para exames"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="param-name">Nome do Parâmetro*</Label>
                    <Input
                      id="param-name"
                      placeholder="Ex: Hemoglobina"
                      value={newParameter.name || ""}
                      onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="param-unit">Unidade de Medida*</Label>
                    <Input
                      id="param-unit"
                      placeholder="Ex: g/dL"
                      value={newParameter.unit || ""}
                      onChange={(e) => setNewParameter({ ...newParameter, unit: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="param-category">Categoria</Label>
                    <Select
                      value={newParameter.category || "Exames de Sangue"}
                      onValueChange={(value) => setNewParameter({ ...newParameter, category: value })}
                    >
                      <SelectTrigger id="param-category">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="param-gender">Aplicável a</Label>
                    <Select
                      value={newParameter.gender || "all"}
                      onValueChange={(value: "male" | "female" | "child" | "all") =>
                        setNewParameter({ ...newParameter, gender: value })
                      }
                    >
                      <SelectTrigger id="param-gender">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="child">Infantil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Valores de Referência Normais</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="param-min">Mínimo</Label>
                        <Input
                          id="param-min"
                          type="number"
                          step="0.01"
                          placeholder="Valor mínimo"
                          value={newParameter.minValue !== undefined ? newParameter.minValue : ""}
                          onChange={(e) =>
                            setNewParameter({
                              ...newParameter,
                              minValue: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="param-max">Máximo</Label>
                        <Input
                          id="param-max"
                          type="number"
                          step="0.01"
                          placeholder="Valor máximo"
                          value={newParameter.maxValue !== undefined ? newParameter.maxValue : ""}
                          onChange={(e) =>
                            setNewParameter({
                              ...newParameter,
                              maxValue: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Valores Limítrofes (opcional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="param-borderline-min">Mínimo</Label>
                        <Input
                          id="param-borderline-min"
                          type="number"
                          step="0.01"
                          placeholder="Valor mínimo limítrofe"
                          value={newParameter.borderlineMin !== undefined ? newParameter.borderlineMin : ""}
                          onChange={(e) =>
                            setNewParameter({
                              ...newParameter,
                              borderlineMin: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="param-borderline-max">Máximo</Label>
                        <Input
                          id="param-borderline-max"
                          type="number"
                          step="0.01"
                          placeholder="Valor máximo limítrofe"
                          value={newParameter.borderlineMax !== undefined ? newParameter.borderlineMax : ""}
                          onChange={(e) =>
                            setNewParameter({
                              ...newParameter,
                              borderlineMax: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="param-description">Descrição (opcional)</Label>
                    <Input
                      id="param-description"
                      placeholder="Descrição ou observações sobre este parâmetro"
                      value={newParameter.description || ""}
                      onChange={(e) => setNewParameter({ ...newParameter, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setNewParameter({
                    category: "Exames de Sangue",
                    gender: "all",
                    unit: "mg/dL",
                  })
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddParameter}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Salvar Alterações" : "Adicionar Parâmetro"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

