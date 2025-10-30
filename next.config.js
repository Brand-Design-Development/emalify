/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    staleTimes: {
      dynamic: 60 * 60, // Let tanstack-query handle refetching
    },
  },
};

export default config;
