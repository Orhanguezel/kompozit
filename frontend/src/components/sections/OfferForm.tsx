'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Wrench, Settings2, Layers3, Paperclip, ChevronRight } from 'lucide-react';
import api from '@/lib/axios';
import { storageService } from '@/features/storage';

type Tab = 'service' | 'product' | 'sparepart';

export function OfferFormClient({
  locale,
  preselectedProduct,
  initialTab = 'product',
}: {
  locale: string;
  preselectedProduct?: string;
  initialTab?: Tab;
}) {
  const t = useTranslations('offer.form');
  const tc = useTranslations('common');
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [sending, setSending] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  
  // Tab specific states
  const [productInterest, setProductInterest] = useState(preselectedProduct || '');
  const [productCategory, setProductCategory] = useState('');
  const [sector, setSector] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [details, setDetails] = useState('');

  // Composite project fields
  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [usageEnvironment, setUsageEnvironment] = useState('');
  const [surfaceFinish, setSurfaceFinish] = useState('');

  const productCategories = [
    'carbon_fiber',
    'frp_ctp',
    'fiberglass',
    'panel',
    'profile',
    'tank',
    'planter_landscape',
    'custom_part',
  ] as const;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    try {
      // 1. Upload files
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const uploaded = await storageService.upload(file, 'quote-requests');
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            url: uploaded?.url,
            path: uploaded?.path,
            id: uploaded?.id,
          };
        }),
      );

      // 2. Prepare payload
      let subject = productInterest || t(`tabs.${activeTab}`);
      let form_data: Record<string, any> = {
        related_type: activeTab,
        attachments: uploadedFiles,
      };

      if (activeTab === 'product') {
        form_data = {
          ...form_data,
          product_category: productCategory || null,
          product_name: productInterest || null,
          sector: sector || null,
          quantity: quantity || null,
          deadline: deadline || null,
          material: material || null,
          dimensions: dimensions || null,
          usage_environment: usageEnvironment || null,
          surface_finish: surfaceFinish || null,
          notes: details || null,
        };
      } else if (activeTab === 'service') {
        form_data = {
          ...form_data,
          product_name: productInterest || null,
          notes: details || null,
          sector: sector || null,
          deadline: deadline || null,
        };
      } else if (activeTab === 'sparepart') {
        form_data = {
          ...form_data,
          product_name: productInterest || null,
          quantity: quantity || null,
          deadline: deadline || null,
          notes: details || null,
          product_category: 'sparepart',
        };
      }

      await api.post('/offers', {
        customer_name: name,
        email,
        phone: phone || null,
        company_name: company || null,
        subject,
        message: details || null,
        source: 'kompozit',
        locale,
        form_data,
      });

      toast.success(t('success'));
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(t('error'));
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setDetails('');
    setFiles([]);
    setProductInterest(preselectedProduct || '');
    setProductCategory('');
    setSector('');
    setQuantity('');
    setDeadline('');
    setMaterial('');
    setDimensions('');
    setUsageEnvironment('');
    setSurfaceFinish('');
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'product', label: t('tabs.product'), icon: Settings2 },
    { id: 'service', label: t('tabs.service'), icon: Wrench },
    { id: 'sparepart', label: t('tabs.sparepart'), icon: Layers3 },
  ];

  const inputClass = "w-full rounded-none border-0 border-b-2 border-[color-mix(in_srgb,var(--color-gold)_34%,var(--color-text-muted))] bg-transparent px-0 py-3.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-300 hover:border-[color-mix(in_srgb,var(--color-gold)_55%,var(--color-text-muted))] focus:border-[var(--color-gold)] focus:outline-none";
  const labelClass = "mb-2 block text-[10px] font-bold uppercase tracking-[2px] text-[var(--color-text-muted)]";

  return (
    <div className="relative">
      {/* Glassmorphic Background Blur Accent */}
      <div className="absolute -top-24 -right-24 size-96 bg-[var(--color-gold)]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 size-96 bg-[var(--color-gold)]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:bg-[var(--color-surface-muted)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        {/* Tab Header */}
        <div className="flex border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg-secondary)_60%,transparent)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-1 items-center justify-center gap-3 px-6 py-6 transition-all duration-500 ${
                activeTab === tab.id 
                  ? 'bg-[color-mix(in_srgb,var(--color-gold)_8%,transparent)] text-[var(--color-gold)]' 
                  : 'text-[var(--color-text-muted)] hover:bg-[color-mix(in_srgb,var(--color-gold)_4%,transparent)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <tab.icon className={`size-4 transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`} />
              <span className="text-[11px] font-bold uppercase tracking-[2px]">{tab.label}</span>
              
              {activeTab === tab.id && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
                />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
          {/* Section 1: Contact Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-8 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center border border-[var(--color-gold)]/20">
                <span className="text-[var(--color-gold)] text-xs font-bold">01</span>
              </div>
              <h3 className="text-[13px] font-bold uppercase tracking-[3px] text-[var(--color-text-primary)]">
                {t('contactInfo') || 'Contact Information'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>{tc('name')}</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder={t('placeholders.name')}
                  className={inputClass} 
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>{tc('email')}</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('placeholders.email')}
                  className={inputClass} 
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>{tc('phone')}</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t('placeholders.phone')}
                  className={inputClass} 
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>{tc('company')}</label>
                <input 
                  type="text" 
                  value={company} 
                  onChange={e => setCompany(e.target.value)}
                  placeholder={t('placeholders.company')}
                  className={inputClass} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Project Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-8 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center border border-[var(--color-gold)]/20">
                <span className="text-[var(--color-gold)] text-xs font-bold">02</span>
              </div>
              <h3 className="text-[13px] font-bold uppercase tracking-[3px] text-[var(--color-text-primary)]">
                {t('details') || 'Project Details'}
              </h3>
            </div>

            <div className="relative">
              <div
                key={activeTab}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300"
              >
                {/* Product Specific Fields */}
                {activeTab === 'product' && (
                  <>
                    <div className="md:col-span-2 space-y-2">
                      <label className={labelClass}>{t('productInterest')}</label>
                      <input 
                        type="text" 
                        value={productInterest} 
                        onChange={e => setProductInterest(e.target.value)}
                        placeholder={t('placeholders.productInterest')}
                        className={inputClass} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('productCategory')}</label>
                      <select 
                        value={productCategory} 
                        onChange={e => setProductCategory(e.target.value)}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">{t('productCategory')}</option>
                        {productCategories.map(cat => (
                          <option key={cat} value={cat}>
                            {t(`productCategories.${cat}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('sector')}</label>
                      <input 
                        type="text" 
                        value={sector} 
                        onChange={e => setSector(e.target.value)}
                        placeholder={t('placeholders.sector')}
                        className={inputClass} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('quantity')}</label>
                      <input
                        type="text"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        placeholder={t('placeholders.quantity')}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('deadline')}</label>
                      <input
                        type="text"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        placeholder={t('placeholders.deadline')}
                        className={inputClass}
                      />
                    </div>

                    {/* Technical Fields Group */}
                    <div className="mt-4 grid grid-cols-1 gap-4 border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg-secondary)_55%,transparent)] p-6 sm:grid-cols-2 md:col-span-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <label className={labelClass}>{t('material')}</label>
                        <input type="text" value={material} onChange={e => setMaterial(e.target.value)} placeholder={t('placeholders.material')} className={inputClass} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>{t('dimensions')}</label>
                        <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder={t('placeholders.dimensions')} className={inputClass} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>{t('usageEnvironment')}</label>
                        <input type="text" value={usageEnvironment} onChange={e => setUsageEnvironment(e.target.value)} placeholder={t('placeholders.usageEnvironment')} className={inputClass} />
                      </div>
                      <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                        <label className={labelClass}>{t('surfaceFinish')}</label>
                        <input type="text" value={surfaceFinish} onChange={e => setSurfaceFinish(e.target.value)} placeholder={t('placeholders.surfaceFinish')} className={inputClass} />
                      </div>
                    </div>
                  </>
                )}

                {/* Service Specific Fields */}
                {activeTab === 'service' && (
                  <>
                    <div className="md:col-span-2 space-y-2">
                      <label className={labelClass}>{t('productInterest')}</label>
                      <input 
                        type="text" 
                        value={productInterest} 
                        onChange={e => setProductInterest(e.target.value)}
                        placeholder={t('placeholders.serviceInterest')}
                        className={inputClass} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('sector')}</label>
                      <input 
                        type="text" 
                        value={sector} 
                        onChange={e => setSector(e.target.value)}
                        placeholder={t('placeholders.sector')}
                        className={inputClass} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('deadline')}</label>
                      <input 
                        type="text" 
                        value={deadline} 
                        onChange={e => setDeadline(e.target.value)}
                        placeholder={t('placeholders.deadline')}
                        className={inputClass} 
                      />
                    </div>
                  </>
                )}

                {/* Spare Part Specific Fields */}
                {activeTab === 'sparepart' && (
                  <>
                    <div className="md:col-span-2 space-y-2">
                      <label className={labelClass}>{t('productInterest')}</label>
                      <input 
                        type="text" 
                        value={productInterest} 
                        onChange={e => setProductInterest(e.target.value)}
                        placeholder={t('placeholders.sparepartInterest')}
                        className={inputClass} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('quantity')}</label>
                      <input 
                        type="text" 
                        value={quantity} 
                        onChange={e => setQuantity(e.target.value)}
                        placeholder={t('placeholders.quantity')}
                        className={inputClass} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>{t('deadline')}</label>
                      <input 
                        type="text" 
                        value={deadline} 
                        onChange={e => setDeadline(e.target.value)}
                        placeholder={t('placeholders.deadline')}
                        className={inputClass} 
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2 space-y-2">
                  <label className={labelClass}>{t('details')}</label>
                  <textarea 
                    rows={4} 
                    value={details} 
                    onChange={e => setDetails(e.target.value)}
                    placeholder={t('detailsPlaceholder')}
                    className={`${inputClass} resize-none`} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Attachments */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-8">
              <div className="size-8 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center border border-[var(--color-gold)]/20">
                <span className="text-[var(--color-gold)] text-xs font-bold">03</span>
              </div>
              <h3 className="text-[13px] font-bold uppercase tracking-[3px] text-[var(--color-text-primary)]">
                {t('attachFile')}
              </h3>
            </div>

            <div className="relative group">
              <input 
                type="file" 
                multiple 
                onChange={e => setFiles(Array.from(e.target.files || []))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg-secondary)_45%,transparent)] p-10 transition-all duration-500 group-hover:border-[var(--color-gold)]/40 group-hover:bg-[color-mix(in_srgb,var(--color-gold)_5%,transparent)]">
                <div className="flex size-16 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] transition-transform duration-500 group-hover:scale-110">
                  <Paperclip className="size-6 text-[var(--color-gold)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-[1px] text-[var(--color-text-primary)]">{t('attachFile')}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[1px] text-[var(--color-text-muted)]">{t('attachHint')}</p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg-secondary)_55%,transparent)] px-3 py-2 text-[10px] font-bold uppercase tracking-[1px] text-[var(--color-gold)]">
                    <Paperclip className="size-3" />
                    {f.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-[var(--color-border)] pt-6 sm:flex-row">
            <p className="max-w-xs text-center text-[10px] uppercase tracking-[1px] text-[var(--color-text-muted)] sm:text-left">
              {t('privacyNote')}
            </p>
            
            <button
              type="submit"
              disabled={sending}
              className="group relative flex items-center gap-4 bg-gradient-to-r from-[var(--color-gold)] to-[#D4AF37] px-10 py-5 rounded-full text-black font-bold uppercase tracking-[3px] text-[11px] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              {sending ? (
                <>
                  <div className="size-4 border-2 border-black/30 border-t-black animate-spin rounded-full" />
                  {tc('loading')}
                </>
              ) : (
                <>
                  {t('submit')}
                  <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
