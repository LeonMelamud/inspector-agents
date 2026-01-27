/**
 * Welcome email for MEDIUM RISK users
 * Sent immediately after quiz completion
 */

interface WelcomeMediumRiskProps {
  firstName: string;
  topPainPoints: string[];
}

export default function WelcomeMediumRisk({ firstName, topPainPoints }: WelcomeMediumRiskProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#f59e0b', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>
          ⚠️ Your AI Risk Assessment
        </h1>
      </div>

      {/* Body */}
      <div style={{ padding: '32px', backgroundColor: '#ffffff' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Hi {firstName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Thanks for taking the AI Risk Assessment. Your results show <strong>moderate risk</strong> — you're doing some things right, but there are gaps that could become problems.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          The good news? You're ahead of 68% of companies who haven't even thought about AI safety. With a few targeted improvements, you'll be in great shape.
        </p>

        {/* Top Areas to Address */}
        <div style={{ backgroundColor: '#fffbeb', padding: '20px', borderRadius: '8px', margin: '24px 0' }}>
          <h2 style={{ fontSize: '18px', color: '#1c1917', marginTop: 0 }}>
            🎯 Your Top Areas to Address:
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {topPainPoints.slice(0, 3).map((point, index) => (
              <li key={index} style={{ fontSize: '16px', lineHeight: '1.8', color: '#1c1917' }}>
                {getPainPointLabel(point)}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Steps */}
        <h2 style={{ fontSize: '20px', color: '#1c1917', marginTop: '32px' }}>
          📋 Your 3-Step Action Plan:
        </h2>

        <div style={{ backgroundColor: '#f5f5f4', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#059669', marginTop: 0 }}>
            1. Get Your AI Safety Checklist
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            A simple framework to systematically identify and fix AI risks before they become problems.
          </p>
          <a 
            href="https://inspectagents.com/checklist" 
            style={{ 
              display: 'inline-block',
              marginTop: '12px',
              padding: '10px 20px',
              backgroundColor: '#059669',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            Download Checklist →
          </a>
        </div>

        <div style={{ backgroundColor: '#f5f5f4', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#059669', marginTop: 0 }}>
            2. Learn From Real Failures
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            Browse 500+ documented AI failures. See what went wrong and how to avoid the same mistakes.
          </p>
          <a 
            href="https://inspectagents.com/failures" 
            style={{ 
              display: 'inline-block',
              marginTop: '12px',
              padding: '10px 20px',
              backgroundColor: '#059669',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            Browse Failures Database →
          </a>
        </div>

        <div style={{ backgroundColor: '#f5f5f4', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#059669', marginTop: 0 }}>
            3. Read The Testing Guide
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            Practical guide on how to test AI agents before deployment. Covers the most common failure modes.
          </p>
          <a 
            href="https://inspectagents.com/blog/how-to-test-ai-agents" 
            style={{ 
              display: 'inline-block',
              marginTop: '12px',
              padding: '10px 20px',
              backgroundColor: '#059669',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            Read Testing Guide →
          </a>
        </div>

        {/* Email Series Preview */}
        <div style={{ backgroundColor: '#ecfdf5', padding: '20px', borderRadius: '8px', marginTop: '32px' }}>
          <h2 style={{ fontSize: '18px', color: '#1c1917', marginTop: 0 }}>
            📧 Coming Up This Week:
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1c1917', marginBottom: '12px' }}>
            I'll send you a short email every few days with:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#1c1917' }}>
            <li>Real case studies of AI failures (and how they were prevented)</li>
            <li>Quick wins you can implement today</li>
            <li>Common mistakes teams make (so you can avoid them)</li>
            <li>Industry best practices from AI leaders</li>
          </ul>
        </div>

        {/* Closing */}
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917', marginTop: '32px' }}>
          You're on the right track. These next few steps will give you confidence that your AI won't embarrass you in front of customers.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Cheers,<br />
          <strong>The InspectAgents Team</strong>
        </p>

        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', marginTop: '32px' }}>
          P.S. Questions? Just reply to this email. We're here to help.
        </p>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#f5f5f4', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#57534e', margin: 0 }}>
          InspectAgents • AI Safety for Teams Who Can't Afford Mistakes
        </p>
        <p style={{ fontSize: '12px', color: '#57534e', marginTop: '8px' }}>
          <a href="https://inspectagents.com" style={{ color: '#059669', textDecoration: 'none' }}>Visit Website</a>
          {' • '}
          <a href="[UNSUBSCRIBE]" style={{ color: '#57534e', textDecoration: 'none' }}>Unsubscribe</a>
        </p>
      </div>
    </div>
  );
}

function getPainPointLabel(painPoint: string): string {
  const labels: Record<string, string> = {
    'hallucinations': 'AI making up false information',
    'security': 'Security vulnerabilities and data breaches',
    'reputation': 'Reputation and brand damage',
    'cost': 'Unexpected costs and resource drain',
    'dont-know': 'Uncertainty about AI risks',
    'time-waste': 'Time wasted on AI issues',
    'financial-loss': 'Financial losses from AI failures',
    'reputation-damage': 'Reputation damage from AI mistakes',
    'experienced-failure': 'Previous AI failure experience',
  };
  return labels[painPoint] || painPoint;
}
