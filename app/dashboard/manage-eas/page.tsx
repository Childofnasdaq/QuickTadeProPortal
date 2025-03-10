"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useData } from "@/components/data-provider"
import { formatDate } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"

export default function ManageEAsPage() {
  const { eas, addEA, deleteEA } = useData()
  const [newEAName, setNewEAName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddEA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newEAName.trim()) {
      setError("Please enter an EA name")
      return
    }

    setIsLoading(true)

    const result = await addEA(newEAName)

    if (result) {
      setNewEAName("")
      setIsAdding(false)
    } else {
      setError("Failed to add EA")
    }

    setIsLoading(false)
  }

  const handleDeleteEA = async (id: string) => {
    const success = await deleteEA(id)

    if (!success) {
      setError("Cannot delete EA because it is in use by one or more license keys")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage EAs</h1>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-red-500 hover:bg-red-600 text-white"
          disabled={isAdding}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New EA
        </Button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md">{error}</div>}

      {isAdding && (
        <div className="bg-red-950/20 border border-red-500 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-300 mb-4">New EA</h2>
          <form onSubmit={handleAddEA} className="space-y-4">
            <div>
              <Input
                placeholder="Full EA name including version number"
                value={newEAName}
                onChange={(e) => setNewEAName(e.target.value)}
                className="bg-black/50 border-red-500/50 focus:border-red-500 text-white"
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add EA"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-950"
                onClick={() => {
                  setIsAdding(false)
                  setNewEAName("")
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-black border border-red-900 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-red-900">
          <h2 className="text-lg font-semibold text-red-300">TOTAL EAs</h2>
          <p className="text-red-400 text-sm">All EAs you are licensing</p>
        </div>

        {eas.length === 0 ? (
          <div className="p-8 text-center text-red-400">No EAs found. Add your first EA using the button above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-950/30">
                  <th className="px-4 py-3 text-left text-red-300 font-medium">EA</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Created</th>
                  <th className="px-4 py-3 text-right text-red-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eas.map((ea) => (
                  <tr key={ea.id} className="border-t border-red-900/30">
                    <td className="px-4 py-3 text-white">{ea.name}</td>
                    <td className="px-4 py-3 text-red-400">{formatDate(ea.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEA(ea.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

