import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AIHedge Documentation',
  tagline: 'The AI-Powered Decentralized Hedge Fund Protocol',
  favicon: 'img/logo/logo1.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://docs.aihedge.finance',
  baseUrl: '/',

  organizationName: 'aihedge-finance',
  projectName: 'aihedge-doc',

  onBrokenLinks: 'warn',

  markdown: {
    // Treat .md as CommonMark (not MDX) to avoid JSX parse errors in math/LaTeX
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    mermaid: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Serve docs at the site root (/) instead of /docs/
          routeBasePath: '/',
          editUrl: 'https://github.com/aihedge-finance/aihedge-doc/',
        },
        // Blog is disabled — using an external blog system
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/logo/logo2.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'AIHedge Logo',
        src: 'img/logo/logo2.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://aihedge.finance/#how-it-works',
          label: 'How It Works',
          position: 'left',
        },
        {
          href: 'https://aihedge.finance/#curators',
          label: 'Vault Creation',
          position: 'left',
        },
        {
          href: 'https://aihedge.finance/partners',
          label: 'Ecosystem',
          position: 'left',
        },
        {
          href: 'https://aihedge.finance/whitepaper.pdf',
          label: 'Whitepaper',
          position: 'left',
        },
        {
          href: 'https://dapp.aihedge.finance',
          label: 'Launch App',
          position: 'right',
        },
        {
          href: 'https://github.com/aihedge-finance',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'AIHedge Logo',
        src: 'img/logo/logo2.png',
        href: 'https://aihedge.finance',
        width: 160,
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
            {
              label: 'Whitepaper',
              href: 'https://aihedge.finance/whitepaper.pdf',
            },
          ],
        },
        {
          title: 'Protocol',
          items: [
            {
              label: 'How It Works',
              href: 'https://aihedge.finance/#how-it-works',
            },
            {
              label: 'Vault Creation',
              href: 'https://aihedge.finance/#curators',
            },
            {
              label: 'Ecosystem',
              href: 'https://aihedge.finance/partners',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/aihedge-finance',
            },
            {
              label: 'Twitter / X',
              href: 'https://x.com/AIHEDGE_finance',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/aiartinc',
            },
          ],
        },
        {
          title: 'App',
          items: [
            {
              label: 'Launch DApp',
              href: 'https://dapp.aihedge.finance',
            },
            {
              label: 'Main Website',
              href: 'https://aihedge.finance',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AIHedge Finance. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
