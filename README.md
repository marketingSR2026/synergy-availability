# Synergy availability collector

One central job. Every 10 minutes it opens Synergy's public Jane booking pages in a logged-out headless browser, reads open times, strips everything except time, service, location, practitioner and duration, and sends the result to the WordPress plugin. Website visitors never trigger it.

Safety: no login, no patient data, one treatment per discipline, sequential with pauses, stops at the first 403, 429 or captcha, never overwrites good data with an empty or failed run.

## Setup (once)
1. Create a new GitHub repo (public, so scheduled runs are free) and upload these files.
2. Repo Settings > Secrets and variables > Actions > New secret:
   - WP_URL = https://synergyrehabilitation.ca
   - WP_TOKEN = the token shown in WP Admin > Synergy Availability
3. Actions tab > Collect availability > Run workflow. Check the log shows a push result of 200.

## Local test
npm install && node collect.js --only langley
