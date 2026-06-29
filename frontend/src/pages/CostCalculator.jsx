import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, HelpCircle, Shield, Award, Cpu, FileText } from 'lucide-react';


const CostCalculator = () => {
  const [activeTab, setActiveTab] = useState('patent');
  
  // Entity type (corporate vs individual/startups get standard government discounts)
  const [entityType, setEntityType] = useState('start-up'); // start-up/individual gets 80% government fee deduction

  // Patent States
  const [patentType, setPatentType] = useState('complete'); // provisional / complete
  const [patentSearch, setPatentSearch] = useState(true);
  const [patentDrafting, setPatentDrafting] = useState(true);
  const [internationalPCT, setInternationalPCT] = useState(false);

  // Trademark States
  const [trademarkClasses, setTrademarkClasses] = useState(1);
  const [trademarkSearch, setTrademarkSearch] = useState(true);
  const [trademarkExpedited, setTrademarkExpedited] = useState(false);

  // Copyright States
  const [copyrightType, setCopyrightType] = useState('software'); // software, literary, artistic
  const [copyrightContracts, setCopyrightContracts] = useState(false);

  // Design States
  const [designDrawings, setDesignDrawings] = useState(true);

  // Cost calculation functions
  const calculatePatentCost = () => {
    let governmentFee = patentType === 'provisional' ? 1600 : 4000;
    if (entityType === 'corporate') governmentFee *= 5; // corporate pays 5x govt fee (standard rule)

    let legalFee = 0;
    if (patentSearch) legalFee += 8000;
    if (patentDrafting) {
      legalFee += patentType === 'provisional' ? 15000 : 35000;
    }
    if (internationalPCT) legalFee += 45000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const calculateTrademarkCost = () => {
    let baseGovtFee = 4500; // Individual/Startup per class
    if (entityType === 'corporate') baseGovtFee = 9000; // Corporate per class

    const governmentFee = baseGovtFee * trademarkClasses;
    
    let legalFee = 0;
    if (trademarkSearch) legalFee += 2500;
    legalFee += (5000 * trademarkClasses); // filing charges
    if (trademarkExpedited) legalFee += 3000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const calculateCopyrightCost = () => {
    let governmentFee = 500; // default artistic / literary
    if (copyrightType === 'software') governmentFee = 500;
    // Goverment fees are standard. Corporate pays the same.
    
    let legalFee = copyrightType === 'software' ? 12000 : 8000;
    if (copyrightContracts) legalFee += 5000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const calculateDesignCost = () => {
    let governmentFee = entityType === 'corporate' ? 4000 : 1000;
    
    let legalFee = 10000; // filing
    if (designDrawings) legalFee += 5000;

    return { govt: governmentFee, legal: legalFee, total: governmentFee + legalFee };
  };

  const getActiveCosts = () => {
    switch (activeTab) {
      case 'patent': return calculatePatentCost();
      case 'trademark': return calculateTrademarkCost();
      case 'copyright': return calculateCopyrightCost();
      case 'design': return calculateDesignCost();
      default: return { govt: 0, legal: 0, total: 0 };
    }
  };

  const formatCurrency = (val) => {
    if (isNaN(val)) val = 0;
    return "₹" + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val);
  };

  const costs = getActiveCosts();  return (
    <div className="page-enter py-16 bg-[#F8F5F0] dark:bg-[#121110] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#8B6B57] uppercase tracking-[0.25em] text-xs font-semibold block">Cost Estimator</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">IPR Registry Calculator</h1>
          <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Estimate governmental filing fees and legal professional drafting services charges interactively.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-b border-[#DDD5C8]/40 dark:border-slate-850">
          <button
            onClick={() => setActiveTab('patent')}
            className={`pb-4 px-6 font-serif font-medium text-lg flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'patent' ? 'border-[#8B6B57] text-[#8B6B57]' : 'border-transparent text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'
            }`}
          >
            <Shield size={18} strokeWidth={1.5} /> Patents
          </button>
          <button
            onClick={() => setActiveTab('trademark')}
            className={`pb-4 px-6 font-serif font-medium text-lg flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'trademark' ? 'border-[#8B6B57] text-[#8B6B57]' : 'border-transparent text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'
            }`}
          >
            <Award size={18} strokeWidth={1.5} /> Trademarks
          </button>
          <button
            onClick={() => setActiveTab('copyright')}
            className={`pb-4 px-6 font-serif font-medium text-lg flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'copyright' ? 'border-[#8B6B57] text-[#8B6B57]' : 'border-transparent text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'
            }`}
          >
            <FileText size={18} strokeWidth={1.5} /> Copyrights
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`pb-4 px-6 font-serif font-medium text-lg flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'design' ? 'border-[#8B6B57] text-[#8B6B57]' : 'border-transparent text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'
            }`}
          >
            <Cpu size={18} strokeWidth={1.5} /> Designs
          </button>
        </div>

        {/* Grid panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls col */}
          <div className="lg:col-span-7 card-premium space-y-6">
            
            {/* Entity Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wider block">
                Applicant Entity Type (Official Subsidies Apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEntityType('start-up')}
                  className={`py-3 px-4 rounded text-xs font-semibold uppercase tracking-widest border transition-all cursor-pointer ${
                    entityType === 'start-up'
                      ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent shadow-xs'
                      : 'bg-[#F8F5F0] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-[#6D6258] dark:text-[#C9C1B5] hover:border-[#8B6B57]'
                  }`}
                >
                  Startup / MSME / Individual
                </button>
                <button
                  type="button"
                  onClick={() => setEntityType('corporate')}
                  className={`py-3 px-4 rounded text-xs font-semibold uppercase tracking-widest border transition-all cursor-pointer ${
                    entityType === 'corporate'
                      ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent shadow-xs'
                      : 'bg-[#F8F5F0] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-[#6D6258] dark:text-[#C9C1B5] hover:border-[#8B6B57]'
                  }`}
                >
                  Large Corporate
                </button>
              </div>
            </div>

            {/* Content per Tab */}
            {activeTab === 'patent' && (
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wider block">Patent Specification Draft</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPatentType('provisional')}
                      className={`py-3 rounded text-xs font-semibold uppercase tracking-widest border transition-all cursor-pointer ${patentType === 'provisional' ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent' : 'bg-[#F8F5F0] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-[#6D6258] dark:text-[#C9C1B5] hover:border-[#8B6B57]'}`}
                    >
                      Provisional Specification
                    </button>
                    <button
                      onClick={() => setPatentType('complete')}
                      className={`py-3 rounded text-xs font-semibold uppercase tracking-widest border transition-all cursor-pointer ${patentType === 'complete' ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent' : 'bg-[#F8F5F0] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-[#6D6258] dark:text-[#C9C1B5] hover:border-[#8B6B57]'}`}
                    >
                      Complete Specification
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 text-sm text-[#6D6258] dark:text-[#C9C1B5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patentSearch}
                      onChange={(e) => setPatentSearch(e.target.checked)}
                      className="rounded border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal">Prior art clearance search & landscaping</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#6D6258] dark:text-[#C9C1B5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patentDrafting}
                      onChange={(e) => setPatentDrafting(e.target.checked)}
                      className="rounded border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal">Professional attorney drafting & claims compilation</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#6D6258] dark:text-[#C9C1B5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={internationalPCT}
                      onChange={(e) => setInternationalPCT(e.target.checked)}
                      className="rounded border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal">File WIPO / PCT International entry dossier</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'trademark' && (
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wider">
                    <span>Number of brand classes: {trademarkClasses}</span>
                    <span>Max: 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={trademarkClasses}
                    onChange={(e) => setTrademarkClasses(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#DDD5C8] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#8B6B57]"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 text-sm text-[#6D6258] dark:text-[#C9C1B5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trademarkSearch}
                      onChange={(e) => setTrademarkSearch(e.target.checked)}
                      className="rounded border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal">Trademark compatibility clearance checks</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-[#6D6258] dark:text-[#C9C1B5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trademarkExpedited}
                      onChange={(e) => setTrademarkExpedited(e.target.checked)}
                      className="rounded border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal">Expedited examination monitoring filing request</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'copyright' && (
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wider block">Work Classification</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setCopyrightType('software')}
                      className={`py-3 rounded text-xs font-semibold uppercase tracking-widest border transition-all cursor-pointer ${copyrightType === 'software' ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent' : 'bg-[#F8F5F0] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-[#6D6258] dark:text-[#C9C1B5] hover:border-[#8B6B57]'}`}
                    >
                      Software Code
                    </button>
                    <button
                      onClick={() => setCopyrightType('artistic')}
                      className={`py-3 rounded text-xs font-semibold uppercase tracking-widest border transition-all cursor-pointer ${copyrightType === 'artistic' ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent' : 'bg-[#F8F5F0] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-[#6D6258] dark:text-[#C9C1B5] hover:border-[#8B6B57]'}`}
                    >
                      Artistic Logo
                    </button>
                    <button
                      onClick={() => setCopyrightType('literary')}
                      className={`py-3 rounded text-xs font-semibold uppercase tracking-widest border transition-all cursor-pointer ${copyrightType === 'literary' ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent' : 'bg-[#F8F5F0] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-[#6D6258] dark:text-[#C9C1B5] hover:border-[#8B6B57]'}`}
                    >
                      Literary Work
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 text-sm text-[#6D6258] dark:text-[#C9C1B5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copyrightContracts}
                      onChange={(e) => setCopyrightContracts(e.target.checked)}
                      className="rounded border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal">Draft licensing / assignment agreements documentation</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-[#6D6258] dark:text-[#C9C1B5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={designDrawings}
                      onChange={(e) => setDesignDrawings(e.target.checked)}
                      className="rounded border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-normal">3D wireframe / visual layout illustration generation</span>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Results box col */}
          <div className="lg:col-span-5 bg-[#171717] dark:bg-[#151413] text-[#F8F5F0] rounded-[20px] p-8 space-y-6 shadow-xl border border-[#8B6B57]/30 h-fit">
            <h3 className="text-2xl font-serif font-medium text-center border-b border-[#DDD5C8]/10 pb-4 text-[#F8F5F0]">Estimate Breakdown</h3>
            
            <div className="space-y-4 text-sm font-light">
              <div className="flex justify-between items-center text-[#C9C1B5]">
                <span>Government Registry Fee</span>
                <span className="font-medium text-white">{formatCurrency(costs.govt)}</span>
              </div>
              <div className="flex justify-between items-center text-[#C9C1B5]">
                <span>Professional drafting & search</span>
                <span className="font-medium text-white">{formatCurrency(costs.legal)}</span>
              </div>
              <div className="border-t border-[#DDD5C8]/10 pt-4 flex justify-between items-center text-lg font-serif">
                <span className="text-[#8B6B57] font-medium">Estimated Total</span>
                <span className="font-medium text-[#8B6B57] text-2xl">{formatCurrency(costs.total)}</span>
              </div>
            </div>

            <div className="bg-[#8B6B57]/5 p-5 border border-[#8B6B57]/10 rounded-[12px] text-center text-xs text-[#C9C1B5] space-y-2 font-light leading-relaxed">
              <p>Government official fees fluctuate according to applicant entity classification. Startup entities receive 80% subsidies.</p>
              <p className="font-semibold text-[#8B6B57] uppercase tracking-wider text-[10px]">NDA Confidentiality protected</p>
            </div>

            <div className="pt-2">
              <Link
                to={`/book-consultation?service=${encodeURIComponent(activeTab === 'patent' ? 'Patent Prosecution' : activeTab === 'trademark' ? 'Trademark Portfolio Management' : activeTab === 'copyright' ? 'Copyright Registration' : 'Industrial Design Registration')}`}
                className="btn-gold w-full py-4 uppercase font-sans text-xs tracking-widest font-semibold cursor-pointer text-center block"
              >
                Submit Estimate & Book Briefing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
