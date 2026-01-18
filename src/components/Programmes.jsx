// src/components/Programmes.jsx
import React, { useState, useEffect } from "react";
import { Monitor, Calculator, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// CMS API URL - change this when deploying
const CMS_API = import.meta.env.VITE_CMS_API || "http://localhost:3001/api";

const ProgrammeCard = ({ programme, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
            {programme.code}
          </span>
          <span className="text-sm text-gray-700 leading-tight truncate">{programme.name}</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-gray-400 shrink-0 ml-2" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 shrink-0 ml-2" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <a
              href={programme.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Read More
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Programmes() {
  const [expandedComputing, setExpandedComputing] = useState(null);
  const [expandedMathematics, setExpandedMathematics] = useState(null);
  const [computingProgrammes, setComputingProgrammes] = useState([]);
  const [mathematicsProgrammes, setMathematicsProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    try {
      const res = await fetch(`${CMS_API}/programmes`);
      if (res.ok) {
        const data = await res.json();
        
        // Separate by category
        const computing = data
          .filter(p => p.category === 'Computing')
          .map(p => ({ code: p.code, name: p.name, url: p.url || '#' }));
        
        const mathematics = data
          .filter(p => p.category === 'Mathematics')
          .map(p => ({ code: p.code, name: p.name, url: p.url || '#' }));
        
        setComputingProgrammes(computing);
        setMathematicsProgrammes(mathematics);
      }
    } catch (err) {
      console.error("Failed to fetch programmes from CMS:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComputing = (code) => {
    setExpandedComputing(expandedComputing === code ? null : code);
  };

  const toggleMathematics = (code) => {
    setExpandedMathematics(expandedMathematics === code ? null : code);
  };

  return (
    <section id="programmes" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Programmes Offered
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our postgraduate programmes in Computing and Mathematical Sciences, 
            designed to advance your academic and professional journey.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          /* Two Column Layout */
          <div className="grid md:grid-cols-2 gap-6">
          {/* Computing Box */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Computing</h3>
                  <p className="text-blue-100 text-sm">{computingProgrammes.length} Programmes</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {computingProgrammes.map((prog) => (
                <ProgrammeCard
                  key={prog.code}
                  programme={prog}
                  isExpanded={expandedComputing === prog.code}
                  onToggle={() => toggleComputing(prog.code)}
                />
              ))}
            </div>
          </div>

          {/* Mathematics Box */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mathematics</h3>
                  <p className="text-purple-100 text-sm">{mathematicsProgrammes.length} Programmes</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {mathematicsProgrammes.map((prog) => (
                <ProgrammeCard
                  key={prog.code}
                  programme={prog}
                  isExpanded={expandedMathematics === prog.code}
                  onToggle={() => toggleMathematics(prog.code)}
                />
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
