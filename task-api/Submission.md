# Submission Notes

## What I'd test next if I had more time

If I had more time, I would add additional edge case tests, including invalid query parameters, pagination boundary cases, concurrent requests, and more validation scenarios.

## Anything that surprised me

Writing tests helped uncover issues such as the incorrect pagination offset calculation. It also highlighted how tests can reveal subtle implementation bugs that are easy to miss during manual testing.

## Questions I'd ask before shipping to production

* Should completed tasks be allowed to change status again?
* Should an assignee be replaceable once assigned?
* Should pagination include metadata such as total pages and total task count?
* Should deleted tasks be permanently removed or soft deleted?
* Should duplicate task titles be allowed?
