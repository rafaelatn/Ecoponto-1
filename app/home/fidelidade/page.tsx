'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface HistoricoItem {
  id: string
  tipo: 'descarte' | 'resgate'
  data: string
  creditos: number
  descricao: string
}

export default function FidelidadePage() {
  const router = useRouter()
  const [creditos, setCreditos] = useState(0)
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showResgate, setShowResgate] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    carregarDados()
  }, [router])

  const carregarDados = async () => {
    try {
      const [creditosRes, historicoRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fidelidade/creditos`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fidelidade/historico`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ])

      const creditosData = await creditosRes.json()
      const historicoData = await historicoRes.json()

      setCreditos(creditosData.creditos || 0)
      setHistorico(historicoData.historico || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResgatar = async () => {
    if (creditos < 1) {
      alert('Você precisa de pelo menos 1 crédito para resgatar.')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fidelidade/resgatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ creditos: 1 }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Resgate realizado com sucesso! A gaveta foi destravada para retirada do óleo.')
        
        // Destravar gaveta
        await fetch(`${process.env.NEXT_PUBLIC_HARDWARE_URL}/hardware/unlock`, {
          method: 'POST',
        })

        setShowResgate(false)
        carregarDados()
      } else {
        alert(data.message || 'Erro ao realizar resgate.')
      }
    } catch (error) {
      alert('Erro de conexão. Tente novamente.')
    }
  }

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.push('/home')}>
        ← Voltar
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>Programa Fidelidade</h1>

        <div className={styles.creditosCard}>
          <div className={styles.creditosIcon}>🎁</div>
          <div className={styles.creditosValue}>{creditos}</div>
          <div className={styles.creditosLabel}>
            Crédito{creditos !== 1 ? 's' : ''} disponível{creditos !== 1 ? 'eis' : ''}
          </div>
          {creditos >= 1 && (
            <button 
              className={styles.resgatarButton}
              onClick={() => setShowResgate(true)}
            >
              Resgatar 1 óleo de 500ml
            </button>
          )}
        </div>

        <div className={styles.historicoSection}>
          <h2 className={styles.historicoTitle}>Histórico</h2>
          {historico.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhum histórico disponível</p>
          ) : (
            <div className={styles.historicoList}>
              {historico.map((item) => (
                <div key={item.id} className={styles.historicoItem}>
                  <div className={styles.historicoIcon}>
                    {item.tipo === 'descarte' ? '🛢️' : '🎁'}
                  </div>
                  <div className={styles.historicoInfo}>
                    <div className={styles.historicoDescricao}>{item.descricao}</div>
                    <div className={styles.historicoData}>
                      {new Date(item.data).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className={styles.historicoCreditos}>
                    {item.tipo === 'descarte' ? '+' : '-'}{item.creditos}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showResgate && (
        <div className={styles.overlay} onClick={() => setShowResgate(false)}>
          <div className={styles.resgateModal} onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Resgate</h3>
            <p>Você deseja resgatar 1 óleo novo de 500ml?</p>
            <p className={styles.resgateInfo}>Isso consumirá 1 crédito.</p>
            <div className={styles.resgateButtons}>
              <button 
                className={styles.buttonCancel}
                onClick={() => setShowResgate(false)}
              >
                Cancelar
              </button>
              <button 
                className={styles.buttonConfirm}
                onClick={handleResgatar}
              >
                Confirmar Resgate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


