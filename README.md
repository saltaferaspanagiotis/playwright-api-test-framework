# Playwright API Test Framework

## Overview
This framework is built with Playwright and TypeScript for automated API testing. It supports environment-based configuration, encrypted secrets, schema validation, and custom helpers for robust API test automation.

## Architecture

### 1. Environment Configuration
- Loads environment variables from `.env`-style files in [`environment-config/`](environment-config/), based on `NODE_ENV`.
- Sensitive values (like passwords) are encrypted and decrypted at runtime using AES-256-CBC ([`encryption.ts`](environment-config/encryption.ts)).

### 2. Test Configuration
- [`api-test.config.ts`](api-test.config.ts) loads and validates environment variables, decrypts secrets, and exposes them via a `config` object.

### 3. Fixtures and Test Context
- [`utils/fixtures.ts`](utils/fixtures.ts) sets up Playwright fixtures:
  - Injects a custom [`RequestHandler`](utils/request-handler.ts) for API calls.
  - Provides the loaded `config`.
  - Fetches and injects an authentication token for tests.

### 4. Request Handling
- [`utils/request-handler.ts`](utils/request-handler.ts) encapsulates all HTTP request logic:
  - Supports path/query parameters, headers, and request bodies.
  - Logs requests and responses.
  - Validates status codes and provides detailed error logs.

### 5. Custom Assertions
- [`utils/assertions.ts`](utils/assertions.ts) extends Playwright’s `expect` with custom matchers:
  - `shouldEqual`, `shouldBeDefined`, `shouldBeLessThanOrEqual`, `shouldMatchSchema`.
  - Assertion errors include recent API logs for easier debugging.

### 6. Schema Validation
- [`utils/schema-validator.ts`](utils/schema-validator.ts) validates API responses against JSON schemas in [`response-schemas/`](response-schemas/).
- Can auto-generate schemas from responses if needed.

### 7. Helpers
- [`helpers/getAccessToken.ts`](helpers/getAccessToken.ts) provides utility functions, such as fetching authentication tokens.

### 8. Test Specs
- [`tests/smokeTests.spec.ts`](tests/smokeTests.spec.ts) contains the actual API test cases, using all the above utilities and fixtures.

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
npx playwright test --grep @smoke
```

## Reporting
- HTML reports are generated in `playwright-report/`.
- Download from GitHub Actions artifacts after CI runs.

## Troubleshooting
- Ensure all required env variables are set.
- Use the correct encryption key for password decryption.
- Check Playwright and Node.js versions for compatibility.