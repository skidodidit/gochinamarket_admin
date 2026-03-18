"use client";

import { useState } from 'react';
import { Plus, X, Zap, Trash2 } from 'lucide-react';
import { ProductOption, ProductVariant, VariantOptionValue } from '@/types';

interface Props {
  basePrice: number;
  options: ProductOption[];
  variants: ProductVariant[];
  onChange: (options: ProductOption[], variants: ProductVariant[]) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function buildCombinations(options: ProductOption[]): VariantOptionValue[][] {
  const valid = options.filter(o => o.optionName.trim() && o.values.length > 0);
  if (valid.length === 0) return [];

  let combos: VariantOptionValue[][] = [[]];
  for (const opt of valid) {
    const next: VariantOptionValue[][] = [];
    for (const combo of combos) {
      for (const val of opt.values) {
        next.push([
          ...combo,
          { optionId: opt.optionId, optionName: opt.optionName, valueId: val.valueId, valueName: val.valueName }
        ]);
      }
    }
    combos = next;
  }
  return combos;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function OptionsVariantsEditor({ basePrice, options, variants, onChange }: Props) {
  const [newValueInputs, setNewValueInputs] = useState<Record<string, string>>({});

  // ── Option group actions ──────────────────────────────────────────────────

  const addOption = () => {
    onChange([...options, { optionId: uid(), optionName: '', values: [] }], variants);
  };

  const updateOptionName = (optionId: string, name: string) => {
    onChange(options.map(o => o.optionId === optionId ? { ...o, optionName: name } : o), variants);
  };

  const removeOption = (optionId: string) => {
    onChange(options.filter(o => o.optionId !== optionId), variants);
  };

  const addValue = (optionId: string) => {
    const raw = (newValueInputs[optionId] || '').trim();
    if (!raw) return;
    onChange(
      options.map(o =>
        o.optionId === optionId
          ? { ...o, values: [...o.values, { valueId: uid(), valueName: raw }] }
          : o
      ),
      variants
    );
    setNewValueInputs(prev => ({ ...prev, [optionId]: '' }));
  };

  const removeValue = (optionId: string, valueId: string) => {
    onChange(
      options.map(o =>
        o.optionId === optionId ? { ...o, values: o.values.filter(v => v.valueId !== valueId) } : o
      ),
      variants
    );
  };

  // ── Variant actions ───────────────────────────────────────────────────────

  const generateVariants = () => {
    const combos = buildCombinations(options);
    if (combos.length === 0) return;

    const generated: ProductVariant[] = combos.map(optionValues => {
      // Preserve existing variant data when regenerating
      const existing = variants.find(v =>
        v.optionValues.map(ov => ov.valueId).sort().join('|') ===
        optionValues.map(ov => ov.valueId).sort().join('|')
      );
      if (existing) return existing;

      const label = optionValues.map(v => v.valueName).join('-').toUpperCase().replace(/\s+/g, '');
      return {
        skuCode: `SKU-${label}-${uid()}`,
        price: basePrice,
        originalPrice: undefined,
        stock: 0,
        imageUrl: '',
        inStock: true,
        optionValues,
      };
    });

    onChange(options, generated);
  };

  const updateVariant = <K extends keyof ProductVariant>(skuCode: string, field: K, value: ProductVariant[K]) => {
    onChange(options, variants.map(v => v.skuCode === skuCode ? { ...v, [field]: value } : v));
  };

  const removeVariant = (skuCode: string) => {
    onChange(options, variants.filter(v => v.skuCode !== skuCode));
  };

  const hasOptions = options.length > 0;

  return (
    <div className="space-y-6">

      {/* ── Options ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 text-sm font-semibold">Product Options</span>
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Option
          </button>
        </div>

        {options.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No options yet. Click "Add Option" to add sizes, colors, storage, etc.
          </p>
        )}

        <div className="space-y-4">
          {options.map(option => (
            <div key={option.optionId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {/* Option name row */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={option.optionName}
                  onChange={e => updateOptionName(option.optionId, e.target.value)}
                  placeholder="Option name (e.g. Color, Size, Storage)"
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => removeOption(option.optionId)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Value chips */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
                {option.values.map(val => (
                  <span
                    key={val.valueId}
                    className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                  >
                    {val.valueName}
                    <button
                      type="button"
                      onClick={() => removeValue(option.optionId, val.valueId)}
                      className="ml-0.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {option.values.length === 0 && (
                  <span className="text-xs text-gray-400 italic">No values yet</span>
                )}
              </div>

              {/* Add value input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newValueInputs[option.optionId] || ''}
                  onChange={e => setNewValueInputs(prev => ({ ...prev, [option.optionId]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addValue(option.optionId); } }}
                  placeholder="Type a value and press Enter or Add"
                  className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => addValue(option.optionId)}
                  className="px-3 py-1.5 text-sm bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Variants ────────────────────────────────────────────────────── */}
      {hasOptions && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 text-sm font-semibold">
              Variants
              {variants.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {variants.length} variant{variants.length !== 1 ? 's' : ''}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={generateVariants}
              className="flex items-center gap-1 text-sm bg-primary text-black px-3 py-1.5 rounded-lg hover:bg-primary/80 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              {variants.length > 0 ? 'Regenerate' : 'Generate Variants'}
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              Click "Generate Variants" to create all option combinations automatically.
            </p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Variant</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Orig. Price</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Image URL</th>
                    <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">In Stock</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {variants.map(variant => (
                    <tr key={variant.skuCode} className="hover:bg-gray-50 transition-colors">
                      {/* Variant label */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {variant.optionValues.map(ov => (
                            <span
                              key={ov.valueId}
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                            >
                              <span className="text-gray-400">{ov.optionName}: </span>
                              {ov.valueName}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 font-mono">{variant.skuCode}</p>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={variant.price}
                          onChange={e => updateVariant(variant.skuCode, 'price', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                        />
                      </td>

                      {/* Original price */}
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={variant.originalPrice ?? ''}
                          onChange={e => updateVariant(variant.skuCode, 'originalPrice', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                          min="0"
                          step="0.01"
                          placeholder="—"
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                        />
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={e => updateVariant(variant.skuCode, 'stock', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                        />
                      </td>

                      {/* Image URL */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={variant.imageUrl || ''}
                          onChange={e => updateVariant(variant.skuCode, 'imageUrl', e.target.value)}
                          placeholder="https://..."
                          className="w-36 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                        />
                      </td>

                      {/* In stock toggle */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={variant.inStock}
                          onChange={e => updateVariant(variant.skuCode, 'inStock', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.skuCode)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}