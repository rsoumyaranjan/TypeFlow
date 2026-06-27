# Data Privacy & Safety Posture Specification
## Project: TypeFlow (Phase 1 MVP)

**Last updated**: 2026-06-07  
**Author**: Data Privacy / Safety Reviewer  
**Status**: Draft (Sprint 1 Specs)

---

## 1. Zero-Telemetry & Client-Side Stance

TypeFlow is built on a **Zero-Telemetry Principle**. We do not collect, process, or sell any user information.

* **No Accounts**: Users do not create profiles, provide email addresses, or log in with third-party providers (Google/Clever).
* **No Database Servers**: All session history, words typed, WPM records, and configuration settings are processed on the user's local hardware and persisted only in browser memory structures (**LocalStorage** and **IndexedDB**).
* **No Tracking Pixels**: The website contains no advertising trackers, analytics trackers (e.g., Google Analytics, Facebook Pixel), or marketing beacons.
* **Open-Source Auditable**: The code is hosted in public repositories allowing anyone to audit the build for tracking leaks.

---

## 2. Compliance Mapping (GDPR & COPPA)

Because TypeFlow collects **zero Personal Data** or **Personally Identifiable Information (PII)**, compliance with international privacy regulations is simple:

### A. COPPA (Children's Online Privacy Protection Act)
* **Rule**: Websites targeting children under 13 cannot collect PII (names, emails, geolocations, IP addresses) without parental consent.
* **TypeFlow Stance**: Fully compliant. Since TypeFlow bypasses authentication and stores all data in the client browser, we never see, collect, or transmit a child's IP address or credentials. It is 100% safe for classroom use.

### B. GDPR (General Data Protection Regulation)
* **Rule**: Requires clear consent, right to access, and right to be forgotten for EU residents' personal data.
* **TypeFlow Stance**: Fully compliant.
  * **Right to Access**: Users can download a full JSON backup of their database directly from the **Progress Page** with one click.
  * **Right to Be Forgotten**: Users can click the "Reset/Delete All Local Data" button on the **Progress Page** to instantly erase all IndexedDB tables and LocalStorage caches.
  * **No Consent Banner Needed**: Since we do not use tracking cookies (we only use LocalStorage/IndexedDB for essential app functionality, which is exempt under ePrivacy Directive rules), a cookie consent banner is legally not required, keeping the UI clean.

---

## 3. Storage Vulnerability Auditing

As an MVP operating on client-side storage, we must protect data from scripting attacks:

### Mitigations:
1. **No External CDN Scripts**: All dependencies (React, Lucide, Dexie) must be bundled locally inside the Vite build rather than loaded from public CDNs. This prevents Man-in-the-Middle (MITM) scripts from reading the IndexedDB data.
2. **HTML Sanitization**: Custom text practice input must be sanitized before rendering to prevent Cross-Site Scripting (XSS) attacks from harvesting browser memory.
3. **No Auth Token Storage**: Since we do not use logins, there are no JWT tokens or access keys sitting in LocalStorage, removing the risk of credential hijacking.
