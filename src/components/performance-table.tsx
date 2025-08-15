
"use client"

import * as React from "react"
import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GamePerformanceData } from "@/lib/performance-data"
import { ArrowUpDown, ExternalLink, Lightbulb, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const getStatusColor = (status: 'red' | 'purple' | 'yellow' | 'light-blue') => {
    switch (status) {
        case 'red': return 'bg-red-500';
        case 'purple': return 'bg-purple-500';
        case 'yellow': return 'bg-yellow-500';
        case 'light-blue': return 'bg-sky-400';
    }
}

export const columns: ColumnDef<GamePerformanceData>[] = [
    {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status;
        return (
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className={cn("w-3 h-3 rounded-full", getStatusColor(status.color))} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{status.tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
  },
  {
    accessorKey: "game",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Game
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const game = row.original;
      return (
        <div className="flex items-center gap-2 font-medium">
            {game.game}
            <Link href={game.gameLink} target="_blank">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
        </div>
      )
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>
  },
  {
    accessorKey: "playedTimes",
    header: "Plays (24h)",
  },
  {
    accessorKey: "winLossRatio",
    header: "Win %",
    cell: ({ row }) => {
        const ratio = row.original.winLossRatio;
        const color = ratio > 50 ? "text-green-500" : "text-destructive";
        return <span className={cn("font-bold", color)}>{ratio}%</span>
    }
  },
  {
    accessorKey: "income",
    header: "Income (24h)",
    cell: ({ row }) => `$${row.original.income.toLocaleString()}`
  },
  {
    accessorKey: "avgTime",
    header: "Avg Time",
    cell: ({ row }) => `${row.original.avgTime}s`
  },
  {
    accessorKey: "roi",
    header: "ROI %",
     cell: ({ row }) => {
        const roi = row.original.roi;
        const color = roi > 0 ? "text-green-500" : "text-destructive";
        return <span className={cn("font-bold", color)}>{roi > 0 ? '+' : ''}{roi}%</span>
    }
  },
  {
    accessorKey: "bugs",
    header: "Bugs",
  },
  {
    accessorKey: "shooterEyeStatus",
    header: "Shooter Eye",
    cell: ({ row }) => {
        const status = row.original.shooterEyeStatus;
        const color = status === "Normal" ? "text-green-500" : status === "Concern" ? "text-yellow-500" : "text-destructive";
        return <span className={cn("font-semibold", color)}>{status}</span>
    }
  },
   {
    accessorKey: "liveResults",
    header: "Live Results",
    cell: ({ row }) => {
        const result = row.original.liveResults;
        return (
            <div className="text-xs p-1 rounded-md bg-secondary text-secondary-foreground flex items-center gap-1">
                {result.type === "win" ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                <span>{result.details}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "ideas",
    header: "Ideas",
    cell: () => (
         <Button variant="ghost" size="icon" className="h-6 w-6">
            <Lightbulb className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
    )
  }
]


interface DataTableProps<TData, TValue> {
  data: TData[]
}

export function PerformanceTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
        <div className="flex items-center py-4">
            <Input
            placeholder="Filter by game name..."
            value={(table.getColumn("game")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("game")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <div className="flex items-center justify-end space-x-2 py-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
      </div>
    </div>
  )
}
