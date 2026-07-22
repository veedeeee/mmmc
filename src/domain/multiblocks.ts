export type MultiblockKey =
    | 'dynamicTank'
    | 'thermalEvaporationPlant'
    | 'sps'
    | 'thermoelectricBoiler'
    | 'inductionMatrix'
    | 'industrialTurbine'
    | 'fissionReactor'
    | 'fusionReactor'

export type ResourceKey =
    | 'dynamicTankCasing'
    | 'dynamicValve'
    | 'structuralGlass'
    | 'inductionCasing'
    | 'inductionPort'
    | 'inductionCell'
    | 'inductionProvider'
    | 'thermalEvaporationBlock'
    | 'thermalEvaporationValve'
    | 'thermalEvaporationController'
    | 'advancedSolarGenerator'
    | 'spsCasing'
    | 'spsPort'
    | 'superchargedCoil'
    | 'boilerCasing'
    | 'boilerValve'
    | 'pressureDisperser'
    | 'superheatingElement'
    | 'turbineCasing'
    | 'turbineValve'
    | 'turbineVent'
    | 'rotationalComplex'
    | 'turbineRotor'
    | 'turbineBlade'
    | 'electromagneticCoil'
    | 'saturatingCondenser'
    | 'reactorGlass'
    | 'fissionReactorCasing'
    | 'fissionReactorPort'
    | 'fissionReactorLogicAdapter'
    | 'fissionFuelAssembly'
    | 'controlRodAssembly'
    | 'fusionReactorFrame'
    | 'fusionReactorPort'
    | 'fusionReactorController'
    | 'fusionReactorLogicAdapter'
    | 'laserFocusMatrix'

export type CalculationNoteKey =
    | 'spsFixedShape'
    | 'boilerLayerModel'
    | 'fissionAssemblyPattern'
    | 'turbineApproximation'
    | 'specModelAssumption'
    | 'evaporationSolarPatternModel'
    | 'coilSoftCap'
    | 'turbineBladeSoftCap'
    | 'turbineVentSoftCap'
    | 'turbineCondenserSoftCap'

export type CoolantType = 'water' | 'sodium'

export type SpecKey =
    | 'dynamicTankFluidCapacity'
    | 'dynamicTankChemicalCapacity'
    | 'evaporationInputCapacity'
    | 'evaporationOutputCapacity'
    | 'evaporationWaterToBrineProduction'
    | 'evaporationBrineToLithiumProduction'
    | 'spsEnergyInput'
    | 'spsPoloniumConsumption'
    | 'spsCoilEfficiency'
    | 'boilerWaterCapacity'
    | 'boilerSteamCapacity'
    | 'boilerHeatedCoolantCapacity'
    | 'boilerMaxBoilRate'
    | 'boilerCoolingEfficiency'
    | 'boilerCoolantHeatingRate'
    | 'boilerCoolantTemperature'
    | 'inductionEnergyCapacity'
    | 'inductionInputOutputRate'
    | 'turbineSteamCapacity'
    | 'turbineMaxFlowRate'
    | 'turbineMaxPowerGeneration'
    | 'turbineMaxWaterOutput'
    | 'fissionFuelCapacity'
    | 'fissionHeatedCoolantCapacity'
    | 'fissionWasteCapacity'
    | 'fissionMaxBurnRate'
    | 'fissionSelectedBurnRate'
    | 'fissionCoolingEfficiency'
    | 'fissionCoolantHeatingRate'
    | 'fissionCoolantTemperature'
    | 'fusionFuelCapacity'
    | 'fusionEnergyCapacity'
    | 'fusionSteamProduction'
    | 'fusionPassiveGeneration'
    | 'fusionCoolingTransferRate'
    | 'fusionCasingTemperature'

export interface Dimensions {
    width: number
    height: number
    length: number
}

export interface RequirementLine {
    key: ResourceKey
    count: number
}

export interface SpecLine {
    key: SpecKey
    value: number
    unit: string
}

export interface CalculatorInput {
    type: MultiblockKey
    dimensions: Dimensions
    ports: number
    useStructuralGlass?: boolean
    useReactorGlass?: boolean
    coolantType?: CoolantType
    matrixCells?: number
    matrixProviders?: number
    evaporationUseSolarGenerators?: boolean
    evaporationTemperatureKk?: number
    spsCoils?: number
    boilerSteamHeight?: number
    boilerSuperheatingElements?: number
    boilerWaterHeight?: number
    boilerSuperheatingLayers?: number
    turbineRotorHeight?: number
    turbineBladesPerRotor?: number
    turbineCoils?: number
    turbineCondensers?: number
    turbineVents?: number
    fissionAssemblies?: number
    fissionAssemblyHeight?: number
    fissionBurnRate?: number
    fissionLogicAdapters?: number
    fusionLogicAdapters?: number
    fusionInjectionRate?: number
}

export interface CalculatorResult {
    isValid: boolean
    errors: string[]
    notes: CalculationNoteKey[]
    dimensions: Dimensions
    shellBlocks: number
    innerVolume: number
    lines: RequirementLine[]
    specs: SpecLine[]
}

const MIN_CUBOID = 3
const MAX_CUBOID = 18
const FISSION_BASE_BOIL_TEMPERATURE_K = 373.15
const FISSION_WATER_CONDUCTIVITY = 0.5
const FISSION_SODIUM_CONDUCTIVITY = 1
const FISSION_SODIUM_THERMAL_ENTHALPY = 5
const FISSION_ENVIRONMENT_INVERSE_CONDUCTION = 20_010

// Official FissionReactorMultiblockData thresholds: MIN_DAMAGE_TEMPERATURE=1200, MAX_DAMAGE_TEMPERATURE=1800.
export const FISSION_DANGER_TEMPERATURE_K = 1_200
export const FISSION_CRITICAL_TEMPERATURE_K = 1_800

const plannerDefaults = {
    dynamicTankFluidPerVolume: 350_000,
    dynamicTankChemicalPerVolume: 16_000_000,
    inductionCellCapacity: 8_000_000_000,
    inductionProviderRate: 256_000,
    evaporationTankPerInner: 16_000,
    evaporationOutputBase: 10_000,
    evaporationSolarGeneratorCount: 4,
    evaporationDefaultTemperatureKk: 3,
    evaporationAmbientTemperatureK: 300,
    evaporationMaxMultiplierTemperatureK: 3_000,
    evaporationTempMultiplier: 0.4,
    spsEnergyInput: 400_000_000,
    spsPoloniumPerTick: 1,
    boilerWaterPerTank: 16_000,
    boilerSteamPerTank: 160_000,
    boilerHeatedCoolantPerTank: 256_000,
    boilerSuperheatingHeatTransfer: 16_000_000,
    boilerWaterThermalEnthalpy: 10,
    boilerSteamEnergyEfficiency: 0.2,
    boilerWaterCoolantEfficiency: 1,
    boilerSodiumCoolantEfficiency: 1.8,
    turbineSteamPerInner: 64_000,
    turbineVentFlowRate: 32_000,
    turbineDisperserFlowRate: 1_280,
    turbineBladesPerCoil: 4,
    turbineMaxBlades: 28,
    turbineMaxEnergyPerSteam: 10,
    turbineWaterPerCondenser: 6_400,
    fissionFuelPerAssemblyBlock: 8_000,
    fissionCoolantPerInner: 10_000,
    fissionBurnPerAssembly: 1,
    fissionHardMaxBurnRate: 1_920,
    fissionEnergyPerFuel: 1_000_000,
    fissionCasingHeatCapacity: 1_000,
    fissionSurfaceAreaTarget: 4,
    fusionMaxInjectionRate: 98,
    fusionBurnTemperature: 100_000_000,
    fusionBurnRatio: 1,
    fusionPlasmaCaseConductivity: 0.2,
    fusionThermocoupleEfficiency: 0.05,
    fusionCasingThermalConductivity: 0.1,
    fusionWaterHeatingRatio: 0.3,
    fusionEnergyPerFuel: 10_000_000,
    fusionFuelCapacity: 1_000_000,
    fusionEnergyCapacity: 1_000_000_000,
    fusionWaterPerInjection: 1_000_000,
    fusionSteamPerInjectionCapacity: 100_000_000,
    fusionWaterTempPerInjection: 65,
    fusionSodiumTempPerInjection: 44,
} as const

export const minimumPortsByType: Record<MultiblockKey, number> = {
    dynamicTank: 1,
    thermalEvaporationPlant: 2,
    sps: 3,
    thermoelectricBoiler: 2,
    inductionMatrix: 1,
    industrialTurbine: 1,
    fissionReactor: 4,
    fusionReactor: 2,
}

const clampMin = (value: number, min: number): number => Math.max(min, Math.floor(value))

const outerShellBlocks = ({ width, height, length }: Dimensions): number =>
    2 * (width * height + width * length + height * length) - 4 * (width + height + length) + 8

const frameBlocks = ({ width, height, length }: Dimensions): number =>
    4 * (width + height + length) - 16

const innerVolume = ({ width, height, length }: Dimensions): number => {
    const insideWidth = Math.max(width - 2, 0)
    const insideHeight = Math.max(height - 2, 0)
    const insideLength = Math.max(length - 2, 0)
    return insideWidth * insideHeight * insideLength
}

const normalizePorts = (ports: number): number => Math.max(0, Math.floor(ports))

const addLine = (lines: RequirementLine[], key: ResourceKey, count: number): void => {
    if (count > 0) {
        lines.push({ key, count })
    }
}

const addSpec = (specs: SpecLine[], key: SpecKey, value: number, unit: string): void => {
    specs.push({ key, value, unit })
}

const round = (value: number, digits = 1): number => {
    const base = 10 ** digits
    return Math.round(value * base) / base
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)

const getCoolantEfficiency = (coolantType: CoolantType): number =>
    coolantType === 'sodium' ? plannerDefaults.boilerSodiumCoolantEfficiency : plannerDefaults.boilerWaterCoolantEfficiency

const toEven = (value: number): number => Math.floor(value / 2) * 2

export const estimateFissionMaxBurnRate = (
    assemblyBlocks: number,
): number => {
    const structuralMax = Math.floor(assemblyBlocks * plannerDefaults.fissionBurnPerAssembly)
    return Math.max(Math.min(structuralMax, plannerDefaults.fissionHardMaxBurnRate), 0)
}

const splitShellMaterial = (
    dims: Dimensions,
    shellBlocks: number,
    dedicatedShellBlocks: number,
    useGlass: boolean,
): { casingCount: number; glassCount: number } => {
    const frame = frameBlocks(dims)
    const walls = Math.max(shellBlocks - frame, 0)
    if (!useGlass) {
        return {
            casingCount: Math.max(shellBlocks - dedicatedShellBlocks, 0),
            glassCount: 0,
        }
    }

    const glassCount = Math.max(walls - dedicatedShellBlocks, 0)
    const casingCount = Math.max(shellBlocks - dedicatedShellBlocks - glassCount, 0)
    return { casingCount, glassCount }
}

const validateCuboidRange = (dims: Dimensions, errors: string[]): void => {
    if (dims.width < MIN_CUBOID || dims.width > MAX_CUBOID) {
        errors.push(`Width must be between ${MIN_CUBOID} and ${MAX_CUBOID}.`)
    }
    if (dims.height < MIN_CUBOID || dims.height > MAX_CUBOID) {
        errors.push(`Height must be between ${MIN_CUBOID} and ${MAX_CUBOID}.`)
    }
    if (dims.length < MIN_CUBOID || dims.length > MAX_CUBOID) {
        errors.push(`Length must be between ${MIN_CUBOID} and ${MAX_CUBOID}.`)
    }
}

const withFixedDimensions = (width: number, height: number, length: number): Dimensions => ({
    width,
    height,
    length,
})

const buildInvalidResult = (dimensions: Dimensions, shellBlocks: number, freeInnerVolume: number, errors: string[]): CalculatorResult => ({
    isValid: false,
    errors,
    notes: [],
    dimensions,
    shellBlocks,
    innerVolume: freeInnerVolume,
    lines: [],
    specs: [],
})

export function calculateRequirements(input: CalculatorInput): CalculatorResult {
    const errors: string[] = []
    const notes: CalculationNoteKey[] = []
    const lines: RequirementLine[] = []
    const specs: SpecLine[] = []

    const dims = withFixedDimensions(
        clampMin(input.dimensions.width, 1),
        clampMin(input.dimensions.height, 1),
        clampMin(input.dimensions.length, 1),
    )

    const ports = normalizePorts(input.ports)
    const useStructuralGlass = input.useStructuralGlass === true
    const useReactorGlass = input.useReactorGlass === true
    const coolantType = input.coolantType ?? 'water'
    const minimumPorts =
        input.type === 'thermalEvaporationPlant' && input.evaporationUseSolarGenerators !== true
            ? 3
            : minimumPortsByType[input.type]

    if (ports < minimumPorts) {
        errors.push(`This structure needs at least ${minimumPorts} ports/valves for practical operation.`)
    }

    if (input.type === 'thermalEvaporationPlant') {
        if (dims.width !== 4 || dims.length !== 4) {
            errors.push('Thermal Evaporation Plant uses a fixed 4x4 footprint.')
        }
        if (dims.height < 3 || dims.height > 18) {
            errors.push('Thermal Evaporation Plant height must be between 3 and 18.')
        }
    } else if (input.type === 'sps') {
        if (dims.width !== 7 || dims.height !== 7 || dims.length !== 7) {
            errors.push('SPS is a fixed 7x7x7 structure.')
        }
    } else if (input.type === 'fusionReactor') {
        if (dims.width !== 5 || dims.height !== 5 || dims.length !== 5) {
            errors.push('Fusion Reactor is a fixed 5x5x5 structure.')
        }
    } else if (input.type === 'industrialTurbine') {
        if (dims.width < 5 || dims.width > 17 || dims.length < 5 || dims.length > 17 || dims.height < 5 || dims.height > 18) {
            errors.push('Industrial Turbine dimensions must be width/length 5..17 and height 5..18.')
        }
        if (dims.width % 2 !== 1 || dims.length % 2 !== 1) {
            errors.push('Industrial Turbine width and length must be odd numbers.')
        }
    } else {
        validateCuboidRange(dims, errors)
    }

    const shellBlocks = outerShellBlocks(dims)
    const freeInnerVolume = innerVolume(dims)

    if (errors.length > 0) {
        return buildInvalidResult(dims, shellBlocks, freeInnerVolume, errors)
    }

    switch (input.type) {
        case 'dynamicTank': {
            const dedicatedShellBlocks = ports
            const shellMaterial = splitShellMaterial(dims, shellBlocks, dedicatedShellBlocks, useStructuralGlass)
            const totalVolume = dims.width * dims.height * dims.length
            addLine(lines, 'dynamicValve', ports)
            addLine(lines, 'dynamicTankCasing', shellMaterial.casingCount)
            addLine(lines, 'structuralGlass', shellMaterial.glassCount)
            addSpec(specs, 'dynamicTankFluidCapacity', totalVolume * plannerDefaults.dynamicTankFluidPerVolume, 'mB')
            addSpec(
                specs,
                'dynamicTankChemicalCapacity',
                totalVolume * plannerDefaults.dynamicTankChemicalPerVolume,
                'mB',
            )
            break
        }

        case 'inductionMatrix': {
            const cells = Math.max(0, Math.floor(input.matrixCells ?? 0))
            const providers = Math.max(0, Math.floor(input.matrixProviders ?? 0))
            if (cells + providers > freeInnerVolume) {
                errors.push('Induction Cells + Induction Providers must fit inside the inner volume.')
            }

            const dedicatedShellBlocks = ports
            const shellMaterial = splitShellMaterial(dims, shellBlocks, dedicatedShellBlocks, useStructuralGlass)
            addLine(lines, 'inductionPort', ports)
            addLine(lines, 'inductionCasing', shellMaterial.casingCount)
            addLine(lines, 'structuralGlass', shellMaterial.glassCount)
            addLine(lines, 'inductionCell', cells)
            addLine(lines, 'inductionProvider', providers)
            addSpec(specs, 'inductionEnergyCapacity', cells * plannerDefaults.inductionCellCapacity, 'FE')
            addSpec(specs, 'inductionInputOutputRate', providers * plannerDefaults.inductionProviderRate, 'FE/t')
            break
        }

        case 'thermalEvaporationPlant': {
            const useSolarGenerators = input.evaporationUseSolarGenerators === true
            const solarGenerators = useSolarGenerators ? plannerDefaults.evaporationSolarGeneratorCount : 0
            const totalThermalStructureBlocks = 16 + 12 * Math.max(dims.height - 1, 0)
            const maxPortsByModel = Math.max(totalThermalStructureBlocks - 1 - solarGenerators, 0)
            if (ports > maxPortsByModel) {
                errors.push(`Thermal Evaporation Plant ports/valves must be <= ${maxPortsByModel} for the selected layout.`)
            }
            const dedicatedBlocks = ports + 1
            const replaceableBlocks = Math.max(totalThermalStructureBlocks - dedicatedBlocks, 0)
            const nonSolarReplaceableBlocks = Math.max(replaceableBlocks - solarGenerators, 0)
            const thermalEvaporationBlockCount = useStructuralGlass ? 0 : nonSolarReplaceableBlocks
            const structuralGlassCount = useStructuralGlass ? nonSolarReplaceableBlocks : 0
            const evaporationTemperatureKk = clamp(
                input.evaporationTemperatureKk ?? plannerDefaults.evaporationDefaultTemperatureKk,
                0,
                3,
            )
            const evaporationTemperatureK = evaporationTemperatureKk * 1_000
            const tempMultiplierRaw =
                (Math.min(plannerDefaults.evaporationMaxMultiplierTemperatureK, evaporationTemperatureK) -
                    plannerDefaults.evaporationAmbientTemperatureK) *
                plannerDefaults.evaporationTempMultiplier *
                (dims.height / 18)
            const tempMultiplier = Math.max(tempMultiplierRaw, 0)
            const production =
                tempMultiplier > 0 && tempMultiplier < 1
                    ? round(1 / Math.ceil(1 / tempMultiplier), 3)
                    : round(tempMultiplier, 3)
            addLine(lines, 'thermalEvaporationController', 1)
            addLine(lines, 'thermalEvaporationValve', ports)
            addLine(lines, 'thermalEvaporationBlock', thermalEvaporationBlockCount)
            addLine(lines, 'structuralGlass', structuralGlassCount)
            addLine(
                lines,
                'advancedSolarGenerator',
                solarGenerators,
            )
            addSpec(
                specs,
                'evaporationInputCapacity',
                dims.width * dims.height * dims.length * plannerDefaults.evaporationTankPerInner,
                'mB',
            )
            addSpec(specs, 'evaporationOutputCapacity', plannerDefaults.evaporationOutputBase, 'mB')
            addSpec(specs, 'evaporationWaterToBrineProduction', production, 'mB/t')
            addSpec(specs, 'evaporationBrineToLithiumProduction', production, 'mB/t')
            if (useSolarGenerators) {
                notes.push('evaporationSolarPatternModel')
            }
            break
        }

        case 'sps': {
            const coils = clamp(Math.floor(input.spsCoils ?? 1), 1, 1)
            // SPSValidator uses a fixed 7x7x7 shape with a custom allowed grid.
            // The official SPSBuilder composes the shell as:
            // - 60 frame casing blocks
            // - 126 face positions that can be casing/structural glass/ports
            // Total required shell blocks = 186.
            const spsRequiredShellBlocks = 186
            const spsFrameOnlyBlocks = 60
            const spsPortCompatibleBlocks = 126
            if (ports > spsPortCompatibleBlocks) {
                errors.push(`SPS ports must be between ${minimumPortsByType.sps} and ${spsPortCompatibleBlocks}.`)
            }
            const shellMaterial = useStructuralGlass
                ? {
                    casingCount: spsFrameOnlyBlocks,
                    glassCount: Math.max(spsPortCompatibleBlocks - ports, 0),
                }
                : {
                    casingCount: Math.max(spsRequiredShellBlocks - ports, 0),
                    glassCount: 0,
                }
            addLine(lines, 'spsPort', ports)
            addLine(lines, 'spsCasing', shellMaterial.casingCount)
            addLine(lines, 'structuralGlass', shellMaterial.glassCount)
            addLine(lines, 'superchargedCoil', coils)
            addSpec(specs, 'spsEnergyInput', plannerDefaults.spsEnergyInput, 'FE/t')
            addSpec(specs, 'spsPoloniumConsumption', plannerDefaults.spsPoloniumPerTick, 'mB/t')
            addSpec(specs, 'spsCoilEfficiency', 100, '%')
            notes.push('spsFixedShape')
            break
        }

        case 'thermoelectricBoiler': {
            const innerWidth = Math.max(dims.width - 2, 0)
            const innerLength = Math.max(dims.length - 2, 0)
            if (dims.height < 4) {
                errors.push('Thermoelectric Boiler needs at least height 4 for water and steam sections.')
            }
            const steamHeight = Math.max(1, Math.floor(input.boilerSteamHeight ?? 1))
            if (steamHeight > Math.max(dims.height - 3, 1)) {
                errors.push('Boiler steam height must leave room for water and one pressure disperser layer.')
            }
            const waterHeight = Math.max(dims.height - steamHeight - 2, 0)
            const maxUsefulSuperheating = innerWidth * innerLength * waterHeight
            const superheating = Math.max(
                0,
                Math.floor(
                    input.boilerSuperheatingElements ??
                    ((input.boilerSuperheatingLayers ?? 0) * innerWidth * innerLength),
                ),
            )
            if (superheating > maxUsefulSuperheating) {
                errors.push(`Superheating elements must be between 0 and ${maxUsefulSuperheating} for this steam split.`)
            }
            const dispersers = innerWidth * innerLength
            const dedicatedShellBlocks = ports
            const shellMaterial = splitShellMaterial(dims, shellBlocks, dedicatedShellBlocks, useStructuralGlass)
            const layerFootprint = dims.width * dims.length
            const waterBlocks = Math.max(layerFootprint * waterHeight - superheating, 0)
            const steamBlocks = layerFootprint * (steamHeight + 1)
            const boilerMaxBoilRate = Math.floor(
                (plannerDefaults.boilerSuperheatingHeatTransfer * superheating) /
                plannerDefaults.boilerWaterThermalEnthalpy *
                plannerDefaults.boilerSteamEnergyEfficiency,
            )
            const coolantEfficiency = getCoolantEfficiency(coolantType)
            const coolantHeatingRate = round(boilerMaxBoilRate * coolantEfficiency)
            const coolantTemperature = round(
                300 +
                superheating *
                (coolantType === 'sodium'
                    ? plannerDefaults.fusionSodiumTempPerInjection
                    : plannerDefaults.fusionWaterTempPerInjection),
            )
            addLine(lines, 'boilerValve', ports)
            addLine(lines, 'boilerCasing', shellMaterial.casingCount)
            addLine(lines, 'structuralGlass', shellMaterial.glassCount)
            addLine(lines, 'pressureDisperser', dispersers)
            addLine(lines, 'superheatingElement', superheating)
            addSpec(specs, 'boilerWaterCapacity', waterBlocks * plannerDefaults.boilerWaterPerTank, 'mB')
            addSpec(specs, 'boilerSteamCapacity', steamBlocks * plannerDefaults.boilerSteamPerTank, 'mB')
            addSpec(specs, 'boilerHeatedCoolantCapacity', waterBlocks * plannerDefaults.boilerHeatedCoolantPerTank, 'mB')
            addSpec(specs, 'boilerMaxBoilRate', boilerMaxBoilRate, 'mB/t')
            addSpec(
                specs,
                'boilerCoolingEfficiency',
                maxUsefulSuperheating === 0 ? 0 : round((superheating / maxUsefulSuperheating) * 100),
                '%',
            )
            addSpec(specs, 'boilerCoolantHeatingRate', coolantHeatingRate, 'mB/t')
            addSpec(specs, 'boilerCoolantTemperature', coolantTemperature, 'K')
            notes.push('boilerLayerModel')
            break
        }

        case 'industrialTurbine': {
            const maxRotorHeight = Math.max(dims.height - 4, 0)
            const rotorHeight = Math.max(1, Math.floor(input.turbineRotorHeight ?? maxRotorHeight))
            if (rotorHeight > maxRotorHeight) {
                errors.push(`Rotor height must be between 1 and ${maxRotorHeight}.`)
            }
            const bladesPerRotor = clamp(Math.floor(input.turbineBladesPerRotor ?? 2), 0, 2)
            const coils = Math.max(1, Math.floor(input.turbineCoils ?? 1))
            const condensers = Math.max(0, Math.floor(input.turbineCondensers ?? 0))
            const vents = Math.max(1, Math.floor(input.turbineVents ?? 1))
            const dispersers = Math.max((dims.width - 2) * (dims.length - 2) - 1, 0)
            if (ports + vents > shellBlocks) {
                errors.push('Ports + vents cannot exceed the outer shell block count.')
            }

            const dedicatedShellBlocks = ports + vents
            const shellMaterial = splitShellMaterial(dims, shellBlocks, dedicatedShellBlocks, useReactorGlass)
            const blades = rotorHeight * bladesPerRotor
            const lowerVolume = dims.width * dims.length * rotorHeight
            const disperserLimitedFlowRate = lowerVolume * dispersers * plannerDefaults.turbineDisperserFlowRate
            const ventLimitedFlowRate = vents * plannerDefaults.turbineVentFlowRate
            const maxFlowRate = Math.min(disperserLimitedFlowRate, ventLimitedFlowRate)
            const bladeLimiter = Math.min(blades, coils * plannerDefaults.turbineBladesPerCoil)
            const energyMultiplier =
                (plannerDefaults.turbineMaxEnergyPerSteam / plannerDefaults.turbineMaxBlades) * bladeLimiter
            const canProcessSteam = bladeLimiter > 0
            const maxUsefulVents = Math.ceil(disperserLimitedFlowRate / plannerDefaults.turbineVentFlowRate)
            const effectiveFlowForCondensers = canProcessSteam ? maxFlowRate : 0
            const maxUsefulCondensers = Math.ceil(effectiveFlowForCondensers / plannerDefaults.turbineWaterPerCondenser)
            addLine(lines, 'turbineValve', ports)
            addLine(lines, 'turbineVent', vents)
            addLine(lines, 'turbineCasing', shellMaterial.casingCount)
            addLine(lines, 'reactorGlass', shellMaterial.glassCount)
            addLine(lines, 'rotationalComplex', 1)
            addLine(lines, 'pressureDisperser', dispersers)
            addLine(lines, 'turbineRotor', rotorHeight)
            addLine(lines, 'turbineBlade', blades)
            addLine(lines, 'electromagneticCoil', coils)
            addLine(lines, 'saturatingCondenser', condensers)
            addSpec(specs, 'turbineSteamCapacity', lowerVolume * plannerDefaults.turbineSteamPerInner, 'mB')
            addSpec(specs, 'turbineMaxFlowRate', maxFlowRate, 'mB/t')
            addSpec(
                specs,
                'turbineMaxPowerGeneration',
                round(maxFlowRate * energyMultiplier),
                'FE/t',
            )
            addSpec(specs, 'turbineMaxWaterOutput', condensers * plannerDefaults.turbineWaterPerCondenser, 'mB/t')
            notes.push('turbineApproximation')
            if (bladeLimiter < blades) {
                notes.push('turbineBladeSoftCap')
            }
            if (vents > maxUsefulVents) {
                notes.push('turbineVentSoftCap')
            }
            if (condensers > maxUsefulCondensers) {
                notes.push('turbineCondenserSoftCap')
            }
            break
        }

        case 'fissionReactor': {
            const innerFootprint = Math.max((dims.width - 2) * (dims.length - 2), 0)
            const maxAssemblySlots = Math.ceil(innerFootprint / 2)
            const maxAssemblyHeight = Math.max(dims.height - 3, 0)
            const assemblies = Math.max(0, Math.floor(input.fissionAssemblies ?? maxAssemblySlots))
            const assemblyHeight = Math.max(1, Math.floor(input.fissionAssemblyHeight ?? maxAssemblyHeight))
            if (assemblies > maxAssemblySlots) {
                errors.push(`Assembly count must be between 0 and ${maxAssemblySlots} for this footprint.`)
            }
            if (assemblyHeight > maxAssemblyHeight) {
                errors.push(`Assembly height must be between 1 and ${maxAssemblyHeight}.`)
            }
            const logicAdapters = Math.max(0, Math.floor(input.fissionLogicAdapters ?? 0))
            const dedicatedShellBlocks = ports + logicAdapters
            if (dedicatedShellBlocks > shellBlocks) {
                errors.push('Fission shell components exceed available outer shell blocks (ports + logic adapters).')
            }
            const shellMaterial = splitShellMaterial(dims, shellBlocks, dedicatedShellBlocks, useReactorGlass)
            const assemblyBlocks = assemblies * assemblyHeight
            const maxBurnRate = estimateFissionMaxBurnRate(assemblyBlocks)
            const selectedBurnRate = clamp(Math.floor(input.fissionBurnRate ?? maxBurnRate), 0, maxBurnRate)
            const heatCapacity = shellBlocks * plannerDefaults.fissionCasingHeatCapacity
            const boilEfficiency = assemblies === 0
                ? 0
                : Math.min(1, Math.max(assemblyHeight, 0) / plannerDefaults.fissionSurfaceAreaTarget)
            const coolantConductivity = coolantType === 'sodium'
                ? FISSION_SODIUM_CONDUCTIVITY
                : FISSION_WATER_CONDUCTIVITY
            const generatedHeatPerTick = selectedBurnRate * plannerDefaults.fissionEnergyPerFuel
            const coolingCoefficient = boilEfficiency * coolantConductivity
            const environmentCoefficient = 1 / FISSION_ENVIRONMENT_INVERSE_CONDUCTION
            const denominator = coolingCoefficient + environmentCoefficient
            const coolantTemperature = denominator > 0
                ? round(
                    (
                        generatedHeatPerTick / heatCapacity +
                        coolingCoefficient * FISSION_BASE_BOIL_TEMPERATURE_K +
                        environmentCoefficient * plannerDefaults.evaporationAmbientTemperatureK
                    ) / denominator,
                )
                : plannerDefaults.evaporationAmbientTemperatureK
            const environmentHeatLoss =
                heatCapacity * environmentCoefficient * Math.max(coolantTemperature - plannerDefaults.evaporationAmbientTemperatureK, 0)
            const coolantCapturedHeat = Math.max(generatedHeatPerTick - environmentHeatLoss, 0)
            const coolantHeatingRate = round(
                coolantType === 'sodium'
                    ? coolantCapturedHeat / FISSION_SODIUM_THERMAL_ENTHALPY
                    : (plannerDefaults.boilerSteamEnergyEfficiency * coolantCapturedHeat) / plannerDefaults.boilerWaterThermalEnthalpy,
            )
            addLine(lines, 'fissionReactorPort', ports)
            addLine(lines, 'fissionReactorLogicAdapter', logicAdapters)
            addLine(lines, 'fissionReactorCasing', shellMaterial.casingCount)
            addLine(lines, 'reactorGlass', shellMaterial.glassCount)
            addLine(lines, 'fissionFuelAssembly', assemblyBlocks)
            addLine(lines, 'controlRodAssembly', assemblies)
            addSpec(specs, 'fissionFuelCapacity', assemblyBlocks * plannerDefaults.fissionFuelPerAssemblyBlock, 'mB')
            addSpec(specs, 'fissionHeatedCoolantCapacity', freeInnerVolume * plannerDefaults.fissionCoolantPerInner, 'mB')
            addSpec(specs, 'fissionWasteCapacity', assemblyBlocks * plannerDefaults.fissionFuelPerAssemblyBlock, 'mB')
            addSpec(specs, 'fissionMaxBurnRate', maxBurnRate, 'mB/t')
            addSpec(specs, 'fissionSelectedBurnRate', selectedBurnRate, 'mB/t')
            addSpec(
                specs,
                'fissionCoolingEfficiency',
                round(coolingCoefficient * 100),
                '%',
            )
            addSpec(specs, 'fissionCoolantHeatingRate', coolantHeatingRate, 'mB/t')
            addSpec(specs, 'fissionCoolantTemperature', coolantTemperature, 'K')
            notes.push('fissionAssemblyPattern')
            break
        }

        case 'fusionReactor': {
            const logicAdapters = Math.max(0, Math.floor(input.fusionLogicAdapters ?? 0))
            const laserMatrices = 1
            const dedicatedShellBlocks = ports + 1 + logicAdapters + laserMatrices
            if (dedicatedShellBlocks > shellBlocks) {
                errors.push('Fusion shell components exceed available outer shell blocks (ports + controller + logic adapters + laser matrices).')
            }
            const shellMaterial = splitShellMaterial(dims, shellBlocks, dedicatedShellBlocks, useReactorGlass)
            const requestedInjectionRate = Math.max(0, Math.floor(input.fusionInjectionRate ?? 2))
            const injectionRate = toEven(
                clamp(requestedInjectionRate, 0, plannerDefaults.fusionMaxInjectionRate),
            )
            const isWaterCooled = coolantType === 'water'
            const k = isWaterCooled ? plannerDefaults.fusionWaterHeatingRatio : 0
            const caseAirConductivity = plannerDefaults.fusionCasingThermalConductivity
            const denominator = plannerDefaults.fusionEnergyPerFuel * plannerDefaults.fusionBurnRatio *
                (plannerDefaults.fusionPlasmaCaseConductivity + k + caseAirConductivity) -
                plannerDefaults.fusionPlasmaCaseConductivity * (k + caseAirConductivity)
            const minInjectionRate = denominator <= 0
                ? plannerDefaults.fusionMaxInjectionRate
                : 2 * Math.ceil(
                    (
                        plannerDefaults.fusionBurnTemperature * plannerDefaults.fusionBurnRatio * plannerDefaults.fusionPlasmaCaseConductivity *
                        (k + caseAirConductivity)
                    ) /
                    denominator /
                    2,
                )
            const equilibriumInjection = Math.max(injectionRate, minInjectionRate)
            const maxCasingTemperature =
                (plannerDefaults.fusionEnergyPerFuel * equilibriumInjection) /
                (k + caseAirConductivity)
            const passiveGeneration =
                plannerDefaults.fusionThermocoupleEfficiency *
                plannerDefaults.fusionCasingThermalConductivity *
                maxCasingTemperature
            const steamProduction = isWaterCooled
                ? (plannerDefaults.boilerSteamEnergyEfficiency * plannerDefaults.fusionWaterHeatingRatio * maxCasingTemperature) /
                plannerDefaults.boilerWaterThermalEnthalpy
                : 0
            addLine(lines, 'fusionReactorController', 1)
            addLine(lines, 'fusionReactorPort', ports)
            addLine(lines, 'fusionReactorLogicAdapter', logicAdapters)
            addLine(lines, 'laserFocusMatrix', laserMatrices)
            addLine(lines, 'fusionReactorFrame', shellMaterial.casingCount)
            addLine(lines, 'reactorGlass', shellMaterial.glassCount)
            addSpec(specs, 'fusionFuelCapacity', plannerDefaults.fusionFuelCapacity, 'mB')
            addSpec(specs, 'fusionEnergyCapacity', plannerDefaults.fusionEnergyCapacity, 'FE')
            addSpec(specs, 'fusionPassiveGeneration', Math.floor(passiveGeneration), 'FE/t')
            addSpec(
                specs,
                'fusionSteamProduction',
                Math.floor(steamProduction),
                'mB/t',
            )
            addSpec(
                specs,
                'fusionCoolingTransferRate',
                isWaterCooled ? 0 : Math.floor(passiveGeneration / Math.max(plannerDefaults.fusionEnergyPerFuel, 1)),
                'mB/t',
            )
            addSpec(specs, 'fusionCasingTemperature', round(maxCasingTemperature), 'K')
            break
        }

        default: {
            const exhaustive: never = input.type
            throw new Error(`Unhandled multiblock type: ${exhaustive}`)
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        notes: [...notes, 'specModelAssumption'],
        dimensions: dims,
        shellBlocks,
        innerVolume: freeInnerVolume,
        lines,
        specs,
    }
}
