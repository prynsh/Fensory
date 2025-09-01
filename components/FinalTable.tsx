"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const curatedPoolIds = {
  Lending: [
    "db678df9-3281-4bc2-a8bb-01160ffd6d48",
    "c1ca08e4-d618-415e-ad63-fcec58705469",
    "8edfdf02-cdbb-43f7-bca6-954e5fe56813",
  ],
  "Liquid Staking": [
    "747c1d2a-c668-4682-b9f9-296708a3dd90",
    "80b8bf92-b953-4c20-98ea-c9653ef2bb98",
    "90bfb3c2-5d35-4959-a275-ba5085b08aa3",
  ],
  "Yield Aggregator": [
    "107fb915-ab29-475b-b526-d0ed0d3e6110",
    "05a3d186-2d42-4e21-b1f0-68c079d22677",
    "1977885c-d5ae-4c9e-b4df-863b7e1578e6",
  ],
}

const poolCategoryMap: Record<string, string> = Object.entries(curatedPoolIds)
  .flatMap(([category, ids]) =>
    ids.map((id) => [id, category] as [string, string])
  )
  .reduce((acc, [id, category]) => {
    acc[id] = category
    return acc
  }, {} as Record<string, string>)

type PoolRow = {
  category: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apy: number
  prediction: number | null
}
function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-")
}

export default function PoolsTable() {
  const [data, setData] = React.useState<PoolRow[]>([])
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All")
  const router = useRouter()

  React.useEffect(() => {
    fetch("https://yields.llama.fi/pools")
      .then((res) => res.json())
      .then((json) => {
        const filtered = json.data
          .filter((pool: any) => poolCategoryMap[pool.pool]) // keeping only selected ones
          .map((pool: any) => ({
            category: poolCategoryMap[pool.pool],
            chain: pool.chain,
            project: pool.project,
            symbol: pool.symbol,
            tvlUsd: pool.tvlUsd,
            apy: pool.apy,
            prediction: pool.predictions?.predictedProbability ?? null,
          }))
        setData(filtered)
      })
  }, [])

  const filteredData =
    categoryFilter === "All"
      ? data
      : data.filter((row) => row.category === categoryFilter)

  const columns: ColumnDef<PoolRow>[] = [
    { accessorKey: "category", header: "Category" },
    { accessorKey: "chain", header: "Chain" },
    {
      accessorKey: "project",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original.project
        const slug = slugify(project)
        return (
          <button
            onClick={() => router.push(`/project/${slug}`)}
            className="text-blue-600 hover:underline"
          >
            {project}
          </button>
        )
      },
    },
    { accessorKey: "symbol", header: "Symbol" },
    { accessorKey: "tvlUsd", header: "TVL (USD)" },
    { accessorKey: "apy", header: "APY (%)" },
    {
      accessorKey: "prediction",
      header: "Prediction",
      cell: ({ getValue }) => {
        const value = getValue() as number | null
        return value !== null ? `${(value * 100).toFixed(2)}%` : "N/A"
      },
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Filter dropdown */}
      <Select onValueChange={(val) => setCategoryFilter(val)} defaultValue="All">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {Object.keys(curatedPoolIds).map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
          {/* {Table} */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
