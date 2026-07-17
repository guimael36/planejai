import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { useInsight } from '@/hooks/useInsight'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'
import { Error } from '../Insights/Error'
import { Content } from '../Insights/Content'
import { Send, User, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const {
    insight,
    isLoading,
    error,
    fetchInsight,
    chatHistory,
    sendChatMessage,
    isSendingMessage,
  } = useInsight(simulationId)

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, isSendingMessage])

  const handleSend = () => {
    if (!inputValue.trim() || isSendingMessage) return
    sendChatMessage(inputValue.trim())
    setInputValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="bg-card order-2 flex h-200 flex-col overflow-hidden rounded-2xl shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="shrink-0 p-6 pb-2">
        <div className="mb-3 flex items-center gap-1.5">
          <span>✨</span>
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Insight Financeiro Personalizado
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoading && (
          <div className="flex">
            <Skeleton
              count={10.5}
              baseColor="var(--color-skeleton-base)"
              highlightColor="var(--color-skeleton-highlight)"
              className="mb-3 flex rounded-lg"
              containerClassName="flex-1"
              inline
            />
          </div>
        )}

        {!isLoading && error && (
          <Error
            simulationId={simulationId}
            message={error}
            onRetry={() => fetchInsight(simulationId)}
          />
        )}

        {!isLoading && insight && (
          <>
            <Content insight={insight} />

            {chatHistory.length > 0 && <hr className="border-border my-8" />}

            <div className="mt-4 flex flex-col gap-6">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {msg.role === 'user' ? (
                      <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full">
                        <User size={14} />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/10 text-purple-600">
                        <Bot size={14} />
                      </div>
                    )}
                    <span className="text-sm font-semibold">
                      {msg.role === 'user' ? 'Você' : 'Resposta da IA'}
                    </span>
                  </div>

                  <div className="text-muted-foreground pl-8 text-sm leading-relaxed">
                    {msg.role === 'model' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isSendingMessage && (
                <div className="text-muted-foreground flex animate-pulse items-center gap-2 pl-8 text-sm">
                  <Bot size={14} /> Pensando...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {!isLoading && !error && insight && (
        <div className="border-border bg-background/50 shrink-0 border-t p-4">
          <div className="bg-muted relative flex items-center rounded-xl p-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSendingMessage}
              placeholder="Faça uma pergunta sobre o seu plano..."
              className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent px-4 py-3 text-sm outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSendingMessage}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 w-10 items-center justify-center rounded-lg transition-colors disabled:opacity-50"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
