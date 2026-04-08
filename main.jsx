import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Check, FileText, CheckCircle, AlertCircle,
  HeartHandshake, ArrowRight, ChevronRight, ChevronDown, Plus, Minus,
  Scale, Users, Leaf, Lock, BookOpen,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mdgczltrpqdlorbmobbn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZ2N6bHRycHFkbG9yYm1vYmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDcxNzgsImV4cCI6MjA4NjMyMzE3OH0.nczVKWf1OEvWJvNnHjJThGV_fbm4lJGRAJeZnm2q7gs'
);

// --- COMPONENTE DE ANIMAÇÃO DE SCROLL ---
const Reveal = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    // Se o elemento já está visível no viewport ao montar, revela imediatamente
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const baseClasses = 'transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]';

  const directionClasses = {
    up: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    down: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6',
    left: isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6',
    right: isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6',
    scale: isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${directionClasses[direction] || directionClasses.up} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- COMPONENTE MOUSE GLOW ---
const MouseGlow = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handler = (e) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10 transition-all duration-[1400ms] ease-out"
      style={{
        background: `radial-gradient(650px circle at ${pos.x}% ${pos.y}%, rgba(63,150,79,0.06), transparent 60%)`,
      }}
    />
  );
};

// --- COMPONENTE FAQ ACCORDION ---
const FaqItem = ({ question, answer, isOpen, onToggle }) => (
  <div
    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
      isOpen ? 'border-[#3F964F]/30 shadow-sm shadow-green-900/5' : 'border-slate-100'
    }`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors duration-200"
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-slate-900 text-base md:text-lg leading-snug">{question}</span>
      <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 transition-all duration-300">
        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-400 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <p className="px-6 pb-6 text-slate-600 leading-relaxed text-base">{answer}</p>
    </div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    localizacao: '',
    prescricao: '',
    apoioJuridico: '',
    objetivo: '',
    lgpd: false,
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [touched, setTouched] = useState({
    nome: false, whatsapp: false, localizacao: false,
    prescricao: false, apoioJuridico: false, lgpd: false,
  });

  const errors = {
    nome: !formData.nome.trim() ? 'Informe seu nome completo.' : '',
    whatsapp: !formData.whatsapp.trim() ? 'Informe seu WhatsApp com DDD.' : '',
    localizacao: !formData.localizacao.trim() ? 'Informe sua cidade e estado.' : '',
    prescricao: !formData.prescricao ? 'Selecione uma das opções acima.' : '',
    apoioJuridico: !formData.apoioJuridico ? 'Selecione uma das opções acima.' : '',
    lgpd: !formData.lgpd ? 'Você precisa aceitar os termos para continuar.' : '',
  };

  const formValid = Object.values(errors).every((e) => !e);

  const markAllTouched = () =>
    setTouched({ nome: true, whatsapp: true, localizacao: true, prescricao: true, apoioJuridico: true, lgpd: true });

  useEffect(() => {
    setLoaded(true);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // radio e checkbox ficam "touched" ao primeiro clique
    if (type === 'radio' || type === 'checkbox') {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) { markAllTouched(); return; }

    setIsSubmitting(true);

    const objetivoTrimmed = formData.objetivo.trim().slice(0, 1000);

    const { error } = await supabase.from('pre_cadastros').insert({
      nome: formData.nome,
      whatsapp: formData.whatsapp,
      localizacao: formData.localizacao,
      prescricao: formData.prescricao,
      apoio_juridico: formData.apoioJuridico,
      objetivo: objetivoTrimmed || null,
      lgpd: formData.lgpd,
    });

    if (error) {
      setStatus({ type: 'error', message: 'Erro ao enviar o cadastro. Por favor, tente novamente.' });
    } else {
      setStatus({
        type: 'success',
        message:
          'Pré-cadastro realizado com sucesso! Nossa equipe entrará em contato em breve com as próximas orientações.',
      });
      setFormData({ nome: '', whatsapp: '', localizacao: '', prescricao: '', apoioJuridico: '', objetivo: '', lgpd: false });
      setTimeout(() => setStatus({ type: '', message: '' }), 7000);
    }

    setIsSubmitting(false);
  };

  const faqs = [
    {
      question: 'O que é a CEBEDÊ?',
      answer:
        'A CEBEDÊ é uma associação em processo de estruturação que apoia pacientes que buscam acesso legal e seguro a medicamentos à base de cannabis no Brasil. Atuamos com equipe multidisciplinar — médicos, advogados e profissionais de saúde — para orientar cada associado de forma responsável e individualizada.',
    },
    {
      question: 'O processo é 100% legal?',
      answer:
        'Sim. Todos os nossos processos seguem rigorosamente a legislação brasileira vigente e as resoluções da ANVISA. O acesso a medicamentos à base de cannabis exige prescrição médica de profissional habilitado, e orientamos nossos associados a seguir exatamente esse caminho legal.',
    },
    {
      question: 'Preciso ter prescrição médica para me associar?',
      answer:
        'Não é obrigatório ter prescrição para iniciar o pré-cadastro. Se você ainda não possui prescrição, nossa equipe pode orientá-lo sobre os passos necessários e, quando pertinente, encaminhá-lo a médicos habilitados para avaliação.',
    },
    {
      question: 'Quais condições a CEBEDÊ atende?',
      answer:
        'Atendemos pacientes que buscam tratamento para diversas condições, incluindo ansiedade, distúrbios do sono, dores crônicas, inflamações severas, espectro autista (TEA), epilepsia e condições neurológicas. O encaminhamento médico é sempre individualizado.',
    },
    {
      question: 'Quanto custa a associação?',
      answer:
        'Não há mensalidade até a abertura oficial da associação. Quem realizar o pré-cadastro agora garante condições especiais como paciente associado. Oferecemos também consultoria jurídica gratuita para pessoas de baixa renda que necessitam de apoio legal para viabilizar o tratamento.',
    },
    {
      question: 'O que acontece depois do pré-cadastro?',
      answer:
        'Após o envio do formulário, nossa equipe analisará seu perfil e entrará em contato pelo WhatsApp informado. Você receberá uma orientação inicial personalizada sobre os próximos passos, documentação necessária e, quando aplicável, o encaminhamento a profissionais habilitados.',
    },
  ];

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-[#3F964F] selection:text-white transition-opacity duration-700 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { overflow-x: hidden; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          66% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.75; }
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }

        .animate-float { animation: float 7s ease-in-out infinite; }
        .animate-morph { animation: morph 14s ease-in-out infinite; }
        .animate-scroll-bounce { animation: scrollBounce 2s ease-in-out infinite; }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
        }
        .animate-ping-slow { animation: ping-slow 2.2s cubic-bezier(0,0,0.2,1) infinite; }

        .shimmer-btn { position: relative; overflow: hidden; }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 35%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-200%);
        }
        .shimmer-btn:hover::after {
          animation: shimmer 0.65s ease-in-out;
        }

        .input-focus-line { position: relative; }
        .input-focus-line::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 2px;
          background: #3F964F;
          border-radius: 2px;
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }
        .input-focus-line:focus-within::after { width: 95%; }

        .link-underline { position: relative; }
        .link-underline::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 100%; height: 1px;
          background: #3F964F;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .link-underline:hover::after { transform: scaleX(1); }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #3F964F; border-radius: 3px; }

        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      {/* ═══ 1. NAVEGAÇÃO ═══ */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
            : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/30'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="logo-cebede.webp"
              alt="CEBEDÊ"
              width="176"
              height="176"
              className="w-28 sm:w-36 md:w-44 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="relative inline-flex sm:inline-block">
            <span className="sm:hidden absolute -inset-1 rounded-full bg-[#3F964F]/30 animate-ping-slow pointer-events-none" />
            <button
              onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
              className="shimmer-btn group relative inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 font-semibold text-white text-sm sm:text-base transition-all duration-300 bg-[#3F964F] rounded-full hover:bg-[#2d6b38] hover:shadow-lg hover:shadow-green-900/20"
            >
              <span className="hidden sm:inline">Fazer Pré-Cadastro</span>
              <span className="sm:hidden font-extrabold tracking-wide">Associar-se</span>
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ 2. HERO ═══ */}
      <header className="relative pt-36 pb-16 md:pt-44 md:pb-28 px-4 text-center min-h-[88vh] md:min-h-[90vh] flex flex-col overflow-hidden">
        <MouseGlow />

        {/* Blobs decorativos */}
        <div
          className="absolute top-[12%] left-[6%] w-72 h-72 bg-[#3F964F]/8 animate-morph will-change-transform pointer-events-none -z-10"
          style={{ animationDuration: '15s' }}
        />
        <div
          className="absolute bottom-[10%] right-[6%] w-80 h-80 bg-emerald-300/7 animate-morph will-change-transform pointer-events-none -z-10"
          style={{ animationDuration: '19s', animationDelay: '-8s' }}
        />

        <div className="max-w-4xl mx-auto my-auto relative z-10">
          <Reveal direction="scale">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#3F964F]/10 to-emerald-400/10 border border-[#3F964F]/30 text-sm font-bold mb-8 text-[#2d6b38] backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#3F964F] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3F964F]" />
              </span>
              Seja Paciente Associado · Vagas limitadas
              <span className="ml-1 bg-[#3F964F] text-white text-xs font-black px-2 py-0.5 rounded-full tracking-wide">
                GRÁTIS
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 md:mb-8 leading-[1.08] tracking-tight">
              Cannabis medicinal com{' '}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F964F] via-emerald-500 to-[#3F964F] animate-gradient-text"
              >
                orientação, segurança
              </span>{' '}
              e respaldo legal.
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <p className="text-base md:text-xl text-slate-500 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              A CEBEDÊ orienta e apoia pacientes que buscam acesso legal a tratamentos à base de cannabis no Brasil,
              com equipe multidisciplinar e processo transparente do início ao fim.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex flex-col items-center justify-center gap-3">
              <button
                onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
                className="shimmer-btn group inline-flex items-center justify-center gap-2.5 bg-[#3F964F] hover:bg-[#2d6b38] text-white text-base sm:text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:shadow-xl hover:shadow-green-900/25 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Quero ser Paciente Associado
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => document.getElementById('base-cientifica')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 text-base font-semibold px-6 py-4 rounded-full border border-slate-200 hover:border-[#3F964F]/50 bg-white hover:bg-green-50 transition-all duration-300 w-full sm:w-auto"
                >
                  <BookOpen size={16} className="text-[#3F964F]" />
                  Base Científica
                </button>
                <button
                  onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 text-base font-semibold px-6 py-4 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-300 w-full sm:w-auto"
                >
                  Como funciona
                  <ChevronDown size={16} className="transition-transform group-hover:translate-y-0.5" />
                </button>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-[#3F964F]" />
              Sem mensalidade até a abertura oficial · Processo 100% gratuito
            </p>
          </Reveal>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-scroll-bounce">
          <ChevronDown size={18} className="text-slate-300" />
        </div>
      </header>

      {/* ═══ 3. TRUST BAR ═══ */}
      <section className="py-10 md:py-14 px-4 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                Icon: Scale,
                title: '100% Legal',
                desc: 'Conformidade com a legislação brasileira vigente',
              },
              {
                Icon: ShieldCheck,
                title: 'Normas ANVISA',
                desc: 'Processos alinhados às resoluções da agência',
              },
              {
                Icon: Lock,
                title: 'Proteção LGPD',
                desc: 'Sigilo absoluto das suas informações de saúde',
              },
              {
                Icon: Users,
                title: 'Equipe Dedicada',
                desc: 'Médicos, advogados e profissionais de saúde',
              },
            ].map(({ Icon, title, desc }, idx) => (
              <Reveal key={idx} delay={idx * 80} direction="up">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">
                    <Icon size={20} className="text-[#3F964F]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm md:text-base">{title}</p>
                    <p className="text-slate-500 text-xs md:text-sm leading-snug mt-0.5">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. STORYTELLING / SOBRE ═══ */}
      <section className="py-16 md:py-28 px-4 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(63,150,79,0.05) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 md:mb-20">
              <p className="text-sm font-bold tracking-widest text-[#3F964F] uppercase mb-3">
                Nossa história
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight max-w-2xl mx-auto">
                Por que a CEBEDÊ existe?
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal direction="left">
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                  Muitos pacientes no Brasil têm dificuldade de acessar tratamentos com cannabis medicinal
                  não por falta de indicação, mas por falta de orientação. O processo é legal, mas
                  poucos sabem por onde começar.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  A CEBEDÊ nasceu para mudar isso. Somos uma associação que organiza e apoia pacientes,
                  oferecendo o caminho claro: do pré-cadastro à orientação médica e jurídica, sem
                  jargão, sem burocracia desnecessária e sem deixar ninguém sem resposta.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Nossa atuação é pautada por transparência, ética e respeito à história de cada
                  pessoa. Aqui, você não é um número — é alguém em busca de mais qualidade de vida, e
                  isso merece atenção real.
                </p>
              </div>
            </Reveal>

            <Reveal direction="right" delay={150}>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    Icon: HeartHandshake,
                    title: 'Acolhimento real',
                    desc: 'Cada associado recebe atenção individualizada, com respeito à sua história e necessidade.',
                  },
                  {
                    Icon: FileText,
                    title: 'Processo transparente',
                    desc: 'Do pré-cadastro ao encaminhamento, você sabe exatamente o que está acontecendo e o que vem a seguir.',
                  },
                  {
                    Icon: Leaf,
                    title: 'Compromisso com a legalidade',
                    desc: 'Trabalhamos exclusivamente dentro dos caminhos legais. Nenhum atalho, nenhuma promessa irresponsável.',
                  },
                ].map(({ Icon, title, desc }, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#3F964F]/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#3F964F]" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">{title}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 5. PARA QUEM É ═══ */}
      <section className="py-16 md:py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-bold tracking-widest text-[#3F964F] uppercase mb-3">
                Público atendido
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Para quem é a CEBEDÊ?
              </h2>
              <p className="text-slate-500 text-base md:text-xl mt-4 max-w-xl mx-auto">
                Apoiamos pessoas que buscam qualidade de vida por meio de tratamentos legais,
                com prescrição médica.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              'Ansiedade e Distúrbios do Sono',
              'Dores Crônicas e Inflamações Severas',
              'Espectro Autista (TEA)',
              'Epilepsia e Condições Neurológicas',
            ].map((item, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 100}>
                <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#3F964F]/30 hover:shadow-md transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-[#3F964F] transition-colors duration-300">
                    <Check size={18} className="text-[#3F964F] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-semibold text-slate-800">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Centro de Base Científica — entrada */}
          <Reveal direction="up" delay={450}>
            <div className="mt-14 max-w-3xl mx-auto" id="base-cientifica">
              <div className="text-center mb-7">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#3F964F] uppercase bg-green-50 border border-green-100 px-3 py-1.5 rounded-full mb-3">
                  <BookOpen size={11} />
                  Centro de Base Científica
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-3 mb-2">
                  A ciência por trás do nosso trabalho
                </h3>
                <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Conheça estudos clínicos e revisões científicas que ajudam a entender, de forma simples,
                  como a cannabis medicinal vem sendo estudada para cada condição que atendemos.
                </p>
              </div>

              {/* Mini-cards dos estudos */}
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Epilepsia', texto: 'CBD e epilepsia: o que este estudo mostrou', slug: 'epilepsia-dravet-cannabidiol', pmid: '28538134' },
                  { label: 'Epilepsia', texto: 'CBD em epilepsias resistentes: eficácia e segurança em 4 anos', slug: 'epilepsia-resistente-cbd-longo-prazo', pmid: '36537757' },
                  { label: 'Distúrbios do Sono', texto: 'Cannabis medicinal e insônia: o que a pesquisa observou', slug: 'insonia-cannabis-medicinal', pmid: '34115851' },
                  { label: 'Dor Crônica', texto: 'Cannabis e dor crônica: principais achados do estudo', slug: 'dor-cronica-cannabis', pmid: '32445190' },
                  { label: 'Espectro Autista', texto: 'CBD no autismo: resultados observados em crianças', slug: 'autismo-cbd', pmid: '35617670' },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={`#/estudo/${item.slug}`}
                    className="group flex items-start gap-3 bg-white border border-slate-100 hover:border-[#3F964F]/30 hover:shadow-sm p-4 rounded-xl transition-all duration-200"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3F964F] mt-2 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#3F964F] mb-0.5">{item.label}</p>
                      <p className="text-sm text-slate-700 leading-snug group-hover:text-[#3F964F] transition-colors">{item.texto}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#/base-cientifica"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3F964F] hover:bg-[#2d6b38] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200"
                >
                  Explorar base científica
                  <ArrowRight size={14} />
                </a>
                <span className="text-xs text-slate-400">6 estudos · Leitura simplificada · Referências reais</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 6. COMO FUNCIONA ═══ */}
      <section id="como-funciona" className="py-16 md:py-28 px-4 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 md:mb-20">
              <p className="text-sm font-bold tracking-widest text-[#3F964F] uppercase mb-3">
                Processo
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                O seu caminho até nós
              </h2>
              <p className="text-slate-500 text-base md:text-xl mt-4 max-w-lg mx-auto">
                Um processo desenhado para ser simples, transparente e acolhedor — do início ao fim.
              </p>
            </div>
          </Reveal>

          <div className="relative">
            {/* Linha vertical conectora (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent -translate-x-1/2 -z-0" />

            <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-1 md:gap-0">
              {[
                {
                  step: '01',
                  title: 'Pré-Cadastro',
                  desc: 'Preencha o formulário seguro com seus dados reais. É rápido, gratuito e sem compromisso. Suas informações ficam sob sigilo total.',
                  side: 'left',
                  delay: 100,
                },
                {
                  step: '02',
                  title: 'Análise de Perfil',
                  desc: 'Nossa equipe multidisciplinar analisa seu caso para entender suas necessidades e como podemos ajudar da melhor forma.',
                  side: 'right',
                  delay: 200,
                },
                {
                  step: '03',
                  title: 'Orientação Inicial',
                  desc: 'Você recebe orientação personalizada por WhatsApp sobre os próximos passos, documentação necessária e o caminho legal mais adequado ao seu caso.',
                  side: 'left',
                  delay: 300,
                },
                {
                  step: '04',
                  title: 'Encaminhamento Especializado',
                  desc: 'Quando pertinente, você é direcionado a médicos habilitados para avaliação e prescrição, com orientação sobre as normas da ANVISA.',
                  side: 'right',
                  delay: 400,
                },
                {
                  step: '05',
                  title: 'Acompanhamento Contínuo',
                  desc: 'A CEBEDÊ permanece ao seu lado durante todo o processo, com suporte jurídico e médico sempre que necessário.',
                  side: 'left',
                  delay: 500,
                },
              ].map((item, idx) => (
                <Reveal key={idx} direction={item.side === 'left' ? 'left' : 'right'} delay={item.delay} className="relative z-10">
                  <div
                    className={`flex gap-6 items-start py-6 md:py-8 px-4 md:px-0 ${
                      item.side === 'right' ? 'md:flex-row-reverse md:text-right' : ''
                    }`}
                  >
                    {/* Step number */}
                    <div className="shrink-0 w-14 h-14 bg-white border-2 border-slate-100 shadow-sm text-[#3F964F] rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300 hover:bg-[#3F964F] hover:text-white hover:border-[#3F964F] hover:shadow-lg hover:shadow-green-900/15 cursor-default">
                      {item.step}
                    </div>
                    {/* Content */}
                    <div className="flex-1 max-w-md">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. O QUE OFERECEMOS ═══ */}
      <section className="py-16 md:py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-bold tracking-widest text-[#3F964F] uppercase mb-3">
                Benefícios
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                O que a CEBEDÊ oferece
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Informação qualificada',
                desc: 'Conteúdo confiável e atualizado sobre cannabis medicinal para pacientes e familiares.',
              },
              {
                title: 'Orientação sobre caminhos legais',
                desc: 'Apoio para navegar a legislação brasileira vigente e as resoluções da ANVISA com segurança.',
              },
              {
                title: 'Consultoria jurídica',
                desc: 'Suporte legal especializado. Gratuito para pessoas de baixa renda que necessitam de apoio para viabilizar o tratamento.',
              },
              {
                title: 'Equipe multidisciplinar',
                desc: 'Médicos, advogados e profissionais de saúde dedicados a apoiar cada associado de forma integral.',
              },
              {
                title: 'Encaminhamento médico',
                desc: 'Direcionamento a profissionais habilitados para avaliação, prescrição e acompanhamento terapêutico.',
              },
              {
                title: 'Organização de pacientes',
                desc: 'Comunidade estruturada que fortalece a voz coletiva e incentiva o acesso e a pesquisa na área.',
              },
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 80} direction="up">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#3F964F]/20 transition-all duration-400 h-full">
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                    <Check size={16} className="text-[#3F964F]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. AUTORIDADE / RIGOR LEGAL ═══ */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal direction="scale">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden">
              {/* Glow decorativo */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#3F964F]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
              {/* Grid sutil */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={22} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-0.5">
                      Conformidade
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      Rigor legal em cada etapa
                    </h2>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      Icon: FileText,
                      title: 'Prescrição Médica',
                      desc: 'Acesso exclusivo mediante prescrição de médico ou dentista legalmente habilitado.',
                    },
                    {
                      Icon: ShieldCheck,
                      title: 'Normas da ANVISA',
                      desc: 'Todos os processos seguem rigorosamente as resoluções vigentes da Agência Nacional de Vigilância Sanitária.',
                    },
                    {
                      Icon: Lock,
                      title: 'Proteção de Dados (LGPD)',
                      desc: 'Sigilo absoluto das suas informações de saúde, em conformidade total com a Lei Geral de Proteção de Dados.',
                    },
                  ].map(({ Icon, title, desc }, idx) => (
                    <Reveal key={idx} direction="up" delay={idx * 120}>
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors duration-300">
                        <div className="w-10 h-10 rounded-xl bg-[#3F964F]/20 flex items-center justify-center mb-4">
                          <Icon size={18} className="text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-white mb-2">{title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={400}>
                  <p className="mt-8 text-slate-400 text-sm text-center leading-relaxed max-w-xl mx-auto">
                    A CEBEDÊ é uma associação em processo de estruturação. Atuamos dentro da legislação
                    brasileira para garantir o acesso seguro e legal a medicamentos à base de cannabis.
                  </p>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 9. CTA INTERMEDIÁRIO ═══ */}
      <section className="py-14 md:py-20 px-4 bg-[#3F964F] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Reveal direction="scale">
            <p className="text-green-100 text-sm font-bold tracking-widest uppercase mb-4">
              Pacientes Associados · Vagas Limitadas
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
              Torne-se Paciente Associado hoje.
            </h2>
            <p className="text-green-100 text-base md:text-lg mb-6 leading-relaxed">
              O cadastro é gratuito, leva menos de 2 minutos e garante os benefícios exclusivos de
              paciente associado — sem mensalidade até a abertura oficial.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-sm text-green-100/80">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />Orientação médica e jurídica</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />Acesso prioritário</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />100% gratuito</span>
            </div>
            <button
              onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
              className="shimmer-btn group inline-flex items-center justify-center gap-2.5 bg-white text-[#3F964F] font-bold px-8 py-4 rounded-full text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Quero ser Paciente Associado
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ═══ 10. FAQ ═══ */}
      <section className="py-16 md:py-28 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 md:mb-14">
              <p className="text-sm font-bold tracking-widest text-[#3F964F] uppercase mb-3">
                Dúvidas frequentes
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Perguntas frequentes
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <Reveal key={idx} delay={idx * 60} direction="up">
                <FaqItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === idx}
                  onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <p className="text-center text-slate-400 text-sm mt-10">
              Ainda tem dúvidas?{' '}
              <a
                href="https://chat.whatsapp.com/IIIhNwQGoDI3C2PJ9Ec1hP"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3F964F] font-semibold hover:underline"
              >
                entre na nossa comunidade no WhatsApp
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 11. FORMULÁRIO ═══ */}
      <section id="cadastro" className="py-16 md:py-32 px-3 sm:px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        {/* Blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3F964F]/20 blur-[120px] rounded-full animate-morph pointer-events-none"
          style={{ animationDuration: '18s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600/12 blur-[100px] rounded-full animate-morph pointer-events-none"
          style={{ animationDuration: '22s', animationDelay: '-11s' }}
        />
        {/* Logo watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.025] pointer-events-none animate-float hidden md:block">
          <img src="logo-cebede.webp" alt="" width="500" height="500" className="w-full h-full object-contain brightness-0 invert" />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <Reveal direction="scale">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/30">
              <div className="text-center pt-10 md:pt-14 pb-6 px-5 md:px-10">
                <span className="inline-block py-1 px-3 rounded-full bg-green-50 text-[#3F964F] text-xs font-bold tracking-wider uppercase mb-3">
                  Etapa 1 de 1 — é só isso
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  Pré-Cadastro
                </h2>
                <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed">
                  Preencha com seus dados reais. Após o envio, nossa equipe entrará em contato pelo
                  WhatsApp com as orientações personalizadas para o seu caso.
                </p>
              </div>

              <div className="px-5 md:px-10 pb-10">
                {status.message && (
                  <Reveal direction="down">
                    <div
                      className={`p-4 rounded-2xl mb-6 flex items-start gap-3 ${
                        status.type === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {status.type === 'error' ? (
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                      ) : (
                        <CheckCircle className="shrink-0 mt-0.5" size={20} />
                      )}
                      <span className="font-medium text-base leading-snug">{status.message}</span>
                    </div>
                  </Reveal>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="input-focus-line">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white focus:ring-0 transition-all duration-300 text-base placeholder-slate-400 ${
                        touched.nome && errors.nome
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-slate-100 focus:border-[#3F964F]'
                      }`}
                      placeholder="Ex: Maria da Silva"
                    />
                    {touched.nome && errors.nome && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                        <AlertCircle size={12} /> {errors.nome}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="input-focus-line">
                      <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white focus:ring-0 transition-all duration-300 text-base placeholder-slate-400 ${
                          touched.whatsapp && errors.whatsapp
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-slate-100 focus:border-[#3F964F]'
                        }`}
                        placeholder="(00) 00000-0000"
                      />
                      {touched.whatsapp && errors.whatsapp && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                          <AlertCircle size={12} /> {errors.whatsapp}
                        </p>
                      )}
                    </div>
                    <div className="input-focus-line">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Cidade / Estado
                      </label>
                      <input
                        type="text"
                        name="localizacao"
                        value={formData.localizacao}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white focus:ring-0 transition-all duration-300 text-base placeholder-slate-400 ${
                          touched.localizacao && errors.localizacao
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-slate-100 focus:border-[#3F964F]'
                        }`}
                        placeholder="Ex: Fortaleza / CE"
                      />
                      {touched.localizacao && errors.localizacao && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                          <AlertCircle size={12} /> {errors.localizacao}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border transition-colors duration-200 ${
                    touched.prescricao && errors.prescricao ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <label className="block text-sm font-bold text-slate-900 mb-3">
                      Já possui prescrição médica para cannabis medicinal?
                    </label>
                    <div className="flex gap-3">
                      {['Sim', 'Não'].map((opt) => (
                        <label
                          key={opt}
                          className={`flex-1 flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.prescricao === opt
                              ? 'border-[#3F964F] bg-green-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="prescricao"
                            value={opt}
                            checked={formData.prescricao === opt}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                              formData.prescricao === opt ? 'border-[#3F964F]' : 'border-slate-300'
                            }`}
                          >
                            {formData.prescricao === opt && (
                              <div className="w-2.5 h-2.5 bg-[#3F964F] rounded-full" />
                            )}
                          </div>
                          <span className={`font-bold text-sm ${formData.prescricao === opt ? 'text-[#3F964F]' : 'text-slate-600'}`}>
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                    {touched.prescricao && errors.prescricao && (
                      <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                        <AlertCircle size={12} /> {errors.prescricao}
                      </p>
                    )}
                  </div>

                  <div className={`p-5 rounded-2xl border transition-colors duration-200 ${
                    touched.apoioJuridico && errors.apoioJuridico ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-start gap-3 mb-1">
                      <HeartHandshake size={18} className="text-[#3F964F] shrink-0 mt-0.5" />
                      <label className="text-sm font-bold text-slate-900 leading-snug">
                        Deseja solicitar consultoria jurídica gratuita?
                      </label>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 pl-7">
                      Disponível para pessoas de baixa renda que precisam de apoio legal para viabilizar
                      o tratamento.
                    </p>
                    <div className="flex gap-3">
                      {['Sim', 'Não'].map((opt) => (
                        <label
                          key={opt}
                          className={`flex-1 flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.apoioJuridico === opt
                              ? 'border-[#3F964F] bg-green-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="apoioJuridico"
                            value={opt}
                            checked={formData.apoioJuridico === opt}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                              formData.apoioJuridico === opt ? 'border-[#3F964F]' : 'border-slate-300'
                            }`}
                          >
                            {formData.apoioJuridico === opt && (
                              <div className="w-2.5 h-2.5 bg-[#3F964F] rounded-full" />
                            )}
                          </div>
                          <span
                            className={`font-bold text-sm ${
                              formData.apoioJuridico === opt ? 'text-[#3F964F]' : 'text-slate-600'
                            }`}
                          >
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                    {touched.apoioJuridico && errors.apoioJuridico && (
                      <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                        <AlertCircle size={12} /> {errors.apoioJuridico}
                      </p>
                    )}
                  </div>

                  <div className="input-focus-line">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Qual o seu objetivo com a cannabis medicinal?{' '}
                      <span className="font-normal text-slate-400">(opcional)</span>
                    </label>
                    <p className="text-xs text-slate-400 mb-2">
                      Conte brevemente sua situação ou o que busca com o tratamento. Isso nos ajuda a orientar melhor o seu caso.
                    </p>
                    <div className="relative">
                      <textarea
                        name="objetivo"
                        value={formData.objetivo}
                        onChange={handleChange}
                        maxLength={1000}
                        rows={4}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:ring-0 focus:border-[#3F964F] transition-all duration-300 text-base placeholder-slate-400 resize-none"
                        placeholder="Ex: Tenho ansiedade e distúrbios do sono há alguns anos e gostaria de entender se o tratamento com cannabis medicinal poderia ajudar no meu caso..."
                      />
                      <span className="absolute bottom-3 right-4 text-xs text-slate-300 pointer-events-none select-none">
                        {formData.objetivo.length}/1000
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={`flex items-start gap-3 cursor-pointer group rounded-2xl p-3 -mx-3 transition-colors duration-200 ${
                      touched.lgpd && errors.lgpd ? 'bg-red-50' : 'hover:bg-slate-50'
                    }`}>
                      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          name="lgpd"
                          checked={formData.lgpd}
                          onChange={handleChange}
                          className={`peer appearance-none w-5 h-5 border-2 rounded-md checked:bg-[#3F964F] checked:border-[#3F964F] transition-all cursor-pointer ${
                            touched.lgpd && errors.lgpd ? 'border-red-400' : 'border-slate-300'
                          }`}
                        />
                        <Check
                          size={13}
                          className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-150"
                        />
                      </div>
                      <span className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                        Autorizo o uso dos meus dados pela CEBEDÊ para fins de contato e avaliação de
                        perfil, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                      </span>
                    </label>
                    {touched.lgpd && errors.lgpd && (
                      <p className="mt-1.5 ml-1 text-xs text-red-500 flex items-center gap-1.5">
                        <AlertCircle size={12} /> {errors.lgpd}
                      </p>
                    )}
                  </div>

                  {/* Indicador de campos pendentes */}
                  {!formValid && Object.values(touched).some(Boolean) && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>
                        {Object.values(errors).filter(Boolean).length === 1
                          ? 'Falta preencher 1 campo para continuar.'
                          : `Faltam ${Object.values(errors).filter(Boolean).length} campos para continuar.`}
                      </span>
                    </div>
                  )}

                  <button
                    type={formValid ? 'submit' : 'button'}
                    onClick={!formValid ? markAllTouched : undefined}
                    disabled={isSubmitting}
                    className={`shimmer-btn w-full text-white text-base md:text-lg font-bold py-4 md:py-5 rounded-2xl transition-all duration-300 mt-2 flex justify-center items-center gap-3 ${
                      isSubmitting
                        ? 'bg-slate-300 cursor-not-allowed'
                        : formValid
                        ? 'bg-[#3F964F] hover:bg-[#2d6b38] hover:shadow-xl hover:shadow-green-900/25 hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-slate-300 cursor-not-allowed opacity-70'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Concluir Pré-Cadastro
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400 pt-1 flex items-center justify-center gap-1.5">
                    <Lock size={11} />
                    Seus dados são protegidos e nunca compartilhados com terceiros
                  </p>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 12. FOOTER ═══ */}
      <footer className="bg-slate-950 text-slate-400 py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
            {/* Logo e tagline */}
            <Reveal direction="up">
              <div>
                <div
                  className="mb-3 opacity-60 hover:opacity-100 transition-all duration-400 cursor-pointer w-fit"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <img
                    src="logo-cebede.webp"
                    alt="CEBEDÊ"
                    width="64"
                    height="64"
                    className="h-16 object-contain opacity-90"
                  />
                </div>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                  Associação em formação para apoio a pacientes que buscam acesso legal e seguro a
                  cannabis medicinal no Brasil.
                </p>
              </div>
            </Reveal>

            {/* Contatos */}
            <Reveal direction="up" delay={100}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href="https://www.instagram.com/cebede.oficial?igsh=ZndzcjZrYTJrdnMx&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-slate-800 text-slate-400 hover:border-[#3F964F] hover:text-[#3F964F] transition-all duration-300 text-sm font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @cebede.oficial
                </a>
                <a
                  href="https://chat.whatsapp.com/IIIhNwQGoDI3C2PJ9Ec1hP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-slate-800 text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300 text-sm font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Comunidade WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal direction="up" delay={200}>
            <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <p>© {new Date().getFullYear()} CEBEDÊ. Todos os direitos reservados.</p>
              <div className="flex items-center gap-5">
                <a href="#" className="link-underline hover:text-slate-400 transition-colors duration-200">
                  Termos de Uso
                </a>
                <a href="#" className="link-underline hover:text-slate-400 transition-colors duration-200">
                  Política de Privacidade
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}
