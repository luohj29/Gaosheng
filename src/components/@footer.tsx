import Image from 'next/image';
import {getTranslations} from 'next-intl/server';

type Props = {
  locale: string;
};

// 社交媒体图标 SVG 组件
const SocialIcon = ({ name, href, children }: { name: string; href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110"
    aria-label={name}
  >
    {children}
  </a>
);

// 社交媒体链接配置
const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=100089593702467',
  youtube: 'https://www.youtube.com/channel/UCxTjurBn_dIiGeBeSH8M-1w',
  twitter: 'https://twitter.com/Gaosheng_OF',
  instagram: 'https://www.instagram.com/gaosheng_officefurniture/',
  linkedin: 'https://www.linkedin.com/in/gaosheng-hongkong-62325a264/',
};

// 二维码图片路径
const QR_CODE_PATHS = {
  whatsapp: '/contact/whatsapp.png',
  wechat: '/contact/wechat.png',
};

export default async function Footer({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'Footer'});

  const socialLinks = [
    {
      name: 'Facebook',
      href: SOCIAL_LINKS.facebook,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: SOCIAL_LINKS.youtube,
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768C18.255 19 12 19 12 19s-6.255 0-7.814-.418a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.745 5 11.999 5 11.999 5s6.255 0 7.813.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: SOCIAL_LINKS.twitter,
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: SOCIAL_LINKS.instagram,
      icon: (
        <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: SOCIAL_LINKS.linkedin,
      icon: (
        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <footer id="contact" className="border-t border-black/10 bg-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-xl space-y-4 text-gray-800">
          <p className="text-lg font-semibold text-gray-900">{t('tagline')}</p>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900 mb-1">{t('phoneLabel')}</p>
              <p>{t('contactPhone')}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">{t('addressLabel')}</p>
              <p>{t('address')}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">{t('emailLabel')}</p>
              <p>{t('contactEmail')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* 社交媒体图标 */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-900">{t('followUs')}</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <SocialIcon key={social.name} name={social.name} href={social.href}>
                  {social.icon}
                </SocialIcon>
              ))}
            </div>
          </div>

          {/* 二维码 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">{t('scanQR')}</p>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 bg-white rounded-lg p-2 border border-gray-200">
                  <Image
                    src={QR_CODE_PATHS.whatsapp}
                    alt="WhatsApp QR Code"
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 bg-white rounded-lg p-2 border border-gray-200">
                  <Image
                    src={QR_CODE_PATHS.wechat}
                    alt="WeChat QR Code"
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <span className="text-xs text-gray-600">WeChat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 px-6 py-4 text-center text-xs text-gray-500">
        @{new Date().getFullYear()} Gaosheng {t('copyright')}
      </div>
    </footer>
  );
}

