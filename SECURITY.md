# Security Policy

## Supported Versions
Only the latest major version is actively supported for security updates.

## Reporting a Vulnerability

Please report security issues directly via email to the core maintainer team. Do not open public issues for severe vulnerabilities. We will respond within 48 hours with a mitigation plan.

### Implemented Defenses
- CSP headers configured for iframe safety.
- Sanitized inputs to prevent XSS.
- No eval() or insecure object injections.
