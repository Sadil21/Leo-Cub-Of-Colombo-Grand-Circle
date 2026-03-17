import { ArrowUp, Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import clubLogo from '@/assets/logos/Club_Logo_2025.png';

const footerLinks = [
  { label: 'HOME', href: '#top' },
  { label: 'ABOUT', href: '#about' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
];

const footerCards = [
  {
    icon: MessageCircle,
    value: '+94 70 151 3600',
    href: 'https://wa.me/94701513600',
  },
  {
    icon: Instagram,
    value: 'Sadil Manvidu',
    href: 'https://instagram.com/',
  },
  {
    icon: Facebook,
    value: 'Sadil Manvidu',
    href: 'https://facebook.com/',
  },
  {
    icon: Mail,
    value: 'sadilmanvidu219@gmail.com',
    href: 'mailto:sadilmanvidu219@gmail.com',
  },
];

const socialLinks = [
  { icon: MessageCircle, href: 'https://wa.me/94701513600', label: 'WhatsApp' },
  { icon: Instagram, href: 'https://instagram.com/leo_club_grand_circle', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/leo_club_grand_circle', label: 'Facebook' },
];

const FooterSection: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

        @keyframes footerGlow {
          0%, 100% {
            opacity: 0.58;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @keyframes footerSlide {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(6px);
          }
        }

        .footer-section {
          width: 100%;
          background:
            radial-gradient(circle at bottom center, rgba(42, 14, 122, 0.36), transparent 34%),
            linear-gradient(180deg, #030304 0%, #060608 100%);
          padding: 18px 0 20px;
        }

        .footer-shell {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .footer-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
            rgba(0, 0, 0, 0.94);
          padding: 22px 22px 10px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 28px 80px rgba(0, 0, 0, 0.32);
        }

        .footer-topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 18px;
        }

        .footer-socials {
          display: flex;
          gap: 14px;
        }

        .footer-social {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .footer-social:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.34);
        }

        .footer-copy {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.96rem, 1.2vw, 1rem);
          color: rgba(255, 255, 255, 0.62);
        }

        .footer-grid {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
          gap: clamp(28px, 4vw, 48px);
          align-items: start;
          margin-bottom: clamp(22px, 4vw, 42px);
        }

        .footer-brand {
          padding-top: 8px;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .footer-logo {
          width: clamp(170px, 20vw, 240px);
          height: auto;
          display: block;
          margin-bottom: 26px;
          filter: drop-shadow(0 14px 28px rgba(24, 24, 60, 0.35));
        }

        .footer-kicker {
          margin: 0 0 6px;
          font-family: 'Inter', sans-serif;
          font-size: clamp(2.2rem, 4vw, 2.2rem);
          line-height: 1;
          color: #ffffff;
          animation: footerGlow 4.8s ease-in-out infinite;
        }

        .footer-title {
          margin: 0;
          width:100%;
          font-family: 'Inter', sans-serif;
          font-size: clamp(3.9rem, 9vw, 7.6rem);
          line-height: 0.92;
          letter-spacing: -0.05em;
          color: #ffffff;
          animation: footerGlow 5.8s ease-in-out infinite;
        }

        .footer-brand-copy {
          margin-top: auto;
          padding-top: clamp(22px, 4vw, 38px);
          width: 100%;
          max-width: none;
        }

        .footer-nav-side {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .footer-nav-header {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding-top: 18px;
        }

        .footer-backtop {
          width: 96px;
          height: 96px;
          display: grid;
          place-items: center;
          border: 6px solid #ffffff;
          background: #000000;
          color: #ffffff;
          text-decoration: none;
          transition: transform 180ms ease, background-color 180ms ease, color 180ms ease;
        }

        .footer-backtop:hover {
          transform: translateY(-4px);
          background: #ffffff;
          color: #000000;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 26px;
          padding: 18px 0;
          border-bottom: 2px solid rgba(255, 255, 255, 0.74);
          text-decoration: none;
          color: #ffffff;
        }

        .footer-link-icon {
          display: inline-flex;
          color: #ffffff;
          animation: footerSlide 3.8s ease-in-out infinite;
        }

        .footer-link-text {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2rem);
          font-weight: 400;
          letter-spacing: 0.01em;
          color: #ffffff;
          transition: transform 180ms ease, color 180ms ease;
        }

        .footer-link:hover .footer-link-text {
          transform: translateX(8px);
          color: #f2ebdc;
        }

        .footer-cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
          margin-top: 16px;
        }

        .footer-card {
          min-height: 124px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px 18px 16px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
            rgba(0, 0, 0, 0.88);
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .footer-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .footer-card-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
        }

        .footer-card-value {
          margin: auto 0 0;
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.98rem, 1.2vw, 1.05rem);
          line-height: 1.28;
          color: #ffffff;
          word-break: break-word;
        }

        .footer-credit {
          margin: 24px 0 0;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.98rem, 1.2vw, 1.05rem);
          color: rgba(255, 255, 255, 0.9);
        }

        .footer-credit span {
          color: #9cabff;
        }

        @media (max-width: 980px) {
          .footer-section {
            min-height: auto;
          }

          .footer-shell {
            min-height: auto;
          }

          .footer-grid {
            grid-template-columns: 1fr;
          }

          .footer-brand-copy {
            margin-top: 24px;
            padding-top: 20px;
            max-width: 100%;
          }

          .footer-nav-side {
            grid-template-columns: 78px minmax(0, 1fr);
          }

          .footer-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer-copy {
            text-align: left;
          }

          .footer-nav-header {
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .footer-topline {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-copy {
            text-align: left;
          }

          .footer-socials {
            flex-wrap: wrap;
          }

          .footer-main {
            padding: 18px 16px 10px;
          }

          .footer-nav-header {
            gap: 18px;
            padding-top: 0;
          }

          .footer-backtop {
            width: 78px;
            height: 78px;
            border-width: 4px;
          }

          .footer-nav-side {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .footer-cards {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }
      `}</style>

      <footer className="footer-section">
        <div className="footer-shell">
          <div className="footer-main">
            <div className="footer-topline">
              <div className="footer-socials">
                {socialLinks.map(link => {
                  const Icon = link.icon;

                  return (
                    <a
                      key={link.label}
                      className="footer-social"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.9} />
                    </a>
                  );
                })}
              </div>

              <p className="footer-copy">Copyright 2026 Leo Club of Colombo Grand Circle. All rights reserved</p>
            </div>

            <div className="footer-grid">
              <div className="footer-brand">
                <img className="footer-logo" src={clubLogo} alt="Leo Club of Colombo Grand Circle logo" />
              </div>

              <div className="footer-nav-side">
                <div className="footer-nav-header">
                  <a className="footer-backtop" href="#top" aria-label="Back to top">
                    <ArrowUp className="h-12 w-12" strokeWidth={2.4} />
                  </a>
                </div>

                <nav className="footer-links" aria-label="Footer navigation">
                  {footerLinks.map(link => (
                    <a key={link.label} className="footer-link" href={link.href}>
                      <span className="footer-link-icon">
                        <ArrowUp className="h-8 w-8 rotate-[-45deg]" strokeWidth={2.4} />
                      </span>
                      <span className="footer-link-text">{link.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            <div className="footer-brand-copy">
              <p className="footer-kicker">Leo Club of</p>
              <h2 className="footer-title">Colombo Grand Circle</h2>
            </div>
          </div>

          <div className="footer-cards">
            {footerCards.map(card => {
              const Icon = card.icon;

              return (
                <a key={card.value} className="footer-card" href={card.href} target="_blank" rel="noreferrer">
                  <div className="footer-card-icon">
                    <Icon className="h-6 w-6" strokeWidth={1.9} />
                  </div>
                  <p className="footer-card-value">{card.value}</p>
                </a>
              );
            })}
          </div>

          <p className="footer-credit">
            Developed by <span>Leo Sadil Manvidu</span> from 306D5
          </p>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;
