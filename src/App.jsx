import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState('fr'); // Defaulting to FR for CAA Québec, togglable to EN
  const [simulationState, setSimulationState] = useState('idle'); // 'idle', 'redeeming', 'completed-current', 'completed-future'
  const [selectedArchMode, setSelectedArchMode] = useState('current'); // 'current', 'future'
  const [isPresentMode, setIsPresentMode] = useState(false); // New full-screen / presentation mode toggle
  const [touchpointView, setTouchpointView] = useState('agent'); // 'agent' (Salesforce CCaaS) vs 'portal' (Orion)

  // Mock data for interactive discovery checklist
  const [discoveryQuestions, setDiscoveryQuestions] = useState([
    { 
      id: 1, 
      textEN: "What are the exact transactional data volumes and frequency for member redemptions vs. retail credits?", 
      textFR: "Quels sont les volumes et fréquences de données transactionnelles exacts pour les encaissements de membres par rapport aux crédits de détaillants ?",
      answered: false 
    },
    { 
      id: 2, 
      textEN: "Are there technical constraints or latency limits on Axis/AccessFS or Orion for direct on-demand queries?", 
      textFR: "Existe-t-il des contraintes techniques ou des limites de latence sur Axis/AccessFS ou Orion pour les requêtes directes à la demande ?",
      answered: false 
    },
    { 
      id: 3, 
      textEN: "What is the expected growth of transactional volume if we expand the 'Daily Concierge' model?", 
      textFR: "Quelle est la croissance attendue du volume transactionnel si nous étendons le modèle de « Concierge quotidien » ?",
      answered: false 
    },
    { 
      id: 4, 
      textEN: "How is the integration between CAA Québec and out-of-province CAA entities currently handled?", 
      textFR: "Comment est gérée actuellement l'intégration entre CAA Québec et les autres entités CAA hors province ?",
      answered: false 
    }
  ]);

  const toggleQuestion = (id) => {
    setDiscoveryQuestions(prev => prev.map(q => q.id === id ? { ...q, answered: !q.answered } : q));
  };

  const runSimulation = (mode) => {
    setSimulationState('redeeming');
    setTimeout(() => {
      setSimulationState(mode === 'current' ? 'completed-current' : 'completed-future');
    }, 2000);
  };

  const resetSimulation = () => {
    setSimulationState('idle');
  };

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const slides = [
    // SLIDE 1: The Strategic Challenge
    {
      title: language === 'en' 
        ? "Addressing the Near-Real-Time Integration Gap" 
        : "Combler l'écart d'intégration en temps quasi réel",
      subtitle: language === 'en' 
        ? "The Challenge of Redemption Integrity vs. Ingestion Sync" 
        : "Le défi de l'intégrité de l'encaissement vs la synchronisation d'ingestion",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column: Context & Quote */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div>
              <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full tracking-wider uppercase">
                {language === 'en' ? "Problem Statement" : "Énoncé du problème"}
              </span>
              <h3 className="text-xl font-bold text-white mt-4 mb-3">
                {language === 'en' ? "\"Is Talend + Snowflake Enough?\"" : "« Talend + Snowflake est-il suffisant ? »"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {language === 'en' ? (
                  <>
                    A fundamental architectural question regarding CAA Dollars & Points. 
                    While a 24-hour batch replication delay is acceptable when <strong>crediting points</strong> from slow external retailers, 
                    it creates a critical operational risk during <strong>redemption and immediate utilization</strong>.
                  </>
                ) : (
                  <>
                    Une question d'architecture fondamentale concernant les points et dollars CAA. 
                    Bien qu'un délai de réplication par lots de 24 heures soit acceptable pour le <strong>crédit de points</strong> provenant de détaillants externes, 
                    cela engendre un risque opérationnel critique lors de l'<strong>encaissement et de l'utilisation immédiate</strong>.
                  </>
                )}
              </p>
              
              <div className="border-l-4 border-teal-500 pl-4 py-1 my-4 italic text-slate-400 text-sm">
                {language === 'en' 
                  ? "\"If a member redeems dollars to renew their membership in Axis and then immediately attempts to apply those same dollars toward an insurance policy in Orion, the lag in replication creates an out-of-sync, inconsistent member experience.\""
                  : "« Si un membre utilise des dollars pour renouveler son adhésion dans Axis et tente immédiatement d'appliquer ces mêmes dollars à une police d'assurance dans Orion, le retard de réplication crée une expérience déconnectée et incohérente pour le membre. »"}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mt-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {language === 'en' ? "The Architectural Flaw:" : "La faille architecturale :"}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'en' 
                  ? "Data logic is hosted in systems of record like Axis/AccessFS and Orion, and then replicated into multiple downstream places. This 'copy-everywhere' pattern creates latency loops rather than querying operational data dynamically."
                  : "La logique des données est hébergée dans des systèmes d'enregistrement comme Axis/AccessFS et Orion, puis répliquée dans plusieurs systèmes en aval. Ce modèle de « copie universelle » crée des boucles de latence au lieu de requêter les données opérationnelles de manière dynamique."}
              </p>
            </div>
          </div>

          {/* Right Column: Visual Breakdown of Crediting vs Redemption */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Box 1: The Low-Risk Flow */}
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white">
                    {language === 'en' ? "POINT CREDITING (Batch is Acceptable)" : "CRÉDIT DE POINTS (Traitement par lots acceptable)"}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {language === 'en' 
                      ? "Retailer reports transaction → Data arrives overnight in batches → Talend syncs to Axis, Orion, and Snowflake. Because the retail collection loop itself is slow, a 24-hour sync lag here is invisible to the member."
                      : "Le détaillant signale la transaction → Les données arrivent la nuit par lots → Talend synchronise vers Axis, Orion et Snowflake. Comme la boucle de collecte du détaillant est elle-même lente, un délai de synchronisation de 24 heures est invisible pour le membre."}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                      {language === 'en' ? "Talend & Snowflake Match" : "Correspondance Talend & Snowflake"}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {language === 'en' ? "Asynchronous Sync" : "Sync asynchrone"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: The Critical-Risk Flow */}
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-red-900/40 hover:border-red-800/60 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white text-red-400">
                    {language === 'en' ? "POINT REDEMPTION (Near-Real-Time Needed)" : "ENCAISSEMENT DE POINTS (Temps quasi réel requis)"}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {language === 'en' 
                      ? "Member redeems points in Axis → Orion must instantly reflect the adjusted balance to apply to insurance. A 24-hour lag here permits double-spending points, causes checkout failures, and damages trust."
                      : "Le membre encaisse des points dans Axis → Orion doit instantanément refléter le solde ajusté pour l'assurance. Un délai de 24 heures permet la double dépense des points, provoque des échecs d'encaissement et nuit à la confiance."}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono">
                      {language === 'en' ? "Replication Delay Failure" : "Échec dû au délai de réplication"}
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono">
                      {language === 'en' ? "Action: Near-Real-Time Orchestration" : "Action : Orchestration en temps quasi réel"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key takeaway indicator */}
            <div className="p-4 bg-teal-500/5 rounded-xl border border-teal-500/20 text-center">
              <span className="text-xs text-teal-300">
                💡 <strong>{language === 'en' ? "The Strategic Paradigm Shift:" : "Le changement de paradigme stratégique :"}</strong>{' '}
                {language === 'en' 
                  ? "We aren't proposing moving data from point A to B faster. We are changing how data is queried and orchestrated at the moment of the customer interaction."
                  : "Nous ne proposons pas de déplacer les données plus rapidement d'un point A à un point B. Nous changeons la façon dont les données sont interrogées et orchestrées au moment même de l'interaction avec le client."}
              </span>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 2: Interactive Scenario Simulation
    {
      title: language === 'en' ? "Interactive Scenario: Axis to Orion" : "Scénario interactif : d'Axis vers Orion",
      subtitle: language === 'en' 
        ? "See how the current architecture risks balance inconsistencies compared to MuleSoft's live API orchestration."
        : "Découvrez comment l'architecture actuelle risque de causer des incohérences de solde par rapport à l'orchestration d'API en direct de MuleSoft.",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Control Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div>
              {/* Interactive perspective selection */}
              <div className="mb-5 pb-5 border-b border-slate-800/80">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  {language === 'en' ? "1. Select Touchpoint Perspective" : "1. Choisir la perspective du point de contact"}
                </h4>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => { setTouchpointView('agent'); resetSimulation(); }}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${touchpointView === 'agent' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{language === 'en' ? "CCaaS Agent Console" : "Console Agent CCaaS"}</span>
                  </button>
                  <button
                    onClick={() => { setTouchpointView('portal'); resetSimulation(); }}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${touchpointView === 'portal' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a5 5 0 00-10 0c0 1.005.113 1.984.33 2.927m11.97-.274a9 9 0 11-11.21 3.063" />
                    </svg>
                    <span>{language === 'en' ? "Member Orion Portal" : "Portail Membre Orion"}</span>
                  </button>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                {language === 'en' ? "2. Choose Architecture Model" : "2. Choisir le modèle d'architecture"}
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => { setSelectedArchMode('current'); resetSimulation(); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedArchMode === 'current' ? 'bg-red-500/10 border-red-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <div className="font-bold text-sm">
                    {language === 'en' ? "Current: Batch Replication" : "Actuel : Réplication par lots"}
                  </div>
                  <div className="text-xs opacity-80 mt-1">
                    {language === 'en' 
                      ? "Uses Talend + Nightly Batch Sync to copy Axis data downstream." 
                      : "Utilise Talend + synchronisation nocturne par lots pour répliquer Axis en aval."}
                  </div>
                </button>

                <button 
                  onClick={() => { setSelectedArchMode('future'); resetSimulation(); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedArchMode === 'future' ? 'bg-teal-500/10 border-teal-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <div className="font-bold text-sm">
                    {language === 'en' ? "Future: MuleSoft Live Query" : "Futur : Requête en direct via MuleSoft"}
                  </div>
                  <div className="text-xs opacity-80 mt-1">
                    {language === 'en' 
                      ? "Hybrid approach. Real-time API query triggered instantly on active engagement."
                      : "Approche hybride. Requête API en direct déclenchée instantanément lors d'un engagement."}
                  </div>
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {language === 'en' ? "Simulated Member Path" : "Parcours simulé du membre"}
                </h4>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                  <li>
                    {language === 'en' 
                      ? "Member redeems $50 CAA Dollars on Membership Renewal (Axis)." 
                      : "Le membre utilise 50 $ de dollars CAA sur son renouvellement d'adhésion (Axis)."}
                  </li>
                  <li>
                    {touchpointView === 'agent' 
                      ? (language === 'en' ? "Member immediately calls the customer service agent to check insurance options." : "Le membre appelle immédiatement le service client pour vérifier ses options d'assurance.")
                      : (language === 'en' ? "Member immediately navigates to self-service Orion insurance portal." : "Le membre navigue immédiatement vers le portail d'assurance d'auto-assistance Orion.")}
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-6">
              {simulationState === 'idle' && (
                <button 
                  onClick={() => runSimulation(selectedArchMode)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all text-center ${selectedArchMode === 'current' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'}`}
                >
                  {language === 'en' ? "Simulate Live Transaction" : "Simuler la transaction en direct"}
                </button>
              )}
              {simulationState === 'redeeming' && (
                <div className="w-full py-3 px-4 rounded-xl bg-slate-800 text-center text-slate-400 text-sm animate-pulse flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'en' ? "Processing Sync..." : "Traitement de la synchronisation..."}
                </div>
              )}
              {(simulationState === 'completed-current' || simulationState === 'completed-future') && (
                <button 
                  onClick={resetSimulation}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all text-center"
                >
                  {language === 'en' ? "Reset Simulation" : "Réinitialiser la simulation"}
                </button>
              )}
            </div>
          </div>

          {/* Interactive Flow Visualizer */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
              {language === 'en' ? "Interactive Transaction Flow" : "Flux de transaction interactif"}
            </h3>

            <div className="grid grid-cols-3 gap-4 items-center justify-center relative my-auto">
              
              {/* Box A: Touchpoint/Salesforce Portal (Changes based on toggle) */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl relative z-10 transition-all duration-300 transform">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg mb-2">
                  {touchpointView === 'agent' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-bold text-white text-center min-h-[40px] flex items-center justify-center">
                  {touchpointView === 'agent' ? (
                    language === 'en' ? "Salesforce Agent Console (CCaaS)" : "Console Agent Salesforce (CCaaS)"
                  ) : (
                    language === 'en' ? "Insurance Quote (Orion Portal)" : "Soumission d'assurance (Portail Orion)"
                  )}
                </span>
                
                {/* Dynamic Balance Display */}
                <div className="mt-3 py-1.5 px-3 bg-slate-950 rounded border border-slate-800 text-center min-w-[120px]">
                  <span className="block text-[9px] text-slate-400 uppercase font-mono">
                    {language === 'en' ? "Available CAA Dollars Balance" : "Solde de dollars CAA disponibles"}
                  </span>
                  <span className="text-xs font-bold text-slate-100">
                    {simulationState === 'idle' && "$100.00"}
                    {simulationState === 'redeeming' && "$100.00"}
                    {simulationState === 'completed-current' && (
                      <span className="text-red-400 animate-pulse">
                        {language === 'en' ? "$100.00 (Unchanged!)" : "100,00 $ (Inchangé !)"}
                      </span>
                    )}
                    {simulationState === 'completed-future' && (
                      <span className="text-teal-400">
                        {language === 'en' ? "$50.00 (Updated Live)" : "50,00 $ (Mis à jour en direct)"}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Dynamic Connecting Line with status animation */}
              <div className="flex flex-col items-center justify-center relative">
                {simulationState === 'redeeming' && (
                  <div className="absolute w-full flex justify-between px-4">
                    <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-ping delay-75"></div>
                    <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-ping delay-150"></div>
                  </div>
                )}
                <div className={`h-1 w-full rounded ${selectedArchMode === 'current' ? 'bg-red-500/20' : 'bg-teal-500/20'}`}></div>
                <div className="text-[10px] font-mono text-slate-400 mt-2 text-center bg-slate-900 px-2 py-1 rounded border border-slate-800 select-none">
                  {selectedArchMode === 'current' 
                    ? (language === 'en' ? 'Talend Batch Sync' : 'Sync par lots Talend') 
                    : (language === 'en' ? 'MuleSoft API Proxy' : "Proxy d'API MuleSoft")}
                </div>
              </div>

              {/* Box B: Core Operational Record (AccessFS / Axis) */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl relative z-10">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-white text-center font-sans min-h-[40px] flex items-center justify-center">
                  {language === 'en' ? "Axis Backend Ledger" : "Registre de base Axis"}
                </span>
                
                <div className="mt-3 py-1.5 px-3 bg-slate-950 rounded border border-slate-800 text-center min-w-[120px]">
                  <span className="block text-[9px] text-slate-400 uppercase font-mono">
                    {language === 'en' ? "Axis Actual Balance" : "Solde réel Axis"}
                  </span>
                  <span className="text-xs font-bold text-purple-300">
                    {simulationState === 'idle' ? "$100.00" : "$50.00"}
                  </span>
                </div>
              </div>

            </div>

            {/* Simulation Feedback / Outcome Messages */}
            <div className="mt-6 min-h-[110px] flex items-center justify-center">
              {simulationState === 'idle' && (
                <p className="text-slate-400 text-xs text-center italic">
                  {language === 'en' 
                    ? "Select perspective + architecture approach and click \"Simulate Live Transaction\" above to test the outcome."
                    : "Sélectionnez une perspective + approche d'architecture et cliquez sur « Simuler la transaction en direct » ci-dessus."}
                </p>
              )}
              {simulationState === 'redeeming' && (
                <p className="text-yellow-400 text-xs text-center animate-pulse font-mono">
                  {language === 'en' 
                    ? "Retrieving Member Ledger... Checking synchronization layers..." 
                    : "Récupération du registre des membres... Vérification de la synchronisation..."}
                </p>
              )}
              
              {/* CURRENT BATCH FAILURES */}
              {simulationState === 'completed-current' && (
                <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl w-full">
                  <div className="flex gap-2">
                    <span className="text-red-400 font-bold text-xs shrink-0">
                      {language === 'en' ? "⚠️ SYNC LAG FAILURE:" : "⚠️ ÉCHEC DE SYNC :"}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {touchpointView === 'agent' ? (
                        language === 'en' 
                          ? "Because Salesforce FSC relies on Talend's nightly 24-hour sync cycle, the customer service agent sees an outdated $100.00 balance during the call. The agent processes an incorrect transaction, leading to ledger discrepancies and agent frustration."
                          : "Puisque Salesforce dépend de la synchronisation nocturne de 24h de Talend, l'agent au téléphone voit un solde obsolète de 100,00 $. L'agent traite une mauvaise transaction en direct, causant des erreurs de registre et de la confusion."
                      ) : (
                        language === 'en' 
                          ? "Because Orion (Insurance) relies on Talend's nightly 24-hour sync cycle, the member's insurance quote page still shows $100.00 even though Axis reflects the actual $50.00 balance. This lag allows double-spending and creates transaction leakage."
                          : "Puisque Orion (Assurance) dépend du cycle de synchronisation nocturne de 24 heures de Talend, la page de soumission d'assurance du membre affiche toujours 100,00 $, même si Axis reflète le solde réel de 50,00 $. Ce retard permet la double dépense."
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* FUTURE FUTURE SUCCESSES */}
              {simulationState === 'completed-future' && (
                <div className="p-4 bg-teal-950/40 border border-teal-900/60 rounded-xl w-full animate-fadeIn">
                  <div className="flex gap-2">
                    <span className="text-teal-400 font-bold text-xs shrink-0">
                      {language === 'en' ? "✅ ON-DEMAND SUCCESS:" : "✅ SUCCÈS À LA DEMANDE :"}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {touchpointView === 'agent' ? (
                        language === 'en' 
                          ? "The moment the service agent opens the member's record in Salesforce FSC, MuleSoft initiates an on-demand API query directly to Axis. The agent console updates instantly, reflecting the correct balance of $50.00 near-real-time."
                          : "Dès que l'agent ouvre la fiche du membre dans Salesforce FSC, MuleSoft lance une requête API à la demande vers Axis. La console agent se met à jour instantanément, affichant le vrai solde de 50,00 $ en temps quasi réel."
                      ) : (
                        language === 'en' 
                          ? "While heavy reporting continues over Talend/Snowflake batch schedules, MuleSoft executes an on-demand API query directly to Axis when the Orion checkout page renders. The system safely returns the member's true near-real-time balance of $50.00 instantly."
                          : "Pendant que les rapports analytiques transitent par lots, MuleSoft lance une requête API en direct vers Axis dès le chargement de la page Orion. Le membre voit immédiatement son vrai solde de 50,00 $ en temps quasi réel."
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )
    },

    // SLIDE 3: Coexistence Architecture
    {
      title: language === 'en' ? "Coexistence Architecture: Better Together" : "Architecture de coexistence : Mieux ensemble",
      subtitle: language === 'en'
        ? "MuleSoft does not replace Talend or Snowflake—it extends them to the live customer layer."
        : "MuleSoft ne remplace pas Talend ou Snowflake — il les étend jusqu'à la couche client en direct.",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column: Coexistence Philosophy */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div>
              <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-semibold rounded-full tracking-wider uppercase">
                {language === 'en' ? "Strategic Fit" : "Adéquation stratégique"}
              </span>
              <h3 className="text-xl font-bold text-white mt-4 mb-3">
                {language === 'en' ? "Expanding the Ecosystem" : "Élargir l'écosystème"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {language === 'en' 
                  ? "We are not proposing to rip and replace CAA Québec's existing Talend, Snowflake, or Azure assets."
                  : "Nous ne proposons pas de remplacer et d'éliminer les actifs existants de CAA Québec (Talend, Snowflake ou Azure)."}
              </p>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                {language === 'en'
                  ? "Talend remains a powerful tool for heavy volume, back-office analytical processing and nightly staging. However, extending Talend into the live, interactive customer portal pushes it past its intended operational architecture boundaries."
                  : "Talend reste un outil puissant pour le traitement analytique de grand volume en arrière-guichet et la préparation de données nocturne. Cependant, étendre Talend au portail client interactif en direct repousse ses limites au-delà de sa vocation d'architecture opérationnelle."}
              </p>

              {/* The "Three Pillars" visual block */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="text-xs text-slate-300">
                    <strong>Talend/Snowflake:</strong> {language === 'en' ? "Massive Batch Analytical Syncing" : "Synchronisation analytique par lots volumineux"}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span className="text-xs text-slate-300">
                    <strong>MuleSoft:</strong> {language === 'en' ? "Near-Real-Time Operational API & Orchestration Layer" : "API opérationnelle et couche d'orchestration en temps quasi réel"}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span className="text-xs text-slate-300">
                    <strong>Salesforce FSC / CCaaS:</strong> {language === 'en' ? "Context-Rich UI & Next-Best Action" : "Interface riche en contexte et Prochaine meilleure action"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20 text-center text-xs text-indigo-300 mt-4">
              {language === 'en' 
                ? "🛡️ Preserving Partnerships: This architecture creates a massive delivery opportunity for Levio to construct the modern API layer while retaining complete alignment with Paulo."
                : "🛡️ Préserver les partenariats : Cette architecture offre une excellente opportunité de livraison à Levio pour construire la couche moderne d'API, tout en restant pleinement aligné avec Paulo."}
            </div>
          </div>

          {/* Right Column: Visual Architecture Block diagram */}
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
              {language === 'en' ? "Unified Operational & Analytical Architecture" : "Architecture unifiée opérationnelle et analytique"}
            </h4>

            {/* Architecture Diagram blocks */}
            <div className="space-y-4">
              
              {/* Layer 1: Core Systems */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="block text-[10px] uppercase font-mono text-slate-500 mb-2">
                  {language === 'en' ? "Source Systems of Record" : "Systèmes d'enregistrement sources"}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="py-2.5 px-3 bg-slate-950 rounded border border-slate-800 text-xs font-bold text-purple-300">
                    Axis / AccessFS
                  </div>
                  <div className="py-2.5 px-3 bg-slate-950 rounded border border-indigo-500/30 text-xs font-bold text-indigo-300 shadow-sm shadow-indigo-500/5">
                    {language === 'en' ? "Orion (Insurance)" : "Orion (Assurance)"}
                  </div>
                  <div className="py-2.5 px-3 bg-slate-950 rounded border border-slate-800 text-xs font-bold text-slate-400">
                    {language === 'en' ? "Legacy Core Systems" : "Systèmes centraux hérités"}
                  </div>
                </div>
              </div>

              {/* Layer 2: Integration Split */}
              <div className="grid grid-cols-2 gap-4">
                {/* Analytical Sync (Talend) */}
                <div className="p-4 bg-blue-950/10 border border-blue-900/40 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-blue-400 mb-1">
                      {language === 'en' ? "Analytical Pipeline" : "Pipeline analytique"}
                    </span>
                    <h5 className="text-xs font-bold text-white mb-2">Talend ETL</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'en'
                        ? "Handles nightly replication of massive historical logs, reporting data, and batch analytical dumps."
                        : "Gère la réplication nocturne des journaux d'historique massifs, des données de rapport et des transferts analytiques."}
                    </p>
                  </div>
                  <div className="mt-4 py-1.5 px-2 bg-blue-500/10 rounded text-[10px] font-mono text-center text-blue-300">
                    {language === 'en' ? "Target: Snowflake Warehouse" : "Cible : Entrepôt de données Snowflake"}
                  </div>
                </div>

                {/* Live Orchestration (MuleSoft) */}
                <div className="p-4 bg-teal-950/10 border border-teal-900/40 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-teal-400 mb-1">
                      {language === 'en' ? "Live Operational Pipeline" : "Pipeline opérationnel en direct"}
                    </span>
                    <h5 className="text-xs font-bold text-white mb-2">MuleSoft API Proxy</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'en'
                        ? "Triggers microservices, on-demand customer profile queries, and secure live transaction endpoints."
                        : "Déclenche les microservices, les requêtes de profils clients à la demande et les points de terminaison de transaction en direct."}
                    </p>
                  </div>
                  <div className="mt-4 py-1.5 px-2 bg-teal-500/10 rounded text-[10px] font-mono text-center text-teal-300">
                    {language === 'en' ? "Target: Salesforce FSC & CCaaS" : "Cible : Salesforce FSC & CCaaS"}
                  </div>
                </div>
              </div>

              {/* Layer 3: Presentation UI */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="block text-[10px] uppercase font-mono text-slate-500 mb-1">
                  {language === 'en' ? "Single Source of Engagement (360 Degree View)" : "Source unique d'engagement (Vue à 360 degrés)"}
                </span>
                <div className="py-2 px-3 bg-slate-950 rounded border border-slate-800 text-xs font-bold text-emerald-300">
                  {language === 'en' ? "Salesforce Member Experience Cloud & Agent CCaaS Console" : "Salesforce Member Experience Cloud et console agent CCaaS"}
                </div>
              </div>

            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-xs">
                {language === 'en' 
                  ? "With this approach, CAA Québec leverages their existing Microsoft / Azure, Talend investments through MuleSoft's hybrid connectors, keeping message costs highly optimized."
                  : "Avec cette approche, CAA Québec tire parti de ses investissements Microsoft / Azure, Talend existants grâce aux connecteurs hybrides de MuleSoft, maintenant les coûts de messagerie hautement optimisés."}
              </p>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 4: What is MuleSoft Vibe
    {
      title: language === 'en' ? "What is MuleSoft Vibe?" : "Qu'est-ce que MuleSoft Vibe ?",
      subtitle: language === 'en'
        ? "A Purpose-Built AI Agent for Enterprise Integration"
        : "Un agent IA conçu spécifiquement pour l'intégration d'entreprise",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column: Overview */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full tracking-wider uppercase">
                {language === 'en' ? "Platform Intelligence" : "Intelligence de plateforme"}
              </span>
              <h3 className="text-xl font-bold text-white mt-4 mb-3">
                {language === 'en' ? "Your Copilot for the Full Lifecycle" : "Votre copilote pour le cycle de vie complet"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {language === 'en'
                  ? "MuleSoft Vibe is a generative AI assistant embedded across the MuleSoft platform. It accelerates delivery, surfaces insights, and eliminates repetitive development tasks."
                  : "MuleSoft Vibe est un assistant d'IA générative intégré à toute la plateforme MuleSoft. Il accélère la livraison, révèle des informations clés et élimine les tâches de développement répétitives."}
              </p>

              <div className="space-y-3">
                {[
                  language === 'en' ? "App Generation & Testing (MUnit)" : "Génération d'apps et tests (MUnit)",
                  language === 'en' ? "Instance & Policy Management" : "Gestion d'instances et de politiques",
                  language === 'en' ? "Governance, Usage & Insights" : "Gouvernance, utilisation et analyses",
                  language === 'en' ? "Automated AI Troubleshooting" : "Dépannage automatisé par l'IA"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-xs text-slate-300 font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20 text-center text-xs text-indigo-300 mt-6">
              📊 {language === 'en' 
                ? "Achieve up to 60% higher code quality with Vibe vs. standard AI code generation."
                : "Obtenez une qualité de code jusqu'à 60 % supérieure avec Vibe par rapport à la génération de code IA standard."}
            </div>
          </div>

          {/* Right Column: Roles/Personas */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {language === 'en' ? "Accelerating Every IT Role" : "Accélérer chaque rôle informatique"}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Developers */}
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">{language === 'en' ? "Developers" : "Développeurs"}</h4>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {language === 'en' 
                    ? "Build integrations and custom connectors faster. Automatically generate MUnit test suites and mock data from natural-language prompts."
                    : "Créer des intégrations et des connecteurs plus rapidement. Générer automatiquement des suites de tests MUnit et des données fictives via des invites en langage naturel."}
                </p>
              </div>

              {/* Architects */}
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">{language === 'en' ? "Architects" : "Architectes"}</h4>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {language === 'en' 
                    ? "Design and optimize architectures with an AI Agent that enforces best practices, security policies, and leverages Exchange templates."
                    : "Concevoir et optimiser les architectures avec un agent IA qui applique les meilleures pratiques, les politiques de sécurité et utilise les modèles Exchange."}
                </p>
              </div>

              {/* Admins */}
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">{language === 'en' ? "Admins" : "Administrateurs"}</h4>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {language === 'en' 
                    ? "Manage environments, search assets, and govern applications from a single unified conversational interface."
                    : "Gérer les environnements, rechercher des actifs et administrer les applications depuis une interface conversationnelle unifiée."}
                </p>
              </div>

              {/* Ops */}
              <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">{language === 'en' ? "Ops" : "Opérations (Ops)"}</h4>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {language === 'en' 
                    ? "Oversee and troubleshoot deployments effortlessly. Resolve issues faster using AI-powered diagnostics and Integration Intelligence."
                    : "Superviser et dépanner les déploiements sans effort. Résoudre les problèmes plus rapidement grâce aux diagnostics IA et à l'intelligence d'intégration."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 5: Change Management & MuleSoft Vibe
    {
      title: language === 'en' ? "Empowering Your Team with MuleSoft Vibe" : "Autonomiser votre équipe avec MuleSoft Vibe",
      subtitle: language === 'en'
        ? "Simplifying Change Management and Accelerating Integration Delivery"
        : "Simplifier la gestion du changement et accélérer la livraison des intégrations",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column: Change Management & Partnership */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full tracking-wider uppercase">
                {language === 'en' ? "Change Management" : "Gestion du changement"}
              </span>
              <h3 className="text-xl font-bold text-white mt-4 mb-3">
                {language === 'en' ? "A Smooth Transition" : "Une transition en douceur"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {language === 'en' 
                  ? "Adopting a new integration layer doesn't mean starting from scratch or facing a massive learning curve. We prioritize facilitating the onboarding of the solution for your current teams."
                  : "L'adoption d'une nouvelle couche d'intégration ne signifie pas repartir de zéro ou affronter une courbe d'apprentissage abrupte. Nous priorisons la facilitation de la prise en main de la solution pour vos équipes actuelles."}
              </p>
              
              {/* Joint Support Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white">SF</div>
                    <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-900">LV</div>
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    {language === 'en' ? "Joint Guided Support" : "Accompagnement conjoint"}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'en'
                    ? "Levio (Consulting Firm) and MuleSoft/Salesforce will actively support CAA Québec in this journey, bridging any initial gaps and ensuring best practices are embedded from day one."
                    : "Levio (Firme de consultation) et MuleSoft/Salesforce accompagneront activement CAA Québec tout au long de ce parcours, en comblant les écarts initiaux et en assurant l'intégration des meilleures pratiques dès le premier jour."}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-teal-500/5 rounded-xl border border-teal-500/20 text-center text-xs text-teal-300 mt-4">
              💡 {language === 'en' 
                ? "Reduced friction means your developers can start delivering value almost immediately."
                : "La réduction des frictions signifie que vos développeurs peuvent commencer à livrer de la valeur presque immédiatement."}
            </div>
          </div>

          {/* Right Column: MuleSoft Vibe */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'en' ? "AI-Powered Development (MuleSoft Vibe)" : "Développement propulsé par l'IA (MuleSoft Vibe)"}
            </h4>

            {/* Feature 1 */}
            <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white">
                    {language === 'en' ? "Develop in French or English" : "Développement en français ou en anglais"}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {language === 'en' 
                      ? "If a developer can speak French or English, they can build with Vibe. Using natural language, teams can construct integrations, effectively democratizing integration work."
                      : "Si un développeur parle français ou anglais, il peut créer avec Vibe. À l'aide d'un langage naturel, les équipes peuvent concevoir des intégrations, démocratisant ainsi le travail d'intégration."}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white">
                    {language === 'en' ? "Manage & Secure Deployments" : "Gérer et sécuriser les déploiements"}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {language === 'en' 
                      ? "Vibe doesn't just write logic; it helps manage and secure deployments automatically. It reduces manual configuration steps by orchestrating secure rollouts via simple prompts."
                      : "Vibe ne se contente pas d'écrire la logique ; il aide à gérer et sécuriser automatiquement les déploiements. Il réduit les étapes manuelles de configuration en orchestrant des mises en production sécurisées via de simples commandes."}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white">
                    {language === 'en' ? "Reduced Development & Maintenance Effort" : "Réduction des efforts de développement et de maintenance"}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {language === 'en' 
                      ? "By automating the heavy lifting of API creation and maintenance, Vibe radically accelerates delivery timelines and minimizes the technical debt often associated with complex integrations."
                      : "En automatisant le gros du travail de création et de maintenance des API, Vibe accélère radicalement les délais de livraison et minimise la dette technique souvent associée aux intégrations complexes."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )
    },

    // SLIDE 6: Next Steps & Discovery Questions
    {
      title: language === 'en' ? "Discovery & Joint Exploration Goals" : "Objectifs de découverte et d'exploration conjointe",
      subtitle: language === 'en'
        ? "The goal of the integration portion is to validate critical metrics before finalizing the architecture."
        : "L'objectif de la section d'intégration est de valider les indicateurs de performance critiques avant de finaliser l'architecture.",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column: Positioning & Vision */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-semibold rounded-full tracking-wider uppercase">
                {language === 'en' ? "Meeting Strategy" : "Stratégie de réunion"}
              </span>
              <h3 className="text-xl font-bold text-white mt-4 mb-3">
                {language === 'en' ? "Guiding the Conversation" : "Guider la conversation"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {language === 'en'
                  ? "The objective is not to close on a rigid blueprint in our next conversation. Rather, we want to establish architectural credibility, build momentum with Paulo, and set up a structured Proof-of-Value (POV)."
                  : "L'objectif n'est pas de s'arrêter sur un schéma rigide lors de notre prochaine conversation. Nous souhaitons plutôt établir une crédibilité architecturale, créer une dynamique avec Paulo et mettre en place une preuve de valeur (POV) structurée."}
              </p>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 my-4 space-y-2">
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                  {language === 'en' ? "Key Reassurance For Paulo:" : "Rassurance clé pour Paulo :"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'en'
                    ? "Moving to MuleSoft does not require CAA Québec to completely re-skill their workforce overnight. Leveraging Salesforce's Professional Services combined with a strategic Levio subcontract model allows CAA to safely transition while retaining key internal domain expertise."
                    : "La transition vers MuleSoft n'exige pas que CAA Québec requalifie entièrement sa main-d'œuvre du jour au lendemain. Tirer parti des services professionnels de Salesforce combinés à un modèle de sous-traitance stratégique avec Levio permet à CAA de faire la transition en toute sécurité tout en conservant son expertise interne clé."}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="text-xs font-semibold text-slate-300">
                  {language === 'en' ? "Suggested Thursday Meeting Structure" : "Structure suggérée de la réunion de jeudi"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'en'
                  ? "30 Mins: Contact Center / CCaaS POV • 30 Mins: Integration & Orchestration Discussion"
                  : "30 min : POV Centre de contact / CCaaS • 30 min : Discussion d'intégration et d'orchestration"}
              </p>
            </div>
          </div>

          {/* Right Column: Discovery Agenda List */}
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {language === 'en' ? "Architectural Discovery Checklist" : "Liste de contrôle de découverte architecturale"}
              </h4>
              <p className="text-xs text-slate-400 mb-6">
                {language === 'en'
                  ? "Interactive Checkboxes: Click each item to track what needs to be answered to design a highly tailored scoping proposal."
                  : "Cases à cocher interactives : Cliquez sur chaque élément pour suivre ce qui doit être résolu afin de concevoir une proposition d'envergure sur mesure."}
              </p>

              {/* Interactive checklist mapping */}
              <div className="space-y-4">
                {discoveryQuestions.map(q => (
                  <div 
                    key={q.id}
                    onClick={() => toggleQuestion(q.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${q.answered ? 'bg-teal-500/5 border-teal-500/40 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                  >
                    <div className="mt-0.5">
                      {q.answered ? (
                        <div className="w-5 h-5 bg-teal-500 text-slate-950 rounded-md flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-600 hover:border-slate-400 rounded-md"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-mono">QUESTION 0{q.id}</span>
                      <p className="text-xs mt-1 font-medium">
                        {language === 'en' ? q.textEN : q.textFR}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Set up slide keyboard shortcut controls for a robust Present Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPresentMode) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'Escape') {
          setIsPresentMode(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPresentMode, currentSlide, language]);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all duration-300 ${isPresentMode ? 'fixed inset-0 z-50 overflow-y-auto p-4 md:p-8 bg-slate-950' : ''}`}>
      
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-white flex items-center gap-2">
              CAA Québec POV
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-normal">
                {language === 'en' ? "MuleSoft Strategy" : "Stratégie MuleSoft"}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {language === 'en' ? "Architectural Positioning & Problem Alignment" : "Positionnement architectural et alignement des enjeux"}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Bilingual Language Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${language === 'fr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              FR
            </button>
          </div>

          {/* Slide Selector Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-all ${currentSlide === index ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {language === 'en' ? `Slide ${index + 1}` : `Diapo ${index + 1}`}
              </button>
            ))}
          </div>

          {/* Toggle Full Screen / Present Mode inside App */}
          <button
            onClick={() => setIsPresentMode(!isPresentMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold tracking-wide transition-all ${isPresentMode ? 'bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30' : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'}`}
            title={language === 'en' ? "Press ESC to exit presentation mode" : "Appuyez sur ÉCHAP pour quitter le mode présentation"}
          >
            {isPresentMode ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {language === 'en' ? "Exit Present Mode (ESC)" : "Quitter le mode présent (ÉCHAP)"}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                {language === 'en' ? "Present Full Screen" : "Présenter plein écran"}
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Slide Content Area */}
      <main className="flex-1 flex flex-col justify-between p-6 md:p-12 max-w-7xl w-full mx-auto animate-fadeIn">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        <div className="flex-1 min-h-[400px]">
          {slides[currentSlide].content}
        </div>

        {/* Bottom Slide Controller Actions */}
        <div className="mt-8 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${currentSlide === 0 ? 'border-slate-800/50 text-slate-600 cursor-not-allowed' : 'border-slate-700 text-slate-200 bg-slate-900 hover:bg-slate-800'}`}
            >
              {language === 'en' ? "Back" : "Retour"}
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${currentSlide === slides.length - 1 ? 'border-slate-800/50 text-slate-600 cursor-not-allowed' : 'border-slate-700 bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {language === 'en' ? "Next Slide" : "Diapositive suivante"}
            </button>
          </div>
        </div>
      </main>

      {/* Slide Navigation Dots Footer */}
      <footer className="bg-slate-900/30 border-t border-slate-800/60 py-4 text-center rounded-xl">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === index ? 'bg-indigo-500 w-6' : 'bg-slate-700 hover:bg-slate-600'}`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}