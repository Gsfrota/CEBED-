import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ExternalLink, BookOpen, AlertTriangle, FlaskConical,
  ChevronRight, Microscope, Library,
} from 'lucide-react';
import { ESTUDOS } from './estudos-data.jsx';
import Reveal from './shared-reveal.jsx';

const BRAND = '#3F964F';

export default function BaseCientifica() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-800"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 700ms cubic-bezier(0.16,1,0.3,1) forwards; }
        :focus-visible { outline: 2px solid ${BRAND}; outline-offset: 2px; border-radius: 4px; }
        .card-estudo:hover .card-arrow { transform: translateX(4px); }
        .card-arrow { transition: transform 300ms ease; }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <a href="#/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#3F964F] transition-colors group">
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Início
          </a>
          <img src="/logo-cebede.png" alt="CEBEDÊ" className="h-7 object-contain" />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full opacity-50 blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-50 rounded-full opacity-30 blur-3xl -translate-x-1/4" />
        </div>
        <div className="max-w-3xl mx-auto relative">
          <div className="fade-up" style={{ animationDelay: '80ms', opacity: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#3F964F] uppercase bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                <Library size={12} />
                Centro de Base Científica
              </span>
              <span className="text-xs text-slate-400 font-medium">5 estudos revisados</span>
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay: '160ms', opacity: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
              Centro de Base Científica
            </h1>
          </div>
          <div className="fade-up" style={{ animationDelay: '240ms', opacity: 0 }}>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 max-w-2xl">
              Uma área dedicada à leitura simplificada de estudos científicos sobre cannabis medicinal,
              com linguagem acessível, referências reais e abordagem responsável.
            </p>
          </div>
          <div className="fade-up" style={{ animationDelay: '320ms', opacity: 0 }}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => document.getElementById('estudos')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-[#3F964F] hover:bg-[#2d6b38] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200"
              >
                Explorar estudos
                <ChevronRight size={15} />
              </button>
              <span className="text-xs text-slate-400">Leitura simplificada · Referências científicas · Conteúdo informativo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── APRESENTAÇÃO INSTITUCIONAL ── */}
      <section className="py-14 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-1">
                <FlaskConical size={18} className="text-[#3F964F]" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-[#3F964F] uppercase mb-2">Sobre este centro</p>
                <p className="text-slate-600 leading-relaxed text-base mb-3">
                  A CEBEDÊ acompanha a literatura científica sobre cannabis medicinal com responsabilidade,
                  traduzindo estudos relevantes para uma linguagem mais clara — sem transformar ciência em promessa,
                  sem simplificar além do que o estudo permite dizer.
                </p>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Os estudos destacados aqui foram selecionados por sua relevância para as condições
                  atendidas pela CEBEDÊ. Cada página apresenta o design do estudo, os achados principais,
                  as limitações reconhecidas pelos próprios autores e a referência bibliográfica completa.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GRID DOS ESTUDOS ── */}
      <section id="estudos" className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-10 md:mb-14">
              <p className="text-xs font-bold tracking-widest text-[#3F964F] uppercase mb-2">Estudos em destaque</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                5 estudos selecionados
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {ESTUDOS.map((estudo, idx) => {
              const Icon = estudo.icon;
              return (
                <Reveal key={estudo.slug} direction="up" delay={idx * 70}>
                  <a
                    href={`#/estudo/${estudo.slug}`}
                    className="card-estudo group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#3F964F]/25 p-6 transition-all duration-300"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 group-hover:bg-[#3F964F]/10 flex items-center justify-center transition-colors duration-300">
                          <Icon size={16} className="text-[#3F964F]" />
                        </div>
                        <span className="text-xs font-bold tracking-widest text-[#3F964F] uppercase">{estudo.categoria}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">PMID {estudo.pmid}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-[#3F964F] transition-colors duration-200">
                      {estudo.titulo}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
                      {estudo.resumoCurto}
                    </p>

                    <div className="bg-green-50/70 border border-green-100/80 rounded-xl px-4 py-2.5 mb-4">
                      <p className="text-xs text-slate-500 mb-0.5">Destaque</p>
                      <p className="text-sm font-semibold text-[#3F964F]">{estudo.destaque}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{estudo.journal} · {estudo.ano}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-[#3F964F]">
                        Ler estudo resumido
                        <ChevronRight size={14} className="card-arrow" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              );
            })}

            {/* Card de complemento (6º slot) */}
            <Reveal direction="up" delay={5 * 70}>
              <div className="flex flex-col bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 items-center justify-center text-center min-h-[200px]">
                <Microscope size={22} className="text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-400">Mais estudos em breve</p>
                <p className="text-xs text-slate-300 mt-1">A base científica da CEBEDÊ está em expansão</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── BLOCO DE RESPONSABILIDADE ── */}
      <section className="py-14 md:py-20 px-4 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-1">
                <AlertTriangle size={18} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-2">Responsabilidade científica</p>
                <p className="text-slate-600 leading-relaxed text-base mb-3">
                  Todo o conteúdo apresentado neste centro tem caráter exclusivamente informativo e educativo.
                  Os estudos descritos representam pesquisas em andamento ou resultados específicos
                  de determinados contextos clínicos — e não devem ser interpretados como recomendações universais.
                </p>
                <p className="text-slate-500 leading-relaxed text-sm">
                  A evidência científica sobre cannabis medicinal está em evolução. Resultados variam conforme
                  o perfil do paciente, a condição clínica, a formulação e a dose utilizada. O uso terapêutico
                  de qualquer produto deve ser avaliado, prescrito e acompanhado por profissional de saúde habilitado.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-14 md:py-20 px-4 bg-[#3F964F] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
        </div>
        <div className="max-w-3xl mx-auto relative text-center">
          <Reveal>
            <BookOpen size={28} className="text-green-200 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
              Explore os estudos destacados
            </h2>
            <p className="text-green-100 text-base md:text-lg mb-7 max-w-xl mx-auto leading-relaxed">
              Entenda, de forma simples, o que a ciência já investigou sobre cannabis medicinal
              em diferentes contextos de saúde.
            </p>
            <button
              onClick={() => document.getElementById('estudos')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-white text-[#3F964F] font-bold px-6 py-3 rounded-xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Ver estudos
              <ChevronRight size={15} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/logo-cebede.png" alt="CEBEDÊ" className="h-16 object-contain opacity-90" />
          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} CEBEDÊ. Todos os direitos reservados.
          </p>
          <a href="#/" className="text-slate-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft size={13} />
            Voltar ao início
          </a>
        </div>
      </footer>
    </div>
  );
}
