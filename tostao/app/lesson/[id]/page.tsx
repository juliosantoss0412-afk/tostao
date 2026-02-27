'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const LESSONS: Record<string, {
  title: string,
  steps: any[]
}> = {
  'juros-compostos': {
    title: 'Juros Compostos',
    steps: [
      {
        type: 'content',
        tag: 'Módulo 1 · Conceito',
        title: 'O que são Juros Compostos?',
        content: 'Imagina que tens 1.000€ numa conta que paga 10% de juros por ano. No primeiro ano ganhas 100€. Mas no segundo ano não ganhas juros sobre os 1.000€ originais — ganhas sobre os 1.100€. Isso é juros sobre juros.',
        highlight: 'É o que Einstein (segundo a lenda) chamou de "a oitava maravilha do mundo". O dinheiro começa a trabalhar para ti, e esse trabalho cresce a cada ano.',
      },
      {
        type: 'formula',
        tag: 'Módulo 1 · Fórmula',
        title: 'Como se calcula?',
        content: 'A fórmula parece assustadora mas é simples. Cada letra representa uma coisa:',
        formula: 'M = C × (1 + i)ⁿ',
        formulaSub: 'M = montante final · C = capital inicial · i = taxa de juro · n = número de períodos',
        highlight: 'Exemplo: 1.000€ a 7% durante 10 anos = 1.000 × (1.07)¹⁰ = 1.967€. Quase o dobro, sem trabalhar.',
      },
      {
        type: 'content',
        tag: 'Módulo 1 · Aplicação',
        title: 'Na prática, o que deves fazer?',
        content: 'O segredo dos juros compostos é o tempo. Quanto mais cedo começas, mais tempo o teu dinheiro tem para crescer. Uma pessoa que investe 100€/mês dos 25 aos 35 anos (10 anos) acaba com mais dinheiro aos 65 do que alguém que investe dos 35 aos 65 (30 anos). Parece impossível, mas é matemática.',
        highlight: 'Começa cedo. Mesmo com pouco. O tempo é o teu maior aliado — e não podes comprar mais tempo.',
      },
      {
        type: 'quiz',
        tag: 'Quiz',
        title: 'Testa o teu conhecimento',
        question: 'Tens 500€ numa conta com 5% de juros anuais. Quanto tens ao fim de 2 anos com juros compostos?',
        options: ['550,00€', '551,25€', '552,50€', '560,00€'],
        correct: 1,
        explanation: 'Correto! Ano 1: 500 × 1.05 = 525€. Ano 2: 525 × 1.05 = 551,25€. Os juros do 1º ano também geraram juros. É a magia dos compostos!',
        wrongExplanation: 'Quase! Lembra que no 2º ano ganhas juros sobre 525€ (não 500€). Ano 1: 500 × 1.05 = 525€. Ano 2: 525 × 1.05 = 551,25€.',
      },
      {
        type: 'quiz',
        tag: 'Quiz',
        title: 'Última pergunta',
        question: 'Qual é a principal vantagem dos juros compostos em relação aos juros simples?',
        options: [
          'Os juros compostos têm sempre uma taxa mais alta',
          'Os juros compostos geram juros sobre os juros anteriores',
          'Os juros compostos são garantidos pelo governo',
          'Os juros compostos não têm risco'
        ],
        correct: 1,
        explanation: 'Exatamente! A característica-chave dos juros compostos é que os juros são reinvestidos e passam eles próprios a gerar mais juros. É uma bola de neve financeira.',
        wrongExplanation: 'A resposta correta é a segunda opção. Os juros compostos "reinvestem" os juros — eles próprios geram mais juros. É este efeito bola de neve que os torna tão poderosos.',
      }
    ]
  },
  'irs': {
    title: 'IRS Descomplicado',
    steps: [
      {
        type: 'content',
        tag: 'Módulo 2 · Conceito',
        title: 'O que é o IRS?',
        content: 'IRS significa Imposto sobre o Rendimento das Pessoas Singulares. É basicamente um imposto que pagas ao Estado sobre o dinheiro que ganhas. Se trabalhas por conta de outrem, o teu empregador retém uma parte do teu salário todos os meses — isso é a retenção na fonte.',
        highlight: 'Em março de cada ano fazes a declaração de IRS, onde "acertas as contas" com o Estado. Podes receber dinheiro de volta (reembolso) ou ter de pagar mais.',
      },
      {
        type: 'content',
        tag: 'Módulo 2 · Escalões',
        title: 'Como funcionam os escalões?',
        content: 'Portugal usa um sistema progressivo. Não pagas a mesma percentagem sobre todo o rendimento — pagas menos nos primeiros euros e mais nos últimos. Por exemplo, os primeiros ~7.700€ anuais são taxados a 13,25%. O que está acima disso é taxado progressivamente.',
        highlight: 'Se ganhas 20.000€/ano, NÃO pagas a taxa do teu escalão sobre os 20.000€ todos. Cada "fatia" do rendimento é taxada à sua própria taxa. É uma distinção importante que muitas pessoas não percebem.',
      },
      {
        type: 'quiz',
        tag: 'Quiz',
        title: 'Testa o teu conhecimento',
        question: 'Porque é que a maioria dos trabalhadores por conta de outrem já tem IRS retido mensalmente?',
        options: [
          'Porque o patrão fica com o dinheiro',
          'Porque o Estado obriga o empregador a reter uma parte do salário antecipadamente',
          'Porque é opcional fazer essa retenção',
          'Porque o IRS só se paga no fim do ano'
        ],
        correct: 1,
        explanation: 'Correto! A "retenção na fonte" é obrigatória por lei. O empregador retém uma estimativa do IRS mensalmente e entrega ao Estado. Em março acertas as contas — se retiveram demais, recebes; se foi a menos, pagas.',
        wrongExplanation: 'A retenção na fonte é obrigação legal do empregador — ele retém uma estimativa do IRS mensalmente e entrega ao Estado. Em março acertas as contas finais.',
      }
    ]
  }
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const { id } = params
  const lesson = LESSONS[id]
  const [step, setStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const router = useRouter()

  if (!lesson) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
      Módulo não encontrado.
    </div>
  )

  const currentStep = lesson.steps[step]
  const totalSteps = lesson.steps.length
  const progress = (step / totalSteps) * 100

  const handleAnswer = (idx: number) => {
    if (answered) return
    setSelectedOption(idx)
    setAnswered(true)
    if (idx === currentStep.correct) setScore(s => s + 1)
  }

  const handleContinue = async () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1)
      setSelectedOption(null)
      setAnswered(false)
    } else {
      // Save progress to Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('progress').upsert({
          user_id: user.id,
          module_id: id,
          completed: true,
          score,
          completed_at: new Date().toISOString(),
        })
        // Add XP
        const xpGain = 50
        await supabase.rpc('add_xp', { user_id: user.id, xp_amount: xpGain })
      }
      setCompleted(true)
    }
  }

  const canContinue = currentStep.type !== 'quiz' || answered

  // COMPLETE SCREEN
  if (completed) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center', maxWidth: '420px', margin: '0 auto',
    }}>
      <div style={{ fontSize: '72px', marginBottom: '20px' }}>🏆</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: 800, color: 'var(--gold)', marginBottom: '8px' }}>
        Lição Completa!
      </div>
      <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '32px', lineHeight: 1.5 }}>
        Mais um passo na tua jornada financeira.
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '36px' }}>
        {[
          { val: '+50', label: 'XP Ganhos' },
          { val: `${score}/${lesson.steps.filter(s => s.type === 'quiz').length}`, label: 'Respostas' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid #2A2620',
            borderRadius: '16px', padding: '18px 28px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 800, color: 'var(--gold)', marginBottom: '4px' }}>{s.val}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push('/dashboard')}
        style={{
          width: '100%', background: 'var(--gold)', color: '#0F0E0A', border: 'none',
          borderRadius: '14px', padding: '16px',
          fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
        }}>
        Continuar →
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/dashboard')} style={{
          width: '38px', height: '38px', background: 'var(--surface)',
          border: '1px solid #2A2620', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '16px', color: 'var(--text)', flexShrink: 0,
        }}>←</button>
        <div style={{ flex: 1, height: '6px', background: '#2A2620', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #D4A017, #F5C842)',
            borderRadius: '999px',
            width: `${progress}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600, flexShrink: 0 }}>+50 XP</div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '0 24px', overflowY: 'auto' }}>

        {currentStep.type === 'content' && (
          <>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', marginBottom: '10px' }}>{currentStep.tag}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>{currentStep.title}</div>
            <div style={{ fontSize: '15px', lineHeight: 1.7, color: '#BFB99F', marginBottom: '24px' }}>{currentStep.content}</div>
            <div style={{
              background: 'var(--surface)', border: '1px solid #2A2620',
              borderLeft: '3px solid var(--gold)', borderRadius: '12px',
              padding: '16px', fontSize: '14px', lineHeight: 1.6, color: 'var(--text)',
            }}>{currentStep.highlight}</div>
          </>
        )}

        {currentStep.type === 'formula' && (
          <>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', marginBottom: '10px' }}>{currentStep.tag}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>{currentStep.title}</div>
            <div style={{ fontSize: '15px', lineHeight: 1.7, color: '#BFB99F', marginBottom: '20px' }}>{currentStep.content}</div>
            <div style={{
              background: '#1C1A0F', border: '1px solid rgba(245,200,66,0.2)',
              borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px',
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '1px' }}>{currentStep.formula}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>{currentStep.formulaSub}</div>
            </div>
            <div style={{
              background: 'var(--surface)', border: '1px solid #2A2620',
              borderLeft: '3px solid var(--gold)', borderRadius: '12px',
              padding: '16px', fontSize: '14px', lineHeight: 1.6,
            }}>{currentStep.highlight}</div>
          </>
        )}

        {currentStep.type === 'quiz' && (
          <>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gold)', marginBottom: '10px' }}>{currentStep.tag}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 700, lineHeight: 1.3, marginBottom: '24px' }}>{currentStep.question}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {currentStep.options.map((opt: string, idx: number) => {
                const isCorrect = answered && idx === currentStep.correct
                const isWrong = answered && idx === selectedOption && idx !== currentStep.correct
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} style={{
                    background: isCorrect ? 'rgba(74,222,128,0.08)' : isWrong ? 'rgba(248,113,113,0.08)' : 'var(--surface)',
                    border: `1.5px solid ${isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : '#2A2620'}`,
                    borderRadius: '14px', padding: '16px 18px', fontSize: '14px',
                    cursor: answered ? 'default' : 'pointer',
                    textAlign: 'left', color: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--text)',
                    fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                    width: '100%',
                  }}>{opt}</button>
                )
              })}
            </div>
            {answered && (
              <div style={{
                borderRadius: '14px', padding: '16px', fontSize: '14px', lineHeight: 1.5,
                background: selectedOption === currentStep.correct ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                border: `1px solid ${selectedOption === currentStep.correct ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                color: selectedOption === currentStep.correct ? 'var(--green)' : 'var(--red)',
              }}>
                {selectedOption === currentStep.correct ? '✓ ' : '✗ '}
                {selectedOption === currentStep.correct ? currentStep.explanation : currentStep.wrongExplanation}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 24px 32px' }}>
        <button onClick={handleContinue} disabled={!canContinue} style={{
          width: '100%', background: 'var(--gold)', color: '#0F0E0A', border: 'none',
          borderRadius: '14px', padding: '16px',
          fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700,
          cursor: canContinue ? 'pointer' : 'default',
          opacity: canContinue ? 1 : 0.4, transition: 'all 0.15s',
        }}>
          {step < totalSteps - 1 ? 'Continuar →' : 'Concluir Lição 🎉'}
        </button>
      </div>
    </div>
  )
}

