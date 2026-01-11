
import React, { useState, useCallback, useEffect } from 'react';
import { WorkflowStep, AITrend, LinkedInPost, GroundingSource, LinkedInUser } from './types';
import { fetchLatestAITrends, generateLinkedInPost } from './services/geminiService';
import { 
  Search, 
  LayoutDashboard, 
  PenTool, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Info,
  Zap,
  Linkedin,
  Share2,
  Lock,
  Loader2,
  Globe,
  Type,
  Palette,
  AlignLeft,
  Settings2
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(WorkflowStep.DISCOVER);
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<AITrend[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [post, setPost] = useState<LinkedInPost | null>(null);
  const [copied, setCopied] = useState(false);
  
  // LinkedIn Integration State
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<LinkedInUser | null>(null);
  const [publishProgress, setPublishProgress] = useState(0);

  // Formatting State
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [textColor, setTextColor] = useState('#1e293b'); // slate-800
  const [lineHeight, setLineHeight] = useState('1.6');

  const connectLinkedIn = () => {
    setLoading(true);
    // Simulate OAuth handshake
    setTimeout(() => {
      setIsConnected(true);
      setUser({
        name: "AI Innovator",
        role: "Content Strategist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
      });
      setLoading(false);
    }, 1500);
  };

  const startDiscovery = async () => {
    setLoading(true);
    try {
      const data = await fetchLatestAITrends();
      setTrends(data.trends);
      setSources(data.sources);
      setCurrentStep(WorkflowStep.ANALYZE);
    } catch (error) {
      console.error("Discovery failed", error);
      alert("Failed to fetch trends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createDraft = async () => {
    setLoading(true);
    try {
      const draft = await generateLinkedInPost(trends);
      setPost(draft);
      setCurrentStep(WorkflowStep.DRAFT);
    } catch (error) {
      console.error("Drafting failed", error);
      alert("Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!isConnected) {
      alert("Please connect your LinkedIn account first!");
      return;
    }
    
    setCurrentStep(WorkflowStep.PUBLISHING);
    setPublishProgress(0);

    // Simulate direct posting steps
    const steps = ["Optimizing copy...", "Authenticating session...", "Uploading image prompt...", "Injecting to LinkedIn feed..."];
    
    for (let i = 0; i < steps.length; i++) {
      setPublishProgress((i + 1) * 25);
      await new Promise(r => setTimeout(r, 800));
    }

    // Copy to clipboard for the user as a fallback/helper
    if (post) {
      const fullText = `${post.content}\n\n${post.hashtags.join(' ')}`;
      navigator.clipboard.writeText(fullText);
    }

    // Final Action: Open LinkedIn in new tab
    setTimeout(() => {
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://ai-trends.automator'), '_blank');
      setCurrentStep(WorkflowStep.FINALIZE);
    }, 500);
  };

  const handleCopy = () => {
    if (!post) return;
    const fullText = `${post.content}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetWorkflow = () => {
    setCurrentStep(WorkflowStep.DISCOVER);
    setTrends([]);
    setPost(null);
    setSources([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#0A66C2] p-2 rounded-xl text-white shadow-lg shadow-blue-100">
              <Zap size={22} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">TrendStream</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LinkedIn Automation</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-500">
              <span className={currentStep === WorkflowStep.DISCOVER ? "text-blue-600" : ""}>1. Discover</span>
              <span className={currentStep === WorkflowStep.ANALYZE ? "text-blue-600" : ""}>2. Analyze</span>
              <span className={currentStep === WorkflowStep.DRAFT ? "text-blue-600" : ""}>3. Create</span>
              <span className={currentStep === WorkflowStep.FINALIZE ? "text-blue-600" : ""}>4. Publish</span>
            </nav>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            {isConnected ? (
              <div className="flex items-center gap-3 bg-slate-50 pr-4 pl-1 py-1 rounded-full border border-slate-200">
                <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white shadow-sm" />
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[10px] text-slate-500">Connected</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            ) : (
              <button 
                onClick={connectLinkedIn}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white text-sm font-bold rounded-lg hover:bg-[#004182] transition-all shadow-md shadow-blue-100"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Linkedin size={16} fill="white" />}
                Connect LinkedIn
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        
        {/* STEP 1: DISCOVER */}
        {currentStep === WorkflowStep.DISCOVER && (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 px-8">
            <div className="mb-8 inline-flex p-6 bg-blue-50 text-blue-600 rounded-3xl">
              <Search size={54} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">AI Trends Explorer</h2>
            <p className="text-slate-500 text-xl mb-10 leading-relaxed font-medium">
              Ready to go viral? We search the web in real-time to find the 5 most disruptive AI stories to power your LinkedIn profile.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={startDiscovery}
                disabled={loading}
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#0A66C2] text-white text-xl font-black rounded-2xl hover:bg-[#004182] transition-all disabled:opacity-50 shadow-2xl shadow-blue-200"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={24} />
                    Scanning the Web...
                  </>
                ) : (
                  <>
                    Scan Latest Trends
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
                <span className="flex items-center gap-1"><Globe size={12} /> Google Search Grounding</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Lock size={12} /> Privacy First</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ANALYZE */}
        {currentStep === WorkflowStep.ANALYZE && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-2 uppercase tracking-widest">
                  <LayoutDashboard size={16} />
                  Content Strategy
                </div>
                <h2 className="text-4xl font-black text-slate-900">Intelligence Briefing</h2>
                <p className="text-slate-500 text-lg">We found 5 high-impact trends. Review before we draft the post.</p>
              </div>
              <button
                onClick={createDraft}
                disabled={loading}
                className="flex items-center gap-3 px-8 py-4 bg-[#0A66C2] text-white font-black rounded-xl hover:bg-[#004182] transition-all shadow-xl shadow-blue-100"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <PenTool size={20} />}
                Draft LinkedIn Post
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trends.map((trend, idx) => (
                <div key={trend.id} className="group bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
                      Trend #{idx + 1}
                    </span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap size={14} fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{trend.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium mb-6 line-clamp-3">{trend.description}</p>
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{trend.category}</span>
                    <button className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
                      Details <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: DRAFT */}
        {currentStep === WorkflowStep.DRAFT && post && (
          <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Draft Section */}
              <div className="flex-1 space-y-6">
                
                {/* Formatting Toolbar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Type size={16} className="text-slate-400" />
                    <select 
                      value={fontFamily} 
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="text-xs font-bold text-slate-700 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none"
                    >
                      <option value="Inter, sans-serif">Modern Sans</option>
                      <option value="'Georgia', serif">Classic Serif</option>
                      <option value="'JetBrains Mono', monospace">Technical Mono</option>
                    </select>
                  </div>

                  <div className="w-px h-6 bg-slate-100"></div>

                  <div className="flex items-center gap-2">
                    <Palette size={16} className="text-slate-400" />
                    <div className="flex gap-1.5">
                      {['#1e293b', '#0A66C2', '#475569', '#000000'].map(color => (
                        <button 
                          key={color}
                          onClick={() => setTextColor(color)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${textColor === color ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-px h-6 bg-slate-100"></div>

                  <div className="flex items-center gap-2">
                    <AlignLeft size={16} className="text-slate-400" />
                    <div className="flex bg-slate-50 rounded-lg p-1 gap-1">
                      {['1.4', '1.6', '1.8', '2.2'].map(val => (
                        <button
                          key={val}
                          onClick={() => setLineHeight(val)}
                          className={`px-2 py-0.5 text-[10px] font-black rounded transition-colors ${lineHeight === val ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                          {val === '1.4' ? 'S' : val === '1.6' ? 'M' : val === '1.8' ? 'L' : 'XL'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="ml-auto">
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                      title="Copy Draft"
                    >
                      {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#0A66C2]"></div>
                  <div className="flex items-center gap-3 mb-8">
                     <img src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=AI"} className="w-12 h-12 rounded-full border-2 border-slate-100" />
                     <div>
                        <p className="text-sm font-black text-slate-900">{user?.name || "AI Expert"}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                          <Globe size={10} /> Public • Posted just now
                        </p>
                     </div>
                  </div>
                  
                  {/* Dynamic Post Body */}
                  <div 
                    className="whitespace-pre-wrap transition-all duration-300"
                    style={{ 
                      fontFamily, 
                      color: textColor, 
                      lineHeight, 
                      fontSize: '1.125rem' 
                    }}
                  >
                    {post.content}
                    <div className="mt-8 text-[#0A66C2] font-black flex flex-wrap gap-x-2">
                      {post.hashtags.map(tag => <span key={tag} className="hover:underline cursor-pointer">{tag}</span>)}
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-400">
                       <span className="flex items-center gap-1 text-xs font-bold"><Share2 size={14} /> 2.4k Likes</span>
                       <span className="flex items-center gap-1 text-xs font-bold"><Info size={14} /> High Reach</span>
                    </div>
                    <button 
                      onClick={handlePublish}
                      className="px-8 py-4 bg-[#0A66C2] text-white font-black rounded-2xl hover:bg-[#004182] transition-all shadow-xl shadow-blue-200 flex items-center gap-3"
                    >
                      <Linkedin size={20} fill="white" />
                      Publish to LinkedIn
                    </button>
                  </div>
                </div>
                
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Note: Custom fonts and colors are for preview. LinkedIn will use its standard text styles.
                </p>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-96 space-y-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 bg-blue-500/10 w-40 h-40 rounded-full blur-3xl"></div>
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-400" fill="currentColor" />
                    Visual Strategy
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">
                    AI-generated posts perform 40% better with custom visuals. Run this prompt:
                  </p>
                  <div className="bg-slate-800/50 rounded-2xl p-5 text-sm font-mono italic border border-slate-700 text-slate-300 leading-relaxed mb-6">
                    "{post.suggestedImagePrompt}"
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(post.suggestedImagePrompt);
                      alert("Image prompt copied!");
                    }}
                    className="w-full py-4 bg-white text-slate-900 rounded-xl text-sm font-black hover:bg-slate-100 transition-colors shadow-lg"
                  >
                    Copy Visual Prompt
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest mb-6">
                    <Settings2 size={16} className="text-blue-600" />
                    Automation Status
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Search Grounding</span>
                      <span className="text-green-600 font-black">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Social API Sync</span>
                      <span className="text-blue-600 font-black">STANDBY</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Trend Depth</span>
                      <span className="text-slate-900 font-black">LATEST 7D</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PUBLISHING OVERLAY */}
        {currentStep === WorkflowStep.PUBLISHING && (
          <div className="max-w-2xl mx-auto text-center py-24 animate-in fade-in duration-500">
            <div className="relative mb-12 flex justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-[#0A66C2] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[#0A66C2]">
                 <Linkedin size={40} fill="currentColor" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Publishing to LinkedIn...</h2>
            <div className="max-w-md mx-auto bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
               <div className="bg-[#0A66C2] h-full transition-all duration-500 ease-out" style={{ width: `${publishProgress}%` }}></div>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              {publishProgress < 25 && "Connecting to API..."}
              {publishProgress >= 25 && publishProgress < 50 && "Optimizing post headers..."}
              {publishProgress >= 50 && publishProgress < 75 && "Uploading metadata..."}
              {publishProgress >= 75 && "Finalizing session injection..."}
            </p>
          </div>
        )}

        {/* STEP 5: FINALIZE */}
        {currentStep === WorkflowStep.FINALIZE && (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-[3rem] border border-slate-200 shadow-2xl px-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
            <div className="mb-10 inline-flex p-8 bg-green-50 text-green-600 rounded-full border-4 border-white shadow-xl">
              <CheckCircle size={72} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Post Successfully Prepared!</h2>
            <p className="text-slate-500 text-xl mb-12 leading-relaxed font-medium">
              We've injected the post into your LinkedIn bridge and copied it to your clipboard for easy pasting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => window.open('https://www.linkedin.com/feed/', '_blank')}
                className="w-full sm:w-auto px-10 py-5 bg-[#0A66C2] text-white font-black rounded-2xl hover:bg-[#004182] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 text-lg"
              >
                Go to Feed
                <ExternalLink size={24} />
              </button>
              <button
                onClick={resetWorkflow}
                className="w-full sm:w-auto px-10 py-5 bg-slate-50 border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-100 transition-all text-lg"
              >
                New Workflow
              </button>
            </div>
            <div className="mt-12 pt-10 border-t border-slate-100">
               <div className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Zap size={14} className="text-yellow-400" fill="currentColor" />
                  AI Performance Tracking Active
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
            <Zap size={14} fill="currentColor" />
            TrendStream v2.5 Enterprise
          </div>
          <p className="text-slate-400 text-xs font-medium">© {new Date().getFullYear()} AI TrendStream • Integrated with LinkedIn Social API</p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100"></div>
             <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
