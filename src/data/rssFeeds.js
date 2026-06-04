export const RSS_FEEDS = [
  // CVE
  { id: 'cve',          label: 'CVE Feed',            url: 'https://cvefeed.io/rssfeed/latest.xml',                                  color: '#f54b4b', tag: 'CVE',           category: 'CVE'           },
  // Cybersécurité
  { id: 'htb-blue',     label: 'HTB Blue Team',        url: 'https://www.hackthebox.com/rss/blog/blue-teaming',                       color: '#4b9ef5', tag: 'Blue Team',     category: 'Cybersécurité' },
  { id: 'htb-red',      label: 'HTB Red Team',         url: 'https://www.hackthebox.com/rss/blog/red-teaming',                        color: '#f54b4b', tag: 'Red Team',      category: 'Cybersécurité' },
  { id: 'datasecbreach',label: 'Data Security Breach', url: 'https://www.datasecuritybreach.fr/feed/',                                color: '#f5a623', tag: 'Sécurité',      category: 'Cybersécurité' },
  { id: 'lmi-securite', label: 'LMI Sécurité',         url: 'https://www.lemondeinformatique.fr/flux-rss/thematique/securite/rss.xml', color: '#9b59f5', tag: 'Sécurité',      category: 'Cybersécurité' },
  // IT
  { id: 'lmi-reseaux',  label: 'LMI Réseaux',          url: 'https://www.lemondeinformatique.fr/flux-rss/thematique/reseaux/rss.xml',  color: '#00e5a0', tag: 'Réseaux',       category: 'IT'            },
  { id: 'lmi-virt',     label: 'LMI Virtualisation',   url: 'https://www.lemondeinformatique.fr/flux-rss/thematique/virtualisation/rss.xml', color: '#00e5a0', tag: 'Virtualisation', category: 'IT'       },
  { id: 'korben',       label: 'Korben',                url: 'https://korben.info/feed',                                               color: '#e5c300', tag: 'IT',            category: 'IT'            },
]

export const RSS_CATEGORIES = ['CVE', 'Cybersécurité', 'IT']
