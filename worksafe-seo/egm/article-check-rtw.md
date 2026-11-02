# Goldfish check: return-to-work article (pages/src/rtw.mjs)

I found 33 problems in `rtw.mjs`. The worst is in section 4: wherever the page touches on what physio costs, it never says that the accepted, pending and non-claim cases differ. I built the page in memory only (no files written) and its lint reported 0 issues. Line numbers below are for `/home/user/synergy-availability/worksafe-seo/pages/src/rtw.mjs`.

## 1. Factual sentences not wrapped in `ctx.claim`

**L51** "There is no set length." and **L126** "There is no set timeline. How long it takes depends on…"
- These are WorkSafeBC statements with no claim row.
- The RTW-08 notes say an employer guide gives a typical length, so "no set length" is not supported.
- L51 fix: "How long it takes depends on your injury, your job and how your body responds. ${c('RTW-08', 'Each version of your return-to-work plan is based on what you can safely do at the time, and a new one is made as you can do more.')}"
- L126 fix: "How long it takes depends on your injury, your job and how your body responds, so every plan looks a little different."

**L51** "Your physio reviews your progress at each visit and will be honest about what they see."
- This is a Synergy practice and a promise about conduct, with no register row.
- Fix: "Ask your physio how your progress looks at each visit."

**L53** "Often, yes. Many people keep up physio while they work their way back to full duties."
- Untagged, and it implies WorkSafeBC keeps paying for physio. Replacement is in 4a.

**L121** "Each step up is planned. When one step goes well, the next one follows."
- Untagged description of how the plan works, and it implies progress will happen.
- Fix: "${c('RTW-08', 'As you can do more, a new version of the plan is made.')}"

**L160** "No one decides alone."
- Untagged, and RTW-15 and RTW-16 contradict it: WorkSafeBC alone decides benefits and disputes.
- Fix: "Several people have a part, and each decides different things."

**L268** "If you think it could help you, ask your WorkSafeBC case manager."
- Fix: "${c('RTW-15', 'Your WorkSafeBC case manager helps you access WorkSafeBC services, so ask them if you think it could help.')}"

**L291** "Your WorkSafeBC case manager can answer questions about your claim."
- Fix: "${c('RTW-15', 'Your WorkSafeBC case manager is your main contact for questions about your claim.')}"

**L299** "Book a WCB physio visit online at the clinic nearest home or work."
- Fix: "${c('SYN-JANE', 'Book a WCB physio visit online at the clinic nearest home or work.')}"

**Synergy service statements with no register row** (the file header also says clinical sign-off is required). Either add a SYN row with clinical-lead sign-off and wrap them, or soften them:
- **L97** "Physio goals built around your real job tasks" becomes "Physio goals can be set around your job tasks".
- **L118** "Your physio keeps building your strength between shifts." becomes "Your physio can keep working on your strength while you build up your shifts."
- **L124** "Your physio works on the hardest parts of your job before that last step." becomes "Your physio can work on the hardest parts of your job before that last step."
- **L197** (the whole lede) becomes "Your physio can look at what your job asks of your body and set treatment goals around those tasks, adding weight, time or reps a little at a time as you cope."
- **L204** "You also get exercises…" becomes "Your physio may give you exercises to keep up at home and at work between visits."
- **L103**, **L198** and **L217** are covered in section 3.

**L302** "19+ locations from Vancouver to Abbotsford. synergyrehab.ca"
- This is the brand line the spec requires, so it can stay.
- Whether synergyrehab.ca redirects is still unknown (research/03, egm N5). Confirm before publishing.

**Clinical lines** at L238 and L243 to L254 (soreness "often settles … by the next day", the red flags) are not register facts. They need the clinical sign-off before publish.

## 2. Wording that goes beyond the register row

**L43 RTW-06** The answer opens "No." to "Do I need my doctor or physio to sign off". The row only covers what WorkSafeBC requires, not employers.
- Fix: "Not for WorkSafeBC. ${c('RTW-06', 'WorkSafeBC does not require medical approval for you to return to work. A written return-to-work plan can help keep your physio or doctor up to date, if needed.')}"

**L45 RTW-02** says "reduce or stop wage-loss benefits". The row says "reduce or suspend", and its notes say benefits can be reviewed later.
- Fix: "WorkSafeBC can reduce or suspend wage-loss benefits if it finds you did not cooperate and had no good reason."

**L49 RTW-04** "Every employer also has to look for suitable work". The row does not say "every".
- Fix: "${c('RTW-04', 'Under the duty to cooperate, your employer must also find and offer suitable work for you.')}"

**L53 and L97 SYN-JANE** put "19+ locations" inside the claim. The row says all 19 clinics, and its notes say being bookable is not proof of a WorkSafeBC contract.
- Fixes: "${c('SYN-JANE', 'You can book WCB physio visits online at each of our 19 clinics.')}" and "${c('SYN-JANE', 'WCB physio booking online at all 19 clinics')}".
- Keep "19+ locations" outside claims only (L102, L302).

**L114 RTW-07** "WorkSafeBC calls the written version a return-to-work plan." The row does not attribute that definition to WorkSafeBC.
- Fix: "A return-to-work plan is a written plan you and your employer make together. It sets out what you can do, your tasks and your hours."

**L160 RTW-04** "Your employer offers suitable work." states a duty as if it always happens.
- Fix: "Your employer must find and offer suitable work."

**L160 RTW-11** "help show what you can safely do". The row says providers help the worker see the link.
- Fix: "Your physio and doctor can help you see what you can safely do at work."

**L164 RTW-02** leaves out the "as soon as practicable" wording and the exception in the notes.
- Fix: "Contact your employer as soon as you reasonably can, and keep in touch, unless contact would harm your recovery."

**L166 RTW-02** drops "when asked".
- Fix: "Help find suitable work when asked, and do not turn suitable work down without a good reason."

**L171 RTW-03** and **L172 RTW-04** describe what the employer does as fact rather than as a duty.
- Fixes: "Must contact you as soon as practicable and keep in touch with you and WorkSafeBC." and "Must find and offer suitable work that is safe, useful, within your abilities and a fit for your skills."

**L173 RTW-07** "Makes a return-to-work plan with you" is listed as an employer duty. The row creates no such duty.
- Fix: "May make a written return-to-work plan with you that sets out what you can do, your tasks and your hours."

**L186 RTW-06** "helps keep them up to date". The row says "can help … if needed".
- Fix: "A written plan can help keep them up to date."

**L265 RTW-19** has three problems:
- "does not claim to deliver them" is a hedge; the row says "does not deliver".
- It adds "exercise aimed at your job"; the row says only assessment and treatment.
- "What we offer is WCB physiotherapy" rests on SYN-JANE, not on SYN-01, which is UNVERIFIED.
- Fix: "${c('RTW-19', 'Synergy Rehab does not deliver either service. What we offer is WCB physiotherapy: assessment and treatment.')}" Hold it until ops confirms RTW-19 and SYN-01. Spec 6.3 uses the same "does not claim to deliver" wording and should change too.

**L57 WSBC-44** drops "Pacific".
- Fix: "Monday to Friday, 8 a.m. to 6 p.m. Pacific time."

**L57 WSBC-11** leaves out the 60-day condition and who pays. The fix is in 4b.

## 3. Banned items

**Clean:** no visit or week counts, no ICBC, and no "approved" wording (only "medical approval" and "approve your return", which come from the RTW-06 quote). There are no em or en dashes, as characters or as entities; the file is pure ASCII.

**Outcome promises**
- **L14** (meta): "how physio gets you ready" becomes "how physio can help you prepare".
- **L92**: "how physiotherapy gets your body ready for the real demands of your job" becomes "how physiotherapy can help you prepare for the physical demands of your job".
- **L196** (H2): becomes "How can physiotherapy help me prepare for my job?"
- **L75**: "building up to the weight your job needs" becomes "working toward the weight your job needs".
- **L51** and **L121** are covered in section 1.

**Implying Synergy runs part of a WorkSafeBC program**
- **L103**: "Your job / is the goal of your plan". On this page, "plan" reads as the return-to-work plan, which RTW-07 says the worker and employer make. Fix: "Your job tasks / shape your treatment goals".
- **L217**: "Real detail lets us build a plan that matches your job." Fix: "Real detail helps your physio plan treatment around your job."
- **L198**: "Job demands we train for" echoes "job demands analysis", the separate WorkSafeBC service described at L271. Fix: "Parts of your job we work on in the clinic".
- **L80**: "loading docks, ramps and steps between levels" suggests work at the job site, which the RTW-11 notes forbid. Fix: "Balance and confidence for surfaces like wet floors, ramps and steps, practised in the clinic."
- **L227**: putting the RTW-20 Functional Abilities Assessment form in the "before your visit" checklist implies Synergy fills it in. The RTW-20 notes forbid that until ops confirm. Fix: take it out of the checklist and state it separately: "${c('RTW-20', 'Your employer may give you a Functional Abilities Assessment form for your health care provider. WorkSafeBC does not require this form for a return-to-work plan.')}"

## 4. Misleading cost statements

**4a. L53** The FAQ "Can I keep going to physio after I go back to work?" implies WorkSafeBC keeps paying, but says nothing about accepted, pending or non-claim areas.
- Fix: "It depends on your claim. ${c('WSBC-23', 'On an accepted claim, care related to your claim is billed to WorkSafeBC and you should not have to pay fees.')} ${c('WSBC-25', 'Treatment for a body area that is not part of your accepted claim can be billed to you.')} ${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it, and WorkSafeBC decides.')}"

**4b. L57** The pending-claim FAQ says the first assessment can happen before acceptance. It leaves out who pays, the 60-day condition, and that treatment visits before acceptance may be charged.
- Fix: "${c('WSBC-12', 'Within 60 days of your injury, a WorkSafeBC-contracted physiotherapist can do your first assessment while your claim is pending, without prior approval.')} ${c('WSBC-11', 'The clinic bills WorkSafeBC directly for that assessment.')} ${c('WSBC-17', 'Treatment visits paid by WorkSafeBC start once the claim is accepted.')} ${c('WSBC-28', 'Before then, a clinic may ask you to pay for treatment, and you can ask for a refund if the claim is accepted later.')} ${c('SYN-PEND', 'Ask the clinic how it handles visits while your claim is pending.')}"

**4c. L180** "Decides whether to fund more physio…" raises funding with no claim context. L188 and L204 have the same gap.
- Fix: "${c('WSBC-21', 'Decides whether you get more treatment when your physiotherapist asks for it.')}"

**4d. Page level** The WCB booking calls to action (L94, L97, L299) appear with no cost line. Full cost information is only behind the guide links at L283 and L303.
- Fix: add near L299: "${c('WSBC-23', 'Accepted claim: care related to your claim is billed to WorkSafeBC and you should not have to pay fees.')} ${c('WSBC-28', 'Pending claim: a clinic may ask you to pay for treatment.')} ${c('SYN-PEND', 'Ask us how we handle visits while your claim is pending.')} ${c('WSBC-25', 'Care for a body area that is not part of your claim can be billed to you.')}"

## Context
- All 28 claim ids on the page are unverified: no row has `checked_by`, `checked_on` or `quote_matches` set.
- 8 of them are STAFF_CONFIRM (RTW-02, -03, -09, -14, -15, -16, -18, -19), so publish mode would block the page anyway.
- The lint's one warning is a false positive on the footer link text "What WorkSafeBC covers".