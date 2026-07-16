# Workflow Automation — complete typography inventory

Audited page: `/workflow-automation/` on 2026-07-14. This is an inventory of every HTML text node that participates in the page UI (293 nodes), including decorative symbols, the hidden mobile menu, and the screen-reader-only menu label. It also inventories text drawn into the visible canvas motifs. SEO metadata, `aria-label` attributes, and alt/accessible descriptions are deliberately excluded from the typography tables: they have no rendered font styling.

## Typeface and role system

## Post-port result — 2026-07-14

The workflow page now loads only three type families: Freight Big Pro for display hierarchy, Inter Variable for reading and controls, and IBM Plex Mono for labels and product chrome. The display, reading, label, metric, and compact-product roles live in `public/assets/wexpro-foundations.css`; `workflow-automation.css` consumes those roles rather than introducing another typography layer.

The stylesheet was reduced from 5,463 to 2,955 lines by deleting 338 rules whose class families were absent from both live entrypoints. The unmounted `canvas[data-motif]` renderer, unreferenced workflow-motif runtime, and unused Newsreader/Freight-italic font assets were also removed. The booking surface now has its own stylesheet and script, leaving the workflow page bundle scoped to workflow behavior.

Fresh browser QA recorded three rendered families and 21 base DOM typography signatures after the port (family, size, weight, style, line height, tracking, and transform; color excluded). The remaining small signatures are intentional compact product-chrome and accessibility roles. The exact-motif canvases remain a responsive illustration subscale and render with the same Inter/IBM family contract.

| Role | Family | Desktop metrics | Typical use |
|---|---|---|---|
| Display 1 | Freight Big Pro (fallback: Newsreader, Iowan Old Style, Palatino, Georgia) | 64/67.2, 400, -2.24px tracking | H1 |
| Display 2 | Freight Big Pro | 48/50.4, 400, -1.68px | Section H2s and final CTA |
| Display 3 | Freight Big Pro | 36/37.8, 400, usually -1.08px | Story/chapter headings and bridge copy |
| Title | Freight Big Pro | 24/27.6, 400, -0.48px (workflow-card heads use -0.60px) | Card titles, FAQ questions, pilot steps |
| Lead | Inter Variable | 18/29.7, 400 | Introductory paragraphs |
| Body | Inter Variable | 16/26.4, 400 | Narrative copy, FAQ answers, story body |
| Small body | Inter Variable | 14/21, 400 | Card/definition text |
| Control | Inter Variable | 14/21, 500 | Navigation and button labels |
| Label | IBM Plex Mono | 12/18, 500; tracking varies by component | Section labels, indexes, metadata |
| Diagram UI title/body/meta | Inter or IBM Plex Mono | 10/13, 9/12.15, 8/10.4 | The compact hero workflow illustration |

Primary text is `#171718`; standard secondary text is `#625f63`; violet is `#692fff`; success green is `#177d58`; amber warning copy is `#70481b`. Labels that are uppercase use the text-transform rather than different source copy. At widths of 720px and below, Display 1/2/3/Title become 48px/40px/32px/24px respectively; all other role sizes remain as specified below.

## Typography variation count and register

There are **64 exact DOM typography variations** across the 293 HTML text nodes. A variation is a distinct computed tuple of **font family, font size, font weight, font style, line height, letter spacing, text transform, and color**. Thus, a bold treatment, color change, tracking change, or line-height change counts even when the font family and size match. If only family + size + weight + style are considered, the page has **24 base font variants**.

This count covers the static DOM only. The canvas motifs use responsive JavaScript sizing, so their text does not have one fixed computed CSS tuple; their separate inventory appears at the end of this document.

Abbreviations in the table: `LH` = line height, `LS` = letter spacing, `TT` = text transform. “Use” is representative only; the section inventories below contain every text instance using the variation.

| ID | Nodes | Family | Size / weight / style | LH | LS | TT | Color | Use |
|---:|---:|---|---|---|---|---|---|---|
| 1 | 32 | Inter | 14px / 400 / normal | 21px | normal | none | #625f63 | Workflow cards and solution definitions |
| 2 | 19 | Inter | 14px / 500 / normal | 21px | normal | none | #171718 | Desktop navigation, definition titles |
| 3 | 16 | Inter | 16px / 400 / normal | 26.4px | normal | none | #625f63 | Story, chapter, pilot, FAQ body |
| 4 | 15 | IBM Plex Mono | 12px / 500 / normal | 18px | 0.84px | none | #692fff | Workflow indexes and numbered steps |
| 5 | 13 | Inter | 10px / 500 / normal | 13px | normal | none | #171718 | Hero illustration titles |
| 6 | 12 | IBM Plex Mono | 12px / 500 / normal | 18px | 0.72px | uppercase | #171718 | `Before` / `With Wexpro` labels |
| 7 | 12 | Freight Big Pro | 24px / 400 / normal | 27.6px | -0.60px | none | #171718 | Workflow-card title fragments |
| 8 | 10 | Inter | 9px / 400 / normal | 12.15px | normal | none | #625f63 | Hero illustration metadata |
| 9 | 9 | Freight Big Pro | 24px / 400 / normal | 27.6px | -0.48px | none | #171718 | Pilot titles and FAQ questions |
| 10 | 8 | IBM Plex Mono | 9px / 400 / normal | 12.15px | normal | none | #625f63 | Hero switcher/count labels |
| 11 | 7 | IBM Plex Mono | 8px / 500 / normal | 8px | normal | none | white | Hero application glyphs |
| 12 | 6 | IBM Plex Mono | 12px / 500 / normal | 18px | 0.72px | uppercase | #625f63 | `Capacity returned` |
| 13 | 6 | IBM Plex Mono | 14px / 500 / normal | 21px | -0.35px | none | #171718 | Workload metrics |
| 14 | 6 | IBM Plex Mono | 8px / 400 / normal | 8px | normal | none | #625f63 | Hero completion ticks |
| 15 | 6 | Freight Big Pro | 24px / 400 / normal | 27.6px | -0.60px | none | #692fff | Workflow-card arrows |
| 16 | 6 | Freight Big Pro | 24px / 400 / normal | 27.6px | -0.84px | none | #171718 | Capacity-returned figures |
| 17 | 6 | Freight Big Pro | 48px / 400 / normal | 50.4px | -1.68px | none | #171718 | Section H2s |
| 18 | 6 | Inter | 14px / 500 / normal | 21px | normal | none | white | Primary CTA labels |
| 19 | 6 | Inter | 18px / 400 / normal | 29.7px | normal | none | #625f63 | Section lead paragraphs |
| 20 | 5 | IBM Plex Mono | 12px / 400 / normal | 19.8px | normal | none | #625f63 | `Your systems · …` proof line |
| 21 | 5 | IBM Plex Mono | 12px / 500 / normal | 18px | 1.32px | uppercase | #171718 | Section labels |
| 22 | 5 | Freight Big Pro | 36px / 400 / normal | 37.8px | -1.08px | none | #171718 | Problem-story headings and finder bridge |
| 23 | 4 | IBM Plex Mono | 12px / 500 / normal | 18px | 1.56px | none | #625f63 | Problem-story numbers |
| 24 | 4 | IBM Plex Mono | 12px / 500 / normal | 18px | normal | none | #625f63 | Scale proof captions |
| 25 | 4 | IBM Plex Mono | 8px / 400 / normal | 8px | normal | none | #692fff | Hero arrow/check/status glyphs |
| 26 | 4 | Inter | 16px / 500 / normal | 16px | normal | none | white | CTA arrow glyphs |
| 27 | 3 | IBM Plex Mono | 10px / 400 / normal | 13px | 0.50px | uppercase | #692fff | Hero stage numbers |
| 28 | 3 | IBM Plex Mono | 10px / 500 / normal | 13px | 0.50px | uppercase | #171718 | Hero stage labels |
| 29 | 3 | IBM Plex Mono | 12px / 500 / normal | 18px | 1.56px | uppercase | #625f63 | `01 · Connect` chapter indexes |
| 30 | 3 | IBM Plex Mono | 12px / 500 / normal | 18px | normal | none | #716e70 | Mobile-menu numbers |
| 31 | 3 | IBM Plex Mono | 8px / 400 / normal | 10.4px | normal | none | #625f63 | Hero time metadata |
| 32 | 3 | Freight Big Pro | 18px / 400 / normal | 29.7px | normal | none | #171718 | Scale proof figures |
| 33 | 3 | Freight Big Pro | 24px / 400 / normal | 27.6px | normal | none | #171718 | Mobile navigation links |
| 34 | 3 | Freight Big Pro | 36px / 400 / normal | 37.8px | -1.26px | none | #171718 | Solution chapter headings |
| 35 | 3 | Inter | 14px / 500 / normal | 21px | normal | none | #625f63 | Footer navigation |
| 36 | 2 | IBM Plex Mono | 14px / 500 / normal | 21px | 2.66px | none | #171718 | Header/footer brand |
| 37 | 2 | IBM Plex Mono | 8px / 400 / normal | 10.4px | normal | none | #716e70 | Browser URL bars |
| 38 | 2 | IBM Plex Mono | 8px / 500 / normal | 10.4px | 0.24px | uppercase | #625f63 | Browser/desktop environment subtitles |
| 39 | 2 | IBM Plex Mono | 9px / 500 / normal | 12.15px | 0.72px | uppercase | #692fff | `Browser` / `Desktop` labels |
| 40 | 2 | Freight Big Pro | 16px / 500 / normal | 16px | normal | none | #171718 | Hero summary figures `3` and `1` |
| 41 | 1 | IBM Plex Mono | 12px / 400 / normal | 18px | normal | none | white | Skip link |
| 42 | 1 | IBM Plex Mono | 12px / 500 / normal | 18px | 0.24px | none | #625f63 | Workflow disclaimer |
| 43 | 1 | IBM Plex Mono | 12px / 500 / normal | 18px | 1.20px | uppercase | #171718 | `Good first workflows` |
| 44 | 1 | IBM Plex Mono | 12px / 500 / normal | 18px | 1.44px | uppercase | #625f63 | `Example` label |
| 45 | 1 | IBM Plex Mono | 8px / 400 / normal | 10.4px | 0.32px | uppercase | #70481b | `Human` checkpoint marker |
| 46 | 1 | IBM Plex Mono | 8px / 400 / normal | 10.4px | 0.64px | none | #69616f | Desktop-window controls |
| 47 | 1 | IBM Plex Mono | 8px / 400 / normal | 10.4px | normal | none | #69616f | `ERP Desktop` |
| 48 | 1 | IBM Plex Mono | 8px / 400 / normal | 8px | normal | none | #716e70 | Hero summary `+` |
| 49 | 1 | IBM Plex Mono | 8px / 400 / normal | 8px | normal | none | #a96818 | Warning `!` |
| 50 | 1 | IBM Plex Mono | 8px / 400 / normal | 8px | normal | none | white | Final completion tick |
| 51 | 1 | IBM Plex Mono | 9px / 400 / normal | 12.15px | 0.36px | uppercase | #625f63 | `Triggered by` |
| 52 | 1 | IBM Plex Mono | 9px / 500 / normal | 12.15px | 0.225px | none | #171718 | `Agent follows the handoff` |
| 53 | 1 | Freight Big Pro | 16px / 500 / normal | 16px | normal | none | #115f44 | `Completed` |
| 54 | 1 | Freight Big Pro | 36px / 400 / normal | 37.8px | -0.90px | none | #625f63 | Problem closing statement |
| 55 | 1 | Freight Big Pro | 64px / 400 / normal | 67.2px | -2.24px | none | #171718 | Hero H1 |
| 56 | 1 | Inter | 10px / 400 / normal | 13px | normal | none | #4e4a4f | Hero record caption |
| 57 | 1 | Inter | 10px / 500 / normal | 13px | normal | none | #70481b | Conflict title |
| 58 | 1 | Inter | 10px / 500 / normal | 13px | normal | none | white | Illustration approval button |
| 59 | 1 | Inter | 14px / 400 / normal | 21px | normal | none | #171718 | Run-example paragraph |
| 60 | 1 | Inter | 16px / 400 / italic | 26.4px | normal | none | #625f63 | Solution aside |
| 61 | 1 | Inter | 16px / 400 / normal | 24px | normal | none | #171718 | Screen-reader-only menu label |
| 62 | 1 | Inter | 9px / 400 / normal | 12.15px | normal | none | #70481b | Conflict instruction |
| 63 | 1 | Inter | 9px / 400 / normal | 12.15px | normal | none | #115f44 | Completion metadata |
| 64 | 1 | Inter | 9px / 400 / normal | 12.15px | normal | none | #177d58 | Approval check glyph |

## Global accessibility and header

| Text | Typography |
|---|---|
| `Skip to content` | IBM Plex Mono, 12/18, 400, white. Visually appears only on focus. |
| `WEXPRO LABS` | IBM Plex Mono, 14/21, 500, #171718, 2.66px tracking. |
| `Workflows`; `How it works`; `Start small` | Inter, 14/21, 500, #171718. |
| `Book a workflow mapping` (desktop CTA) | Inter, 14/21, 500, white. |
| `Open navigation` | Inter, 16/24, 400, #171718. Screen-reader-only. |

### Mobile menu (present in DOM; hidden until opened)

| Text | Typography |
|---|---|
| `Workflows`; `How it works`; `Start small` | Freight Big Pro, 24/27.6, 400, #171718. |
| `01`; `02`; `03` | IBM Plex Mono, 12/18, 500, #716e70. |
| `Book a workflow mapping` | Inter, 14/21, 500, white. |
| `→` | Inter, 16/16, 500, white. |

## Hero

### Hero copy and controls

| Text | Typography |
|---|---|
| `Turn the work your team repeats into a workflow you can run again.` | Freight Big Pro, 64/67.2, 400, #171718, -2.24px tracking. |
| `Record one real process as your team moves between web portals and desktop applications. Wexpro maps every handoff into one workflow your team can review, approve, trigger on schedule or by event, and pause wherever a person should decide.` | Inter, 18/29.7, 400, #625f63. |
| `Book a workflow mapping` | Inter, 14/21, 500, white. |
| `See how it works` | Inter, 14/21, 500, #171718. |

### Record / review / run illustration

This is a deliberately independent compact UI scale—not the page reading hierarchy.

| Text group | Typography |
|---|---|
| Stage numbers: `01`; `02`; `03` | IBM Plex Mono, 10/13, 400, violet, 0.5px tracking, uppercase. |
| Stage labels: `Record`; `Review & approve`; `Run again` | IBM Plex Mono, 10/13, 500, #171718, 0.5px tracking, uppercase. |
| Window titles: `Agent recording`; `Workflow draft`; `Read request`; `Match account`; `Update customer record`; `Workflow run`; `New customer request`; `Request read`; `Account matched`; `Record updated` | Inter, 10/13, 500, #171718. |
| Window meta: `live · 03:18`; `4 mapped steps`; `08:31` | IBM Plex Mono, 8/10.4, 400, #625f63. |
| Switcher / count labels: `Chrome`; `Portal`; `ERP`; `Agent steps`; `Human decision` | IBM Plex Mono, 9/12.15, 400, #625f63. |
| Switcher/status glyphs: `→`; `→`; `✓`; `↗` | IBM Plex Mono, 8/8, 400, violet. |
| White application glyphs: `W`; `W`; `E`; `W`; `E` | IBM Plex Mono, 8/8, 500, white. |
| `Agent follows the handoff` | IBM Plex Mono, 9/12.15, 500, #171718, 0.225px tracking. |
| `One workflow mapped across every application` | Inter, 10/13, 400, #4e4a4f. |
| Summary figures: `3`; `1` | Freight Big Pro, 16/16, 500, #171718. |
| Summary divider: `+` | IBM Plex Mono, 8/8, 400, #716e70. |
| Step metadata: `Chrome · customer portal`; `Web · admin portal`; `Desktop · ERP`; `Ready for approval`; `Chrome`; `Web portal`; `Desktop ERP` | Inter, 9/12.15, 400, #625f63. |
| Completion ticks: six `✓` values | IBM Plex Mono, 8/8, 400, #625f63. |
| Warning glyph: `!` | IBM Plex Mono, 8/8, 400, #a96818. |
| `If records conflict` | Inter, 10/13, 500, #70481b. |
| `Pause and ask an operator` | Inter, 9/12.15, 400, #70481b. |
| `Human` | IBM Plex Mono, 8/10.4, 400, #70481b, 0.32px tracking, uppercase. |
| Approval tick: `✓` | Inter, 9/12.15, 400, green. |
| `Approve workflow` | Inter, 10/13, 500, white. |
| `Triggered by` | IBM Plex Mono, 9/12.15, 400, #625f63, 0.36px tracking, uppercase. |
| Final white tick: `✓` | IBM Plex Mono, 8/8, 400, white. |
| `Completed` | Freight Big Pro, 16/16, 500, #115f44. |
| `Evidence saved · 08:32` | Inter, 9/12.15, 400, #115f44. |

### Record sub-panel: browser and desktop labels

| Text | Typography |
|---|---|
| `Browser`; `Desktop` | IBM Plex Mono, 9/12.15, 500, violet, 0.72px tracking, uppercase. |
| `Web portals`; `Installed applications` | IBM Plex Mono, 8/10.4, 500, #625f63, 0.24px tracking, uppercase. |
| `portal.company.com`; `admin.company.com` | IBM Plex Mono, 8/10.4, 400, #716e70. |
| `Customer portal`; `Admin portal`; `Customer record` | Inter, 10/13, 500, #171718. |
| `Read request`; `Match account`; `Update ERP` | Inter, 9/12.15, 400, #625f63. |
| `01`; `02`; `03` (step IDs) | IBM Plex Mono, 9/12.15, 400, #625f63. |
| App glyph `W`; app glyph `E` | IBM Plex Mono, 8/8, 500, white. |
| `ERP Desktop` | IBM Plex Mono, 8/10.4, 400, #69616f. |
| `— □ ×` | IBM Plex Mono, 8/10.4, 400, #69616f, 0.64px tracking. |

### Capability strip

| Text | Typography |
|---|---|
| `Good first workflows` | IBM Plex Mono, 12/18, 500, #171718, 1.2px tracking, uppercase. |
| `Request intake`; `Account changes`; `Reporting`; `Reconciliation`; `Onboarding`; `Recurring checks` | Inter, 14/21, 400, #625f63. |

## Find your workflow

| Text group | Typography |
|---|---|
| `Find your workflow` | IBM Plex Mono, 12/18, 500, #171718, 1.32px tracking, uppercase. |
| `Which workflow is slowing your team down?` | Freight Big Pro, 48/50.4, 400, #171718, -1.68px. |
| `Start with work that repeats, crosses tools, follows recognizable checks, and ends in a result you can verify.` | Inter, 18/29.7, 400, #625f63. |
| `01 / OPERATIONS`; `02 / FINANCE`; `03 / REPORTING`; `04 / CUSTOMER OPS`; `05 / ONBOARDING`; `06 / COMPLIANCE` | IBM Plex Mono, 12/18, 500, violet, 0.84px tracking. |
| Card headlines: `Inbox request → CRM updated`; `Invoice or order → systems reconciled`; `Weekly exports → checked client brief`; `Approved customer change → records updated`; `New client → systems ready`; `Recurring check → exception queue` | Freight Big Pro, 24/27.6, 400, #171718, -0.60px. Each arrow alone is violet at the same metrics. |
| Card description and “before/with Wexpro” explanations | Inter, 14/21, 400, #625f63: `Read the request, find the account, apply the checks, and update the routine case.`; `Four staff hours spent reading, matching, and updating.`; `Routine requests complete across inbox and CRM; unclear matches return with context.`; `Read the source, match related records, validate totals, and leave proof.`; `Twelve hours spent re-keying and comparing totals.`; `Clean matches reconcile across systems; mismatches and approvals are held.`; `Pull current data, reconcile totals, prepare the brief, and run final checks.`; `Four and a half hours gathering, checking, and formatting.`; `The reviewed brief is prepared across sources; gaps wait for context.`; `Read the request, find the customer, update connected records, and leave an audit trail.`; `Six and a half hours searching, copying, and verifying.`; `Approved changes update every system; conflicts stop for review.`; `Collect approved details, create records, check required fields, and flag gaps.`; `Nearly nine hours copying approved details across tools.`; `Standard setups complete across tools; missing access or fields return.`; `Review scheduled sources, verify expected conditions, and log the result.`; `Nearly 17 hours repeating checks when little changed.`; `Expected cases are checked and logged; only changes reach the team.` |
| `Before`; `With Wexpro` (six repetitions each) | IBM Plex Mono, 12/18, 500, #171718, 0.72px tracking, uppercase. |
| `30 requests/day × 8 min`; `120 records/week × 6 min`; `6 reports/week × 45 min`; `40 changes/week × 10 min`; `15 clients/week × 35 min`; `500 checks/week × 2 min` | IBM Plex Mono, 14/21, 500, #171718, -0.35px. |
| `Capacity returned` (six repetitions) | IBM Plex Mono, 12/18, 500, #625f63, 0.72px tracking, uppercase. |
| `If 80% follow the routine path.`; `If 85% are clean matches.`; `If 80% need no follow-up.`; `If 75% follow the standard path.`; `If 70% are standard setups.`; `If 95% are unchanged.` | Inter, 14/21, 500, #171718. |
| `3.2 staff hours/day`; `10.2 staff hours/week`; `3.6 staff hours/week`; `5 staff hours/week`; `6.1 staff hours/week`; `15.8 staff hours/week` | Freight Big Pro, 24/27.6, 400, #171718, -0.84px. |
| `Illustrative workload math, not customer performance claims. A pilot replaces these assumptions with your volume, time per run, routine rate, and completion data.` | IBM Plex Mono, 12/18, 500, #625f63, 0.24px tracking. |
| `Don’t see yours? Show us the process and we’ll map it with you.` | Freight Big Pro, 36/37.8, 400, #171718, -1.08px. |
| `Book a workflow mapping`; `→` | Inter 14/21, 500, white; arrow is Inter 16/16, 500, white. |

## The problem

| Text group | Typography |
|---|---|
| `The problem` | IBM Plex Mono, 12/18, 500, #171718, 1.32px tracking, uppercase. |
| `Your best operators should not be the integration layer.` | Freight Big Pro, 48/50.4, 400, #171718, -1.68px. |
| `The process is known. But every new request still needs a person to carry it across systems that do not talk to each other.` | Inter, 18/29.7, 400, #625f63. |
| `01`; `02`; `03`; `04` | IBM Plex Mono, 12/18, 500, #625f63, 1.56px tracking. |
| `Every system is its own island.`; `The process lives in experienced operators’ heads.`; `Rigid automation breaks on variation.`; `Volume becomes headcount.` | Freight Big Pro, 36/37.8, 400, #171718, -1.08px. |
| `People move the same context through inboxes, documents, portals, spreadsheets, desktop apps, and APIs.`; `Checks and exception rules are hard to capture in a static SOP or hand to a new hire.`; `A macro can replay clicks but cannot preserve the intended result when real inputs change.`; `More requests create more manual performances, longer queues, and more pressure to hire.` | Inter, 16/26.4, 400, #625f63. |
| `The bottleneck is not knowing what to do. It is needing a person to bridge every system, every time.` | Freight Big Pro, 36/37.8, 400, #625f63, -0.90px. |

## The solution / How it works

| Text group | Typography |
|---|---|
| `The solution` | IBM Plex Mono, 12/18, 500, #171718, 1.32px tracking, uppercase. |
| `Connect the systems you already use. Run the outcome you need.` | Freight Big Pro, 48/50.4, 400, #171718, -1.68px. |
| `Wexpro works across the portals, desktop software, and APIs your operation already depends on—then completes the workflow with a record your team can review.` | Inter, 18/29.7, 400, #625f63. |
| `Bring us the systems and the workflow. If an integration is not already available, we connect it with you—then keep every run visible and controllable.` | Inter italic, 16/26.4, 400, #625f63. |
| `Connected on your terms`; `agent completion measured in production`; `cheaper than staff time, measured from a real customer bill`; `one live workflow after self-optimization` | IBM Plex Mono, 12/18, 500, #625f63. |
| `01 · Connect`; `02 · Run`; `03 · Scale` | IBM Plex Mono, 12/18, 500, #625f63, 1.56px tracking, uppercase. |
| `The integrations are already built—or we build them with you.`; `One request runs the whole workflow.`; `Run thousands of approved workflows a day.` | Freight Big Pro, 36/37.8, 400, #171718, -1.26px. |
| The three chapter paragraphs | Inter, 16/26.4, 400, #625f63: `Wexpro connects the systems your team already works in: customer portals, EHRs, CRMs, carrier sites, desktop software, and internal tools. If a system is not connected yet, we work with you to bring it online.`; `Get the finished outcome, not just access to another system. Wexpro carries the work across every connected application, returns structured evidence, and pauses for your team only when the case needs judgment.`; `Wexpro keeps approved sessions authenticated and fans work out across thousands of parallel runs. Volume becomes a larger agent fleet—not a longer queue or another staffing cycle—and every completed workflow leaves evidence behind.` |
| Definition titles: `Browser`; `Desktop & Citrix`; `APIs & internal systems`; `Record every run`; `Review & approve`; `Human in the loop`; `Always authenticated`; `Thousands of parallel sessions` | Inter, 14/21, 500, #171718. |
| Definition descriptions | Inter, 14/21, 400, #625f63: `Web portals and browser-based software, worked the way your staff already work them.`; `Windows, Linux, and virtual desktops—agents drive the full computer when the work lives there.`; `Use existing APIs where they are available, or connect the system behind the workflow with you.`; `See what was read, what changed, and the evidence behind the completed result.`; `Define the expected outcome and approve the routine path before it runs at volume.`; `Add a checkpoint wherever judgment belongs. The workflow waits with the relevant context.`; `Keep approved credentials secure, sessions warm between runs, and re-authenticate when a system expires them.`; `Fan work out across browser, desktop, Citrix, and API systems at once so a volume spike does not become a longer queue.` |
| `Your systems`; `·`; `one connected workflow`; `·`; `one accountable result` | IBM Plex Mono, 12/19.8, 400, #625f63. |
| `Example` | IBM Plex Mono, 12/18, 500, #625f63, 1.44px tracking, uppercase. |
| `For a customer change, Wexpro matches the request, updates the right records, and returns proof of what changed. Missing information or conflicting records stop with the context an operator needs.` | Inter, 14/21, 400, #171718. |
| `99%+`; `25–30×`; `12 min → 77 sec` | Freight Big Pro, 18/29.7, 400, #171718. |

## Start small

| Text | Typography |
|---|---|
| `Start small` | IBM Plex Mono, 12/18, 500, #171718, 1.32px tracking, uppercase. |
| `Start with one workflow your team already knows how to show.` | Freight Big Pro, 48/50.4, 400, #171718, -1.68px. |
| `01`; `02`; `03` | IBM Plex Mono, 12/18, 500, violet, 0.84px tracking. |
| `Book a workflow mapping.`; `Review the draft.`; `Run a controlled pilot.` | Freight Big Pro, 24/27.6, 400, #171718, -0.48px. |
| `Bring the task, tools, frequency, volume, and common exceptions.`; `Confirm the steps, checks, expected result, and human boundaries.`; `Approve a limited replay, compare it with the manual process, and decide whether to scale.` | Inter, 16/26.4, 400, #625f63. |
| `Book a workflow mapping`; `→` | Inter, 14/21, 500, white; arrow is Inter, 16/16, 500, white. |

## Questions

| Text group | Typography |
|---|---|
| `Questions` | IBM Plex Mono, 12/18, 500, #171718, 1.32px tracking, uppercase. |
| `Know what Wexpro learns—and what stays in your control.` | Freight Big Pro, 48/50.4, 400, #171718, -1.68px. |
| `The first output is a draft for review, not an automation running on its own.` | Inter, 18/29.7, 400, #625f63. |
| `01`; `02`; `03`; `04`; `05`; `06` | IBM Plex Mono, 12/18, 500, violet, 0.84px tracking. |
| `Do I need to document the process first?`; `Can anyone on the team build one?`; `Can a person stay in the loop?`; `Where can one workflow run?`; `What happens when an input changes?`; `What evidence does each run leave?` | Freight Big Pro, 24/27.6, 400, #171718, -0.48px. |
| FAQ answers | Inter, 16/26.4, 400, #625f63: `No. Start by performing one real workflow. Wexpro uses the demonstration to draft the steps, checks, and exception path.`; `Anyone who knows the work can demonstrate it. Wexpro drafts the reusable workflow; your team reviews and approves what it learned.`; `Yes. Add an approval or review checkpoint wherever judgment belongs. The run waits and returns the relevant context.`; `Across browser tabs, desktop apps, files, and connected APIs. The handoffs stay together instead of becoming separate automations.`; `The workflow applies the approved checks. If it cannot confirm the intended result, it stops that case and returns it with context.`; `The pilot defines what should be recorded: what was read, what changed, which checks passed, and what was held for review.` |

## Final call to action and footer

| Text | Typography |
|---|---|
| `Bring us the workflow your team is ready to stop doing manually.` | Freight Big Pro, 48/50.4, 400, #171718, -1.68px. |
| `Walk us through one real run. We’ll map how it becomes a workflow you can review, approve, and run with confidence.` | Inter, 18/29.7, 400, #625f63. |
| `Book a workflow mapping`; `→` | Inter, 14/21, 500, white; arrow is Inter, 16/16, 500, white. |
| Footer `WEXPRO LABS` | IBM Plex Mono, 14/21, 500, #171718, 2.66px tracking. |
| Footer `Workflows`; `How it works`; `Start small` | Inter, 14/21, 500, #625f63. |
| `samin@wexprolabs.com` | Inter, 14/21, 500, #171718. |

## Canvas-rendered text (visible, but not DOM text)

The page’s solution diagrams are canvases. Their font metrics are responsive to canvas dimensions; they do not have a fixed CSS computed size. In the source, functional canvas text uses Inter (`text`: commonly 8–12px, 450–650) and labels/statuses use IBM Plex Mono (`mono`/callout helpers: commonly 5–9px, 500, often uppercase). The bundled main motifs also draw the following text:

| Motif | Text inventory |
|---|---|
| Connect main | `Browser portal`; `Browser`; `CRM`; `Desktop app`; `Records`; `Desktop app`; `Wexpro job`; `One approved run`; `Approved`; `Systems ready`. |
| Run main | `Wexpro job`; `One request`; `Approval checkpoint`; `Optional · human`; `The workflow`; `Log in`; `Read request`; `Apply checks`; `Update records`; and status text that resolves to either `Every run recorded` or `Step 1/4 · recorded` through `Step 4/4 · recorded`. |
| Scale main | `Authenticated fleet`; `Sessions warm`; `1,000s / day`; `Approved`; `Workflow`; `AUTH`; `EXECUTE`; `OPTIMIZE`; `W`; repeated `API` labels for API nodes. |
| Small connect/run motifs | The shapes are primarily iconographic; the visible text is produced by the shared callout helpers above rather than additional DOM labels. |

The static file `public/assets/asteroid-runtime/wexpro-workflow-motifs.js` contains an older, unmounted canvas implementation; it is not loaded by this page and is intentionally not counted in the live page inventory.
