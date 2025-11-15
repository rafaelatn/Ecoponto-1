'use client'

import { useState } from 'react'
import styles from './Modal.module.css'

interface RegisterModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Dados pessoais
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [endereco, setEndereco] = useState('')
  const [telefone, setTelefone] = useState('')
  const [genero, setGenero] = useState('')
  const [cpf, setCpf] = useState('')
  
  // Senha
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nomeCompleto && dataNascimento && estado && cidade && endereco && telefone && genero && cpf) {
      setStep(2)
      setError('')
    } else {
      setError('Preencha todos os campos')
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    if (senha.length !== 4) {
      setError('A senha deve ter exatamente 4 dígitos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const url = `${apiUrl}/api/auth/register`
      
      console.log('Enviando cadastro para:', url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_completo: nomeCompleto,
          data_nascimento: dataNascimento,
          estado,
          cidade,
          endereco,
          telefone: telefone.replace(/\D/g, ''),
          genero,
          cpf: cpf.replace(/\D/g, ''),
          senha,
        }),
      })

      console.log('Resposta recebida:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = 'Erro ao cadastrar'
        try {
          const data = await response.json()
          errorMessage = data.message || data.errors?.[0]?.message || errorMessage
          console.error('Erro do servidor:', data)
        } catch (parseError) {
          const text = await response.text()
          console.error('Erro ao parsear resposta:', text)
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }
        setError(errorMessage)
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('Cadastro bem-sucedido:', data)
      onSuccess()
    } catch (err) {
      console.error('Erro ao cadastrar:', err)
      setError(`Erro de conexão: ${err instanceof Error ? err.message : 'Tente novamente'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.title}>Cadastro</h2>
        
        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nascimento">Data de Nascimento</label>
              <input
                id="nascimento"
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endereco">Endereço</label>
              <input
                id="endereco"
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="genero">Gênero</label>
              <select
                id="genero"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
                <option value="prefiro_nao_informar">Prefiro não informar</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitButton}>
              Próximo
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="senha">Crie uma senha de 4 dígitos</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setSenha(value)
                }}
                placeholder="0000"
                maxLength={4}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmarSenha">Confirme a senha</label>
              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setConfirmarSenha(value)
                }}
                placeholder="0000"
                maxLength={4}
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.buttonRow}>
              <button 
                type="button" 
                className={styles.buttonSecondary}
                onClick={() => setStep(1)}
              >
                Voltar
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


