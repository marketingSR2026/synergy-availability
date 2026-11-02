# Re-check 2: coverage guide

Not clean. I found 13 remaining problems in /home/user/synergy-availability/worksafe-seo/pages/src/guide.mjs, most severe first.

1. **Line 205, wording beyond its row.** `c('SYN-GUIDE-02', 'If WorkSafeBC does not cover a service for your claim, or has not given approval for it, the clinic can bill you for it.')` The row describes a Synergy-only billing practice and is UNVERIFIED. The page states it as a rule for any clinic.
   Corrected: `${c('SYN-GUIDE-02', 'At our clinics, if WorkSafeBC does not cover a service for your claim, or has not given approval for it, we can bill you for it.')}`

2. **Line 231, unwrapped Synergy clinical guidance.** "Your part is to keep your visits, do your home exercises and tell your physio how your work tasks feel. That helps your physio plan the next step with you." This is job-specific planning, which the SYN-GUIDE-01 note bars without clinical sign-off.
   Corrected: delete both sentences, or replace them with advice only: "Ask your physio what you can do between visits."

3. **Lines 59 and 161, wording beyond WSBC-17.** `c('WSBC-17', 'Treatment visits paid by WorkSafeBC start once the claim is accepted.')` (line 161 says "your claim"). The row says visits start "only once" the claim is accepted. That is a condition, not a promise: past 60 days WSBC-14 approval is still needed.
   Corrected: `${c('WSBC-17', 'Treatment visits paid by WorkSafeBC can start only after the claim is accepted.')}`

4. **Lines 61 and 241, implied "no referral for physio".** Line 61: `c('WSBC-35', 'WorkSafeBC massage therapy is different: it needs a doctor&#8217;s referral and an accepted claim.')` It answers "Do I need a doctor's referral?", so "is different" says physio needs none. That is WSBC-16, which is PARTIAL / STAFF_CONFIRM and must not be stated absolutely. Line 241, "The rules are not the same as for physio.", makes the same comparison. WSBC-35 says nothing about physio.
   Corrected (both lines): `${c('WSBC-35', 'WorkSafeBC massage therapy has its own rules: it needs a doctor&#8217;s referral and an accepted claim.')}`

5. **Lines 102 and 162, wording beyond WSBC-12.** Line 102: "Within 60 days of your injury, your claim can still be pending at your first assessment." Line 162: "If it is within 60 days of your injury, a pending claim does not stop you getting your first assessment." Both drop "contracted physio" and "without prior approval". Both suggest that after 60 days a pending claim blocks the assessment, which the row does not say.
   Corrected: `${c('WSBC-12', 'Within 60 days of your injury, a contracted physio can do your first assessment while your claim is still pending, without asking WorkSafeBC first.')}` Line 162 can also be deleted, since it repeats the short answer.

6. **Line 217, cost answer missing claim status.** "If you choose one who is not contracted, you pay for each visit and then ask WorkSafeBC to pay you back. WorkSafeBC repays at its set rate, $95 per visit from April 1, 2026, and you pay any difference." This reads as repayment no matter what happens to the claim. The pending, denied and outside-the-claim cases are missing.
   Corrected: keep the WSBC-26 sentence and add `${c('WSBC-30', 'If your claim is denied, WorkSafeBC does not pay for treatment given while it was pending,')} ${c('WSBC-25', 'and care for a body area that is not part of your accepted claim can be billed to you.')}`

7. **Line 92 (hero) and line 57 (FAQ), wording beyond WSBC-23.** Line 92: "physio for your work injury is billed to WorkSafeBC, and you should not have to pay any fees." The row says "claim-related services"; "work injury" is broader. Neither line covers a physio without a contract, which WSBC-26 later says you pay for.
   Corrected (line 92): `${c('WSBC-23', 'Once WorkSafeBC accepts your claim, physio related to your claim is billed to WorkSafeBC, and you should not have to pay any fees.')}`
   Optional addition to line 57: `${c('WSBC-26', 'At a physio who is not contracted with WorkSafeBC, you pay and WorkSafeBC repays only its set rate.')}`

8. **Line 104, cost distinction missing.** The "At a glance" list gives the pending and accepted cases but not care outside the claim.
   Corrected: `${c('WSBC-23', 'Accepted claim: you should not have to pay fees for care related to your claim.')} ${c('WSBC-25', 'Care for an area not on your claim can be billed to you.')}`

9. **Line 275, cost exception missing.** "On an accepted claim, no user fees for physio for your claim-related injury. … So can care for an area not on your claim." The SYN-09 note lists a third exception: services WorkSafeBC does not cover. The card leaves it out, so "no user fees" overstates.
   Corrected, appended: `${c('SYN-GUIDE-02', 'So can a service WorkSafeBC does not cover for your claim or has not approved.')}`

10. **Line 189, outcome wording.** `c('WSBC-14', 'You can, but WorkSafeBC has to approve it first. …')` The row only says "not refused automatically", so "You can" reads as a yes.
    Corrected: `${c('WSBC-14', 'It is possible, but WorkSafeBC has to approve it first. It is not refused automatically, so 60 days is not a cut-off for physio.')}`

11. **Line 67, unwrapped Synergy clinical sentence.** "Bring any notes or exercise sheets your surgeon gave you, so your physio can follow them." It claims something about clinical practice with no row behind it.
    Corrected: "Bring any notes or exercise sheets your surgeon gave you to your first visit."

12. **Line 287, unwrapped Synergy statement.** "Our team cannot speed up a WorkSafeBC decision."
    Corrected: delete it and keep "If something is unclear, ask us."

13. **Line 320, unwrapped Synergy fact.** "19+ locations from Vancouver to Abbotsford." No claim row covers it. The same line appears unwrapped on the pillar, return-to-work and location pages.
    Corrected: add a register row (for example SYN-LOC) and use `${c('SYN-LOC', '19+ locations from Vancouver to Abbotsford.')}`. The build's "19+ locations" check still passes after wrapping.

The other checks came back clean:
- No em or en dashes, and no ICBC mentions.
- No "WorkSafeBC-approved" or "approved clinic/physio" wording.
- No visit or week counts. The only numbers are cleared ones: 60 days, 72 hours, 90 days and the $95 per-visit rate (WSBC-26, expires 2027-03-31).
- No DO_NOT_PUBLISH ids are used, and every id exists in /home/user/synergy-availability/worksafe-seo/data/claims-register.csv or /home/user/synergy-availability/worksafe-seo/data/claims-additions.csv.
- The Synergy direct-billing lines (SYN-08, SYN-09) are limited to "our clinics with a confirmed WorkSafeBC contract".
- The page does not claim that any clinic offers massage or acupuncture.