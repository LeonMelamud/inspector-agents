/**
 * Welcome email for LOW RISK users
 * Sent immediately after quiz completion
 */

interface WelcomeLowRiskProps {
  firstName: string;
  topPainPoints: string[];
}

export default function WelcomeLowRisk({ firstName, topPainPoints }: WelcomeLowRiskProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#22c55e', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>
          ✅ You're Doing Great with AI Safety
        </h1>
      </div>

      {/* Body */}
      <div style={{ padding: '32px', backgroundColor: '#ffffff' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Hi {firstName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Thanks for taking the AI Risk Assessment. Great news — <strong>your AI practices are in good shape!</strong>
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          You're ahead of 85% of teams when it comes to AI safety awareness. But as you know, the AI landscape changes fast. Let's make sure you stay ahead.
        </p>

        {/* Areas for Improvement */}
        {topPainPoints.length > 0 && (
          <div style={{ backgroundColor: '#ecfdf5', padding: '20px', borderRadius: '8px', margin: '24px 0' }}>
            <h2 style={{ fontSize: '18px', color: '#1c1917', marginTop: 0 }}>
              🎯 Keep an Eye On:
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {topPainPoints.slice(0, 3).map((point, index) => (
                <li key={index} style={{ fontSize: '16px', lineHeight: '1.8', color: '#1c1917' }}>
                  {getPainPointLabel(point)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resources */}
        <h2 style={{ fontSize: '20px', color: '#1c1917', marginTop: '32px' }}>
          📚 Resources to Stay Sharp:
        </h2>

        <div style={{ backgroundColor: '#f5f5f4', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#059669', marginTop: 0 }}>
            1. AI Safety Checklist
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            Even if you're doing well, this checklist helps catch edge cases and new attack vectors.
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
            2. AI Failures Database
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            Stay updated on the latest AI incidents. Learn what's happening in the wild so you can prevent it.
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
            Browse Database →
          </a>
        </div>

        <div style={{ backgroundColor: '#f5f5f4', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#059669', marginTop: 0 }}>
            3. Advanced Testing Techniques
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', margin: 0 }}>
            Go beyond the basics. Learn advanced strategies for adversarial testing and edge case discovery.
          </p>
          <a 
            href="https://inspectagents.com/blog/advanced-ai-testing" 
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
            Read Advanced Guide →
          </a>
        </div>

        {/* What's Next */}
        <div style={{ backgroundColor: '#fffbeb', padding: '20px', borderRadius: '8px', marginTop: '32px' }}>
          <h2 style={{ fontSize: '18px', color: '#1c1917', marginTop: 0 }}>
            📧 What You'll Get From Us:
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1c1917', marginBottom: '12px' }}>
            Since you're already ahead of the curve, I'll keep it light:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#1c1917' }}>
            <li>Weekly roundup of new AI incidents (so you stay informed)</li>
            <li>Advanced techniques and edge cases from the field</li>
            <li>Industry trends and emerging risks</li>
            <li>Early access to new tools and resources</li>
          </ul>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', marginTop: '12px' }}>
            <em>No spam, no fluff. Just the good stuff.</em>
          </p>
        </div>

        {/* Closing */}
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917', marginTop: '32px' }}>
          Keep up the great work! It's rare to see teams taking AI safety seriously from day one.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1c1917' }}>
          Stay safe out there,<br />
          <strong>The InspectAgents Team</strong>
        </p>

        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#57534e', marginTop: '32px' }}>
          P.S. Got questions about specific edge cases? Reply to this email — we love geeking out about AI safety.
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
