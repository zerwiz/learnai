# hejhopp — Home Page & Cloudflare Hosting Plan

## Overview

Build a home page for the `hejhopp` repository and host it at `learn.zerwiz.org` via Cloudflare.

## Goals

- Create a clean, informative home page for the repo
- Host it on Cloudflare at `learn.zerwiz.org`
- Make it a learning resource for AI experimentation

## Steps

### 1. Create the Home Page

- Build an `index.html` file in the repo root
- Include:
  - Project title and description
  - Learning path overview
  - Links to documentation and resources
  - Quick start guide

### 2. Set Up Cloudflare

- Verify DNS for `learn.zerwiz.org`
- Create a CNAME record pointing to the repo (or use Cloudflare Pages)
- Configure SSL/TLS settings
- Test the deployment

### 3. Deploy

- Push the `index.html` to the repo
- Verify the page loads at `learn.zerwiz.org`
- Update the README with hosting info

## Files to Create/Modify

- `index.html` — the home page
- `README.md` — add hosting link
- Cloudflare DNS records

## Notes

- Use static HTML for simplicity
- Keep it lightweight and fast-loading
- Ensure mobile-friendly design
