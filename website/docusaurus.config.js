// @ts-check

const config = {
  title: 'Awesome Database Modelling & Design',
  tagline: 'Learn database modelling with case studies and in-a-hurry guides',
  favicon: 'img/favicon.ico',

  url: 'https://ashishps1.github.io',
  baseUrl: '/awesome-database-modelling-design/',

  organizationName: 'ashishps1',
  projectName: 'awesome-database-modelling-design',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'DB Modelling Learn',
      items: [
        {to: '/in-a-hurry/introduction', label: 'In a hurry', position: 'left'},
        {to: '/path/learning-path', label: 'Learning path', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/ashishps1/awesome-database-modelling-design',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {label: 'Introduction', to: '/in-a-hurry/introduction'},
            {label: 'Schema evolution', to: '/in-a-hurry/schema-evolution'},
            {label: 'Indexing strategy', to: '/in-a-hurry/indexing-strategy'},
          ],
        },
        {
          title: 'Repository',
          items: [
            {label: 'Main README', href: 'https://github.com/ashishps1/awesome-database-modelling-design#readme'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Awesome Database Modelling`,
    },
  },
};

module.exports = config;
