/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // SVG Configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false
                  }
                }
              }
            ]
          }
        }
      }]
    });

    return config;
  },
  // Add output option to reduce the risk of module not found errors
  output: 'standalone',
};

export default nextConfig;
