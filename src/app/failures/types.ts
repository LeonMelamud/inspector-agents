export interface AIFailure {
  id: string;
  title: string;
  company: string;
  date: string;
  category: 'Hallucination' | 'Prompt Injection' | 'Security' | 'Bias' | 'Jailbreak' | 'Misinformation' | 'Privacy' | 'Safety';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  impact: string;
  cost?: string;
  source: string;
  sourceUrl: string;
  prevention: string[];
}
