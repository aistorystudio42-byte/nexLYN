'use client';

import React from 'react';
import { ModuleFeature } from '@/utils/moduleParser';
import ModuleErrorBoundary from './ModuleErrorBoundary';

interface ModuleFactoryProps {
  modules: ModuleFeature[];
}

const VintageCard = ({ module, children }: { module: ModuleFeature, children: React.ReactNode }) => {
  return (
    <div className="vintage-module-card h-full flex flex-col">
      <div className="card-header mb-4 border-b border-[rgba(189,160,97,0.2)] pb-3">
        <h3 className="font-playfair text-2xl font-bold text-[var(--text)] tracking-tight">
          {module.name}
        </h3>
        <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--accent)] opacity-80 mt-1 block">
          {module.type.replace('_', ' ')}
        </span>
      </div>
      
      <div className="card-content flex-grow relative">
        {children}
      </div>

      <div className="card-footer mt-6 pt-4 border-t border-[rgba(189,160,97,0.1)]">
        <h4 className="text-[var(--primary)] text-sm font-bold uppercase tracking-widest mb-3 opacity-90">
          Özellikler
        </h4>
        <ul className="space-y-2">
          {module.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-[var(--text)] opacity-80 font-light group hover:opacity-100 transition-opacity">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 mr-3 shadow-[0_0_5px_var(--primary)] group-hover:scale-125 transition-transform" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .vintage-module-card {
          background-color: #0d0a0a;
          border: 1px solid rgba(189, 160, 97, 0.15);
          padding: 2rem;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        
        .vintage-module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.3;
        }

        .vintage-module-card:hover {
          transform: translateY(-5px);
          border-color: rgba(189, 160, 97, 0.4);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
};

// UI Components for different module types
const GalleryGrid = () => (
  <div className="grid grid-cols-2 gap-2 opacity-60 hover:opacity-100 transition-opacity">
    <div className="bg-[var(--surface)] aspect-square border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]/40">IMG 1</div>
    <div className="bg-[var(--surface)] aspect-square border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]/40">IMG 2</div>
    <div className="col-span-2 bg-[var(--surface)] h-12 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]/40 text-xs">VİTRİN GÖRÜNÜMÜ</div>
  </div>
);

const ActionForm = () => (
  <div className="space-y-3 opacity-70">
    <div className="h-8 border-b border-[var(--primary)]/30 w-full" />
    <div className="h-8 border-b border-[var(--primary)]/30 w-full" />
    <button className="w-full py-2 bg-[var(--primary)]/20 text-[var(--primary)] text-xs uppercase tracking-widest border border-[var(--primary)]/40 mt-2">
      Gönder
    </button>
  </div>
);

const LiveChat = () => (
  <div className="flex flex-col h-32 border border-[var(--accent)]/10 p-2 bg-black/20">
    <div className="flex-grow space-y-2 overflow-hidden">
      <div className="w-3/4 h-2 bg-[var(--accent)]/20 rounded-r-full" />
      <div className="w-1/2 h-2 bg-[var(--primary)]/20 rounded-l-full self-end ml-auto" />
    </div>
    <div className="h-6 mt-2 border border-[var(--accent)]/20 rounded-full w-full" />
  </div>
);

const DefaultModule = ({ type }: { type: string }) => (
  <div className="flex items-center justify-center h-24 border border-dashed border-[var(--text)]/10">
    <span className="text-xs uppercase tracking-widest text-[var(--text)]/30">{type} INTERFACE</span>
  </div>
);

export default function ModuleFactory({ modules }: ModuleFactoryProps) {
  const renderModuleInterface = (type: string) => {
    switch (type) {
      case 'gallery_grid':
      case 'masonry_grid':
        return <GalleryGrid />;
      case 'action_form':
      case 'contact_form':
      case 'booking_system':
        return <ActionForm />;
      case 'live_chat':
      case 'forum_thread':
        return <LiveChat />;
      case 'list_view':
      case 'news_feed':
      case 'accordion_list':
        return (
            <div className="space-y-2">
                <div className="h-4 bg-[var(--accent)]/10 w-full rounded" />
                <div className="h-4 bg-[var(--accent)]/5 w-5/6 rounded" />
                <div className="h-4 bg-[var(--accent)]/10 w-full rounded" />
            </div>
        );
      default:
        return <DefaultModule type={type} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
      {modules.map((module) => (
        <ModuleErrorBoundary key={module.id} moduleName={module.name}>
          <VintageCard module={module}>
            {renderModuleInterface(module.type)}
          </VintageCard>
        </ModuleErrorBoundary>
      ))}
    </div>
  );
}
