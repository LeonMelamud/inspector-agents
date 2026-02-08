/**
 * Welcome email for MEDIUM RISK users
 * Sent immediately after quiz completion
 * 
 * Brand colors: Primary #486581, Accent #f0b429, Dark #102a43
 */

interface WelcomeMediumRiskProps {
  firstName: string;
  topPainPoints: string[];
}

export default function WelcomeMediumRisk({ firstName, topPainPoints }: WelcomeMediumRiskProps) {
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
      <div style={{ backgroundColor: '#f59e0b', padding: '16px 32px', textAlign: 'center' as const }}>
        <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
          ⚠️ Moderate Risk Detected
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '36px 32px 24px', backgroundColor: '#ffffff' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#102a43', margin: '0 0 16px' }}>
          {greeting},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#334e68', margin: '0 0 16px' }}>
          Your AI Risk Assessment shows <strong style={{ color: '#d97706' }}>moderate risk</strong> — you&apos;re doing some things right, but there are gaps that could become expensive problems.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#334e68', margin: '0 0 24px' }}>
          You&apos;re ahead of 68% of companies who haven&apos;t thought about AI safety at all. A few targeted fixes will put you in great shape.
        </p>

        {/* Your concerns */}
        {topPainPoints.length > 0 && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '20px 24px', borderRadius: '8px', margin: '0 0 28px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#d97706', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 12px' }}>
              Areas to Address
            </p>
            {topPainPoints.slice(0, 3).map((point, index) => (
              <div key={index} style={{ marginBottom: index < topPainPoints.slice(0, 3).length - 1 ? '8px' : '0' }}>
                <span style={{ color: '#d97706', marginRight: '8px', fontSize: '14px' }}>•</span>
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
                  Get the AI Safety Checklist
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  A simple framework to systematically identify and fix AI risks. Start with the highest-impact items.
                </p>
                <a 
                  href="https://inspectagents.com/checklist/download?utm_source=email&utm_medium=welcome&utm_campaign=medium_risk" 
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
                  Learn From Real Failures
                </p>
                <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: '0 0 12px' }}>
                  Browse 500+ documented AI failures. See what went wrong at Chevrolet, Air Canada, and others — so you don&apos;t repeat their mistakes.
                </p>
                <a 
                  href="https://inspectagents.com/failures?utm_source=email&utm_medium=welcome&utm_campaign=medium_risk" 
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
                  Practical, step-by-step guide to test AI agents before deployment. Covers the most common failure modes.
                </p>
                <a 
                  href="https://inspectagents.com/blog/how-to-test-ai-agents?utm_source=email&utm_medium=welcome&utm_campaign=medium_risk" 
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
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#102a43', margin: '0 0 4px' }}>72%</p>
          <p style={{ fontSize: '14px', color: '#627d98', lineHeight: '1.6', margin: 0 }}>
            of companies deploying AI agents have experienced at least one failure. Most were preventable with basic testing.
            {' '}
            <a href="https://inspectagents.com/blog/ai-chatbot-failures-2025-2026?utm_source=email&utm_medium=welcome&utm_campaign=medium_risk" style={{ color: '#486581', fontWeight: 600 }}>See the full list →</a>
          </p>
        </div>

        {/* Closing */}
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334e68', margin: '0 0 4px' }}>
          You&apos;re on the right track. These next steps will close the gaps and give you confidence your AI won&apos;t embarrass you in front of customers.
        </p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334e68', margin: '24px 0 0' }}>
          — The InspectAgents Team
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 32px', textAlign: 'center' as const, backgroundColor: '#f0f4f8' }}>
        <p style={{ fontSize: '12px', color: '#829ab1', margin: '0 0 8px' }}>
          <a href="https://inspectagents.com?utm_source=email&utm_medium=welcome&utm_campaign=medium_risk" style={{ color: '#486581', textDecoration: 'none', fontWeight: 600 }}>inspectagents.com</a>
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
