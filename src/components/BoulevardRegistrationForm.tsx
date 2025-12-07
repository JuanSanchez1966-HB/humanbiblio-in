import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import { useAnalytics } from '../hooks/useAnalytics';

interface BoulevardRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BoulevardRegistrationForm({ isOpen, onClose, onSuccess }: BoulevardRegistrationFormProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { logAction, logConversion } = useAnalytics({ userId: user?.id });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    location: '',
    products: '',
    targetAudience: '',
    experience: '',
    goals: ''
  });

  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calcular scroll máximo para cremallera
  useEffect(() => {
    if (contentRef.current && isOpen) {
      const element = contentRef.current;
      const maxScrollValue = element.scrollHeight - element.clientHeight;
      setMaxScroll(maxScrollValue);
    }
  }, [isOpen, formData]); // Recalcular cuando cambie el contenido

  // Manejar scroll con cremallera
  const handleScroll = () => {
    if (contentRef.current) {
      setScrollPosition(contentRef.current.scrollTop);
    }
  };

  // Scroll programático desde cremallera
  const scrollTo = (position: number) => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError(t('auth.required'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const productsArray = formData.products
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const { data, error: insertError } = await supabase
        .from('wb_businesses')
        .insert([
          {
            owner_id: user.id,
            name: formData.businessName,
            category: formData.category,
            description: formData.description,
            products_services: productsArray,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            website: formData.website || null,
            location: formData.location,
            target_audience: formData.targetAudience || null,
            experience: formData.experience || null,
            goals: formData.goals || null,
            is_approved: true
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating business:', insertError);
        setError(t('boulevard.form.error'));
        return;
      }

      if (data) {
        await logAction('create_business', data.id, {
          businessName: formData.businessName,
          category: formData.category,
          location: formData.location
        });

        await logConversion('business_created', {
          businessId: data.id,
          category: formData.category,
          hasWebsite: !!formData.website
        });
      }

      alert(`${t('boulevard.form.success.immediate')}\n\n${t('boulevard.form.success.visible')}`);

      if (onSuccess) {
        onSuccess();
      }

      onClose();

      setFormData({
        businessName: '',
        category: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        location: '',
        products: '',
        targetAudience: '',
        experience: '',
        goals: ''
      });

    } catch (err) {
      console.error('Error submitting form:', err);
      setError(t('boulevard.form.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollPercentage = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        
        {/* CREMALLERA LATERAL PARA FORMULARIO WB */}
        <div className="absolute right-2 top-16 bottom-16 w-6 z-10">
          {/* Track de la cremallera */}
          <div className="relative h-full bg-gray-200 rounded-full w-2 mx-auto">
            {/* Indicador de posición */}
            <div 
              className="absolute w-6 h-6 bg-emerald-600 rounded-full shadow-lg cursor-pointer transform -translate-x-2 transition-all duration-200 hover:bg-emerald-700 hover:scale-110"
              style={{ 
                top: `${scrollPercentage}%`,
                transform: `translateX(-50%) translateY(-50%)`
              }}
              onClick={(e) => {
                const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const percentage = (clickY / rect.height) * 100;
                const targetScroll = (percentage / 100) * maxScroll;
                scrollTo(targetScroll);
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                WB
              </div>
            </div>
          </div>
          
          {/* Botones de navegación rápida */}
          <div className="absolute -right-8 top-0">
            <button
              onClick={() => scrollTo(0)}
              className="w-8 h-8 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors text-xs font-bold shadow-lg"
              title={t('boulevard.form.scroll.top')}
            >
              ↑
            </button>
          </div>

          <div className="absolute -right-8 bottom-0">
            <button
              onClick={() => scrollTo(maxScroll)}
              className="w-8 h-8 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors text-xs font-bold shadow-lg"
              title={t('boulevard.form.scroll.bottom')}
            >
              ↓
            </button>
          </div>
        </div>

        {/* Header fijo */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('business.form.title')}
            </h2>
            <p className="text-gray-600">
              {t('business.form.subtitle')}
            </p>
          </div>
        </div>
        
        {/* Contenido scrolleable con cremallera */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto pr-8"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('business.form.name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('boulevard.form.business.name.placeholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('business.form.category')} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('boulevard.form.category.select')}</option>
                    <option value="Gastronomía">{t('boulevard.form.category.gastronomy')}</option>
                    <option value="Tecnología">{t('boulevard.form.category.technology')}</option>
                    <option value="Salud y Bienestar">{t('boulevard.form.category.health')}</option>
                    <option value="Educación">{t('boulevard.form.category.education')}</option>
                    <option value="Arte y Cultura">{t('boulevard.form.category.art')}</option>
                    <option value="Servicios Profesionales">{t('boulevard.form.category.services')}</option>
                    <option value="Música y Audio">{t('boulevard.form.category.music')}</option>
                    <option value="Diseño y Creatividad">{t('boulevard.form.category.design')}</option>
                    <option value="Retail y Comercio">{t('boulevard.form.category.retail')}</option>
                    <option value="Otros">{t('boulevard.form.category.other')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('business.form.description')} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('boulevard.form.description.placeholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('business.form.products')} *
                </label>
                <textarea
                  value={formData.products}
                  onChange={(e) => setFormData(prev => ({ ...prev, products: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('boulevard.form.products.placeholder')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('business.form.contact.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('business.form.contact.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('boulevard.form.phone.placeholder')}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('business.form.website')} (Opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('boulevard.form.website.placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('boulevard.form.location')}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t('boulevard.form.location.placeholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('business.form.target')}
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('boulevard.form.target.placeholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('business.form.experience')}
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">{t('boulevard.form.experience.select')}</option>
                  <option value="Menos de 1 año">{t('boulevard.form.experience.less1')}</option>
                  <option value="1-3 años">{t('boulevard.form.experience.1to3')}</option>
                  <option value="3-5 años">{t('boulevard.form.experience.3to5')}</option>
                  <option value="5-10 años">{t('boulevard.form.experience.5to10')}</option>
                  <option value="10-15 años">{t('boulevard.form.experience.10to15')}</option>
                  <option value="Más de 15 años">{t('boulevard.form.experience.more15')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('business.form.goals')}
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t('boulevard.form.goals.placeholder')}
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h4 className="font-semibold text-emerald-900 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  {t('business.form.includes.title')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-800">
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>{t('business.form.includes.profile')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>{t('business.form.includes.gallery')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>{t('business.form.includes.chat')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>{t('business.form.includes.geo')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>{t('business.form.includes.analytics')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-green-500">✅</span>
                    <span>{t('business.form.includes.certification')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">🌟</span>
                  {t('business.form.philosophy.title')}
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {t('business.form.philosophy.description')}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
                  {error}
                </div>
              )}

              {/* Botón de envío dentro del scroll */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">{t('boulevard.form.submitting')}</span>
                    </>
                  ) : (
                    t('boulevard.form.submit')
                  )}
                </button>
              </div>
              
              {/* Espaciado final para scroll completo */}
              <div className="h-8"></div>
            </form>
          </div>
        </div>

        {/* Footer fijo */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
            >
              {t('boulevard.form.cancel')}
            </button>
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-20"
        >
          ✕
        </button>

        {/* Indicador de scroll */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 border border-gray-200">
          {scrollPercentage < 95 ? t('boulevard.form.scroll.help') : t('boulevard.form.scroll.complete')}
        </div>
      </div>
    </div>
  );
}