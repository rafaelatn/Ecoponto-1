'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface User {
  nome_completo: string
  creditos: number
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (err) {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.welcome}>
          Bem-vindo(a), {user.nome_completo}
        </div>
        <button 
          className={styles.logoutButton}
          onClick={() => setShowLogoutConfirm(true)}
        >
          Encerrar sessão
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.optionsGrid}>
          <button 
            className={styles.optionCard}
            onClick={() => router.push('/home/descarte')}
          >
            <div className={styles.icon}>🛢️</div>
            <h2>Descarte de óleo usado</h2>
            <p>Deposite suas PETs com óleo usado e ganhe créditos</p>
          </button>

          <button 
            className={styles.optionCard}
            onClick={() => router.push('/home/fidelidade')}
          >
            <div className={styles.icon}>🎁</div>
            <h2>Programa fidelidade</h2>
            <p>Visualize seus créditos e histórico</p>
            {user.creditos > 0 && (
              <div className={styles.creditosBadge}>
                {user.creditos} crédito{user.creditos !== 1 ? 's' : ''}
              </div>
            )}
          </button>

          <button 
            className={styles.optionCard}
            onClick={() => router.push('/home/dados')}
          >
            <div className={styles.icon}>👤</div>
            <h2>Dados cadastrais</h2>
            <p>Visualize e edite seus dados</p>
          </button>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className={styles.overlay} onClick={() => setShowLogoutConfirm(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar saída</h3>
            <p>Tem certeza que deseja encerrar a sessão?</p>
            <div className={styles.confirmButtons}>
              <button 
                className={styles.buttonCancel}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className={styles.buttonConfirm}
                onClick={handleLogout}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


