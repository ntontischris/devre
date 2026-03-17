export const CLIENT_LOGOS = [
  { name: 'UFC', src: '/images/clients/ufc.png', solidBg: false },
  { name: 'AJP', src: '/images/clients/ajp.png', solidBg: false },
  { name: 'ADCC', src: '/images/clients/adcc.png', solidBg: false },
  { name: 'Alpha Jiu-Jitsu', src: '/images/clients/alpha.png', solidBg: false },
  { name: 'Almeco', src: '/images/clients/almeco.png', solidBg: false },
  { name: 'Stammdesign', src: '/images/clients/stammdesign.png', solidBg: false },
  { name: 'Technomat', src: '/images/clients/technomat.jpeg', solidBg: true },
  { name: 'RE/MAX', src: '/images/clients/remax.png', solidBg: false },
  { name: 'Ariston', src: '/images/clients/ariston.png', solidBg: false },
  { name: 'Ophthalmica', src: '/images/clients/ophthalmica.png', solidBg: false },
  { name: 'Delli', src: '/images/clients/delli.png', solidBg: false },
  { name: 'Μαύρη Θάλασσα', src: '/images/clients/mavri-thalassa.png', solidBg: true },
] as const;

export const PORTFOLIO_VIDEOS = [
  { id: 'SU7cHJa24SI', key: 'video1Title' },
  { id: 't7WGvZgAfoM', key: 'video2Title' },
  { id: 'd0LHY3KmAcE', key: 'video3Title' },
  { id: 'Aa8xOabwCz8', key: 'video4Title' },
  { id: '57WcYfFSMFw', key: 'video5Title' },
  { id: 'wDvWXvlwvMM', key: 'video6Title' },
] as const;

export const NAV_LINKS = [
  { href: '#about', labelKey: 'nav.about' },
  { href: '#services', labelKey: 'nav.services' },
  { href: '#portfolio', labelKey: 'nav.portfolio' },
  { href: '#team', labelKey: 'nav.team' },
  { href: '#pricing', labelKey: 'nav.pricing' },
  { href: '#contact', labelKey: 'nav.contact' },
] as const;

export const SOCIAL_LINKS = [
  {
    href: 'https://www.instagram.com/devre_media?igsh=YnQ2bWRlMjJycG1p',
    label: 'Instagram',
    platform: 'instagram',
  },
  {
    href: 'https://www.linkedin.com/company/devre-media/',
    label: 'LinkedIn',
    platform: 'linkedin',
  },
  { href: 'https://www.youtube.com/@DevreMedia', label: 'YouTube', platform: 'youtube' },
] as const;
