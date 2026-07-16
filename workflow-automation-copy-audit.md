# Wexpro workflow automation copy audit

Date: July 15, 2026
Scope: Copy and messaging only. This audit does not assess page design, layout, typography, animation quality, or implementation.

## Executive verdict

The page understands the problem more clearly than it states the offer.

Its strongest idea is: **experienced operators are acting as the integration layer between systems that do not talk to one another.** That is a real, horizontal operational problem. The controlled-pilot offer is also specific and appropriately low-risk.

The page is currently weaker in four places:

1. **The hero does not identify the category or buyer quickly enough.** The H1 could describe an SOP tool, recorder, project-management product, RPA tool, or consulting service. The full hero clarifies the mechanism, but the H1 alone fails Julian Shapiro's explicit header-only test: a visitor reading only the header should know what is being sold.
2. **The page has multiple competing master narratives.** It alternates among Record / Review / Run, Connect / Run / Scale, and Connect / Record and replace / Scale. Search, social, structured-data, visible-page, and LLM summaries also use different lead promises.
3. **The differentiation is present as a list of capabilities, not a crisp reason to choose Wexpro.** Cross-system execution, human checkpoints, audit logs, authentication, and scale are all claimed by established automation vendors and newer recorder-led products. Wexpro needs to make the combination and buyer consequence explicit.
4. **The strongest claims have the weakest visible substantiation.** The page contains precise production numbers but no named case, denominator, time period, scope, methodology, or link. Precision without context can reduce trust rather than increase it.

This is not a verdict on conversion performance. There is no traffic-source data, conversion data, customer-interview corpus, or message test in the materials reviewed. The recommendations below are evidence-based messaging hypotheses that should be validated with prospects and experiments.

## What the page should position

### The horizontal problem

The problem is not generic “repetitive work.” It is:

> Recurring operational work still requires an experienced person to carry context, checks, and decisions across systems that were never designed to work together. As volume grows, queues and staffing grow with it.

That framing is horizontal because it describes an operational pattern, not an industry. It can apply to finance, customer operations, compliance, onboarding, reporting, and other functions without pretending that every company or task is a fit.

### The primary ICP

“Horizontal” should not mean “for everyone.” The clearest primary reader is:

> A Head, Director, or VP of Operations who owns a recurring, high-volume process that crosses multiple systems and is currently constrained by manual handoffs.

The strongest fit signals are behavioral and operational:

- The process repeats often enough that queue time or staffing is material.
- It crosses several surfaces: browser portals, desktop software, Citrix, files, internal tools, or APIs.
- A routine path exists, but exceptions still require judgment.
- An experienced operator can demonstrate the process.
- The end result can be checked: a record changed, a reconciliation completed, a report prepared, or an exception returned.
- The buyer wants a controlled pilot before production scale.

Secondary audiences should be acknowledged without taking over the hero:

- **Champion / buyer:** operations leader or process owner.
- **Subject-matter user:** operator who demonstrates and reviews the workflow.
- **Technical approver:** IT or security owner evaluating credentials, deployment, data handling, logs, and failure behavior.

Likely poor fits should be stated internally, and perhaps in sales qualification:

- One-off or low-volume tasks.
- Work with no stable routine path.
- Work whose outcome cannot be verified.
- Simple API-to-API automation already handled well by an existing integration tool.
- Processes where nearly every case requires novel human judgment.

### The value proposition

A stronger horizontal value proposition is:

> Automate recurring operations across browser, desktop, Citrix, and APIs from one real demonstration. Review the workflow before it runs, keep human decisions in place, and get evidence from every completed case.

This contains four buyer-relevant elements:

1. **Outcome:** automate recurring operations and return capacity.
2. **Scope:** complete the workflow across systems, including surfaces without conventional integrations.
3. **Mechanism:** start from one real demonstration rather than a full process-document or developer-built flow.
4. **Control:** review the draft, preserve human decisions, and retain evidence.

The page should then establish the business consequence: volume no longer has to translate directly into a longer queue or another staffing cycle.

## Objective scorecard

The ratings below use explicit tests from the cited guides. “Partial” means the information exists but is late, ambiguous, inconsistent, or unsupported.

| Criterion | Rating | Verifiable evidence |
| --- | --- | --- |
| Header identifies what is sold | Fail | “Turn the work your team repeats into a workflow you can run again” does not name automation, a service, a product category, system scope, or a buyer. |
| Audience can self-identify | Partial | Visible copy says “your team,” “operators,” and “your operation.” “Operations teams” appears in `llms.txt`, not in the visible hero. |
| Specific problem is articulated | Pass | The problem section clearly describes disconnected systems, tacit process knowledge, variation, and volume becoming headcount. |
| Primary value is clear | Partial | The hero promises a reusable workflow, but “run again” is a mechanism, not the most valuable buyer outcome. Capacity is explained later. |
| Differentiation is explicit | Partial | Browser, desktop, Citrix, API, review, evidence, and scale are described, but the page never directly explains why this combination is better for the ICP than iPaaS, RPA, a recorder, an agent, or custom integration work. |
| Claims are believable and auditable | Fail | Three precise production claims lack a named case, sample, denominator, period, methodology, or supporting link. |
| Objections are handled | Partial | Documentation, workflow author, human review, execution surfaces, changing inputs, and evidence are covered. Security, credentials, deployment, maintenance, implementation time, commercial model, and integration lead time are not. |
| CTA is specific and consistent | Pass | The “Book a workflow mapping” CTA link is used seven times and leads to a page explaining what the mapping covers. |
| One narrative runs through the page | Fail | Record / Review / Run, Connect / Run / Scale, and Connect / Record and replace / Scale compete with one another. |
| Horizontal positioning is maintained | Partial | Functional examples are horizontal, but “EHRs” and “carrier sites” imply an undeclared healthcare or insurance tilt. |

## Quantitative copy inventory

The HTML `<body>` copy—including responsive-menu variants, accessibility labels, and compact UI labels—contains approximately:

- 1,489 words.
- 1 H1, 6 H2s, 16 H3s, and 50 paragraphs.
- 6 workflow-example cards and 6 FAQ items.
- 7 primary CTA links using “Book a workflow mapping.” The phrase appears once more as a pilot-step heading.
- 38 uses of “workflow” or “workflows.”
- 18 uses of “system” or “systems.”
- 17 visible uses of “Wexpro.”
- 27 uses of “you” or “your.”
- Only 2 visible uses of “automation,” both in objection-oriented contexts; “automate” is not used once.

Length is not inherently a problem. Both Julian and Stripe explicitly reject the idea that all landing-page copy must be short. The issue is that 1,489 words currently carry multiple competing messages while the category, ICP, and dominant promise remain implicit.

## Message consistency audit

The lead message changes by surface:

| Surface | Current lead message |
| --- | --- |
| HTML title | “Connect every system. Run the whole workflow.” |
| Meta description | Connect browser, desktop, Citrix, and private APIs; record, approve, replace, and scale. |
| Open Graph title | “One recorded workflow across browser, desktop, and APIs.” |
| Twitter title | “Connect every system. Run the whole workflow.” |
| Structured-data page name | “Record, review, and run recurring workflows.” |
| Visible H1 | “Turn the work your team repeats into a workflow you can run again.” |
| Hero visual sequence | Record / Review & approve / Run again. |
| Main solution sequence | Connect / Run / Scale. |
| `llms.txt` title | Connect / Record and replace / Scale. |

This is not harmless variation. Each version makes a different idea dominant:

- system connectivity;
- demonstration and recording;
- review and control;
- repeatability;
- replacement;
- scale.

Choose one canonical story and use it everywhere. The clearest version for this product is:

> **Show one real workflow → review the drafted steps and human boundaries → run the approved workflow across every system.**

“Connect” is an enabling capability. “Scale” is a result after the workflow works. Neither needs to replace the central three-step buyer story.

## Section-by-section critique

### 1. Metadata and search/share copy

**What works**

- The meta description is more concrete than the H1. It names browser, desktop, Citrix, private APIs, review, replacement, and scale.
- The page URL clearly names workflow automation.

**What weakens trust or clarity**

- “Connect every system” is an absolute claim. The body later softens it to “if a system is not connected yet, we work with you to bring it online.” Those are not equivalent promises.
- Search, social, structured data, visible copy, and LLM copy disagree about the dominant value proposition.
- The title does not contain “workflow automation,” which is the clearest category term for a solution-aware visitor.

**Recommendation**

Use one defensible title and one canonical description. For example:

> **Workflow automation across browser, desktop, Citrix, and APIs | Wexpro**

> **Show Wexpro one recurring process. Review the drafted workflow and human checkpoints, then pilot the approved path across every system it touches.**

Do not use “every” unless the company is willing to defend it literally.

### 2. Hero

Current H1:

> Turn the work your team repeats into a workflow you can run again.

**What works**

- It is plain language.
- It centers the visitor’s work rather than company history.
- It avoids “agentic,” “orchestration,” and other saturated category jargon.

**What fails the benchmark**

- The H1 alone does not tell the visitor what Wexpro is or what it sells.
- “A workflow you can run again” could mean a saved checklist, SOP, macro, or playbook.
- “You can run” implies the user still performs or initiates the work; the business outcome is not clear.
- The buyer is not identified.
- The differentiating mechanism—one real demonstration across browser, desktop, Citrix, and APIs—is in the paragraph, not the headline.

Current subhead:

> Record one real process as your team moves between web portals and desktop applications. Wexpro maps every handoff into one workflow your team can review, approve, trigger on schedule or by event, and pause wherever a person should decide.

**What works**

- This is the clearest compact explanation of the mechanism on the page.
- It addresses control and human judgment early.

**What to improve**

- The second sentence carries at least five ideas: mapping, review, approval, triggering, and pausing. Stripe’s one-idea-per-sentence advice applies directly.
- It still does not state the business result: returned capacity, shorter queues, or absorbing more volume.
- It omits Citrix and APIs even though those surfaces are major differentiators elsewhere.

**Recommended clarity-first hero**

Eyebrow / fit statement:

> For operations teams whose recurring work crosses disconnected systems

H1:

> Automate recurring work across browser, desktop, Citrix, and APIs—from one real demonstration.

Subhead:

> Show Wexpro one end-to-end process. Review the drafted steps, checks, and human decisions before it runs. Then pilot the approved workflow with evidence from every completed case.

Primary CTA:

> Book a workflow mapping

CTA support:

> Bring one recurring process. No process document required.

This version is a recommendation for a solution-aware visitor. If most traffic is outbound to problem-aware operations leaders, test a pain-led H1 against it:

> Stop using your best operators as the integration layer.

That pain-led version needs the product/category explanation immediately beneath it.

### 3. “Good first workflows” and the workflow finder

**What works**

- The list gives visitors a fast fit test without choosing an industry.
- The six cards describe functional use cases rather than vertical markets.
- Each card makes the workflow concrete by naming input, actions, exceptions, and outcome.
- The workload arithmetic is transparent enough to recalculate.

**What weakens the argument**

- Six use cases appear before the page has fully established the problem, category, or credibility. Stripe recommends moving quickly from the value proposition into the pain when the pain is easy to underestimate.
- The sequence asks the reader to inspect many examples before giving them a strong reason to believe Wexpro can deliver any of them.
- “Capacity returned” looks like a measured result, but the scenarios are hypothetical. Only `llms.txt`, which most visitors will not read, says these are illustrative scenarios rather than customer performance claims.
- The labels jump among operations, finance, reporting, customer ops, onboarding, and compliance. This demonstrates breadth but can also make the page feel like it has six readers instead of one operations owner.

**Arithmetic verification**

| Scenario | Page math | Verification |
| --- | --- | --- |
| Request intake | 30/day × 8 min × 80% | 3.2 hours/day: correct. |
| Reconciliation | 120/week × 6 min × 85% | 10.2 hours/week: correct. |
| Reporting | 6/week × 45 min × 80% | 3.6 hours/week: correct. |
| Customer change | 40/week × 10 min × 75% | 5 hours/week: correct. The baseline is 6 hours 40 minutes, not “six and a half hours.” |
| Onboarding | 15/week × 35 min × 70% | 6.125 hours/week, reasonably rounded to 6.1. |
| Recurring checks | 500/week × 2 min × 95% | 15.833 hours/week, reasonably rounded to 15.8. |

**Recommendation**

- Add a visible label such as “Illustrative capacity model” and explain the formula once.
- Use “potential routine capacity” rather than “capacity returned” until the number is measured in a pilot.
- Keep the examples, but frame them through the one reader: “Common processes operations leaders bring to a first mapping.”
- Consider leading with one complete, evidence-backed example and treating the other five as fit patterns. This is a copy-priority recommendation, not a visual-design recommendation.

### 4. Problem section

Current headline:

> Your best operators should not be the integration layer.

This is the page’s strongest line.

It identifies the buyer’s bad alternative, makes the cost human and operational, and differentiates the problem from generic task automation. It is also more memorable than the current H1.

The four-part problem story is coherent:

1. Systems are disconnected.
2. Process knowledge is tacit.
3. Rigid automation breaks on variation.
4. Volume creates staffing pressure.

The closer is also strong:

> The bottleneck is not knowing what to do. It is needing a person to bridge every system, every time.

**Recommendation**

- Move this argument earlier in the copy narrative, directly after the hero or after a very short fit strip.
- Preserve the distinction between **knowledge** and **execution**. It is one of the few ideas on the page that established enterprise automation vendors do not state as cleanly.
- Replace “manual performances,” which is unnatural, with “manual runs” or “manual executions.”

### 5. Solution introduction

Current headline:

> Connect the systems you already use. Run the outcome you need.

**What works**

- It makes clear that Wexpro works with the existing stack.
- “Run the outcome” attempts to distinguish Wexpro from brittle click replay.

**What is unclear**

- People run a workflow or complete an outcome; “run the outcome” is not natural customer language.
- It changes the central story from Record / Review / Run to Connect / Run / Scale.
- “The integrations are already built—or we build them with you” is an unusually broad promise with no integration inventory, delivery-time range, qualification, or example.
- “EHRs” and “carrier sites” introduce a healthcare/insurance signal that is not carried elsewhere. If Wexpro is staying horizontal, use broadly recognizable system categories unless those are proven customer examples.

**Recommendation**

Use the solution section to explain why the workflow remains end-to-end:

> One approved workflow across the systems the process already uses.

Then make the technical surfaces supporting evidence:

- Browser portals when no API exists.
- Desktop and Citrix when the work lives in installed or virtual applications.
- APIs and internal systems where direct execution is more reliable.

This is more believable than claiming universal connectivity as the headline.

### 6. Run, review, and human control

This is the most persuasive solution content because it addresses the central fear: “Will an agent make uncontrolled changes?”

Strong copy includes:

- “Get the finished outcome, not just access to another system.”
- “Pause for your team only when the case needs judgment.”
- “Define the expected outcome and approve the routine path before it runs at volume.”
- “The workflow waits with the relevant context.”

**Problems to correct**

- “Record every run,” “Review & approve,” and “Human in the loop” are not parallel concepts. One is evidence, one is pre-production governance, and one is runtime exception handling.
- The page uses “review,” “approval,” “human decision,” “human checkpoint,” and “human in the loop” without defining their distinctions.
- “Structured evidence” is abstract. The FAQ is more concrete: what was read, what changed, which checks passed, and what was held.

**Recommendation**

Use three plainly distinct control promises:

1. **Approve before production:** review the drafted steps, checks, and expected result.
2. **Keep judgment human:** pause specific cases with the relevant context.
3. **Verify after every run:** record what was read, changed, passed, and held.

### 7. Scale and proof

Current claims:

- “Run thousands of approved workflows a day.”
- “Thousands of parallel sessions.”
- “99%+ agent completion measured in production.”
- “25–30× cheaper than staff time, measured from a real customer bill.”
- “12 min → 77 sec, one live workflow after self-optimization.”

These are potentially powerful. In their current form they are not auditable from the page or repository.

| Claim | Missing context | Copy risk | Required action |
| --- | --- | --- | --- |
| Thousands of workflows/day | Tested workload, system mix, concurrency, success definition, and whether this is current capacity or architectural capability. | Reads as an absolute scale promise. | Publish the benchmark scope or qualify the claim. |
| 99%+ agent completion | Denominator, sample size, date range, workflow type, eligibility rules, retries, and whether “completion” equals correct business outcome. | A technical metric may be mistaken for customer success or accuracy. | Define the metric and show the measurement base. |
| 25–30× cheaper than staff time | Customer/workflow context, labor-cost basis, Wexpro-cost basis, period, and included implementation/exception costs. | “Cheaper than staff” can sound adversarial and is impossible to reproduce. | Reframe as execution cost or capacity and publish the comparison method. |
| 12 min → 77 sec | Workflow, starting conditions, number of runs, optimization method, approval boundary, and sustained result. | A single best-case result can look cherry-picked. “Self-optimization” may create control anxiety. | Turn it into a short case vignette with method and scope. |

The repo search found these numbers only in the landing page, its `llms.txt`, and the typography audit. That does not show the claims are false; it shows the analyzed materials do not substantiate them.

**Recommended proof format**

Replace floating numbers with a compact, attributable case:

> **Customer portal workflow · [date range]**
> [N] eligible cases across [systems]. [X%] completed the approved routine path without intervention. Median run time fell from [baseline] to [result] after [defined optimization]. Exceptions were returned to operators with [evidence].

If the customer cannot be named, identify the company type, workflow, time period, sample, and method. An anonymized but reproducible result is stronger than an exact number with no context.

### 8. Pilot offer

This section is strong and well matched to an early-stage, service-led sale.

It defines a low-risk sequence:

1. Map one known process.
2. Review the draft and boundaries.
3. Run a controlled pilot and compare it with the manual process.

That sequence is more credible than asking the buyer to commit to “thousands of workflows” immediately.

**Recommendation**

Make the deliverable and decision criteria explicit, but only with facts the team can honor:

- What the buyer leaves the mapping call with.
- Typical call length.
- What data or access is not required on the first call.
- What makes a workflow suitable for a pilot.
- What the pilot measures: completion, time, exceptions, evidence, and operating cost.
- Whether the mapping or pilot is paid.

The demo page already improves expectation-setting with “No process document required” and the list of tools, frequency, checks, and exceptions. Bring a shorter version of that reassurance next to the hero CTA.

### 9. FAQ and objection handling

The current FAQ answers six meaningful objections:

- No existing process documentation is required.
- The operator who knows the work can demonstrate it.
- People can remain in the loop.
- The workflow can cross browser, desktop, files, and APIs.
- Changed inputs do not force blind execution.
- Each run can leave defined evidence.

Missing high-intent objections are:

- How credentials are stored and who can authorize access.
- What data is recorded and retained.
- Where execution runs and what deployment options exist.
- What happens when a portal or desktop UI changes.
- How failed runs, retries, duplicate effects, and rollback are handled.
- How long mapping, integration work, and a pilot typically take.
- What “we build the integration with you” includes.
- Who owns, edits, approves, and versions the workflow.
- Pricing or at least the commercial shape of mapping and pilot work.
- Security and compliance posture.

Do not add generic assurances. Add only answers the product and operating process can prove.

### 10. Final CTA

“Book a workflow mapping” is specific, consistent, and narratively aligned with the controlled-pilot offer. It is better than a generic “Get started” or “Contact sales.”

The final headline is also clear:

> Bring us the workflow your team is ready to stop doing manually.

The improvement is not a new button label. It is clearer expectation-setting around what happens after the click.

## Competitive language check

The category is crowded with the same general promises:

- Tightrope says a recording becomes a working browser automation, includes approval gates, manages authentication, and logs every run.
- Workato says it connects modern and legacy systems, coordinates agents and people, and provides observability, governance, security, and scale.
- Automation Anywhere says it orchestrates AI agents, RPA, APIs, documents, and human expertise across enterprise systems.
- Platonic records work across desktop and browser apps and reconstructs workflows, though it focuses on process intelligence rather than execution.

Therefore, these phrases do not differentiate Wexpro by themselves:

- end-to-end;
- every system;
- human in the loop;
- evidence / audit trail;
- agentic workflow;
- scalable automation;
- connected and controllable.

The differentiated argument must be the **specific combination and consequence**:

> One operator demonstrates the real process across all of its existing surfaces. Wexpro turns the routine path into a reviewable, approved execution, preserves human judgment at named boundaries, and proves the result of every case.

Even that combination overlaps newer recorder-led competitors, so Wexpro ultimately needs one or more defensible proof-backed differentiators, such as:

- materially faster time from demonstration to controlled pilot;
- true browser + desktop + Citrix + API continuity in one workflow;
- a specific reliability or exception-handling advantage;
- lower measured operating cost;
- a done-with-you integration and pilot model;
- a distinctive optimization method with approval controls.

The copy cannot manufacture that differentiation. The company must choose which claim it can prove best.

## Recommended copy architecture

This is a messaging sequence, not a page-design prescription.

1. **Fit statement:** for operations teams with recurring work across disconnected systems.
2. **Hero promise:** automate that work from one real demonstration.
3. **Control reassurance:** review first, preserve human decisions, retain evidence.
4. **Problem:** operators are the integration layer; volume becomes queues and staffing.
5. **Canonical mechanism:** Show → Review → Run.
6. **System coverage:** browser, desktop/Citrix, API/internal systems.
7. **One attributable proof story:** workflow, sample, period, result, exceptions, method.
8. **Additional fit patterns:** request intake, reconciliation, reporting, account changes, onboarding, recurring checks.
9. **Controlled pilot:** inputs, deliverables, comparison criteria, decision to scale.
10. **High-intent objections:** security, credentials, deployment, maintenance, failures, timeline, pricing.
11. **CTA:** book a workflow mapping, with immediate expectation-setting.

## Priority actions

### P0 — Resolve before adding more copy

1. Choose the primary reader: recommend Head / Director / VP of Operations with a high-volume cross-system process.
2. Choose one canonical story: recommend Show → Review → Run.
3. Decide which single differentiator Wexpro can prove better than category peers.
4. Build a source sheet for every numerical or absolute claim.

### P1 — Highest expected clarity and trust impact

1. Rewrite the hero to name automation, system scope, mechanism, and buyer.
2. Move the operator-as-integration-layer problem earlier in the narrative.
3. Turn the production metrics into one contextualized case story.
4. Label the six capacity calculations as illustrative models.
5. Align title, meta, social, structured data, visible page, canvas copy, and `llms.txt` around the same promise.

### P2 — Strengthen evaluation and conversion

1. Separate pre-production approval, runtime human decisions, and post-run evidence.
2. Replace category-generic feature headers with buyer consequences.
3. Add truthful FAQ answers for security, credentials, deployment, UI changes, failures, timeline, and commercial model.
4. Add hero CTA microcopy explaining what the mapping requires and produces.
5. Remove unexplained vertical leakage such as “EHRs” and “carrier sites,” or explicitly present it as an example rather than the product’s center of gravity.

## Validation plan

Copy guidance is not conversion evidence. Validate the rewritten message in this order:

1. **Five-second comprehension test:** ask target operations leaders what Wexpro does, who it is for, and what result it promises after seeing only the hero.
2. **Message interview:** ask 8–10 qualified prospects which problem statement matches their current work, what they call the bad alternative, and which claim creates skepticism.
3. **Proof test:** show the raw metrics versus the contextualized case. Ask what each number means and what information is still needed to believe it.
4. **Offer test:** ask what they expect to happen after “Book a workflow mapping.” Compare their expectation with the actual call.
5. **Traffic-matched A/B test:** test a category-clear hero for solution-aware search traffic and a pain-led hero for problem-aware outbound traffic. Do not mix sources when interpreting the result.
6. **Measure qualified outcomes:** mapping-book rate, qualified-mapping rate, show rate, pilot-fit rate, and pilot-start rate—not only button clicks.

## Sources and benchmark rationale

- [Julian Shapiro, Startup Handbook: Landing Page Copywriting](https://www.julian.com/guide/startup/landing-pages): descriptive hero test, specificity, bad-alternative/value exercise, objection handling, social proof, and CTA continuity.
- [Joanna Wiebe for Stripe Atlas, Writing copy for landing pages](https://stripe.com/guides/atlas/landing-page-copy): customer orientation, one idea per sentence, customer awareness, problem-first narrative, Rule of One, “ideal for,” and So what / Prove it.
- [Unbounce, The Guide to Landing Page Copywriting](https://unbounce.com/landing-page-copywriting/): one page goal, message match, audience-specific value proposition, information hierarchy, objections, proof, and explicit CTA expectations.
- [Copyhackers, USP or Value Proposition](https://copyhackers.com/2013/04/usp-value-proposition/): early-stage companies should clearly state a specific, desirable, differentiated value proposition.
- [CXL, Social Proof](https://cxl.com/blog/is-social-proof-really-that-important/): proof should support the page’s argument and counter real objections rather than provide generic praise.
- [Tightrope](https://tightrope.dev/), [Workato](https://www.workato.com/platform), [Automation Anywhere](https://www.automationanywhere.com/products/agentic-process-automation-system), and [Platonic](https://platonicresearch.com/): current category-language comparison only, not endorsements.
