# AngularJS Companion Frontend

This directory contains a **separate AngularJS 1.8.3 frontend demo** for the Event Operations Hub project. It sits alongside the existing React + TypeScript app; it does not replace or modify the React implementation.

## Run it

The easiest option is to open `index.html` in a browser while connected to the internet (AngularJS and Google Fonts are loaded from CDNs).

For a local static server, from the repository root run:

```bash
npx serve angularjs-frontend
```

Then open the local URL printed by the command.

## What it demonstrates

- AngularJS module and controller structure
- Two-way data binding with `ng-model`
- Repeated UI with `ng-repeat`
- Conditional rendering with `ng-if` and `ng-class`
- Event handling with `ng-click` and `ng-submit`
- Filtering the attendee list
- Interactive work-order status changes, attendee check-in, room readiness, and incident tracking

All data is sample data held in the page's in-memory controller state. Reloading the page resets the demo. It is not connected to the React app, a shared database, or a production API.

## Important technology note

AngularJS 1.x is a legacy framework and is no longer officially supported. This companion is intended to demonstrate familiarity with AngularJS concepts, not to recommend AngularJS for new production systems. For new projects, use a currently supported framework.

## Structure

- `index.html` — application layout and AngularJS CDN
- `app.js` — AngularJS module, controller, and demo interactions
- `styles.css` — responsive dark operations-dashboard styling
