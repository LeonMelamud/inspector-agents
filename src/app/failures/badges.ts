export function getSeverityColor(severity: string) {
  switch (severity) {
    case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Low': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-stone-100 text-stone-800 border-stone-300';
  }
}

export function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    'Hallucination': 'bg-purple-100 text-purple-800',
    'Prompt Injection': 'bg-red-100 text-red-800',
    'Security': 'bg-blue-100 text-blue-800',
    'Bias': 'bg-pink-100 text-pink-800',
    'Jailbreak': 'bg-orange-100 text-orange-800',
    'Misinformation': 'bg-yellow-100 text-yellow-800',
    'Privacy': 'bg-indigo-100 text-indigo-800',
    'Safety': 'bg-red-100 text-red-800'
  };
  return colors[category] || 'bg-stone-100 text-stone-800';
}
