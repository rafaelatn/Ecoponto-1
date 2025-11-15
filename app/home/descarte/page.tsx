'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function DescartePage() {
  const router = useRouter()
  const [step, setStep] = useState<'info' | 'processando' | 'pesando' | 'resultado'>('info')
  const [peso, setPeso] = useState<number | null>(null)
  const [status, setStatus] = useState<'aceito' | 'recusado' | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
    }
  }, [router])

  const iniciarDescarte = async () => {
    setLoading(true)
    try {
      // Travar gaveta
      await fetch(`${process.env.NEXT_PUBLIC_HARDWARE_URL}/hardware/lock`, {
        method: 'POST',
      })

      setStep('processando')
      setMensagem('Gaveta travada. Por favor, abra a gaveta, coloque as PETs com óleo usado e feche a gaveta.')

      // Aguardar fechamento da gaveta (simulado - em produção, usar sensor)
      setTimeout(() => {
        setStep('pesando')
        setMensagem('Pesando...')
        processarPeso()
      }, 5000)
    } catch (error) {
      setMensagem('Erro ao iniciar descarte. Tente novamente.')
      setLoading(false)
    }
  }

  const processarPeso = async () => {
    try {
      // Obter peso do hardware
      const weightResponse = await fetch(`${process.env.NEXT_PUBLIC_HARDWARE_URL}/hardware/weight`)
      const weightData = await weightResponse.json()
      const pesoAtual = weightData.peso || 0

      setPeso(pesoAtual)

      // Validar descarte
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/descarte/pesar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ peso: pesoAtual }),
      })

      const data = await response.json()

      if (data.status === 'aceito') {
        setStatus('aceito')
        setMensagem(`Descarte aceito! Peso: ${pesoAtual.toFixed(2)}kg. Você ganhou ${data.creditos_gerados} crédito(s).`)
        
        // Destravar gaveta para retirada (se houver crédito)
        if (data.creditos_gerados > 0) {
          await fetch(`${process.env.NEXT_PUBLIC_HARDWARE_URL}/hardware/unlock`, {
            method: 'POST',
          })
        }
      } else {
        setStatus('recusado')
        setMensagem(data.motivo || 'Descarte recusado. Peso mínimo: 3,4kg.')
      }

      setStep('resultado')
    } catch (error) {
      setMensagem('Erro ao processar descarte. Tente novamente.')
      setStatus('recusado')
      setStep('resultado')
    } finally {
      setLoading(false)
    }
  }

  const voltar = () => {
    router.push('/home')
  }

  const novoDescarte = () => {
    setStep('info')
    setPeso(null)
    setStatus(null)
    setMensagem('')
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={voltar}>
        ← Voltar
      </button>

      {step === 'info' && (
        <div className={styles.content}>
          <h1 className={styles.title}>Descarte de Óleo Usado</h1>
          <div className={styles.infoBox}>
            <h2>Como funciona:</h2>
            <p className={styles.rule}>
              A cada <strong>2 PETs de 2L</strong> (mínimo <strong>3,4kg</strong>) você ganha <strong>1 óleo novo de 500ml</strong>
            </p>
            <ul className={styles.instructions}>
              <li>Deposite PETs fechadas com óleo usado</li>
              <li>O sistema pesa automaticamente</li>
              <li>Créditos são acumulados para resgate</li>
            </ul>
          </div>
          <button 
            className={styles.startButton}
            onClick={iniciarDescarte}
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Iniciar descarte'}
          </button>
        </div>
      )}

      {step === 'processando' && (
        <div className={styles.content}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.message}>{mensagem}</h2>
        </div>
      )}

      {step === 'pesando' && (
        <div className={styles.content}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.message}>{mensagem}</h2>
          {peso !== null && (
            <div className={styles.weightDisplay}>
              Peso: {peso.toFixed(2)} kg
            </div>
          )}
        </div>
      )}

      {step === 'resultado' && (
        <div className={styles.content}>
          <div className={status === 'aceito' ? styles.successIcon : styles.errorIcon}>
            {status === 'aceito' ? '✓' : '✗'}
          </div>
          <h2 className={styles.resultTitle}>
            {status === 'aceito' ? 'Descarte Aceito!' : 'Descarte Recusado'}
          </h2>
          <p className={styles.resultMessage}>{mensagem}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.buttonSecondary} onClick={voltar}>
              Voltar ao início
            </button>
            {status === 'aceito' && (
              <button className={styles.buttonPrimary} onClick={novoDescarte}>
                Novo descarte
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


