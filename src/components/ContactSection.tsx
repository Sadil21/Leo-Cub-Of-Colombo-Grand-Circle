import { useState } from 'react';
import { ArrowRight, Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';

const contactCards = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+94 77 111 2223',
    href: 'https://wa.me/94771112223',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: 'leo_club_grand_circle',
    href: 'https://instagram.com/leo_club_grand_circle',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    value: 'leo_club_grand_circle',
    href: 'https://facebook.com/leo_club_grand_circle',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'leoclubofcolombograndcircle@gmail.com',
    href: 'mailto:leoclubofcolombograndcircle@gmail.com',
  },
];

const ContactSection: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState<'subject' | 'message' | null>(null);

  const subjectActive = focusedField === 'subject' || subject.length > 0;
  const messageActive = focusedField === 'message' || message.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

        .contact-section {
          width: 100%;
          background:
            radial-gradient(circle at bottom center, rgba(74, 28, 255, 0.18), transparent 34%),
            linear-gradient(180deg, #020203 0%, #060609 100%);
          padding: clamp(76px, 10vw, 120px) 0 0;
          overflow: hidden;
        }

        .contact-shell {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto;
        }

        .contact-panel {
          display: grid;
          grid-template-columns: minmax(280px, 380px) minmax(0, 1fr);
          gap: clamp(28px, 4vw, 52px);
          align-items: start;
        }

        .contact-title-wrap {
          display: flex;
          justify-content: flex-end;
        }

        .contact-title {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 10vw, 8.8rem);
          line-height: 0.88;
          letter-spacing: 0.02em;
          color: #f5efdd;
          text-transform: uppercase;
          text-align: right;
        }

        .contact-form {
          padding-top: clamp(8px, 2vw, 18px);
        }

        .contact-field {
          position: relative;
          margin-bottom: clamp(28px, 4vw, 46px);
          padding-top: 18px;
        }

        .contact-float-label {
          position: absolute;
          left: 0;
          top: 28px;
          transform-origin: left top;
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.2rem, 1.8vw, 1.5rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.62);
          pointer-events: none;
          transition:
            transform 220ms ease,
            top 220ms ease,
            color 220ms ease,
            font-size 220ms ease;
        }

        .contact-float-label.is-active {
          top: 0;
          transform: scale(0.58);
          color: rgba(255, 255, 255, 0.44);
        }

        .contact-input,
        .contact-textarea {
          width: 100%;
          border: 0;
          border-bottom: 2px solid rgba(255, 255, 255, 0.72);
          background: transparent;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.1rem);
          outline: none;
          transition: border-color 180ms ease;
        }

        .contact-input {
          height: 60px;
        }

        .contact-textarea {
          min-height: 60px;
          padding-top: 10px;
          resize: vertical;
        }

        .contact-input:focus,
        .contact-textarea:focus {
          border-bottom-color: #f5efdd;
        }

        .contact-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .contact-submit {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 34px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
            rgba(5, 5, 8, 0.95);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 18px 40px rgba(0, 0, 0, 0.26);
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.1rem, 1.5vw, 1.25rem);
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .contact-submit:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.26);
        }

        .contact-cards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
          margin-top: clamp(40px, 6vw, 62px);
          padding-bottom: clamp(34px, 5vw, 52px);
        }

        .contact-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 130px;
          padding: 14px 18px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
            rgba(0, 0, 0, 0.9);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.28);
        }

        .contact-card-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
        }

        .contact-card-label {
          margin: 0 0 10px;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .contact-card-value {
          margin: auto 0 0;
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          line-height: 1.35;
          color: #ffffff;
          word-break: break-word;
        }

        .contact-footer-glow {
          height: 52px;
          background: linear-gradient(180deg, rgba(16, 5, 38, 0), #080016 100%);
        }

        @media (max-width: 960px) {
          .contact-panel {
            grid-template-columns: 1fr;
          }

          .contact-title-wrap {
            justify-content: flex-start;
          }

          .contact-title {
            text-align: left;
          }

          .contact-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .contact-submit-row {
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .contact-cards {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .contact-card {
            min-height: 118px;
          }
        }
      `}</style>

      <section className="contact-section" id="contact">
        <div className="contact-shell">
          <div className="contact-panel">
            <div className="contact-title-wrap">
              <h2 className="contact-title">
                Send
                <br />
                Message
              </h2>
            </div>

            <form className="contact-form">
              <div className="contact-field">
                <label
                  className={`contact-float-label ${subjectActive ? 'is-active' : ''}`}
                  htmlFor="contact-subject"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  className="contact-input"
                  type="text"
                  value={subject}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(current => (current === 'subject' ? null : current))}
                  onChange={event => setSubject(event.target.value)}
                />
              </div>

              <div className="contact-field">
                <label
                  className={`contact-float-label ${messageActive ? 'is-active' : ''}`}
                  htmlFor="contact-message"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  className="contact-textarea"
                  rows={1}
                  value={message}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(current => (current === 'message' ? null : current))}
                  onChange={event => setMessage(event.target.value)}
                />
              </div>

              <div className="contact-submit-row">
                <button type="submit" className="contact-submit">
                  SEND <ArrowRight className="h-6 w-6" />
                </button>
              </div>
            </form>
          </div>

          <div className="contact-cards">
            {contactCards.map(card => {
              const Icon = card.icon;

              return (
                <a key={card.label} className="contact-card" href={card.href} target="_blank" rel="noreferrer">
                  <div className="contact-card-icon">
                    <Icon className="h-7 w-7" strokeWidth={1.9} />
                  </div>
                  <div>
                    <p className="contact-card-label">{card.label}</p>
                    <p className="contact-card-value">{card.value}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="contact-footer-glow" />
      </section>
    </>
  );
};

export default ContactSection;
