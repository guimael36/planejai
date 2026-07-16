import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ExternalLink, Target } from 'lucide-react'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'
import type { SimulationRecord } from '@/data/simulation'
import { PageHero } from '@/components/shared/PageHero'

export function SimulationHistoryPage() {
  const { getAllSimulations, removeSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>([])

  useEffect(() => {
    setSimulations(getAllSimulations())
  }, [getAllSimulations])

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta simulação?')) {
      removeSimulation(id)
      setSimulations(getAllSimulations())
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      {simulations.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">
          <p>Nenhuma simulação encontrada.</p>
          <Link to="/" className="text-primary mt-4 inline-block font-medium hover:underline">
            Fazer uma nova simulação
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {simulations.map((sim) => {
            const monthlySavings = calcMonthlySavings(sim)

            return (
              <div
                key={sim.id}
                className="bg-card flex flex-col items-start justify-between gap-6 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:flex-row lg:items-center"
              >
                <div className="flex w-full items-center gap-4 lg:w-1/4">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{sim.goalName}</h3>
                    <span className="text-muted-foreground text-xs">
                      Simulação salva
                    </span>
                  </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-4 lg:w-1/2 lg:grid-cols-3">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">Custo da Meta</span>
                    <span className="font-medium">{sim.goalAmount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">Prazo</span>
                    <span className="font-medium">{sim.goalDeadline} meses</span>
                  </div>
                  <div className="col-span-2 flex flex-col lg:col-span-1">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">Economia Mensal</span>
                    <span className="font-medium">
                      R$ {monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex w-full items-center justify-end gap-4 lg:w-auto">
                  <button
                    onClick={() => handleDelete(sim.id)}
                    className="text-destructive hover:bg-destructive/10 rounded-lg p-2 transition-colors"
                    aria-label="Excluir simulação"
                  >
                    <Trash2 size={20} color='red' />
                  </button>
                  <Link
                    to={`/resultado/${sim.id}`}
                    className="border-input hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-lg border bg-transparent px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <ExternalLink size={16} />
                    Ver detalhes
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
