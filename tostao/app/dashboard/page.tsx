'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const MODULES = [
  {
    id: 'juros-compostos',
    icon: '📈',
    name: 'Juros Compostos',
    desc: 'O conceito que mais muda a tua relação com o dinheiro',
    xp: 50,
    color: 'rgba(245,200,66,0.1)',
    locked: false,
  },
  {
    id: 'irs',
    icon: '🧾',
    name: 'IRS Descomplicado',
    desc: 'O que é, como funciona e como podes pagar menos',
    xp: 60,
    color: 'rgba(96,165,250,0.1)',
    locked: false,
  },
  {
    id: 'credito',
    icon: '🏦',
    name: 'Crédito ao Consumo',
    desc: 'Quando vale a pena pedir emprestado (e quando não)',
    xp: 70,
    color: 'rgba(122,112,96,0.1)',
    locked: true,
  },
  {
    id: 'etfs',
    icon: '📊',
    name: 'ETFs & Investimento',
    desc: 'Como começar a investir com 50€ por mês',
    xp: 80,
    color: 'rgba(122,112,96,0.1)',
    locked: true,
  },
]

interface Profile {
  name: string
  xp: number
  streak: number
  level: number
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: progress } = await supabase
        .from('progress')
        .select('module_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      setProfile(prof)
      setCompletedModules(progress?.map((p: any) => p.module_id) || [])
      setLoading(false)
    }
    load()
  }, [])

  const levelName = (level: number) => {
    if (level === 1) return 'Novato'
    if (level === 2) return 'Poupador'
    if (level === 3) return 'Investidor'
    return 'Expert'
  }

  const xpForLevel = (level: number) => level * 250
  const xpProgress = profile ? (profile.xp % 250) / 250 * 100 : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800 }}>Tostão.</div>
    </div>
  )

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px', color: 'var(--gold)' }}>
          Tostão<span style={{ color: 'var(--text)' }}>.</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'var(--surface)', border: '1px solid #2A2620',
          borderRadius: '999px', padding: '6px 14px', fontSize: '13px', fontWeight: 500,
        }}>
          <span>🔥</span>
          <span>{profile?.streak || 0} dias</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>Bom dia 👋</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700, lineHeight: 1.1, marginBottom: '20px' }}>
          {profile?.name}, continua<br />a crescer.
        </div>

        {/* XP Card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid #2A2620',
          borderRadius: '18px', padding: '18px', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)',
              background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.2)',
              padding: '4px 10px', borderRadius: '999px',
            }}>
              {levelName(profile?.level || 1)} · Nív. {profile?.level || 1}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {profile?.xp || 0} / {xpForLevel(profile?.level || 1)} XP
            </div>
          </div>
          <div style={{ height: '6px', background: '#2A2620', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #D4A017, #F5C842, #FF9500)',
              borderRadius: '999px',
              width: `${xpProgress}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', padding: '0 24px', marginBottom: '28px' }}>
        {[
          { val: completedModules.length, label: 'Módulos', color: 'var(--gold)' },
          { val: profile?.xp || 0, label: 'XP Total', color: 'var(--amber)' },
          { val: `${completedModules.length > 0 ? 100 : 0}%`, label: 'Precisão', color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid #2A2620',
            borderRadius: '14px', padding: '14px 12px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, color: s.color, marginBottom: '2px' }}>{s.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily Challenge */}
      <div style={{
        margin: '0 24px 28px',
        background: 'linear-gradient(135deg, #1C1A0F, #201D10)',
        border: '1px solid rgba(245,200,66,0.25)',
        borderRadius: '18px', padding: '20px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', marginBottom: '6px' }}>⚡ Desafio Diário</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Começa o teu primeiro módulo</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>Juros compostos — o segredo do crescimento financeiro.</div>
        <button
          onClick={() => router.push('/lesson/juros-compostos')}
          style={{
            background: 'var(--gold)', color: '#0F0E0A', border: 'none',
            borderRadius: '10px', padding: '10px 20px',
            fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}>
          Iniciar
        </button>
      </div>

      {/* Modules */}
      <div style={{ fontSize: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', padding: '0 24px', marginBottom: '14px' }}>
        Módulos
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MODULES.map(mod => {
          const done = completedModules.includes(mod.id)
          return (
            <div
              key={mod.id}
              onClick={() => !mod.locked && router.push(`/lesson/${mod.id}`)}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${done ? 'rgba(74,222,128,0.3)' : '#2A2620'}`,
                borderRadius: '18px', padding: '18px',
                display: 'flex', alignItems: 'center', gap: '16px',
                cursor: mod.locked ? 'default' : 'pointer',
                opacity: mod.locked ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: mod.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0,
              }}>{mod.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{mod.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{mod.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', color: done ? 'var(--green)' : 'var(--gold)', fontWeight: 500, marginBottom: '4px' }}>
                  {done ? '✓ Feito' : `+${mod.xp} XP`}
                </div>
                {mod.locked && <div style={{ fontSize: '16px' }}>🔒</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '420px',
        background: 'rgba(15,14,10,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid #1E1C14',
        padding: '12px 32px 20px',
        display: 'flex', justifyContent: 'space-around', zIndex: 50,
      }}>
        {[
          { icon: '🏠', label: 'Início', active: true },
          { icon: '📚', label: 'Módulos', active: false },
          { icon: '🏆', label: 'Liga', active: false },
          { icon: '👤', label: 'Perfil', active: false },
        ].map(n => (
          <div key={n.label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            cursor: 'pointer', padding: '6px 12px',
          }}>
            <span style={{ fontSize: '22px', filter: n.active ? 'none' : 'grayscale(1)', opacity: n.active ? 1 : 0.4 }}>{n.icon}</span>
            <span style={{ fontSize: '10px', color: n.active ? 'var(--gold)' : 'var(--muted)', fontWeight: 500 }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
