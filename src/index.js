// DisTel-agi — ZDOS Unified Platform Bridge
// Full announcement sync: Discord ↔ Telegram ↔ X
// Module unification support

import 'dotenv/config';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { Telegraf } from 'telegraf';

console.log('ZDOS DisTel-agi bridge starting...');

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const telegram = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ——— Configuration ———
const ANNOUNCE_PREFIX = '[ZDOS]';
const SYNC_MODE = process.env.SYNC_MODE || 'announcements';

// ——— Sync Core ———
async function syncAnnouncement(source, content, options = {}) {
  if (!content || content.length < 3) return;
  const message = `${ANNOUNCE_PREFIX} ${content}`;

  console.log(`[SYNC:${source}] ${message.slice(0, 100)}`);

  // Discord → Telegram + X
  if (source === 'discord' && process.env.TELEGRAM_CHANNEL_ID) {
    try {
      await telegram.telegram.sendMessage(process.env.TELEGRAM_CHANNEL_ID, message);
    } catch (e) { console.error('TG send failed', e.message); }
  }

  // Telegram → Discord + X
  if (source === 'telegram' && process.env.DISCORD_ANNOUNCE_CHANNEL_ID) {
    try {
      const channel = await discord.channels.fetch(process.env.DISCORD_ANNOUNCE_CHANNEL_ID);
      if (channel?.isTextBased()) await channel.send(message);
    } catch (e) { console.error('Discord send failed', e.message); }
  }

  // X webhook (if configured)
  if (process.env.X_WEBHOOK_URL) {
    try {
      await fetch(process.env.X_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message.slice(0, 280) })
      });
    } catch (e) { console.error('X webhook failed', e.message); }
  }
}

// ——— Discord Events ———
discord.once(Events.ClientReady, (c) => {
  console.log(`Discord ready as ${c.user.tag}`);
});

discord.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot) return;
  if (SYNC_MODE === 'announcements' && !msg.content.startsWith('!announce')) return;

  const content = msg.content.replace('!announce ', '').trim();
  await syncAnnouncement('discord', content);
});

// ——— Telegram Events ———
telegram.start((ctx) => ctx.reply('ZDOS DisTel-agi online. Sovereign bridge active.'));

telegram.on('text', async (ctx) => {
  if (ctx.chat.id.toString() !== process.env.TELEGRAM_CHANNEL_ID) return;
  if (ctx.message.text.startsWith(ANNOUNCE_PREFIX)) return; // prevent loop

  await syncAnnouncement('telegram', ctx.message.text);
});

// ——— Module Unification Status ———
const MODULES = {
  zlang: 'https://x-zdos.it',
  zswap: 'https://swap.x-zdos.it',
  velvet: 'https://high-cde.github.io/VelvetHub/',
  aesir: 'https://high-cde.github.io/aesir/',
  quest: 'https://quest.x-zdos.it'
};

console.log('Modules registered:', Object.keys(MODULES).join(', '));

// ——— Start ———
if (process.env.DISCORD_TOKEN) {
  discord.login(process.env.DISCORD_TOKEN);
} else {
  console.warn('DISCORD_TOKEN missing');
}

if (process.env.TELEGRAM_BOT_TOKEN) {
  telegram.launch();
} else {
  console.warn('TELEGRAM_BOT_TOKEN missing');
}

console.log('DisTel-agi full sync layer active.');
process.once('SIGINT', () => telegram.stop('SIGINT'));
process.once('SIGTERM', () => telegram.stop('SIGTERM'));