# Wexpro Labs website

This repository is the source for [wexprolabs.com](https://wexprolabs.com/), a static Cloudflare Pages site.

## Public workflow automation resources

- [AI workflow automation services](https://wexprolabs.com/workflow-automation/)
- [Workflow automation without APIs](https://wexprolabs.com/workflow-automation/without-apis/)
- [Workflow automation pilot metrics and scorecard](https://wexprolabs.com/workflow-automation/pilot-measurement/)
- [Downloadable pilot scorecard](https://wexprolabs.com/downloads/workflow-automation-pilot-scorecard.csv)
- [About Wexpro Labs](https://wexprolabs.com/about/)
- [Privacy notice](https://wexprolabs.com/privacy/)

The site labels hypothetical workload math as illustrative, keeps pilot denominators and exceptions visible, and does not present a customer outcome without an attributable measurement method.

## Verification

Run the dependency-free site gate before deployment:

```sh
python3 scripts/validate_site.py
node --input-type=module --check < functions/api/events.js
node scripts/test_events.mjs
```

Production deployments run the same checks, smoke-test public pages and the first-party event endpoint response, and submit changed canonical pages to IndexNow only after the live smoke passes. A dashboard query is still required to confirm durable event receipt.

The current measurement framework and operating cadence are documented in [SEO_AEO_OPERATING_SYSTEM.md](SEO_AEO_OPERATING_SYSTEM.md).
