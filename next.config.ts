const nextConfig = {
  // ... other config
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' https://www.youtube.com https://s.ytimg.com;
              frame-src https://www.youtube.com;
              connect-src 'self';
              img-src 'self' https://i.ytimg.com data:;
              style-src 'self' 'unsafe-inline';
              media-src 'self' https://www.youtube.com;
            `.replace(/\s+/g, " "),
          },
        ],
      },
    ];
  },
};
