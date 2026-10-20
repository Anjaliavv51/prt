/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/admin/documents/:path*": ["./vault/documents/**/*"],
  },
};

module.exports = nextConfig;