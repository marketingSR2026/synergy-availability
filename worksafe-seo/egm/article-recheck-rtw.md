# Re-check 2: return-to-work article

Not clean: 11 problems remain in /home/user/synergy-availability/worksafe-seo/pages/src/rtw.mjs, most severe first. No dashes, ICBC mentions, "approved" wording or visit or week counts are left.

1. **(1)(3) Synergy service statements are not wrapped.** These say a physio plans treatment around your job. SYN-GUIDE-01's notes forbid that kind of claim without clinical sign-off. SYN-RTW-01 covers only the warning signs, so these lines get past the publish gate. Fix: add a row SYN-RTW-02 (Synergy clinical guidance, UNVERIFIED, STAFF_CONFIRM, clinical lead sign-off) to claims-additions.csv and wrap each line.
   - L109 "Physio goals can be set around your job tasks" becomes `<li>${c('SYN-RTW-02', 'Physio goals can be set around your job tasks')}</li>`
   - L115 mini-card "Your job tasks / shape your treatment goals" becomes `${c('SYN-JANE', '<span class="sr-ws-minicard__value">Book online</span><span class="sr-ws-minicard__label">WCB physio visits</span>')}`
   - L130 "Your physio can keep working on your strength while you build up your shifts." becomes `${c('SYN-RTW-02', 'Your physio can keep working on your strength while you build up your shifts.')}`
   - L136 "Your physio can work on the hardest parts of your job before that last step." becomes `${c('SYN-RTW-02', 'Your physio can work on the hardest parts of your job before that last step.')}`
   - L209 lede "Your physio can look at what your job asks of your body and set treatment goals around those tasks..." becomes `${c('SYN-RTW-02', 'Your physio can look at what your job asks of your body and set treatment goals around those tasks, adding weight, time or reps a little at a time as you cope.')}`
   - L214, the descriptions from the L87 to L92 list: render each as `<p class="sr-ws-card__text">${c('SYN-RTW-02', d)}</p>`
   - L216 "Your physio may give you exercises to keep up at home and at work between visits." becomes `${c('SYN-RTW-02', 'Your physio may give you exercises to keep up at home between visits.')}`
   - L229 "Real detail helps your physio plan treatment around your job." becomes `${c('SYN-RTW-02', 'Real detail helps your physio plan treatment around your job.')}`

2. **(3) Equipment claims for every clinic.** These lines say all 19 clinics can train ladders, wet floors and uneven ground, under the heading "...work on in the clinic".
   - L88 "Standing for a full shift, stairs and ladders, kneeling and squatting, and walking on uneven ground." becomes "Standing for longer, stairs, kneeling and squatting, and the walking your job needs."
   - L92 "Balance and confidence for surfaces like wet floors, ramps and steps, practised in the clinic." becomes "Balance and confidence for the floors, ramps and steps you deal with at work."

3. **(2) Warning-sign wording goes beyond the SYN-RTW-01 row.** The clinical lead signs off the page wording exactly as written.
   - L250 "Tell your physio soon if pain keeps building from shift to shift, spreads, or comes with numbness, tingling or weakness." becomes "Tell your physio soon if pain keeps building from shift to shift, or comes with numbness, tingling or weakness." (Or add "spreading pain" to the row.)
   - L258 "Weakness, or a joint that gives way, catches or locks" becomes "Weakness, or a joint that gives way"
   - L261 "Limping, guarding or leaning on your other side to get through a shift" becomes "Limping or guarding to get through a shift"
   - L262 "A task in your plan that is harder than expected, or not what was agreed" becomes "A task in your plan that is harder than expected". A disagreement about the plan belongs with the employer and case manager (RTW-16), not the physio.

4. **(2) L198, RTW-06, says more than the row.** "Do not have to approve your return. A written plan can help keep them up to date." The row covers only what WorkSafeBC requires (the same problem was already fixed in the L54 FAQ). Corrected: `c('RTW-06', 'WorkSafeBC does not require their approval for your return. A written plan can help keep them up to date, if needed.')`

5. **(4) L64 FAQ leaves out the pending case.** "It depends on your claim." is followed only by the accepted case (WSBC-23) and the non-claim case (WSBC-25). Corrected: after the WSBC-23 sentence, add `${c('WSBC-28', 'If your claim is still pending, a clinic may ask you to pay for treatment, and you can ask for a refund if the claim is accepted later.')}`

6. **(4) L68 FAQ leaves out the non-claim case.** It covers pending and accepted costs (WSBC-11, 17, 28) but not body areas outside the claim. Corrected: after the WSBC-28 sentence, add `${c('WSBC-25', 'Care for a body area that is not part of your claim can be billed to you.')}`

7. **(3)(4) L312 cost block reads as a statement about Synergy's billing.** "Accepted claim: care related to your claim is billed to WorkSafeBC and you should not have to pay fees." sits between the Synergy booking button and "Ask us...". That makes it read as Synergy billing WorkSafeBC, which depends on SYN-01 (UNVERIFIED) plus SYN-08 and the clinic's G1 (WSBC-11 notes, spec section 5). The same thing happens at L64, where the SYN-JANE line follows the cost lines. This page's readers are often more than 60 days past their injury, and the block also leaves out WorkSafeBC's approval rule for that case. Corrected: `${c('WSBC-23', 'WorkSafeBC says that once it accepts your claim, your health care provider should bill it for care related to your claim, and you should not have to pay fees.')} ${c('WSBC-14', 'If you start treatment more than 60 days after your injury, WorkSafeBC must approve it first.')}`

8. **(3) Clinic count conflicts with the brand rule.** L109 says "WCB physio booking online at all 19 clinics" next to L114 "19+ locations", and L64 says "each of our 19 clinics" while L315 says "19+ locations". Spec section 13 says to use "19+ locations" exactly.
   - L109: `${c('SYN-JANE', 'Book WCB physio online')}`
   - L64: `${c('SYN-JANE', 'You can book WCB physio visits online.')}`

9. **(1) L130: WorkSafeBC content in a step is not wrapped.** "Fewer hours or days, lighter tasks and more breaks." Spec section 13 says every step must map to a claim. Corrected: `${c('RTW-13', 'Changed days or hours, some tasks taken out or reordered, and stretch breaks and rest periods.')}`

10. **(3) Outcome framing.**
    - L131 pill "As you get stronger" becomes "As you can do more"
    - L135 to L136 "Back to your usual job and hours" / "Your full duties and your normal shift." become "Working toward your usual job and hours" / "Your full duties and your normal shift, when you can safely do them."
    - L104 "while you keep healing" and L145 "while you heal" both become "while your injury still limits what you can do"

11. **(2) L56, RTW-02, softens a legal duty.** "you should not turn down suitable work without a good reason". The row says the worker must not unreasonably refuse suitable work. Corrected: "Under the duty to cooperate, you must not turn down suitable work without a good reason."