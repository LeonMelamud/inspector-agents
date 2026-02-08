/**
 * Welcome email for LOW RISK users
 * Sent immediately after quiz completion
 * 
 * Brand colors: Primary #486581, Accent #f0b429, Dark #102a43
 */

interface WelcomeLowRiskProps {
  firstName: string;
  topPainPoints: string[];
}

export default function WelcomeLowRisk({ firstName, topPainPoints }: WelcomeLowRiskProps) {
  const greeting = firstName ? `Hi ${firstName}` : 'Hi there';

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f0f4f8' }}>
      {/* Header with logo */}
      <div style={{ backgroundColor: '#102a43', padding: '28px 32px', textAlign: 'center' as const }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          InspectAgents
        </h1>
        <p style={{ color: '#9fb3c8', margin: '4px 0 0', fontSize: '13px', fontWeight: 400 }}>
          AI Safety for Teams Who Can&apos;t Afford Mistakes
        </p>
      </div>

      {/* Risk badge */}
      <div style={{ backgroundColor: '#16a34a', padding: '16px 32px', textAlign: 'center' as const }}>
        <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
          ✅ Low Risk — You&apos;re in Good Shape
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '36px 32px 24px', backgroundColor: '#ffffff' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#102a43', margin: '0 0 16px' }}>
          {greeting},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#334e68', margin: '0 0 16px' }}>
          Your AI Risk Assessment shows <strong style={{ color: '#16a34a' }}>low risk</strong> — your AI practices are in good shape. You&apos;re ahead of 85% of teams when it comes to AI safety.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#334e68', margin: '0 0 24px' }}>
          The AI landscape changes fast, though. Here are resources to make sure you stay ahead.
        </p>

        {/* Keep an eye on */}
        {topPainPoints.length > 0 && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px 24px', borderRadius: '8px', margin: '0 0 28px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 12px' }}>
              Keep an Eye On
            </p>
            {topPainPoints.slice(0, 3).map((point, index) => (
              <div key={index} style={{ marginBottom: index < topPainPoints.slice(0, 3).length - 1 ? '8px' : '0' }}>
                <span style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}>•</span>
                <span style={{ fontSize: '15px', color: '#334e68', lineHeight: '1.5' }}>{getPainPointLabel(point)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid #d9e2ec', margin: '4px 0 28px' }} />

        {/* Resources */}
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#486581', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 20px' }}>
          Resources to Stay Sharp
        </p>

        {/* Resource 1 */}
        <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '20px', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '42px' }}>
                <div style={{ backgroundColor: '#102a43', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', textAlign: 'center' as const, lineHeight: '28px', fontSize: '14px', fontWeight: 600 }}>1</div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#102a43', margin: '2px 0 6px' }}>
                  AI Safety Checklist
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  Even if you&apos;re doing well, this checklist helps catch edge cases and new attack vectors as they emerge.
                </p>
                <a 
                  href="https://inspectagents.com/checklist/download?utm_source=email&utm_medium=welcome&utm_campaign=low_risk" 
                  style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#102a43', color: '#ffffff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}
                >
                  Get the Checklist →
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Resource 2 */}
        <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '20px', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '42px' }}>
                <div style={{ backgroundColor: '#102a43', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', textAlign: 'center' as const, lineHeight: '28px', fontSize: '14px', fontWeight: 600 }}>2</div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#102a43', margin: '2px 0 6px' }}>
                  AI Failures Database
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  Stay updated on the latest AI incidents. Learn from what&apos;s happening in the wild so you can prevent it.
                </p>
                <a 
                  href="https://inspectagents.com/failures?utm_source=email&utm_medium=welcome&utm_campaign=low_risk" 
                  style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#ffffff', color: '#102a43', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: '2px solid #d9e2ec' }}
                >
                  Browse Failures →
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Resource 3 */}
        <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '8px', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '42px' }}>
                <div style={{ backgroundColor: '#102a43', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', textAlign: 'center' as const, lineHeight: '28px', fontSize: '14px', fontWeight: 600 }}>3</div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#102a43', margin: '2px 0 6px' }}>
                  The Testing Guide
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  Go deeper on adversarial testing, prompt injection detection, and edge case discovery for AI agents.
                </p>
                <a 
                  href="https://inspectagents.com/blog/how-to-test-ai-agents?utm_source=email&utm_medium=welcome&utm_campaign=low_risk" 
                  style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#ffffff', color: '#102a43', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: '2px solid #d9e2ec' }}
                >
                  Read Guide →
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #d9e2ec', margin: '28px 0' }} />

        {/* Stat callout */}
        <div style={{ backgroundColor: '#f0f4f8', border: '1px solid #d9e2ec', padding: '20px 24px', borderRadius: '8px', margin: '0 0 28px' }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#102a43', margin: '0 0 4px' }}>500+</p>
          <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: 0 }}>
            documented AI chatbot failures in our database. Even well-prepared teams find new patterns to watch for.
            {' '}
            <a href="https://inspectagents.com/blog/ai-chatbot-failures-2025-2026?utm_source=email&utm_medium=welcome&utm_campaign=low_risk" style={{ color: '#486581', fontWeight: 600 }}>See the latest →</a>
          </p>
        </div>

        {/* Closing */}
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334e68', margin: '0 0 4px' }}>
          Keep up the great work. It&apos;s rare to see teams taking AI safety seriously from day one.
        </p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334e68', margin: '24px 0 0' }}>
          — The InspectAgents Team
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 32px', textAlign: 'center' as const, backgroundColor: '#f0f4f8' }}>
        <p style={{ fontSize: '12px', color: '#829ab1', margin: '0 0 8px' }}>
          <a href="https://inspectagents.com?utm_source=email&utm_medium=welcome&utm_campaign=low_risk" style={{ color: '#486581', textDecoration: 'none', fontWeight: 600 }}>inspectagents.com</a>
        </p>
        <p style={{ fontSize: '11px', color: '#9fb3c8', margin: 0 }}>
          You received this because you took the AI Risk Assessment.
        </p>
      </div>
    </div>
  );
}

function getPainPointLabel(painPoint: string): string {
  const labels: Record<string, string> = {
    'hallucinations': 'AI hallucinations — making up false information',
    'security': 'Security vulnerabilities and data breaches',
    'reputation': 'Brand and reputation damage',
    'cost': 'Unexpected costs and resource drain',
    'dontKnow': 'Uncertainty about what could go wrong',
    'dont-know': 'Uncertainty about what could go wrong',
    'time-waste': 'Time wasted on AI issues',
    'financial-loss': 'Financial losses from AI failures',
    'reputation-damage': 'Reputation damage from AI mistakes',
    'experienced-failure': 'Previous AI failure experience',
  };
  return labels[painPoint] || painPoint;
}
