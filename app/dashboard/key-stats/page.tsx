"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useData } from "@/components/data-provider"
import { formatDate } from "@/lib/utils"
import { Trash2, XCircle } from "lucide-react"
import { getPlanDisplayName } from "@/lib/utils"

export default function KeyStatsPage() {
  const { licenseKeys, deleteLicenseKey, deactivateLicenseKey } = useData()
  const [error, setError] = useState("")

  const handleDeleteKey = async (id: string) => {
    const success = await deleteLicenseKey(id)

    if (!success) {
      setError("Failed to delete license key")
    }
  }

  const handleDeactivateKey = async (id: string) => {
    const success = await deactivateLicenseKey(id)

    if (!success) {
      setError("Failed to deactivate license key")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">ALL LICENCE KEYS</h1>
        <p className="text-red-400 mt-1">Total licence keys</p>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-2 rounded-md">{error}</div>}

      <div className="bg-black border border-red-900 rounded-lg overflow-hidden">
        {licenseKeys.length === 0 ? (
          <div className="p-8 text-center text-red-400">
            No license keys found. Generate keys from the "Generate key" page.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-950/30">
                  <th className="px-4 py-3 text-left text-red-300 font-medium">User</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">KEY</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">EA</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Plan</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Created</th>
                  <th className="px-4 py-3 text-left text-red-300 font-medium">Expires</th>
                  <th className="px-4 py-3 text-right text-red-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {licenseKeys.map((key) => (
                  <tr key={key.id} className="border-t border-red-900/30">
                    <td className="px-4 py-3 text-white">{key.username}</td>
                    <td className="px-4 py-3 text-blue-400 font-mono">{key.key}</td>
                    <td className="px-4 py-3 text-red-400">{key.eaName}</td>
                    <td className="px-4 py-3 text-red-400">{getPlanDisplayName(key.plan)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.status === "active"
                            ? "bg-green-100 text-green-800"
                            : key.status === "inactive"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-400">{formatDate(key.createdAt)}</td>
                    <td className="px-4 py-3 text-red-400">
                      {key.plan === "lifetime" ? "Never" : formatDate(key.expiryDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        {key.status === "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivateKey(key.id)}
                            className="text-yellow-500 hover:text-yellow-400 hover:bg-red-950/30"
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Deactivate</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
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

