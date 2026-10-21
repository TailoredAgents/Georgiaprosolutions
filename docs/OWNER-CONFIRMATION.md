# Business confirmation before official launch

The preview intentionally avoids biographies, business age, ratings, guarantees, insurance claims, staff counts, pricing, and an assumed coverage radius. All items below are confirmation points, not established business facts.

| Item                     | Present treatment                                    | Owner confirmation needed                                               |
| ------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Legal name               | Georgia Pro Solutions LLC, supplied in the brief     | Correct legal/public-facing name                                        |
| Main phone               | (478) 484-7213, supplied in the brief                | Current number; permission for public call links                        |
| Base                     | Allentown, Georgia, supplied in the brief            | Correct base and whether a public street address should be shown        |
| Service area             | Ask about the customer's address                     | Actual coverage, travel limitations, and whether Dublin is included     |
| Lawn care                | Broad lawn care/property maintenance description     | Mowing, edging, trimming, recurring work, materials, and exclusions     |
| Exterior cleaning        | Broad pressure washing/exterior cleaning description | Approved surfaces, techniques, limitations, and available work          |
| Removal/hauling          | Broad category with per-job confirmation             | Accepted items, access needs, disposal arrangements, exclusions         |
| Estimates and scheduling | No prices, speed, or availability promises           | Estimate policy, hours, scheduling procedure, pricing process           |
| Company story            | Factual base and supplied categories only            | Owner-approved identity, introduction, and any substantiated history    |
| Wordmark                 | New typographic/geometric concept                    | Approval or replacement with the authentic logo                         |
| Photography              | Explicitly illustrative licensed stock               | Authentic work photos and consent to publish them                       |
| Before/after             | Component ready; no fabricated pairs shown           | Matched real photos of the same project                                 |
| Reviews                  | None published                                       | Authentic excerpts, source links, permissions where needed              |
| Facebook                 | Supplied candidate URL retained in configuration     | Correct official page; no endorsement/authorship inferred               |
| Inquiry recipient        | No configured production recipient                   | Approved email destination and verified sending domain                  |
| Administrator            | No public signup/default password                    | Authorized admin email, securely generated password, and secret storage |
| Privacy                  | Plain-language technical behavior                    | Business privacy contact, retention periods, operational requirements   |
| Domain and indexing      | Preview noindex, proposed-concept footer             | Domain ownership and express authorization to launch officially         |

Business details and media records are centralized in `src/lib/business.ts`. Email/database/authentication details belong in environment variables, not that public configuration module. Set `BUSINESS_DETAILS_APPROVED=true` only after confirming the facts used by schema.
