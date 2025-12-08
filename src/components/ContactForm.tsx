'use client';

import {useState, FormEvent} from 'react';
import {useTranslations} from 'next-intl';

// 接收表单提交的邮箱地址 - 修改这里即可更改接收邮箱
const RECIPIENT_EMAIL = '3133974071@qq.com';

export default function ContactForm() {
  const t = useTranslations('ContactPage');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 使用 FormSubmit 服务发送表单数据
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('_subject', `联系表单 - ${formData.name}`);
      formDataToSend.append('_template', 'box');
      formDataToSend.append('_captcha', 'false');

      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
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
        setFormData({name: '', email: '', message: ''});
        // 5秒后清除成功消息
        setTimeout(() => setSubmitStatus('idle'), 5000);
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-1 text-sm text-gray-600">
        <span>{t('formFields.name')}</span>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full rounded-2xl border border-black/10 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
          placeholder={t('formFields.namePlaceholder')}
        />
      </label>
      <label className="block space-y-1 text-sm text-gray-600">
        <span>{t('formFields.email')}</span>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full rounded-2xl border border-black/10 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
          placeholder={t('formFields.emailPlaceholder')}
        />
      </label>
      <label className="block space-y-1 text-sm text-gray-600">
        <span>{t('formFields.message')}</span>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full rounded-2xl border border-black/10 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
          placeholder={t('formFields.messagePlaceholder')}
        />
      </label>
      {submitStatus === 'success' && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800">
          {t('formSuccess')}
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {t('formError')}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t('formSubmitting') : t('formSubmit')}
      </button>
    </form>
  );
}

