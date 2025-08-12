// This file configures redirects for Netlify deployment

module.exports = async () => {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'query',
          key: 'authorized',
        },
      ],
      destination: '/api/authorized',
      permanent: false,
    },
    {
      source: '/:path*',
      missing: [
        {
          type: 'cookie',
          key: 'authorized',
        },
      ],
      destination: '/api/login',
      permanent: false,
    },
  ];
};