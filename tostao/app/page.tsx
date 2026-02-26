'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'register') {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (err) { setError(err.message); setLoading(false); return }
      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          xp: 0,
          streak: 0,
          level: 1,
        })
        setSuccess('Conta criada! Verifica o teu email para confirmar.')
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError('Email ou password incorretos.'); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '36px',
            fontWeight: 800,
            color: 'var(--gold)',
            marginBottom: '8px',
          }}>
            Tostão<span style={{ color: 'var(--text)' }}>.</span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
            A tua jornada financeira começa aqui.
          </div>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--surface)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '28px',
          border: '1px solid #2A2620',
        }}>
          {(['register', 'login'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: mode === m ? 'var(--gold)' : 'transparent',
              color: mode === m ? '#0F0E0A' : 'var(--muted)',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {m === 'register' ? 'Criar conta' : 'Entrar'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <input
              placeholder="O teu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          {error && (
            <div style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</div>
          )}
          {success && (
            <div style={{ color: 'var(--green)', fontSize: '13px', textAlign: 'center' }}>{success}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            background: 'var(--gold)',
            color: '#0F0E0A',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '4px',
            transition: 'all 0.15s',
          }}>
            {loading ? '...' : mode === 'register' ? 'Criar conta →' : 'Entrar →'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid #2A2620',
  borderRadius: '12px',
  padding: '14px 16px',
  color: 'var(--text)',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif',
  width: '100%',
}
