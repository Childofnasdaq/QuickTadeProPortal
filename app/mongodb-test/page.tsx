"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MongoDBTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTest = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-mongodb")
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      console.error("Error testing MongoDB:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>MongoDB Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTest} disabled={isLoading} className="bg-red-500 hover:bg-red-600">
            {isLoading ? "Testing..." : "Test MongoDB Connection"}
          </Button>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-md">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {testResult && (
            <div
              className={`p-4 rounded-md ${testResult.success ? "bg-green-900/30 border border-green-500 text-green-200" : "bg-red-900/30 border border-red-500 text-red-200"}`}
            >
              <p className="font-bold">
                {testResult.success ? "Success:" : "Failed:"} {testResult.message}
              </p>

              {testResult.success && testResult.details && (
                <div className="mt-4">
                  <p className="font-semibold">Collections:</p>
                  <ul className="list-disc pl-5 mt-2">
                    {testResult.details.collections.length > 0 ? (
                      testResult.details.collections.map((collection: string) => <li key={collection}>{collection}</li>)
                    ) : (
                      <li>No collections found</li>
                    )}
                  </ul>
                </div>
              )}

              {!testResult.success && testResult.error && (
                <div className="mt-4">
                  <p className="font-semibold">Error Details:</p>
                  <p className="mt-2 whitespace-pre-wrap">{testResult.error}</p>

                  {testResult.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">Stack Trace</summary>
                      <pre className="mt-2 text-xs overflow-auto p-2 bg-black/50 rounded">{testResult.stack}</pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="bg-black/50 p-4 rounded-md border border-red-500/30">
            <h3 className="font-semibold text-red-300 mb-2">Troubleshooting Tips:</h3>
            <ul className="list-disc pl-5 space-y-2 text-red-200">
              <li>Make sure your MongoDB Atlas cluster is running and accessible</li>
              <li>Check that the username and password in the connection string are correct</li>
              <li>Verify that your IP address is whitelisted in MongoDB Atlas</li>
              <li>Ensure the database name "quicktradepro" exists in your MongoDB cluster</li>
              <li>Check if your MongoDB Atlas free tier hasn't expired</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

