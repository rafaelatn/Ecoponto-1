'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface UserData {
  nome_completo: string
  data_nascimento: string
  estado: string
  cidade: string
  endereco: string
  telefone: string
  genero: string
  cpf: string
}

export default function DadosPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const handleSave = async () => {
    if (!userData) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          telefone: userData.telefone.replace(/\D/g, ''),
          endereco: userData.endereco,
          cidade: userData.cidade,
          estado: userData.estado,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Dados atualizados com sucesso!')
        setEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.message || 'Erro ao atualizar dados')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (!userData) {
    return <div className={styles.error}>Erro ao carregar dados</div>
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.push('/home')}>
        ← Voltar
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>Dados Cadastrais</h1>

        {error && <div className={styles.alertError}>{error}</div>}
        {success && <div className={styles.alertSuccess}>{success}</div>}

        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nome Completo</label>
            <input
              type="text"
              value={userData.nome_completo}
              disabled
              className={styles.inputDisabled}
            />
          </div>

          <div className={styles.formGroup}>
            <label>CPF</label>
            <input
              type="text"
              value={formatCPF(userData.cpf)}
              disabled
              className={styles.inputDisabled}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Data de Nascimento</label>
            <input
              type="date"
              value={userData.data_nascimento}
              disabled
              className={styles.inputDisabled}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Gênero</label>
            <input
              type="text"
              value={userData.genero}
              disabled
              className={styles.inputDisabled}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Estado</label>
              <input
                type="text"
                value={userData.estado}
                onChange={(e) => setUserData({ ...userData, estado: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Cidade</label>
              <input
                type="text"
                value={userData.cidade}
                onChange={(e) => setUserData({ ...userData, cidade: e.target.value })}
                disabled={!editing}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Endereço</label>
            <input
              type="text"
              value={userData.endereco}
              onChange={(e) => setUserData({ ...userData, endereco: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Telefone</label>
            <input
              type="text"
              value={formatPhone(userData.telefone)}
              onChange={(e) => setUserData({ ...userData, telefone: formatPhone(e.target.value) })}
              disabled={!editing}
            />
          </div>

          <div className={styles.buttonGroup}>
            {!editing ? (
              <button 
                className={styles.editButton}
                onClick={() => setEditing(true)}
              >
                Editar Dados
              </button>
            ) : (
              <>
                <button 
                  className={styles.cancelButton}
                  onClick={() => {
                    setEditing(false)
                    carregarDados()
                  }}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


