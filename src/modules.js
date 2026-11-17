// ZDOS Module Unification Registry
// Central map of all ecosystem components

export const MODULES = {
  core: {
    name: 'ZDOS Core',
    url: 'https://x-zdos.it',
    status: 'active'
  },
  zlang: {
    name: 'Zlang IDE',
    url: 'https://x-zdos.it',
    status: 'active'
  },
  zswap: {
    name: 'ZSwap',
    url: 'https://swap.x-zdos.it',
    status: 'active'
  },
  velvet: {
    name: 'VelvetHub 18+',
    url: 'https://high-cde.github.io/VelvetHub/',
    status: 'active'
  },
  aesir: {
    name: 'Æsir',
    url: 'https://high-cde.github.io/aesir/',
    status: 'active'
  },
  quest: {
    name: 'ZQuest',
    url: 'https://quest.x-zdos.it',
    status: 'active'
  },
  distel: {
    name: 'DisTel-agi Bridge',
    url: 'https://github.com/high-cde/DisTel-agi',
    status: 'active'
  }
};

export function listModules() {
  return Object.values(MODULES).map(m => `${m.name} — ${m.status}`);
}