---
description: "Reusable official-source modeling rules for Mekanism multiblock formulas and UI constraints"
applyTo: "src/domain/multiblocks.ts, src/App.tsx, src/App.test.tsx, .github/copilot-instructions.md"
---

# Mekanism Multiblock Formula Rules

## Source policy
- Use official Mekanism sources only:
  - https://github.com/mekanism/Mekanism
  - https://wiki.aidancbrady.com/wiki/Main_Page
- If official sources are missing or ambiguous for a requested formula, stop and ask the user before adding assumptions.
- All calculator formulas and constraints must be traceable to official Mekanism behavior.
- Do not introduce ad-hoc tuning constants when an official constant or equation exists in source.
- When a planner-side simplification is unavoidable, keep the official equation structure and document which variable is approximated.

## Thermal Evaporation Plant (validated rules)
- Use a dedicated TEP structure model, not a generic cuboid shell.
- For height H, total shell blocks are based on the open-tower layout: `16 + 12 * (H - 1)`.
- Port minimum is conditional:
  - With top solar generator layout OFF: minimum 3 ports.
  - With top solar generator layout ON: minimum 2 ports.
- Solar layout replaces exactly four top-corner Thermal Evaporation Blocks with Advanced Solar Generators.
- Solar layout affects required blocks only in this planner model.
- Production is controlled by manual temperature input and follows official-style multiplier behavior.
- Temperature input range is capped to `0.0..3.0 kK` (effective 3000 K cap behavior).

## SPS (validated rules)
- SPS uses a fixed `7x7x7` validator shape with a custom allowed grid.
- The effective required shell is `186` blocks:
  - `60` frame-only casing positions.
  - `126` other positions (port/casing/structural-glass compatible).
- SPS port bounds are `3..126`.
- Planner model treats Supercharged Coil count as exactly `1`.
- Keep model notes aligned with validator behavior: disconnected internal coils are invalid in official formation logic.

## Thermoelectric Boiler (validated rules)
- Planner supports Boiler shell split with Structural Glass toggle for user-driven design planning.
- Capacity factors follow Mekanism general defaults:
  - Water: `16,000 mB` per water-volume block.
  - Steam: `160,000 mB` per steam-volume block.
  - Heated coolant: `256,000 mB` per water-volume block.
- Input model:
  - User inputs steam-layer height (not water-layer height).
  - Water-layer height is derived as `height - steamHeight - 2`.
  - Steam-side capacity layers are treated as `steamHeight + 1` to include the Pressure Disperser split layer.
  - User inputs superheating element count directly.
  - Superheating element maximum is derived from practical split capacity: `innerWidth * innerLength * waterHeight`.
- Capacity approximation model used by planner:
  - Water and steam layer volumes use full structure footprint per layer (`width * length`) with the selected steam/water split.
  - Water-side effective volume subtracts occupied Superheating Element blocks.
  - This is a planner-side approximation to stay close to official capacity scaling while preserving current UI simplicity.
- Boiler max boil capacity should follow the official-style equation:
  - `maxBoilRate = floor((superheatingHeatTransfer * superheatingElements / waterThermalEnthalpy) * steamEnergyEfficiency)`
  - Default constants used in planner: `16,000,000`, `10`, `0.2`.

## Industrial Turbine (validated rules)
- Keep size constraints aligned with validator:
  - Outer dimensions: width/length `5..17` (odd only), height `5..18`.
- Rotor and blade planner constraints:
  - Rotor height maximum is `height - 4`.
  - Blades per rotor are capped to `0..2`.
  - Practical coil maximum is derived from selected rotor height as `ceil(rotorHeight / 2)` (for max 2 blades/rotor and 4 blades/coil).
- Turbine vent input model:
  - Top vents are controlled by a boolean toggle (`ON` => full top inner face uses vents).
  - Side vents are controlled by side-layer count input.
  - Planner derives total vent count as:
    - `topVentCount = useTopVents ? (width - 2) * (length - 2) : 0`
    - `sideVentCount = (2 * (width + length) - 8) * sideVentLayers`
    - `vents = topVentCount + sideVentCount`
- Turbine disperser count follows formed structure behavior:
  - `dispersers = (width - 2) * (length - 2) - 1`.
- Steam capacity follows lower section volume (not total inner volume):
  - `lowerVolume = width * length * rotorHeight`
  - `steamCapacity = lowerVolume * 64,000 mB`.
- Max steam flow follows official-style limiter pair:
  - `disperserLimitedFlow = lowerVolume * dispersers * 1,280`
  - `ventLimitedFlow = vents * 32,000`
  - `maxFlowRate = min(disperserLimitedFlow, ventLimitedFlow)`.
- Max power generation follows coil-supported blade limiter:
  - `bladeLimiter = min(blades, coils * 4)`
  - `energyMultiplierPerSteam = (10 / 28) * bladeLimiter`
  - `maxPower = maxFlowRate * energyMultiplierPerSteam`.
- Max water output remains condenser-capacity based:
  - `maxWaterOutput = condensers * 6,400 mB/t`.

## Fission Reactor (validated rules)
- Fission port mode in official source is split into three modes (`INPUT`, `OUTPUT_WASTE`, `OUTPUT_COOLANT`).
- Recipe-oriented minimum should be treated as `4` ports (`fuel in`, `coolant in`, `heated coolant out`, `waste out`).
- Although one `INPUT` mode can multiplex tanks in implementation, planner minimum keeps the two input channels explicitly separated.
- Fission Logic Adapter is an outer-shell `OTHER` component and should be configurable separately from ports.
- Shell accounting must include both fission ports and logic adapters.
- Safety warning thresholds should follow official fission danger constants:
  - `MIN_DAMAGE_TEMPERATURE = 1,200 K`
  - `MAX_DAMAGE_TEMPERATURE = 1,800 K`
- When estimated fission temperature reaches/exceeds these thresholds, planner UI should show warning messaging:
  - `>= 1,200 K`: damage-risk warning
  - `>= 1,800 K`: severe danger warning
- Max burn rate should follow official structure cap:
  - `maxBurnRate = min(fuelAssemblyBlocks * burnPerAssembly, 1,920)` with defaults `burnPerAssembly = 1`.
- Temperature and heating estimates should follow official heat flow structure in `FissionReactorMultiblockData`:
  - Heat generation term: `generatedHeat = selectedBurnRate * energyPerFissionFuel`.
  - Boil efficiency term: `boilEfficiency = min(1, averageFuelSurfaceArea / fissionSurfaceAreaTarget)`.
  - Coolant capture term: `capturedHeat ∝ boilEfficiency * coolantConductivity * (temperature - BASE_BOIL_TEMP) * heatCapacity`.
  - Environment loss term: proportional to `(temperature - ambient) / (AIR_INVERSE_COEFFICIENT + INVERSE_INSULATION_COEFFICIENT + INVERSE_CONDUCTION_COEFFICIENT)`.
  - Water conversion uses `steamEnergyEfficiency` and `waterThermalEnthalpy`; chemical coolant conversion uses its thermal enthalpy.

## Fusion Reactor (validated rules)
- Keep Fusion validator constraints aligned with official fixed-size model:
  - Outer dimensions are fixed at `5x5x5`.
- Laser Focus Matrix and Logic Adapter are `OTHER` shell components.
- Planner assumes one Laser Focus Matrix as the effective required component for reactor operation.
- Port minimum should remain `2` in planner defaults.
  - Official Fusion ports are boolean mode (`input/output`) and do not expose fission-style per-channel mode enums.
  - Planner minimum of `2` represents the practical split between at least one input-side and one output-side port.
- Keep Fusion port behavior model aligned with official capability exposure:
  - Port can handle chemical, fluid, and energy capabilities.
  - Output gating is controlled by the port mode toggle.
- Injection rate must be an explicit planner input and aligned with official effective cap behavior:
  - Injection rate is even and bounded by `0..98` (`MAX_INJECTION = 98`).
  - Do not derive injection from Laser Focus Matrix count.
- Fusion thermal and generation estimates should follow official equation structure:
  - Use active cooling term `k = waterHeatingRatio` for water mode, otherwise `k = 0`.
  - `maxCasingTemperature = energyPerFusionFuel * injection / (k + casingThermalConductivity)`.
  - `passiveGeneration = thermocoupleEfficiency * casingThermalConductivity * maxCasingTemperature`.
  - Water cooling steam estimate uses `steamEnergyEfficiency * waterHeatingRatio * maxCasingTemperature / waterThermalEnthalpy`.

## Change management
- When formula or constraint logic changes, update:
  - `src/domain/multiblocks.ts`
  - UI bounds/defaults in `src/App.tsx`
  - Regression tests in `src/App.test.tsx`
- Validate with:
  - `npm run test:run`
  - `npm run lint`
  - `npm run build`
- Keep English and Japanese note strings consistent when changing user-facing model notes.

## Reusable workflow skill
- For any formula correction request, follow this order:
  1. Find official source code/wiki references for the target multiblock.
  2. Extract hard constraints first (fixed size, min/max ports, required components).
  3. Update domain logic in `src/domain/multiblocks.ts`.
  4. Mirror constraints in UI defaults/ranges in `src/App.tsx`.
  5. Add or update regression tests in `src/App.test.tsx`.
  6. Run `npm run test:run`, `npm run lint`, and `npm run build`.
  7. If a requested behavior is not explicitly official, ask the user before finalizing.

## Ongoing maintenance trigger
- When changing any Mekanism-related formula, constraint, or planner assumption, review this file and update impacted sections before completing the task.
- Keep this instruction synchronized with actual behavior in:
  - `src/domain/multiblocks.ts`
  - `src/App.tsx`
  - `src/App.test.tsx`
