import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, AlertTriangle, CheckCircle2,
  ChevronRight, FileText, Users, BookOpen, Info,
} from 'lucide-react';
import { ESTUDOS } from './estudos-data.jsx';
import Reveal from './shared-reveal.jsx';

export default function EstudoPage() {
  const { slug } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const estudo = ESTUDOS.find((e) => e.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  if (!estudo) {
    return (
      <div
        className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Estudo não encontrado</p>
          <a href="#/base-cientifica" className="text-[#3F964F] text-sm underline">
            Voltar ao Centro de Base Científica
          </a>
        </div>
      </div>
    );
  }

  const Icon = estudo.icon;

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
        :focus-visible { outline: 2px solid #3F964F; outline-offset: 2px; border-radius: 4px; }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <a href="#/base-cientifica" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#3F964F] transition-colors group">
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Centro de Base Científica
          </a>
          <img src="/logo-cebede.png" alt="CEBEDÊ" className="h-7 object-contain" />
        </div>
      </nav>

      {/* ── HERO DO ESTUDO ── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full opacity-40 blur-3xl translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="max-w-3xl mx-auto relative">
          {/* Breadcrumb */}
          <div className="fade-up flex items-center gap-1.5 text-xs text-slate-400 mb-5" style={{ animationDelay: '50ms', opacity: 0 }}>
            <a href="#/" className="hover:text-[#3F964F] transition-colors">Início</a>
            <ChevronRight size={11} className="text-slate-300" />
            <a href="#/base-cientifica" className="hover:text-[#3F964F] transition-colors">Centro de Base Científica</a>
            <ChevronRight size={11} className="text-slate-300" />
            <span className="text-slate-500">{estudo.categoria}</span>
          </div>

          <div className="fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                <Icon size={13} className="text-[#3F964F]" />
                <span className="text-xs font-bold tracking-widest text-[#3F964F] uppercase">{estudo.categoria}</span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">PMID {estudo.pmid}</span>
              <span className="text-xs text-slate-400">{estudo.journal} · {estudo.ano}</span>
            </div>
          </div>

          <div className="fade-up" style={{ animationDelay: '180ms', opacity: 0 }}>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
              {estudo.titulo}
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-7">
              {estudo.subtitulo}
            </p>
          </div>

          <div className="fade-up" style={{ animationDelay: '260ms', opacity: 0 }}>
            <div className="flex flex-wrap gap-3">
              <a
                href={estudo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#3F964F] hover:bg-[#2d6b38] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200"
              >
                Artigo original
                <ExternalLink size={13} />
              </a>
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm px-4 py-2.5 rounded-xl">
                <FileText size={13} className="text-slate-400" />
                {estudo.design.split(',')[0]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTAQUE ── */}
      <section className="py-8 px-4 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 flex items-center gap-4">
              <CheckCircle2 size={20} className="text-[#3F964F] shrink-0" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Destaque do estudo</p>
                <p className="font-semibold text-slate-800">{estudo.destaque}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── O QUE ESTE ESTUDO AVALIOU ── */}
      <section className="py-14 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold tracking-widest text-[#3F964F] uppercase mb-3">Contexto</p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-5">
              O que este estudo avaliou
            </h2>
            <p className="text-slate-600 leading-relaxed text-base mb-6">{estudo.oQueAvaliou}</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Desenho</p>
                <p className="text-sm font-semibold text-slate-700 leading-snug">{estudo.design.split(',')[0]}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Participantes</p>
                <p className="text-sm font-semibold text-slate-700 leading-snug">{estudo.populacao.split(';')[0].split('(')[0].trim()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Duração</p>
                <p className="text-sm font-semibold text-slate-700 leading-snug">{estudo.duracao.split('–')[0].split('-')[0].trim()}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRINCIPAIS ACHADOS ── */}
      <section className="py-14 md:py-20 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold tracking-widest text-[#3F964F] uppercase mb-3">Resultados</p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-8">
              Principais achados
            </h2>
          </Reveal>
          <div className="space-y-3">
            {estudo.achados.map((achado, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 60}>
                <div className="flex gap-4 items-start bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={14} className="text-[#3F964F]" />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{achado.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── O QUE ISSO PODE SIGNIFICAR ── */}
      <section className="py-14 md:py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold tracking-widest text-[#3F964F] uppercase mb-3">Contexto prático</p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-5">
              O que isso pode significar na prática
            </h2>
            <div className="flex gap-4 items-start bg-green-50/50 border border-green-100 rounded-2xl p-5 md:p-6">
              <Info size={18} className="text-[#3F964F] shrink-0 mt-0.5" />
              <p className="text-slate-600 leading-relaxed text-base">{estudo.significado}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── LIMITES ── */}
      <section className="py-14 md:py-20 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Prudência científica</p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-6">
              Limites importantes
            </h2>
          </Reveal>
          <div className="space-y-3">
            {estudo.limites.map((limite, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 50}>
                <div className="flex gap-3.5 items-start bg-white border border-slate-100 rounded-xl p-4.5 p-4">
                  <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed">{limite}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERÊNCIA ── */}
      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold tracking-widest text-[#3F964F] uppercase mb-3">Fonte primária</p>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-5">Referência científica</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 mb-5">
              <p className="text-sm text-slate-700 leading-relaxed italic mb-3">{estudo.referencia}</p>
              <p className="text-xs text-slate-400 font-mono mb-4">DOI: {estudo.doi} · PMID: {estudo.pmid}</p>
              <a
                href={estudo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F964F] hover:text-[#2d6b38] transition-colors"
              >
                Ver no PubMed
                <ExternalLink size={12} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3 items-start">
              <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="font-semibold text-slate-800">Aviso:</strong>{' '}
                Este conteúdo tem caráter informativo e não constitui aconselhamento médico.
                O uso de cannabis medicinal deve ser avaliado e acompanhado por profissional habilitado.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── NAVEGAÇÃO ENTRE ESTUDOS ── */}
      <section className="py-12 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-5 text-center">Outros estudos</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ESTUDOS.filter((e) => e.slug !== slug).slice(0, 4).map((e) => {
                const EIcon = e.icon;
                return (
                  <a
                    key={e.slug}
                    href={`#/estudo/${e.slug}`}
                    className="group flex items-center gap-3 bg-white border border-slate-100 hover:border-[#3F964F]/25 hover:shadow-sm rounded-xl p-4 transition-all duration-200"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <EIcon size={14} className="text-[#3F964F]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#3F964F] transition-colors leading-snug line-clamp-2">
                      {e.titulo}
                    </span>
                  </a>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <a
                href="#/base-cientifica"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3F964F] hover:text-[#2d6b38] transition-colors"
              >
                <ArrowLeft size={13} />
                Ver todos os estudos
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/logo-cebede.png" alt="CEBEDÊ" className="h-16 object-contain opacity-90" />
          <p className="text-slate-500 text-sm text-center">© {new Date().getFullYear()} CEBEDÊ. Todos os direitos reservados.</p>
          <a href="#/" className="text-slate-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft size={13} />
            Início
          </a>
        </div>
      </footer>
    </div>
  );
}
