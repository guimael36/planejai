import { useCallback, useEffect, useState, useRef } from 'react'
import { buildAIPrompt } from '@/data/aiPrompt'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getInsight, type InsightData, sendChatMessageToMentor } from '@/services/aiService'
import type { SimulationRecord, ChatMessage } from '@/data/simulation'

export const useInsight = (id: string) => {
  const isRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)

    if (simulation?.insight) {
      console.log("⚡ [Cache] Insight recuperado! Evitando chamada para a API.")
      return simulation.insight
    }

    return null
  })

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const simulation = getFormData(id)
    return simulation?.chatHistory || []
  })
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsight = useCallback(
    async (simulationId: string) => {
      if (isRequestPending.current) return

      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)

        setInsight(data)

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord)
      } catch (err) {
        console.error("Erro ao buscar insight:", err)
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation]
  )

  const sendChatMessage = async (message: string) => {
    const simulation = getFormData(id)
    if (!simulation || !insight) return

    const newUserMessage: ChatMessage = { role: 'user', content: message }
    const updatedHistory = [...chatHistory, newUserMessage]
    setChatHistory(updatedHistory)
    setIsSendingMessage(true)

    try {
      const responseText = await sendChatMessageToMentor(message, chatHistory, insight)

      const newModelMessage: ChatMessage = { role: 'model', content: responseText }
      const finalHistory = [...updatedHistory, newModelMessage]

      setChatHistory(finalHistory)
      updateSimulation(id, { ...simulation, chatHistory: finalHistory } as SimulationRecord)
    } catch (err) {
      console.error(err)
      setChatHistory(chatHistory)
      alert("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setIsSendingMessage(false)
    }
  }

  useEffect(() => {
    if (insight || error) {
      return
    }

    fetchInsight(id)
  }, [id, insight, error, fetchInsight])

  return { insight, isLoading, error, fetchInsight, chatHistory, sendChatMessage, isSendingMessage }
}
