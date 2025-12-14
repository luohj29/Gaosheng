'use client';

import {useState, FormEvent} from 'react';
import {useTranslations} from 'next-intl';
import '@/public/css/color.css';
import {CONTACT_EMAIL} from '@/src/config/constants';

export default function FloatingContactForm() {
  const t = useTranslations('ContactPage');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('_subject', `联系表单 - ${formData.name}`);
      formDataToSend.append('_template', 'box');
      formDataToSend.append('_captcha', 'false');

      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setSubmitStatus('success');
        setIsSubmitting(false);
        // 重置表单
        setFormData({name: '', email: '', phone: '', message: ''});
        // 5秒后清除成功消息并关闭表单
        setTimeout(() => {
          setSubmitStatus('idle');
          setIsOpen(false);
        }, 3000);
      } else {
        throw new Error('提交失败');
      }
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 展开的表单 */}
      {isOpen && (
        <div className="mb-4 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('floatingForm.title', {default: 'Leave a Message'})}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-1 text-sm">
              <span className="text-gray-700 font-medium">{t('formFields.name')}</span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-color focus:outline-none focus:ring-1 focus:ring-color"
                placeholder={t('formFields.namePlaceholder')}
              />
            </label>

            <label className="block space-y-1 text-sm">
              <span className="text-gray-700 font-medium">{t('formFields.email')}</span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-color focus:outline-none focus:ring-1 focus:ring-color"
                placeholder={t('formFields.emailPlaceholder')}
              />
            </label>

            <label className="block space-y-1 text-sm">
              <span className="text-gray-700 font-medium">
                {t('floatingForm.phoneLabel', {default: 'Phone / WhatsApp / WeChat'})}
              </span>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-color focus:outline-none focus:ring-1 focus:ring-color"
                placeholder={t('floatingForm.phonePlaceholder', {default: 'Enter your phone number'})}
              />
            </label>

            <label className="block space-y-1 text-sm">
              <span className="text-gray-700 font-medium">{t('formFields.message')}</span>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-color focus:outline-none focus:ring-1 focus:ring-color resize-none"
                placeholder={t('formFields.messagePlaceholder')}
              />
            </label>

            {submitStatus === 'success' && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                {t('formSuccess')}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                {t('formError')}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-color px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? t('formSubmitting') : t('formSubmit')}
            </button>
          </form>
        </div>
      )}

      {/* 浮动按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center px-6 py-3 rounded-full bg-color text-white shadow-lg hover:opacity-90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color font-semibold text-sm whitespace-nowrap"
          aria-label={t('floatingForm.buttonLabel', {default: 'Leave a message'})}
        >
          {t('floatingForm.buttonText', {default: 'Leave A Message!'})}
        </button>
      )}
    </div>
  );
}

