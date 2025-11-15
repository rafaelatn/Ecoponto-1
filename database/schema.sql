-- Schema do banco de dados para Ecoponto FAECO (Supabase)
-- Execute este script no SQL Editor do Supabase

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo VARCHAR(255) NOT NULL,
  data_nascimento DATE NOT NULL,
  estado VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  genero VARCHAR(50) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  creditos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de descartes
CREATE TABLE descartes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  peso_kg DECIMAL(10, 2) NOT NULL,
  quantidade_pets INTEGER NOT NULL,
  creditos_gerados INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pendente',
  motivo_recusa VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de resgates
CREATE TABLE resgates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creditos_utilizados INTEGER NOT NULL,
  quantidade_oleo_ml INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de status do reservatório
CREATE TABLE reservatorio_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peso_atual_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  capacidade_maxima_kg DECIMAL(10, 2) NOT NULL DEFAULT 1000,
  status VARCHAR(50) NOT NULL DEFAULT 'normal',
  ultima_atualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_descartes_user_id ON descartes(user_id);
CREATE INDEX idx_descartes_created_at ON descartes(created_at);
CREATE INDEX idx_resgates_user_id ON resgates(user_id);
CREATE INDEX idx_resgates_created_at ON resgates(created_at);

-- Inserir registro inicial do reservatório (apenas se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM reservatorio_status) THEN
    INSERT INTO reservatorio_status (peso_atual_kg, capacidade_maxima_kg, status)
    VALUES (0, 1000, 'normal');
  END IF;
END $$;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS) - opcional para segurança adicional
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE descartes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resgates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservatorio_status ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (ajuste conforme necessário)
-- Nota: Como estamos usando autenticação JWT no backend, essas políticas podem ser ajustadas
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Descartes are viewable by owner" ON descartes
  FOR SELECT USING (true);

CREATE POLICY "Resgates are viewable by owner" ON resgates
  FOR SELECT USING (true);


