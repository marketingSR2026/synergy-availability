// RTW article: /return-to-work-after-a-workplace-injury/ . WorkSafe only.
// Owner of: gradual return to work, modified duties, return to work program, worksafebc return to work.
// Every WorkSafeBC or Synergy-specific fact is wrapped in ctx.claim(id, html). RTW-* and SYN-RTW-* rows live in data/claims-additions.csv.
// Content rule: WorkSafeBC's own return-to-work programs are separate WorkSafeBC services. Synergy does not deliver them (RTW-19).
// No visit or week counts, no timeline or outcome promises. Clinical sign-off required before publish (spec 6.3); the
// warning-signs wording is gated by SYN-RTW-01 and the job-focused physio wording by SYN-RTW-02, so publish mode blocks until a
// Synergy clinical lead signs both off.
import { esc, icon, ev, SOURCES, PILLAR_PATH, RTW_PATH } from './shared.mjs';

const PAGE_TYPE = 'article';

export const meta = {
  id: 'rtw',
  path: RTW_PATH,
  title: 'Gradual Return to Work in BC: Modified Duties | Synergy Rehab',
  description: 'Going back to work on a WorkSafeBC claim? How a gradual return to work and modified duties work, who decides what, and how physio helps you prepare.',
  h1: 'Gradual return to work and modified duties',
};

// Official worksafebc.com pages cited on this page. URLs copied exactly from claims-register.csv or claims-additions.csv.
const SRC = {
  rtw: { title: 'Return to work', url: 'https://www.worksafebc.com/en/claims/return-to-work' },
  workersRtw: { title: 'Workers: Return-to-work information', url: 'https://www.worksafebc.com/en/claims/return-to-work/workers-return-to-work-information' },
  workerDuty: { title: 'Workers: Duty to cooperate and duty to maintain employment', url: 'https://www.worksafebc.com/en/law-policy/workers-compensation-law/amendments/bill-41-amendments-to-the-workers-compensation-act/workers-duty-to-cooperate-duty-to-maintain-employment' },
  workerDutySheet: { title: 'Worker duty to cooperate (fact sheet)', url: 'https://www.worksafebc.com/en/resources/claims/guides/worker-duty-to-cooperate?lang=en' },
  employerDutySheet: { title: 'Employer duty to cooperate (fact sheet)', url: 'https://www.worksafebc.com/resources/claims/guides/employer-duty-to-cooperate?lang=en&direct=' },
  act: { title: 'Workers Compensation Act, Part 4: Compensation to injured workers and their dependants', url: 'https://www.worksafebc.com/en/law-policy/occupational-health-safety/searchable-ohs-regulation/workers-compensation-act/part-4-compensation-to-injured-workers-and-their-dependants' },
  employersRtw: { title: 'Employers: Return-to-work information', url: 'https://www.worksafebc.com/en/claims/return-to-work/employers-return-to-work-information' },
  managingRtw: { title: 'Managing a Safe Return to Work (guide)', url: 'https://www.worksafebc.com/resources/claims/guides/managing-safe-return-to-work?lang=en&direct=' },
  providersRtw: { title: 'Health care providers: Return-to-work information', url: 'https://www.worksafebc.com/en/claims/return-to-work/health-care-providers-return-to-work-information' },
  rtwPlan: { title: 'Return-to-Work (RTW) Plan: Template for Employers', url: 'https://www.worksafebc.com/resources/claims/templates/rtw-plan-template-employers?lang=en&direct=' },
  faa: { title: 'Functional Abilities Assessment: Template for Employers', url: 'https://www.worksafebc.com/en/resources/claims/templates/functional-abilities-assessment-employers?lang=en' },
  benefitsServices: { title: 'Benefits and services', url: 'https://www.worksafebc.com/en/claims/benefits-services' },
  wageLoss: { title: 'Wage-loss benefits', url: 'https://www.worksafebc.com/en/claims/benefits-services/wage-loss-benefits' },
  claimGuide: { title: 'About your WorkSafeBC claim: A guide for workers', url: 'https://www.worksafebc.com/resources/about-us/guides/about-your-worksafebc-claim-a-guide-for-workers?lang=en&direct=' },
  vocRehab: { title: 'Vocational rehabilitation guide: Returning to work', url: 'https://www.worksafebc.com/resources/claims/guides/vocational-rehabilitation-guide-returning-work?lang=en&direct=' },
  crrtw: { title: 'Customized Recovery and Return-to-Work Program', url: 'https://www.worksafebc.com/en/health-care-providers/rehabilitation/customized-recovery-rtw-program' },
  crrtwProviders: { title: 'Customized Recovery and Return-to-Work Program: Service providers', url: 'https://www.worksafebc.com/en/health-care-providers/rehabilitation/customized-recovery-rtw-program/service-providers' },
  rtwss: { title: 'Return to Work Support Services', url: 'https://www.worksafebc.com/en/health-care-providers/rehabilitation/return-work-support' },
  rtwssProviders: { title: 'Return to Work Support Services: Service providers', url: 'https://www.worksafebc.com/en/health-care-providers/rehabilitation/return-work-support/service-providers' },
  report: SOURCES.report,
  teleclaim: { title: 'Making a WorkSafeBC claim (information sheet)', url: 'https://www.worksafebc.com/resources/claims/information-sheet/making-worksafebc-claim?lang=en&direct=' },
  contact: { title: 'Contact WorkSafeBC', url: 'https://contactus.online.worksafebc.com/' },
  benefits: SOURCES.benefits,
  msk: { title: 'Musculoskeletal physiotherapy services', url: 'https://www.worksafebc.com/en/health-care-providers/provider-types/physiotherapists/musculoskeletal-physiotherapy-services' },
  manual: { title: 'Physiotherapy Services Reference Manual', url: 'https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-services-reference-manual?lang=en&direct=' },
  agreement: { title: 'Physiotherapy Services Agreement', url: 'https://www.worksafebc.com/en/resources/health-care-providers/guides/physiotherapy-services-agreement' },
  massageGuide: { title: 'How-to guide for massage therapists', url: 'https://www.worksafebc.com/resources/health-care-providers/guides/how-to-guide-for-massage-therapists?lang=en&direct=' },
};

export function rtwFaq(ctx) {
  const c = ctx.claim;
  const guide = ctx.link('guide');
  const costs = guide ? `${guide}#costs` : `${PILLAR_PATH}#eligibility`;
  return [
    ['Do I need my doctor or physio to sign off before I go back to work?',
      `${c('RTW-06', 'Not for WorkSafeBC. WorkSafeBC does not require medical approval for you to return to work. A written return-to-work plan can help keep your physio or doctor up to date, if needed.')} ${c('RTW-11', 'Your physio can still help you see which tasks fit what you can safely do now.')} If you are unsure about a task, bring it to your next visit.`],
    ['Can I say no to modified duties?',
      `${c('RTW-02', 'Under the duty to cooperate, you must not turn down suitable work without a good reason. WorkSafeBC can reduce or suspend wage-loss benefits if it finds you did not cooperate and had no good reason.')} If a task in the offer seems beyond what you can do right now, say so. Talk it through with your employer and your physio, ${c('RTW-15', 'and call your WorkSafeBC case manager, who is your main contact for your claim.')}`],
    ['Will my wage-loss benefits stop if I go back part time?',
      `${c('RTW-14', 'Not always. Wage-loss benefits can continue when you go back on fewer hours or different duties. WorkSafeBC takes what you earn into account and may pay part of the difference.')} ${c('RTW-15', 'Your case manager can tell you how this works on your claim.')}`],
    ['Does my employer have to keep my job for me?',
      `${c('RTW-05', 'It may. If your employer regularly has 20 or more workers and you worked there for at least a year before your injury, it has a duty to keep you employed. That means offering your old job or a similar one if you are fit for it, or else the first suitable work that comes up.')} ${c('RTW-04', 'Under the duty to cooperate, your employer must also find and offer suitable work for you.')}`],
    ['How long does a gradual return to work take?',
      `How long it takes depends on your injury, your job and how your body responds. ${c('RTW-08', 'Each version of your return-to-work plan is based on what you can safely do at the time, and a new one is made as you can do more.')} Ask your physio how your progress looks at each visit.`],
    ['Can I keep going to physio after I go back to work?',
      `${c('SYN-RTW-02', 'Yes. Physio can continue alongside a gradual return to work when it is part of your treatment, so your physio can keep working on your strength while you build up your shifts.')} ${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it, and WorkSafeBC decides.')} ${c('SYN-JANE', 'You can book WCB physio visits online.')} Costs depend on your claim stage. <a class="sr-ws-link sr-ws-link--arrow" href="${costs}">See costs at each claim stage</a>.`],
    ['What is a return-to-work plan?',
      `${c('RTW-07', 'It is a written plan you and your employer make together. It sets out what you can do, your tasks and your hours. A WorkSafeBC team member, your health care provider or a union representative may also help with it.')} ${c('RTW-08', 'It changes as you are able to do more.')}`],
    ['I have not reported my injury yet. What should I do first?',
      `${c('WSBC-42', 'Tell your employer as soon as it is safe, and tell anyone who treats you that it happened at work.')} ${c('WSBC-43', 'Then report it to WorkSafeBC online at any time, or by phone through Teleclaim')} ${c('WSBC-44', 'at 1.888.967.5377 toll-free or 604.231.8888 in the Lower Mainland, Monday to Friday, 8 a.m. to 6 p.m. Pacific time.')} ${c('WSBC-12', 'Within 60 days of your injury, a WorkSafeBC-contracted physiotherapist can do your first assessment while your claim is pending, without prior approval.')}`],
  ];
}

const head = (eyebrow, id, h2, lede, center = false) =>
  `<div class="sr-ws-head${center ? ' sr-ws-head--center' : ''}"><p class="sr-ws-eyebrow">${eyebrow}</p><h2 class="sr-ws-h2" id="${id}">${h2}</h2>
      <p class="sr-ws-lede">${lede}</p></div>`;

const checklist = (items) => `<ul class="sr-ws-checklist" role="list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

export function render(ctx) {
  const c = ctx.claim;
  const pillar = ctx.link('pillar') || PILLAR_PATH;
  const guide = ctx.link('guide');
  const find = `${PILLAR_PATH}#clinics`;
  const faq = rtwFaq(ctx);
  const clin = (html) => c('SYN-RTW-01', html);

  const demands = [
    ['back', 'Lifting and carrying', 'Lifting from the floor, waist and shoulder height, carrying loads, and working toward the weight your job needs.'],
    ['knee', 'Standing, walking and climbing', 'Standing for longer, stairs, kneeling and squatting, and the walking your job needs.'],
    ['shoulder', 'Reaching and overhead work', 'Shoulder strength and stamina for reaching, pushing, pulling and working with your arms up.'],
    ['hand', 'Gripping and tools', 'Grip strength and control for tools, keyboards, steering wheels and tasks you repeat all day.'],
    ['neck', 'Sitting, driving and screen work', 'Neck and back stamina for long sitting, plus a routine of movement breaks that fits your shift.'],
    ['fall', 'Balance and footing', 'Balance and confidence for the floors, ramps and steps you deal with at work.'],
  ];

  return `<div class="sr-ws-page">
<section class="sr-ws-band sr-ws-band--white sr-ws-hero" aria-labelledby="sr-ws-h1">
  <div class="sr-ws-container">
    <nav class="sr-ws-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${pillar}">WorkSafeBC physiotherapy</a></li><li><span aria-current="page">Return to work</span></li></ol></nav>
    <div class="sr-ws-hero__panel sr-ws-notch">
      <div class="sr-ws-notch__tab sr-ws-hero__badge"><span class="sr-ws-pill">Return to work</span></div>
      <div class="sr-ws-hero__content">
        <p class="sr-ws-eyebrow">Back to work after a WCB claim</p>
        <h1 class="sr-ws-h1" id="sr-ws-h1">Gradual return to work and <span class="sr-ws-accent">modified duties</span></h1>
        <p class="sr-ws-lede">A gradual return to work means going back in planned steps, often on modified duties, while your injury still limits what you can do.</p>
        <div class="sr-ws-hero__ctas">
          <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--knob" href="${find}" ${ev('worksafe_location_select', 'all', 'hero', PAGE_TYPE)}>Find your clinic<span class="sr-ws-btn__knob" aria-hidden="true">&#8594;</span></a>
          <a class="sr-ws-btn sr-ws-btn--secondary" href="#who-decides">Who decides what</a>
        </div>
        <ul class="sr-ws-proof" role="list"><li>${c('SYN-JANE', 'Book WCB physio online')}</li><li>${c('SYN-RTW-02', 'Physio goals can be set around your job tasks')}</li></ul>
      </div>
      <figure class="sr-ws-hero__media">
        ${ctx.pillarPhoto('rtw_hero', 'Physiotherapist coaching a patient through a lifting exercise at a Synergy Rehab clinic', 800, 1000, true)}
        <ul class="sr-ws-hero__floats" role="list">
          <li class="sr-ws-minicard sr-ws-minicard--tl"><span class="sr-ws-minicard__icon">${icon('pin')}</span><span><span class="sr-ws-minicard__value">19+</span><span class="sr-ws-minicard__label">locations</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--br"><span class="sr-ws-minicard__icon">${icon('check')}</span>${c('SYN-JANE', '<span class="sr-ws-minicard__value">Book online</span><span class="sr-ws-minicard__label">WCB physio visits</span>')}</li>
        </ul>
      </figure>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white sr-ws-band--flush-top" id="gradual" aria-labelledby="sr-ws-gradual-h">
  <div class="sr-ws-container">
    <ul class="sr-ws-jumpnav" aria-label="On this page"><li><a href="#gradual">Gradual return</a></li><li><a href="#modified">Modified duties</a></li><li><a href="#who-decides">Who decides</a></li><li><a href="#physio">How physio helps</a></li><li><a href="#warning-signs">Warning signs</a></li><li><a href="#faq">FAQ</a></li></ul>
    ${head('Gradual return', 'sr-ws-gradual-h', 'What does a gradual return to work look like?',
      `A gradual return to work means you go back in steps instead of all at once. You might start with shorter shifts, fewer days or lighter tasks, then add more as your body copes. ${c('RTW-07', 'A return-to-work plan is a written plan you and your employer make together. It sets out what you can do, your tasks and your hours.')} ${c('RTW-08', 'Each version is based on what you can safely do now, and a new one is made as you can do more.')}`)}
    <ol class="sr-ws-steps" role="list">
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--blue sr-ws-step__when">To start</span>
        <h3 class="sr-ws-step__title">Begin with what you can do safely</h3>
        <p class="sr-ws-step__body">${c('RTW-13', 'Changed days or hours, some tasks taken out or reordered, and stretch breaks and rest periods.')} ${c('SYN-RTW-02', 'Your physio can keep working on your strength while you build up your shifts.')}</p></li>
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--blue sr-ws-step__when">As you can do more</span>
        <h3 class="sr-ws-step__title">Add hours, days and tasks a little at a time</h3>
        <p class="sr-ws-step__body">${c('RTW-08', 'As you can do more, a new version of the plan is made.')} ${c('RTW-09', 'If the planned duties are not working out, the plan can be changed.')}</p></li>
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--blue sr-ws-step__when">The goal</span>
        <h3 class="sr-ws-step__title">Working toward your usual job and hours</h3>
        <p class="sr-ws-step__body">Your full duties and your normal shift, when you can safely do them. ${c('SYN-RTW-02', 'Your physio can work on the hardest parts of your job before that last step.')}</p></li>
    </ol>
    <div class="sr-ws-note"><p>How long it takes depends on your injury, your job and how your body responds, so every plan looks a little different.</p></div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" id="modified" aria-labelledby="sr-ws-modified-h">
  <div class="sr-ws-container">
    ${head('Modified duties', 'sr-ws-modified-h', 'What are modified duties?',
      `Modified duties are changes to your job so you can keep working, or get back to work, while your injury still limits what you can do. ${c('RTW-12', 'WorkSafeBC says returning to work might mean doing other tasks, working a different schedule or doing things a little differently.')} ${c('RTW-04', 'The work your employer offers must be safe, useful to the business, within what you can do now, and a fit for your skills.')}`)}
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">What can change</h3>
        <p class="sr-ws-card__text">${c('RTW-13', 'WorkSafeBC suggests employers think about changes like these:')}</p>
        ${checklist([
          c('RTW-13', 'Your usual duties, for a while'),
          c('RTW-13', 'Your days or hours of work, for a while'),
          c('RTW-13', 'Taking out some tasks, or doing them in a different order'),
          c('RTW-13', 'Stretch breaks and rest periods'),
        ])}</li>
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">What it can look like</h3>
        <p class="sr-ws-card__text">Every job is different. A few examples:</p>
        ${checklist([
          'A warehouse worker with a back strain scans and labels orders instead of lifting heavy boxes.',
          'A care aide with a sore shoulder does tasks that do not involve lifting or moving people.',
          'A cook with a wrist injury preps with lighter tools and leaves the heavy pots to others.',
          'A driver with a neck strain takes shorter routes with more breaks.',
          'An office worker with a sore back switches between sitting and standing through the day.',
        ])}</li>
    </ul>
    <p class="sr-ws-tip"><span class="sr-ws-tip__label">Tip</span><span>Bring any modified duties offer to your physio visit. ${c('RTW-11', 'Your physio can help you see which tasks in it fit what you can safely do now.')}</span></p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" id="who-decides" aria-labelledby="sr-ws-who-h">
  <div class="sr-ws-container">
    ${head('Who decides what', 'sr-ws-who-h', 'Who decides when I go back to work?',
      `Several people have a part, and each decides different things. ${c('RTW-01', 'Since January 1, 2024, BC law says you and your employer must work together, and with WorkSafeBC, on a safe and timely return to work.')} ${c('RTW-04', 'Your employer must find and offer suitable work.')} ${c('RTW-15', 'WorkSafeBC manages your claim and benefits.')} ${c('RTW-11', 'Your physio and doctor can help you see what you can safely do at work.')} ${c('RTW-06', 'WorkSafeBC does not require medical approval before you go back.')}`)}
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">You</h3>
        ${checklist([
          c('RTW-02', 'Contact your employer as soon as you reasonably can, and keep in touch, unless contact would likely harm or delay your recovery.'),
          c('RTW-10', 'Ask your physio or doctor what you can do at work and at home, and what to avoid. Then share it with your employer.'),
          c('RTW-02', 'Help find suitable work when asked, and do not turn suitable work down without a good reason.'),
          c('RTW-02', 'Give WorkSafeBC the return-to-work information it asks for.'),
        ])}</li>
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">Your employer</h3>
        ${checklist([
          c('RTW-03', 'Must contact you as soon as practicable and keep in touch with you and WorkSafeBC.'),
          c('RTW-04', 'Must find and offer suitable work that is safe, useful, within your abilities and a fit for your skills.'),
          c('RTW-07', 'May make a written return-to-work plan with you that sets out what you can do, your tasks and your hours.'),
          c('RTW-05', 'If it regularly has 20 or more workers and you worked there for at least a year before the injury, it also has a duty to keep you employed.'),
        ])}</li>
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">WorkSafeBC</h3>
        ${checklist([
          c('RTW-15', 'Your case manager is your main contact. They manage your claim and decide on benefits.'),
          c('RTW-07', 'A WorkSafeBC team member may help with your return-to-work plan.'),
          c('WSBC-21', 'Decides whether you get more treatment when your physiotherapist asks for it.'),
          c('RTW-16', 'Can decide if you and your employer cannot sort out a disagreement about cooperating.'),
        ])}</li>
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">Your physio and doctor</h3>
        ${checklist([
          c('RTW-11', 'Help you see how what you can do links to safe, suitable tasks at work.'),
          c('RTW-06', 'WorkSafeBC does not require their approval for your return. A written plan can help keep them up to date, if needed.'),
          c('RTW-07', 'May be part of making your return-to-work plan.'),
          c('WSBC-21', 'Your physiotherapist can ask WorkSafeBC for more treatment if you need it, and WorkSafeBC decides.'),
        ])}</li>
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="physio" aria-labelledby="sr-ws-physio-h">
  <div class="sr-ws-container">
    ${head('How physio helps', 'sr-ws-physio-h', 'How can physiotherapy help me prepare for my job?',
      c('SYN-RTW-02', 'Your physio can look at what your job asks of your body and set treatment goals around those tasks, adding weight, time or reps a little at a time as you cope.'))}
    <h3 class="sr-ws-h3">Parts of your job your physio can work on in the clinic</h3>
    <ul class="sr-ws-grid sr-ws-grid--3 sr-ws-list-reset" role="list">
      ${demands.map(([i, t, d]) => `<li class="sr-ws-card sr-ws-card--soft sr-ws-notch sr-ws-condition">
          <span class="sr-ws-notch__tab"><span class="sr-ws-icon-badge">${icon(i)}</span></span>
          <h4 class="sr-ws-h4 sr-ws-card__title">${t}</h4><p class="sr-ws-card__text">${c('SYN-RTW-02', d)}</p></li>`).join('\n      ')}
    </ul>
    <div class="sr-ws-note"><p>${c('SYN-RTW-02', 'Your physio may give you exercises to keep up at home between visits.')} ${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it. WorkSafeBC decides.')} <a class="sr-ws-link sr-ws-link--arrow" href="${pillar}#eligibility">How WCB physio works at each claim stage</a></p></div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" aria-label="Find a WorkSafe physiotherapy clinic">
  <div class="sr-ws-container">
    ${ctx.finderCompact()}
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="tell-your-physio" aria-labelledby="sr-ws-tell-h">
  <div class="sr-ws-container">
    ${head('Your first visit', 'sr-ws-tell-h', 'What should I tell my physio about my job?',
      `Tell your physio what a normal shift really asks of you. Name the heaviest thing you lift and how often, how long you stand, sit or drive, and how much you reach, bend, kneel or climb. Mention your tools and your shift length. Say if your employer has offered modified duties. ${c('WSBC-42', 'Also tell us the injury happened at work.')} ${c('SYN-RTW-02', 'Real detail helps your physio plan treatment around your job.')}`)}
    <div class="sr-ws-box"><p class="sr-ws-box__head">Before your visit, note down <span class="sr-ws-pill sr-ws-pill--blue">Checklist</span></p>
      <div class="sr-ws-box__body">${checklist([
        'Your job title and your main tasks',
        'The heaviest thing you lift or carry, and how often',
        'How long you stand, sit, walk or drive in a shift',
        'Any reaching overhead, bending, kneeling, climbing or ladders',
        'Tools, machines or vehicles you use',
        'Your shift length, breaks and any overtime',
        'What your employer has offered, such as modified duties or a return-to-work plan',
        c('WSBC-46', 'Your 8-digit claim number, if it has arrived'),
      ])}</div></div>
    <p>${c('RTW-20', 'Your employer may give you a Functional Abilities Assessment form for your health care provider. WorkSafeBC does not require this form for a return-to-work plan.')}</p>
    <p>${c('RTW-10', 'WorkSafeBC asks you to talk with your health care provider about what you can do at work and at home, and what to avoid. Then share it with your employer and talk about changing your duties or schedule so you can keep working.')}</p>
    <p class="sr-ws-tip"><span class="sr-ws-tip__label">Tip</span><span>A photo or short video of a hard task, taken where it is safe and allowed, can help your physio see what you do.</span></p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft sr-ws-band--dotted" id="warning-signs" aria-labelledby="sr-ws-warn-h">
  <div class="sr-ws-container">
    ${head('Warning signs', 'sr-ws-warn-h', 'What warning signs should I tell my physio about?',
      `${clin('Some extra soreness is common when you add hours or tasks, and it often settles with rest by the next day. Tell your physio soon if pain keeps building from shift to shift, or comes with numbness, tingling or weakness. Speak up, too, if you are changing how you move just to get through the day.')} ${c('RTW-09', 'If the planned duties are not working out, the plan can be changed.')}`)}
    <div class="sr-ws-grid sr-ws-grid--2">
      <article class="sr-ws-card" aria-labelledby="sr-ws-warn-list-h">
        <h3 class="sr-ws-h3 sr-ws-card__title" id="sr-ws-warn-list-h">Tell your physio if you notice</h3>
        ${checklist([
          clin('Pain that is getting worse from week to week, not better'),
          clin('Pain that has not settled by the morning after a shift'),
          clin('New numbness, tingling or pins and needles'),
          clin('Weakness, or a joint that gives way'),
          clin('Pain that wakes you at night or is there even when you rest'),
          clin('New swelling, redness or heat around the injury'),
          clin('Limping or guarding to get through a shift'),
          clin('A task in your plan that is harder than expected'),
        ])}
      </article>
      <div>
        <div class="sr-ws-callout"><span class="sr-ws-label">Get urgent care</span><p>${clin('Call 911 or go to the nearest emergency department if you have sudden weakness in an arm or leg, chest pain or trouble breathing. Do the same if you have numbness in your groin or inner thighs, or new trouble controlling your bladder or bowels.')}</p></div>
        <div class="sr-ws-card sr-ws-card--soft"><h3 class="sr-ws-h4 sr-ws-card__title">Who else to tell</h3>
          <p class="sr-ws-card__text">${c('RTW-02', 'Keep your employer in the loop about how the plan is going.')} ${c('RTW-15', 'Your WorkSafeBC case manager is your main contact for questions about your claim.')}</p></div>
      </div>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" id="programs" aria-labelledby="sr-ws-prog-h">
  <div class="sr-ws-container">
    ${head('WorkSafeBC programs', 'sr-ws-prog-h', 'Is WCB physio the same as a WorkSafeBC return-to-work program?',
      `No. ${c('RTW-17', 'WorkSafeBC runs its own Customized Recovery and Return-to-Work Program through a network of providers that hold long-term contracts with WorkSafeBC.')} ${c('RTW-18', 'Return to Work Support Services is another WorkSafeBC service, based at the workplace. These are separate WorkSafeBC services.')} ${c('RTW-19', 'Synergy Rehab does not deliver either service. What we offer is WCB physiotherapy: assessment and treatment.')}`)}
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">Customized Recovery and Return-to-Work Program</h3>
        <p class="sr-ws-card__text">${c('RTW-17', 'A WorkSafeBC program, delivered by providers that hold long-term WorkSafeBC contracts for it.')} ${c('RTW-15', 'Your WorkSafeBC case manager helps you access WorkSafeBC services, so ask them if you think it could help.')}</p>
        <p class="sr-ws-card__text"><a class="sr-ws-link sr-ws-link--ext" href="${esc(SRC.crrtw.url)}">About this program on worksafebc.com</a></p></li>
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">Return to Work Support Services</h3>
        <p class="sr-ws-card__text">${c('RTW-18', 'WorkSafeBC refers workers to contracted providers for job site visits, return-to-work planning and job demands analysis.')} ${c('WSBC-34', 'WorkSafeBC keeps a separate provider list for this service.')}</p>
        <p class="sr-ws-card__text"><a class="sr-ws-link sr-ws-link--ext" href="${esc(SRC.rtwss.url)}">About this service on worksafebc.com</a></p></li>
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="faq" aria-labelledby="sr-ws-faq-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><p class="sr-ws-eyebrow">FAQ</p><h2 class="sr-ws-h2" id="sr-ws-faq-h">WorkSafeBC return-to-work questions</h2></div>
    <div class="sr-ws-faq sr-ws-faq--center">
      ${faq.map(([q, a]) => `<details class="sr-ws-faq__item"><summary class="sr-ws-faq__q">${q}</summary><div class="sr-ws-faq__a"><p>${a}</p></div></details>`).join('\n      ')}
    </div>
    ${guide ? `<p class="sr-ws-center"><a class="sr-ws-link sr-ws-link--arrow" href="${guide}">Claims, costs and coverage in detail</a></p>` : ''}
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft sr-ws-band--tight" aria-labelledby="sr-ws-src-h">
  <div class="sr-ws-container">
    <h2 class="sr-ws-h4" id="sr-ws-src-h">Sources</h2>
    <ol class="sr-ws-sources">${Object.values(SRC).map((s) => `<li><a href="${esc(s.url)}">${esc(s.title)}</a> (worksafebc.com)</li>`).join('')}</ol>
    <p class="sr-ws-small sr-ws-muted">This page gives general information, not advice about your own claim. ${c('RTW-15', 'Your WorkSafeBC case manager is your main contact for questions about your claim.')}</p>
    <p class="sr-ws-asof">${ctx.asof()}</p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-cta-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><h2 class="sr-ws-h2" id="sr-ws-cta-h">Getting ready to go back? Start with an assessment.</h2>
      <p class="sr-ws-lede">${c('SYN-JANE', 'Book a WCB physio visit online at the clinic nearest home or work.')} Bring your job details and any return-to-work plan.</p>
      <p class="sr-ws-small" id="costs">${c('WSBC-23', 'On an accepted claim, you should not have to pay fees for care related to your claim.')} <a class="sr-ws-link sr-ws-link--arrow" href="${guide ? `${guide}#costs` : `${pillar}#eligibility`}">Costs at each claim stage</a></p></div>
    <a class="sr-ws-bigpill sr-ws-hide-below-desktop" href="${find}" ${ev('worksafe_location_select', 'all', 'final', PAGE_TYPE)}>Find your clinic</a>
    <div class="sr-ws-linkcols">
      <div><p class="sr-ws-linkcols__title">Synergy Rehabilitation</p><p class="sr-ws-small">19+ locations from Vancouver to Abbotsford. synergyrehab.ca</p></div>
      <div><p class="sr-ws-linkcols__title">WorkSafe</p><ul><li><a href="${pillar}">WorkSafeBC physiotherapy</a></li>${guide ? `<li><a href="${guide}">Claims and costs guide</a></li>` : ''}<li><a href="#faq">Return-to-work FAQ</a></li></ul></div>
      <div><p class="sr-ws-linkcols__title">WorkSafeBC</p><ul><li><a href="${SOURCES.report.url}">Report an injury</a></li><li><a href="tel:+18889675377">${c('WSBC-44', 'Teleclaim 1.888.967.5377')}</a></li><li><a href="${SRC.rtw.url}">Return to work (worksafebc.com)</a></li></ul></div>
    </div>
  </div>
</section>

<div class="sr-ws-sticky" role="region" aria-label="Find a WorkSafe clinic">
  <a class="sr-ws-btn sr-ws-btn--primary" href="${find}" ${ev('worksafe_location_select', 'all', 'sticky', PAGE_TYPE)}>Find your clinic</a>
</div>
<div class="sr-ws-sticky-spacer"></div>
</div>`;
}
