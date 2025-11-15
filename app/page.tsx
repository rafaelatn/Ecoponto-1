'use client'

import { useState } from 'react'
import LoginModal from '@/components/LoginModal'
import RegisterModal from '@/components/RegisterModal'
import styles from './page.module.css'

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Ecoponto FAECO</h1>
        <p className={styles.subtitle}>Sistema de Coleta de Óleo Usado</p>
        
        <div className={styles.buttonGroup}>
          <button 
            className={styles.buttonPrimary}
            onClick={() => setShowLogin(true)}
          >
            Entrar
          </button>
          <button 
            className={styles.buttonSecondary}
            onClick={() => setShowRegister(true)}
          >
            Cadastrar
          </button>
        </div>
      </div>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false)
            window.location.href = '/home'
          }}
        />
      )}

      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)}
          onSuccess={() => {
            setShowRegister(false)
            alert('Cadastro realizado com sucesso! Você já pode fazer login.')
          }}
        />
      )}
    </div>
  )
}


