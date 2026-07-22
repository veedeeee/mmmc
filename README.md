# Mekanism Multiblock Calculator

Single Page Application built with React + TypeScript.

This repository contains the initial development baseline for a calculator that will help estimate Mekanism multiblock resources and efficiency.

## Current scope

The calculator currently supports planning inputs for these multiblocks:

- Dynamic Tank
- Thermal Evaporation Plant
- SPS
- Thermoelectric Boiler
- Induction Matrix
- Industrial Turbine
- Fission Reactor
- Fusion Reactor

For each structure, you can set size, ports/valves, and structure-specific internals, then view block requirement totals.

## Scripts

- `npm run dev`: Start local development server.
- `npm run build`: Type-check and build production assets.
- `npm run preview`: Preview the production build locally.
- `npm run test`: Start Vitest in watch mode.
- `npm run test:run`: Run Vitest once.

## Language

- Base UI language is English.
- Japanese (`ja`) is available via language switcher.

## Data source policy

This project should use official Mekanism references only:

- https://github.com/mekanism/Mekanism
- https://wiki.aidancbrady.com/wiki/Main_Page

## GitHub Pages

Vite `base` is configured for repository pages:

- `/mekanism_multiblock_calculator.github.io/`
