# Playwright API Test Framework

## Overview
This framework is built with Playwright and TypeScript for automated API testing. It supports environment-based configuration, encrypted secrets, schema validation, and custom helpers for robust API test automation.

## Features
- Environment configuration via `.env` files
- Encrypted secrets using AES-256-CBC
- Custom request/response helpers
- JSON schema validation
- Playwright reporting (HTML)
- GitHub Actions CI integration

## Project Structure
```
my-framework/
├── api-test.config.ts         # Loads environment and config
├── environment-config/        # Env loader, encryption, testdata
│   ├── env.ts
│   ├── encryption.ts
│   ├── testdata.dev.env
│   └── testdata.local.env
├── helpers/                   # API helpers
├── request-payloads/          # Example request bodies
├── response-schemas/          # JSON schemas for validation
├── tests/                     # Test specs
│   └── smokeTests.spec.ts
├── utils/                     # Assertions, logger, fixtures
├── playwright.config.ts       # Playwright config
├── playwright-report/         # HTML reports
└── test-results/              # Test output
```

## Environment Setup
- Create `.env` files in `environment-config/` (e.g., `testdata.dev.env`, `testdata.local.env`).
- Required variables:
  - `BASE_URL`: API base URL
  - `USER_NAME`: Username
  - `PASSWORD`: Encrypted password (see below)
  - `ENCRYPTION_KEY`: Key for encryption/decryption


## Running Tests Locally
Set environment variables and run Playwright:

**PowerShell:**
```sh
$env:NODE_ENV="local"; $env:ENCRYPTION_KEY="MySuperSecretKey1234567890!@#"; npx playwright test
```
**CMD:**
```cmd
set NODE_ENV=local
set ENCRYPTION_KEY=MySuperSecretKey1234567890!@#
npx playwright test
```
**Git Bash:**
```sh
NODE_ENV=local ENCRYPTION_KEY=MySuperSecretKey1234567890!@# npx playwright test
```

## Running Specific Tests
Use Playwright's `--grep` option:
```sh
npx playwright test --grep @VIDEOGAME_API_02
```

## Reporting
- HTML reports are generated in `playwright-report/`.
- Download from GitHub Actions artifacts after CI runs.

## Troubleshooting
- Ensure all required env variables are set.
- Use the correct encryption key for password decryption.
- Check Playwright and Node.js versions for compatibility.