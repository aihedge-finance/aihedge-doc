import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import packageJson from './package.json';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AI Hedge Documentation',
  tagline: 'The AI-Powered Decentralized Hedge Fund Protocol',
  favicon: 'img/logo/logo1.png',

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    },
  ],

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
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    mermaid: true,
  },

  clientModules: [
    './src/clientModules/formbricks.ts',
  ],

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
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          path: 'letters',
          routeBasePath: 'letters',
          blogTitle: 'Letters to Partners',
          blogDescription:
            'Periodic founder letters on AI Hedge philosophy, strategy performance, risk management, and protocol evolution.',
          postsPerPage: 'ALL',
          blogSidebarTitle: 'All Letters',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          feedOptions: {
            type: ['rss', 'atom'],
            title: 'AI Hedge — Letters to Partners',
            description:
              'Annual and quarterly founder letters to partners, users, and the AI Hedge community.',
            copyright: `Copyright © ${new Date().getFullYear()} AI Hedge Finance.`,
            language: 'en',
          },
        },
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
        alt: 'AI Hedge Logo',
        src: 'img/logo/logo2-light.png',
        srcDark: 'img/logo/logo2.png',
        href: 'https://aihedge.finance',
        target: '_self',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/ai-agents/overview',
          label: 'AI Agent',
          position: 'left',
        },
        {
          to: '/developers/overview',
          label: 'Developers',
          position: 'left',
        },
        {
          to: '/letters',
          label: 'Letter to Partners',
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
        {
          type: 'html',
          position: 'right',
          value: `<span class="badge badge--secondary" style="font-family: monospace; font-size: 0.8rem; font-weight: 600; padding: 0.25rem 0.5rem; margin-left: 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">v${packageJson.version}</span>`,
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'AI Hedge Logo',
        src: 'img/logo/logo2-light.png',
        srcDark: 'img/logo/logo2.png',
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
              label: 'Letters to Partners',
              to: '/letters',
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
            /*
            // Hidden for now — uncomment when Vault Creation is ready:
            {
              label: 'Vault Creation',
              href: 'https://aihedge.finance/#curators',
            },
            */
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
      copyright: `Copyright © ${new Date().getFullYear()} AI Hedge Finance. Built with Docusaurus (v${packageJson.version}).`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
