# Dark Pattern Keyword Patterns Reference

Quick-lookup table for text-based scanning. Each row is a regex-friendly pattern.

## Forced Action

| Pattern ID          | Keywords (case-insensitive regex)                                                      |
| ------------------- | -------------------------------------------------------------------------------------- |
| forced-continuity   | `free trial`, `auto.?renew`, `automatically charged`, `subscription will continue`     |
| forced-registration | `sign up to`, `create an account to`, `register to`, `log in to continue`              |
| forced-sharing      | `share to unlock`, `invite friends to`, `share on.* to get`, `tweet to unlock`         |
| forced-consent      | `by continuing you agree`, `pre.?checked`, `share.*with.*partners`                     |
| gamification        | `streak will reset`, `lose.*points`, `daily reward expires`, `claim before`             |

## Misdirection

| Pattern ID       | Keywords                                                                               |
| ---------------- | -------------------------------------------------------------------------------------- |
| visual-misdirect | *(visual — check CSS/screenshots, not text)*                                           |
| trick-questions  | `do not wish to not`, `uncheck.*if you.*not`, `prefer not to not`                      |
| bait-and-switch  | `starting at`, `as low as`, `from.*\$`, `plus.*fees`, `additional charges apply`       |
| disguised-ads    | `sponsored`, `promoted`, `partner content` *(check if visually distinct)*              |
| false-hierarchy  | `most popular`, `recommended`, `best value`, `best seller` *(check if pre-selected)*   |

## Obstruction

| Pattern ID          | Keywords                                                                              |
| ------------------- | ------------------------------------------------------------------------------------- |
| hard-to-cancel      | `call.*to cancel`, `contact.*support.*cancel`, `cannot cancel online`                 |
| confirmshaming      | `no thanks.*I don't`, `I prefer.*paying`, `I don't want to.*save`, `I hate`           |
| exit-obstruction    | `are you sure.*leave`, `before you go`, `wait.*don't leave`, `you'll lose`            |
| complex-process     | `processing.*days`, `waiting period`, `additional steps required`                     |

## Scarcity

| Pattern ID           | Keywords                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ |
| false-stock-count    | `only.*left`, `almost sold out`, `low stock`, `limited stock`, `selling fast`        |
| false-popularity     | `people.*looking at`, `people.*viewing`, `bought.*today`, `booked.*last.*hour`       |
| false-limited        | `limited edition`, `exclusive offer`, `won't come back`, `once.*gone`                |

## Sneaking

| Pattern ID           | Keywords                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ |
| hidden-costs         | `service fee`, `processing fee`, `handling fee`, `shipping.*calculated at checkout`  |
| sneak-into-basket    | `added to your cart`, `also added`, `protection plan`, `warranty included`           |
| hidden-subscription  | `subscribe.*save`, `recurring.*default`, `auto.*delivery`, `delivered every`         |
| drip-pricing         | `starting.*from`, `additional charges`, `resort fee`, `cleaning fee`                |

## Social Proof

| Pattern ID           | Keywords                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ |
| fake-testimonials    | `verified.*review`, `verified.*purchase`, `★★★★★`, `customers love`                 |
| fake-activity        | `just purchased`, `just bought`, `just signed up`, `someone.*just`, `minutes ago`   |
| misleading-metrics   | `trusted by.*million`, `% satisfaction`, `customers served`, `users worldwide`       |
| false-authority      | `as seen on`, `recommended by`, `endorsed by`, `featured in`, `doctor.*recommended` |

## Urgency

| Pattern ID           | Keywords                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ |
| fake-countdown       | `expires in`, `offer ends in`, `countdown`, `flash sale`, `ends.*today`              |
| fake-urgency-text    | `act now`, `last chance`, `don't miss out`, `hurry`, `limited time`, `before it's too late` |
| fake-deal-expiry     | `today only`, `expires tonight`, `valid until.*today`, `use code.*expires`           |
| pressure-selling     | `cart.*expire`, `others.*want this`, `selling out`, `reserve.*now`                   |

## Code-Level Signals

When scanning source code (React/HTML/JS), flag:

```
defaultChecked       → possible forced consent
checked={true}       → possible pre-selected subscription
setInterval.*timer   → possible fake countdown
beforeunload         → exit obstruction
mouseleave.*popup    → exit-intent manipulation
Math.random.*name    → fake activity notifications
fetch.*price.*final  → drip pricing (price computed server-side at last step)
```
