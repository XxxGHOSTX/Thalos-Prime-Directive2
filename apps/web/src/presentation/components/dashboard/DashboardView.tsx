'use client'

// Presentation Component: Dashboard View
// Main dashboard UI with domain-driven structure

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: string
}

export function DashboardView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulated data for now - will connect to API later
    setTasks([
      {
        id: '1',
        title: 'Initialize Project',
        description: 'Set up the monorepo structure',
        status: 'COMPLETED',
      },
      {
        id: '2',
        title: 'Implement DDD Patterns',
        description: 'Create domain entities and repositories',
        status: 'IN_PROGRESS',
      },
    ])
    setIsLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Thalos Prime
          </h1>
          <p className="text-xl text-gray-300">
            Production-ready monorepo with Domain-Driven Design
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">
              Architecture
            </h2>
            <p className="text-gray-300">
              Built with Next.js 14 App Router, FastAPI, and PostgreSQL
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-purple-400">
              Domain-Driven
            </h2>
            <p className="text-gray-300">
              Clean architecture with separated concerns and bounded contexts
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-green-400">
              Production Ready
            </h2>
            <p className="text-gray-300">
              Docker, CI/CD, type safety, and environment configuration
            </p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Tasks</h2>
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {task.title}
                      </h3>
                      <p className="text-gray-400 mb-3">{task.description}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          task.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
