// Curated colour schemes for small first-time businesses.
// Each palette: primary (main brand colour), secondary (supporting),
// accent (buttons/highlights), neutral (backgrounds). The client picks one
// and can then fine-tune any swatch.

export const PALETTES = [
  {
    id: 'fresh-friendly',
    name: 'Fresh & Friendly',
    vibe: 'Cafés, salons, wellness — modern and approachable',
    colors: { primary: '#0D9488', secondary: '#134E4A', accent: '#F97316', neutral: '#FDF6EC' },
  },
  {
    id: 'earthy-handmade',
    name: 'Earthy & Handmade',
    vibe: 'Crafts, florists, farm shops — warm and natural',
    colors: { primary: '#C2703D', secondary: '#7C9070', accent: '#4A3B32', neutral: '#F5EFE6' },
  },
  {
    id: 'clean-professional',
    name: 'Clean & Professional',
    vibe: 'Trades, tutors, consultants — trustworthy and clear',
    colors: { primary: '#1E3A5F', secondary: '#64A8DC', accent: '#33414E', neutral: '#EEF2F5' },
  },
  {
    id: 'warm-bakery',
    name: 'Warm & Homely',
    vibe: 'Bakeries, food, childminders — cosy and inviting',
    colors: { primary: '#6B4226', secondary: '#E9B44C', accent: '#A64253', neutral: '#FFF8EE' },
  },
  {
    id: 'bold-playful',
    name: 'Bold & Playful',
    vibe: 'Events, kids activities, creators — energetic and fun',
    colors: { primary: '#7C3AED', secondary: '#EC4899', accent: '#FACC15', neutral: '#FAF7FF' },
  },
  {
    id: 'coastal-calm',
    name: 'Coastal Calm',
    vibe: 'Holiday lets, therapists, outdoors — relaxed and airy',
    colors: { primary: '#2E6F95', secondary: '#A8DADC', accent: '#5E503F', neutral: '#F1E3CB' },
  },
]

export const COLOR_ROLES = [
  { key: 'primary', label: 'Main colour' },
  { key: 'secondary', label: 'Supporting colour' },
  { key: 'accent', label: 'Highlight colour' },
  { key: 'neutral', label: 'Background' },
]
