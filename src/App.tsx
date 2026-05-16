import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  BookOpen, 
  BrainCircuit, 
  ChevronRight, 
  Hourglass, 
  ListChecks, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserExamConfig, ExamStrategy } from './types';
import { generateStrategy } from './services/strategyService';

export default function App() {
  const [config, setConfig] = useState<UserExamConfig>({
    examType: 'Selección Múltiple',
    duration: 90,
    questionCount: 40,
    difficulty: 'medio'
  });

  const [strategy, setStrategy] = useState<ExamStrategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateStrategy(config);
      setStrategy(result);
    } catch (err) {
      setError('Hubo un error al generar tu estrategia. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStrategy(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 p-2 md:p-6 overflow-x-hidden">
      <div className="flex-1 flex flex-col thick-border bg-white overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-b-4 border-neutral-900 p-6 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end bg-white gap-6"
        >
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter italic">
              Reloj Bajo<br/>Control
            </h1>
            <p className="mt-4 text-lg md:text-xl font-black tracking-tight uppercase text-neutral-500">
              Estrategia Maestra para Exámenes
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-5xl md:text-7xl font-black leading-none">
              {config.duration}<span className="text-2xl ml-1">MIN</span>
            </div>
            <div className="text-xs md:text-sm uppercase font-black bg-yellow-400 px-3 py-1 mt-2 border-2 border-neutral-900">
              Configuración Actual
            </div>
          </div>
        </motion.header>

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <AnimatePresence mode="wait">
            {!strategy ? (
              <motion.div
                key="config"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col lg:flex-row"
              >
                {/* Left side info */}
                <div className="lg:w-1/3 bg-neutral-900 text-white p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-4xl font-black uppercase italic text-yellow-400 mb-6 leading-tight">
                    Prepara Tu<br/>Victoria
                  </h2>
                  <p className="text-neutral-400 font-medium text-lg leading-relaxed mb-8">
                    El tiempo es tu recurso más valioso. Define las variables y deja que la IA calcule tu ruta óptima.
                  </p>
                  <div className="flex items-center gap-4 text-yellow-400 font-black uppercase tracking-widest text-sm">
                    <Sparkles className="w-5 h-5" />
                    Potenciado por Gemini
                  </div>
                </div>

                {/* Form area */}
                <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center border-t-4 lg:border-t-0 lg:border-l-4 border-neutral-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                      <label className="block text-sm font-black uppercase tracking-tight text-neutral-900">
                        Tipo de Examen
                      </label>
                      <select 
                        className="w-full p-5 bg-white border-4 border-neutral-900 rounded-none font-bold text-lg focus:bg-yellow-50 transition-all outline-none italic"
                        value={config.examType}
                        onChange={(e) => setConfig({ ...config, examType: e.target.value })}
                      >
                        <option>Selección Múltiple</option>
                        <option>Ensayo / Desarrollo</option>
                        <option>Técnico / Práctico</option>
                        <option>Matemático</option>
                        <option>Mixto</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-black uppercase tracking-tight text-neutral-900">
                        Duración (minutos)
                      </label>
                      <input 
                        type="number"
                        className="w-full p-5 bg-white border-4 border-neutral-900 rounded-none font-bold text-lg focus:bg-yellow-50 outline-none"
                        value={config.duration}
                        onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-black uppercase tracking-tight text-neutral-900">
                        Número de Preguntas
                      </label>
                      <input 
                        type="number"
                        className="w-full p-5 bg-white border-4 border-neutral-900 rounded-none font-bold text-lg focus:bg-yellow-50 outline-none"
                        value={config.questionCount}
                        onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-black uppercase tracking-tight text-neutral-900">
                        Dificultad
                      </label>
                      <div className="grid grid-cols-3 gap-0 border-4 border-neutral-900">
                        {(['fácil', 'medio', 'difícil'] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setConfig({ ...config, difficulty: d })}
                            className={`py-5 text-xs font-black uppercase transition-all ${
                              config.difficulty === d 
                              ? 'bg-neutral-900 text-white' 
                              : 'bg-white text-neutral-900 hover:bg-neutral-100'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full group bg-neutral-900 text-white py-6 rounded-none font-black text-2xl uppercase italic tracking-tighter hover:bg-yellow-400 hover:text-neutral-900 transition-colors disabled:opacity-50 border-t-0"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          key="loading"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="flex justify-center"
                        >
                          <RefreshCw className="w-8 h-8" />
                        </motion.div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          Trazar Estrategia
                          <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </div>
                      )}
                    </AnimatePresence>
                  </button>
                  
                  {error && (
                    <div className="mt-6 p-4 bg-red-500 text-white font-black uppercase text-sm border-4 border-neutral-900">
                      {error}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="strategy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
              >
                {/* Distribution Column */}
                <section className="lg:w-2/5 lg:border-r-4 border-neutral-900 bg-neutral-900 text-white p-8 md:p-12 flex flex-col overflow-y-auto">
                  <h2 className="text-4xl font-black uppercase italic text-yellow-400 mb-12">Distribución</h2>
                  <div className="space-y-10 mb-12">
                    {strategy.distribution.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className={`flex items-start gap-6 ${idx === 1 ? 'border-l-4 border-yellow-400 pl-4' : ''}`}
                      >
                        <span className={`text-5xl md:text-6xl font-black tracking-tighter w-24 shrink-0 ${idx === 1 ? 'text-yellow-400' : 'opacity-40'}`}>
                          {item.minutes}
                        </span>
                        <div>
                          <p className={`font-black uppercase text-xl leading-none mb-1 ${idx === 1 ? 'text-yellow-400' : 'text-white italic'}`}>
                            {item.phase}
                          </p>
                          <p className="text-xs md:text-sm font-bold text-neutral-400 uppercase tracking-tight">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto bg-neutral-800 p-6 border-2 border-neutral-700 italic border-l-8 border-l-yellow-400">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-2">Reflexión Estratégica</p>
                    <p className="text-sm leading-relaxed font-black">"El éxito no es solo conocimiento, es gestión de recursos. Mantén el ritmo."</p>
                  </div>
                </section>

                {/* Right content grid */}
                <section className="flex-1 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white overflow-y-auto">
                  {strategy.tips.map((tip, idx) => (
                    <div 
                      key={idx}
                      className={`border-4 border-neutral-900 p-8 flex flex-col justify-between transition-all duration-200 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${idx === 1 ? 'bg-red-500 text-white' : idx === 3 ? 'bg-neutral-900 text-white' : 'bg-white'}`}
                    >
                      <span className={`text-6xl font-black opacity-10 group-hover:opacity-20 transition-opacity mb-4 ${idx === 3 ? 'text-yellow-400 text-shadow-sm' : ''}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className={`font-black text-xl uppercase mb-3 leading-none italic ${idx === 3 ? 'text-yellow-400' : ''}`}>Táctica {idx + 1}</h3>
                        <p className="font-bold text-sm leading-snug">{tip}</p>
                      </div>
                    </div>
                  ))}

                  <div className="border-4 border-neutral-900 p-8 col-span-1 md:col-span-2 bg-yellow-400 flex flex-col md:flex-row items-center gap-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="bg-neutral-900 text-white p-4 shrink-0">
                      <BrainCircuit className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase italic tracking-tighter mb-2">Control de Crisis: {strategy.stressTechnique.name}</h3>
                      <div className="flex flex-wrap gap-4">
                        {strategy.stressTechnique.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-neutral-900 rotate-45" />
                            <span className="text-xs font-black uppercase tracking-tight">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={reset}
                      className="mt-4 md:mt-0 md:ml-auto group flex items-center gap-3 font-black uppercase text-sm border-b-4 border-neutral-900 pb-1 hover:text-white transition-colors italic"
                    >
                      Reiniciar <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="bg-neutral-900 text-white px-8 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] md:text-xs font-black uppercase italic tracking-widest text-neutral-500">
            <span className="hover:text-yellow-400 transition-colors cursor-default">Foco Absoluto</span>
            <span className="hover:text-yellow-400 transition-colors cursor-default">Gestión de Tiempo</span>
            <span className="hover:text-yellow-400 transition-colors cursor-default">Ejecución Impecable</span>
          </div>
          <div className="text-[10px] font-black uppercase bg-white text-neutral-900 px-4 py-2 border-2 border-neutral-900 shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]">
            Estudiante de Élite v2.0
          </div>
        </footer>
      </div>
    </div>
  );
}
