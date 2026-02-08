/**
 * Welcome email for HIGH RISK users
 * Sent immediately after quiz completion
 * 
 * Brand colors: Primary #486581, Accent #f0b429, Dark #102a43
 */

interface WelcomeHighRiskProps {
  firstName: string;
  topPainPoints: string[];
}

export default function WelcomeHighRisk({ firstName, topPainPoints }: WelcomeHighRiskProps) {
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
      <div style={{ backgroundColor: '#dc2626', padding: '16px 32px', textAlign: 'center' as const }}>
        <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
          🚨 High Risk Detected
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '36px 32px 24px', backgroundColor: '#ffffff' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#102a43', margin: '0 0 16px' }}>
          {greeting},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#334e68', margin: '0 0 16px' }}>
          Based on your quiz answers, your AI agents are in the <strong style={{ color: '#dc2626' }}>high-risk zone</strong>. You&apos;re not alone — 72% of companies deploying AI face similar challenges.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#334e68', margin: '0 0 24px' }}>
          But here&apos;s the good news: <strong>every major AI failure was preventable</strong>. Here&apos;s your action plan.
        </p>

        {/* Your concerns */}
        {topPainPoints.length > 0 && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '20px 24px', borderRadius: '8px', margin: '0 0 28px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 12px' }}>
              Your Top Concerns
            </p>
            {topPainPoints.slice(0, 3).map((point, index) => (
              <div key={index} style={{ marginBottom: index < topPainPoints.slice(0, 3).length - 1 ? '8px' : '0' }}>
                <span style={{ color: '#dc2626', marginRight: '8px', fontSize: '14px' }}>•</span>
                <span style={{ fontSize: '15px', color: '#334e68', lineHeight: '1.5' }}>{getPainPointLabel(point)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid #d9e2ec', margin: '4px 0 28px' }} />

        {/* Action steps */}
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#486581', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 20px' }}>
          Your 3-Step Action Plan
        </p>

        {/* Step 1 */}
        <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '20px', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '42px' }}>
                <div style={{ backgroundColor: '#102a43', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', textAlign: 'center' as const, lineHeight: '28px', fontSize: '14px', fontWeight: 600 }}>1</div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#102a43', margin: '2px 0 6px' }}>
                  Download the AI Safety Checklist
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  The testing framework used by top AI teams. Takes 5 minutes to implement.
                </p>
                <a 
                  href="https://inspectagents.com/checklist/download?utm_source=email&utm_medium=welcome&utm_campaign=high_risk" 
                  style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#102a43', color: '#ffffff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}
                >
                  Get the Checklist →
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Step 2 */}
        <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '20px', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '42px' }}>
                <div style={{ backgroundColor: '#102a43', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', textAlign: 'center' as const, lineHeight: '28px', fontSize: '14px', fontWeight: 600 }}>2</div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#102a43', margin: '2px 0 6px' }}>
                  See How Others Failed (So You Don&apos;t)
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  500+ documented AI failures — Chevrolet, Air Canada, DPD. See exactly what went wrong.
                </p>
                <a 
                  href="https://inspectagents.com/failures?utm_source=email&utm_medium=welcome&utm_campaign=high_risk" 
                  style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#ffffff', color: '#102a43', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: '2px solid #d9e2ec' }}
                >
                  Browse Failures →
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Step 3 */}
        <table cellPadding={0} cellSpacing={0} style={{ marginBottom: '8px', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '42px' }}>
                <div style={{ backgroundColor: '#102a43', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', textAlign: 'center' as const, lineHeight: '28px', fontSize: '14px', fontWeight: 600 }}>3</div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#102a43', margin: '2px 0 6px' }}>
                  Read the Testing Guide
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  Step-by-step: test AI agents before deployment. Covers prompt injection, hallucinations, and more.
                </p>
                <a 
                  href="https://inspectagents.com/blog/how-to-test-ai-agents?utm_source=email&utm_medium=welcome&utm_campaign=high_risk" 
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
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#102a43', margin: '0 0 4px' }}>$10M+</p>
          <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: 0 }}>
            Average cost of a major AI failure in production. Chevrolet&apos;s chatbot alone cost them millions in brand damage.
            {' '}
            <a href="https://inspectagents.com/blog/chevrolet-ai-failure-breakdown?utm_source=email&utm_medium=welcome&utm_campaign=high_risk" style={{ color: '#486581', fontWeight: 600 }}>Read the breakdown →</a>
          </p>
        </div>

        {/* Closing */}
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334e68', margin: '0 0 4px' }}>
          You took the first step by assessing your risk. Now let&apos;s fix the gaps before they become headlines.
        </p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334e68', margin: '24px 0 0' }}>
          — The InspectAgents Team
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 32px', textAlign: 'center' as const, backgroundColor: '#f0f4f8' }}>
        <p style={{ fontSize: '12px', color: '#829ab1', margin: '0 0 8px' }}>
          <a href="https://inspectagents.com?utm_source=email&utm_medium=welcome&utm_campaign=high_risk" style={{ color: '#486581', textDecoration: 'none', fontWeight: 600 }}>inspectagents.com</a>
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
