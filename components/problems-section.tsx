"use client"

import { AlertTriangle, Clock, DollarSign, Users, TrendingDown } from "lucide-react"

interface ProblemsSectionProps {
  dict: any
}

export function ProblemsSection({ dict }: ProblemsSectionProps) {
  // Verificar que dict y dict.problems existen
  if (!dict || !dict.problems) {
    console.error("ProblemsSection: dict or dict.problems is undefined")
    return null
  }

  const problems = [
    {
      icon: Clock,
      title: dict.problems.problem1?.title || "Procesos manuales que consumen tiempo",
      description:
        dict.problems.problem1?.description ||
        "Tu equipo pierde horas en tareas repetitivas que podrían automatizarse.",
    },
    {
      icon: DollarSign,
      title: dict.problems.problem2?.title || "Costes operativos descontrolados",
      description:
        dict.problems.problem2?.description || "Gastos que crecen más rápido que los ingresos por falta de eficiencia.",
    },
    {
      icon: AlertTriangle,
      title: dict.problems.problem3?.title || "Vulnerabilidades de seguridad ocultas",
      description: dict.problems.problem3?.description || "Tu empresa está expuesta a riesgos que ni siquiera conoces.",
    },
    {
      icon: Users,
      title: dict.problems.problem4?.title || "Equipos sobrecargados y desmotivados",
      description:
        dict.problems.problem4?.description || "Talento valioso perdido en tareas que no aportan valor estratégico.",
    },
    {
      icon: TrendingDown,
      title: dict.problems.problem5?.title || "Competencia que avanza más rápido",
      description:
        dict.problems.problem5?.description || "Mientras dudas, otros ya están implementando IA y automatización.",
    },
  ]

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {dict.problems.title || "¿Te suena"}{" "}
            <span className="text-red-400">{dict.problems.titleHighlight || "familiar"}</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {dict.problems.subtitle ||
              "Estos son los problemas reales que frenan el crecimiento de empresas como la tuya."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-6 bg-gray-900/30 rounded-xl border border-gray-800 hover:border-red-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-lg flex-shrink-0">
                  <problem.icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">{problem.title}</h3>
                  <p className="text-gray-300">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              {dict.problems.solution?.title || "La buena noticia:"}{" "}
              <span className="text-purple-400">
                {dict.problems.solution?.titleHighlight || "Todos tienen solución"}
              </span>
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              {dict.problems.solution?.description ||
                "Con la estrategia correcta y las herramientas adecuadas, puedes convertir estos problemas en ventajas competitivas."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
