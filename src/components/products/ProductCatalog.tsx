import React, { useState } from 'react';
import { Product, VisualAidSlide } from '../../types';
import { Badge } from '../common/Badge';
import { Pill, Eye, X } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const [selectedVisualAidProduct, setSelectedVisualAidProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Pharmaceutical Products & E-Detailing Visual Aids
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard drug compositions, pricing tiers (MRP / PTR / PTS), packaging standards, and digital detailing slides.
          </p>
        </div>
        <Badge variant="primary" size="md">{products.length} Active SKUs</Badge>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{prod.brandName || prod.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{prod.genericName || prod.genericComposition}</p>
                </div>
                <Badge variant="neutral">{prod.dosageForm}</Badge>
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700 block">Indication:</span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{prod.indication || 'Primary clinical therapy'}</p>
              </div>

              {/* Pricing breakdown */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center p-2 rounded-lg bg-teal-50/50 border border-teal-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">MRP</span>
                  <span className="font-bold text-slate-900">₹{(prod.mrp ?? 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">PTR</span>
                  <span className="font-bold text-teal-700">₹{(prod.ptr ?? 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">PTS</span>
                  <span className="font-bold text-blue-700">₹{(prod.pts ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Visual Aid Presentation Action */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Pack: {prod.packSize || prod.packaging || 'Standard'}</span>
              <button
                onClick={() => setSelectedVisualAidProduct(prod)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View E-Detailing
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* E-Detailing Slide Viewer Modal */}
      {selectedVisualAidProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-teal-600">Digital Visual Aid</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedVisualAidProduct.brandName || selectedVisualAidProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedVisualAidProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {(selectedVisualAidProduct.visualAidSlides || []).map((slide: VisualAidSlide, idx: number) => (
                <div key={slide.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{slide.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{slide.description}</p>
                  
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 pl-4 list-disc">
                    {slide.bulletPoints.map((bp: string, bidx: number) => (
                      <li key={bidx}>{bp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedVisualAidProduct(null)}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold text-xs"
              >
                Close Visual Aid
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
