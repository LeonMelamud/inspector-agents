/**
 * Welcome email for HIGH RISK users
 * Sent immediately after quiz completion
 */

interface WelcomeHighRiskProps {
  firstName: string;
  topPainPoints: string[];
}

export default function WelcomeHighRisk({ firstName, topPainPoints }: WelcomeHighRiskProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#ef4444', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>
          🚨 Your AI Is At High Risk
        </h1>
      </div>

      {/* Body */}
      <div style={{ padding: '32px', backgroundColor: '#ffffff' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Hi {firstName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Thanks for taking the AI Risk Assessment. Based on your answers, <strong>your AI agents are in the high-risk zone</strong>.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          You're not alone — 72% of companies deploying AI face similar challenges. But here's the good news: <strong>every major AI failure was preventable</strong>.
        </p>

        {/* Top Concerns */}
        <div style={{ backgroundColor: '#fef3c7', padding: '20px', borderRadius: '8px', margin: '24px 0' }}>
          <h2 style={{ fontSize: '18px', color: '#1c1917', marginTop: 0 }}>
            Your Top Concerns:
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {topPainPoints.slice(0, 3).map((point, index) => (
              <li key={index} style={{ fontSize: '16px', lineHeight: '1.8', color: '#1c1917' }}>
                {getPainPointLabel(point)}
              </li>
            ))}
          </ul>
        </div>

        {/* Urgent Action Steps */}
        <h2 style={{ fontSize: '20px', color: '#1c1917', marginTop: '32px' }}>
          🎯 Take These Steps Today:
        </h2>

        <div style={{ backgroundColor: '#f5f5f4', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#059669', marginTop: 0 }}>
            1. Download Your AI Safety Checklist
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            Get the exact testing framework used by companies like OpenAI and Anthropic to prevent AI failures.
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
            2. Review Real AI Failures (Learn From Others' Mistakes)
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            See how Chevrolet lost millions, Air Canada got sued, and DPD went viral for the wrong reasons.
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
            View Failures Database →
          </a>
        </div>

        <div style={{ backgroundColor: '#f5f5f4', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#059669', marginTop: 0 }}>
            3. Implement Basic Guardrails This Week
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            Read our guide on testing AI agents before deployment. Takes 30 minutes to implement.
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

        {/* What's Next */}
        <div style={{ backgroundColor: '#ecfdf5', padding: '20px', borderRadius: '8px', marginTop: '32px' }}>
          <h2 style={{ fontSize: '18px', color: '#1c1917', marginTop: 0 }}>
            📧 What's Coming Next:
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1c1917', marginBottom: '12px' }}>
            Over the next 5 days, I'll send you:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#1c1917' }}>
            <li><strong>Day 2:</strong> The #1 cause of AI failures (and how to prevent it)</li>
            <li><strong>Day 3:</strong> Real case study: How one company avoided a $10M mistake</li>
            <li><strong>Day 4:</strong> 5-minute AI safety audit you can do today</li>
            <li><strong>Day 5:</strong> Emergency response plan for when AI goes wrong</li>
          </ul>
        </div>

        {/* Closing */}
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917', marginTop: '32px' }}>
          I know dealing with AI risk feels overwhelming. That's why I built InspectAgents — to help teams like yours sleep better at night.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Talk soon,<br />
          <strong>The InspectAgents Team</strong>
        </p>

        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', marginTop: '32px' }}>
          P.S. Have questions? Just hit reply — I read every email personally.
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
