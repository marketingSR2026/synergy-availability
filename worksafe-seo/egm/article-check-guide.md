# Goldfish check: coverage guide (pages/src/guide.mjs)

**Adversarial review: /home/user/synergy-availability/worksafe-seo/pages/src/guide.mjs**

Clean on these checks: no em or en dashes (the file is pure ASCII, with no `&mdash;`, `&ndash;`, `&#8212;` or `&#8211;`), no ICBC mentions, no numeric visit or week counts, and no DO_NOT_PUBLISH ids in use. Everything below is a finding.

**(1) Factual sentences not wrapped in ctx.claim**

- **L82:** "...the claim and cost questions injured workers ask us most..." This is an unverified Synergy claim.
  Fix: "Below are plain answers to common claim and cost questions, with links to WorkSafeBC&#8217;s own pages."
- **L106:** "This page follows the current rules." This states the page is current, with no source.
  Fix: "This page is based on the WorkSafeBC pages listed at the bottom, checked on the date shown there."
- **L114:** "No, you do not need the number in hand." and "Bring it to a later visit if it has not arrived yet." No register row says a clinic can assess or bill you without the claim number. SYN-07 says Synergy asks you to bring the number to the first visit.
  Fix: `${c('WSBC-13', 'You need to have reported the injury to WorkSafeBC, but your claim can still be pending.')}` followed by "Ask the clinic what to bring if your claim number has not arrived yet."
- **L115:** "That way your visit is set up as a WorkSafeBC claim from the start." This is a clinic-process claim.
  Fix: delete it, or use `${c('WSBC-10', 'WorkSafeBC asks you to explain that your injury is work-related.')}`
- **L150:** "Yes, you can start."
  Fix: `${c('WSBC-11', 'Yes, you can start with an assessment.')}`
- **L151:** "...not a reason to wait in pain. You can get assessed, learn what is going on and start the exercises you can do at home." This is an unwrapped rule, a service and outcome claim, and it leaves out the 60-day limit.
  Fix: `${c('WSBC-12', 'If it is within 60 days of your injury, a pending claim does not stop you getting your first assessment.')}`
- **L168:** "Read the decision letter closely, because it explains the reason." No register row covers what decision letters contain.
  Fix: "Read the decision letter closely."
- **L178:** "Yes." This is unwrapped, and it promises an outcome when approval is needed.
  Fix: `${c('WSBC-14', 'You can, but WorkSafeBC has to approve it first.')}`
- **L179:** "That is not how the rules read."
  Fix: `${c('WSBC-14', 'WorkSafeBC&#8217;s rules do not end physio at 60 days.')}`
- **L204:** "You can, but it may cost you."
  Fix: `${c('WSBC-26', 'You can, but you pay the clinic yourself and WorkSafeBC repays only its set rate.')}`
- **L217:** "so a visit number you saw on an older page may not apply to you." This is unwrapped and implies the visit allocation changed. That rests on WSBC-18/19, which are not cleared.
  Fix: "If you read about WorkSafeBC physio on an older page, check it against WorkSafeBC&#8217;s own site."
- **L228:** "It can, but the rules are not the same as for physio." This states coverage without a claim id.
  Fix: delete "It can, but" and keep "The rules are not the same as for physio." The WSBC-35 and WSBC-36 sentences then carry the coverage.
- **L238:** "See which of our clinics book WCB massage or acupuncture..." This is a Synergy service claim, and the RMT and acupuncturist WorkSafeBC status is UNKNOWN (WSBC-35/36 notes).
  Fix: `${c('SYN-JANE', 'See which of our clinics list WCB massage or acupuncture appointments in online booking')}` on our WorkSafeBC physiotherapy page. Hold it until ops confirm (serviceClaim).
- **L246:** Three problems in one paragraph.
  - "Our physiotherapists assess and treat your injury and build a plan around your job." This is a Synergy service claim with no row.
    Fix: add a STAFF_CONFIRM SYN row, or use "Our physiotherapists assess and treat your injury." gated on SYN-01.
  - "You report the injury and keep your employer and WorkSafeBC up to date." Fix: `${c('WSBC-42', 'You tell your employer')} ${c('WSBC-43', 'and report the injury to WorkSafeBC.')}`
  - "start with us and we will point you the right way." This is a promise. Fix: "If you are not sure who to ask, ask us."
- **L258:** "Assess your injury and what your job asks of your body." There is no row for this.
  Fix: "Assess and treat your injury." under a new SYN row or SYN-01.
- **L273:** "we will help you work out what to ask WorkSafeBC." This is a promise.
  Fix: "If something is unclear, ask us."
- **L284:** The meta text "WorkSafeBC physiotherapy at Synergy Rehab" implies a contract (SYN-01), and nothing gates it.
  Fix: "Synergy Rehab pillar page".
- **L294:** "Every rule on this page comes from WorkSafeBC's own pages, listed here." This is false. SRC is missing:
  - the Physiotherapy Services Agreement (used for WSBC-17, WSBC-21, WSBC-24)
  - the massage therapists how-to guide (WSBC-25)
  - worksafebc.com/en/about-us (GEN-01)
  - the EAPP and RTWSS provider lists (WSBC-34)
  - contactus.online.worksafebc.com (the WSBC-44 hours)

  Fix: add those entries to SRC, and change the sentence to "Every WorkSafeBC rule on this page comes from the WorkSafeBC pages listed here."
- **L306:** "19+ locations from Vancouver to Abbotsford." This Synergy fact is unwrapped. In a WorkSafe CTA band it also implies 19+ WCB clinics, but in publish mode only G1-confirmed clinics are listed.
  Fix: add a SYN-LOCATIONS register row and use `${c('SYN-LOCATIONS', '19+ locations from Vancouver to Abbotsford.')}`
- **L195 (low):** "ask the front desk... A good clinic will give you a straight answer." This implies the clinic decides coverage.
  Fix: "If you are not sure whether a visit is covered, ask the clinic before your appointment."

**(2) Wording that goes beyond the register row**

- **L49, WSBC-21:** The page drops "WorkSafeBC decides". Research section 10 and the SYN-05 note both require it. "care" is also broader than "treatment".
  Fix: `${c('WSBC-21', 'If you need more treatment later, your physio can ask WorkSafeBC for it. WorkSafeBC decides.')}`
- **L51, WSBC-16:** The register note says "Publish the WSBC-10 wording instead". Here the sentence answers the referral question by implication.
  Fix: delete the WSBC-16 sentence.
- **L51, WSBC-35:** "Massage therapy is the exception" implies that physio and every other service need no referral.
  Fix: `${c('WSBC-35', 'WorkSafeBC massage therapy is different: it needs a doctor&#8217;s referral and an accepted claim.')}`
- **L55 and L141, WSBC-47:** The page says "care beyond first aid" where the register says "medical care", and "then" adds a timing the source does not give.
  Fix: "Your employer must report it to WorkSafeBC within 72 hours if you missed work or needed medical care beyond first aid."
- **L93, WSBC-23:** "no fees" drops the "should not have to pay" hedge.
  Fix: "Accepted claim: you should not have to pay fees for care related to your claim."
- **L94, WSBC-14:** "WorkSafeBC approves treatment first" reads as a promise that it will approve.
  Fix: "More than 60 days since your injury? WorkSafeBC has to approve treatment before it starts. It is not refused automatically."
- **L106 and L217, WSBC-01:** "physiotherapy rules changed" goes further than "a new services agreement took effect".
  Fix: "WorkSafeBC&#8217;s new physiotherapy services agreement took effect on April 1, 2026."
- **L129, WSBC-43:** The examples "like a lift, a slip or a fall" and the phrase "works best" are not in the register.
  Fix: "WorkSafeBC recommends reporting online for a physical injury from a single incident. Online reporting is open 24 hours a day, 7 days a week."
- **L133 and L53, WSBC-44 (minor):** "Pacific" is missing.
  Fix: "...Monday to Friday, 8 a.m. to 6 p.m. Pacific time."
- **L167, WSBC-30:** The page drops "if the claim is denied". Taken on its own, the sentence is false for claims that are later accepted.
  Fix: "If the claim is denied, WorkSafeBC does not pay for treatment visits given while it was pending. Each clinic decides whether to ask you to pay for those visits or to wait for the decision before treating you."
- **L178, WSBC-14:** "so 60 days is not a deadline for your claim" can be confused with the one-year reporting limit.
  Fix: "It is not refused automatically, so 60 days is not a cut-off for physio."
- **L179, WSBC-14:** "Your care is not cut off." This goes past "not refused automatically" and promises an outcome.
  Fix: "After 60 days, WorkSafeBC has to approve treatment before it starts. It is not refused automatically."
- **L179, WSBC-12:** Placed after a sentence about treatment starting, the surgery-date rule reads as applying to treatment. It applies only to the assessment.
  Fix: "If you have surgery related to your claim, the 60-day window for a first assessment without approval can count from the surgery date."
- **L188 and L205, WSBC-24:** Both drop "except where the agreement expressly allows".
  - L188 fix: "A clinic with a WorkSafeBC contract is not allowed to charge you extra, such as a top-up or user fee, for services under that contract, except where the contract allows it."
  - L205 fix: "A contracted clinic cannot charge you extra for services under its WorkSafeBC contract, except where the contract allows it."
- **L192, WSBC-25:** The only exact quote comes from the massage billing guide; the notes say no physio equivalent was quoted. The page presents it as a physio rule.
  Fix: hold it until staff confirm. After that: "Treatment for a body area that is not part of your accepted claim is not covered by the claim and can be billed to you."
- **L217, WSBC-21:** "WorkSafeBC decides how much physiotherapy your claim covers" is broader than the row, which covers extension requests only.
  Fix: `${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it, and WorkSafeBC decides whether to approve the request.')}`
- **L228, after WSBC-36:** "check what is approved on your claim before you book" is wrong. The first set of massage and acupuncture visits needs no pre-approval (WSBC-35: "without pre-approval"; WSBC-36: "no prior approval").
  Fix: "For either one, your claim has to be accepted before you book."
- **L246, L266, L273, WSBC-17:** The page says "WorkSafeBC decides whether your claim is accepted" and "Only WorkSafeBC can accept or deny your claim". WSBC-17 only says funded treatment starts once the claim is accepted; "only" and "deny" are not in the row.
  Fix: add a register row (GUIDE-04, "WorkSafeBC decides whether a claim is accepted"). Until then: `${c('WSBC-17', 'WorkSafeBC accepts claims, and the treatment visits it pays for start only after that.')}`
- **L246, SYN-08:** "We bill WorkSafeBC for your care" is broader than physio. The register notes say bodyworker, personal training and No Direct Billing disciplines are not WorkSafe services. It is also false for treatment visits while a claim is pending.
  Fix: `${c('SYN-08', 'For physiotherapy on a WorkSafeBC claim, we bill WorkSafeBC directly: the first assessment, and treatment visits once your claim is accepted.')}`
- **L262, SYN-PEND:** The row says Synergy asks workers to check how the clinic handles pending visits. The page turns this into a Synergy commitment ("Tell you how we handle...").
  Fix: move it to the "You" card as "Ask the clinic how it handles visits while your claim is pending." Replace it with the actual policy once ops answer Q-5.

**(3) "Approved" wording, outcome promises, and implying Synergy runs a WorkSafeBC program**

- **"Approved":** L217 ("what is approved for your claim") and L228 refer to treatment approval, not provider approval, so they pass the lint. L228 is misleading anyway (see section 2). No "WorkSafeBC-approved clinic" wording.
- **Outcome promises:** L94, L151, L178 "Yes.", L179 "Your care is not cut off.", L246 "we will point you the right way", L273 "we will help you", L195 "A good clinic will give you a straight answer." Fixes are given above.
- **L314:** `aria-label="Find a WorkSafe clinic"` implies the clinics are WorkSafeBC's.
  Fix: `aria-label="Find a clinic for WCB physio"`
- **L246, L259, L260:** SYN-08 and SYN-09 state Synergy-wide billing and no user fees. The notes say both depend on SYN-01, but the guide never invokes SYN-01 or contractClaim, and G1 is checked per clinic. Verifying SYN-08 alone would publish "we bill WorkSafeBC" for clinics that are not yet confirmed.
  Fix: gate these lines on SYN-01, or reword to "At our clinics with a confirmed WorkSafeBC contract, ..."
- **L231, L234, L238:** The "WCB massage therapy" and "WCB acupuncture" cards next to "which of our clinics book WCB massage or acupuncture" imply Synergy delivers WorkSafeBC massage and acupuncture. That is UNKNOWN. The fix is at L238 above.
- **L303 (CTA) and L82 (hero next to "Find your clinic"):** The WSBC-11 note says that saying Synergy clinics do this depends on SYN-01. The CTA copy is not gated.
  Fix for L303: `${c('WSBC-11', 'At a WorkSafeBC-contracted clinic, you can have your first assessment while your claim is pending')} ${c('WSBC-12', 'if it is within 60 days of your injury.')}` Then gate the Synergy link on SYN-01.

**(4) Misleading cost statements: accepted, pending and non-claim cases are not all stated where costs come up**

- **L46-47, FAQ "Is physio free with a WorkSafeBC claim?":** This standalone FAQ (also emitted as an FAQ answer) leaves out non-claim body areas, the denied-claim outcome, and the 60-day condition.
  Fix: retitle to "Do I pay for physio on a WorkSafeBC claim?" and add: `${c('WSBC-30', 'If the claim is denied, WorkSafeBC does not pay for treatment visits given while it was pending.')} ${c('WSBC-25', 'Care for a body area that is not part of your accepted claim can be billed to you.')}`
- **L82, hero lede:** It gives the no-fee rule and the pending assessment, but leaves out pending treatment costs and non-claim areas.
  Fix: add `${c('WSBC-28', 'Treatment visits before your claim is accepted may cost you,')} ${c('WSBC-25', 'and so can care for an area that is not part of your claim.')}`
- **L91-95, "At a glance":** Same gap.
  Fix: add `<li>${c('WSBC-28', 'Pending claim: a clinic may ask you to pay for treatment visits until the claim is accepted.')}</li>`
- **L150, pending short answer ("and will I pay?"):** It leaves out that if the claim is denied, those pending treatment visits are never paid by WorkSafeBC. It also leaves out Synergy's own pending policy, which the WSBC-28 note and research section 5 say must sit next to this. SYN-PEND is an UNVERIFIED placeholder.
  Fix: add `${c('WSBC-30', 'If the claim is denied, WorkSafeBC does not pay for treatment visits given while it was pending.')}` and `${c('SYN-PEND', '<Synergy pending-claim policy from ops Q-5>')}`
- **L167-168, denied section:** It does not say whether Synergy charges for pending visits or waits for the decision. The WSBC-30 note says this business decision must be published.
  Fix: add the SYN-PEND policy sentence once Q-5 is answered.
- **L188-194, fees list:** "Costs can still come up in a few cases, listed below." reads as a complete list, but leaves out (a) a denied claim and (b) services WorkSafeBC does not cover or does not approve (the SYN-09 note lists this; it needs a register row).
  - Fix the lead: "Costs can still come up, including in these cases:"
  - Add: `<li><strong>If your claim is denied.</strong> ${c('WSBC-30', 'WorkSafeBC does not pay for treatment visits given while the claim was pending.')} <a href="#denied">Denied claims</a></li>`
- **L246 and L259, SYN-08:** Unqualified "bill WorkSafeBC" implies pending treatment visits are billed to WorkSafeBC. The fix is in section 2.
- **L260, SYN-09:** The Synergy card states no user fees without the pending and non-claim exceptions next to it.
  Fix: "On an accepted claim, no user fees for physio for your claim-related injury." followed by `${c('WSBC-28', 'Treatment while your claim is pending can cost you.')}` and `${c('WSBC-25', 'So can care for an area not on your claim.')}`
- **L47, L49, L82, L92, L114, L303, WSBC-11 without the 60-day condition:** Research section 10's publish-ready wording requires "as long as you have reported the injury and it's within 60 days of the injury". Without it, a worker more than 60 days past the injury with a pending claim is told the first assessment is billed to WorkSafeBC, when it actually needs approval first.
  Fix (L92 as the pattern): "Within 60 days of your injury, your claim can still be pending at your first assessment." Apply the same WSBC-12 qualifier at each line.