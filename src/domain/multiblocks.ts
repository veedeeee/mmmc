export type MultiblockKey =
    | 'dynamicTank'
    | 'thermalEvaporationPlant'
    | 'sps'
    | 'thermoelectricBoiler'
    | 'inductionMatrix'
    | 'industrialTurbine'
    | 'fissionReactor'
    | 'fusionReactor'
    | 'quantumComputer'
    | 'matrixAssembler'
    | 'steamBoilerEngine'

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
    | 'quantumCore'
    | 'quantumDataEntangler'
    | 'quantumMultiThreader'
    | 'quantumAccelerator'
    | 'quantumComputerStructuralGlass'
    | 'quantumCraftingUnit'
    | 'quantumStorage128'
    | 'quantumStorage256'
    | 'assemblerMatrixFrame'
    | 'assemblerMatrixWall'
    | 'assemblerMatrixPatternCore'
    | 'assemblerMatrixCraftCore'
    | 'assemblerMatrixSpeedCore'
    | 'createFluidTank'
    | 'createBlazeBurner'
    | 'createSteamEngine'
    | 'createStraw'

export type CalculationNoteKey =
    | 'spsFixedShape'
    | 'boilerLayerModel'
    | 'fissionAssemblyPattern'
    | 'turbineApproximation'
    | 'specModelAssumption'
    | 'pendingImplementation'
    | 'quantumStructureBoundaryRule'
    | 'quantumStorageTierRule'
    | 'evaporationSolarPatternModel'
    | 'coilSoftCap'
    | 'turbineBladeSoftCap'
    | 'turbineVentSoftCap'
    | 'turbineCondenserSoftCap'
    | 'matrixAssemblerRules'
    | 'matrixAssemblerSpeedCoreCap'
    | 'createBoilerRules'
    | 'createLiquidFuelNeedsStraw'

export type CoolantType = 'water' | 'sodium'

export type CreateBoilerFuelType =
    | 'coal'
    | 'blazeCake'
    | 'lava'
    | 'ethanol'
    | 'creosote'
    | 'plantoil'
    | 'crudeOil'
    | 'biofuel'
    | 'biodiesel'
    | 'diesel'
    | 'gasoline'

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
    | 'quantumTotalStorage'
    | 'quantumCoProcessors'
    | 'matrixAssemblerPatternSlots'
    | 'matrixAssemblerMaxConcurrentJobs'
    | 'matrixAssemblerSpeedCoreEffectiveness'
    | 'createBoilerLevel'
    | 'createSteamEngineSu'
    | 'createBoilerRequiredWaterFlow'

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
    quantumStorageTier?: 128 | 256
    quantumDataEntanglers?: number
    quantumMultiThreaders?: number
    quantumAccelerators?: number
    quantumStorageBlocks?: number
    matrixPatternCores?: number
    matrixCraftCores?: number
    matrixSpeedCores?: number
    createBlazeBurners?: number
    createFuelType?: CreateBoilerFuelType
    createSteamEngines?: number
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
const QUANTUM_MAX_SIZE = 7
const QUANTUM_DATA_ENTANGLER_MULTIPLIER = 4
const QUANTUM_ACCELERATOR_THREADS = 8
const QUANTUM_MULTI_THREADER_MULTIPLIER = 4
const MATRIX_ASSEMBLER_MIN_SIZE = 3
const MATRIX_ASSEMBLER_MAX_SIZE = 7
const CREATE_BOILER_MIN_EDGE = 1
const CREATE_BOILER_MAX_EDGE = 3
const CREATE_BOILER_MAX_HEIGHT = 8
const MATRIX_PATTERN_SLOTS_PER_CORE = 36
const MATRIX_CRAFT_THREADS_PER_CORE = 8
const MATRIX_EFFECTIVE_SPEED_CORE_CAP = 5
const CREATE_BOILER_MAX_LEVEL = 18
const CREATE_BOILER_WATER_PER_LEVEL = 10
const CREATE_STEAM_ENGINE_BASE_SU = 1024
const CREATE_BLAZE_BURNER_HEAT_SOLID = 1
const CREATE_BLAZE_BURNER_HEAT_LIQUID = 2
const CREATE_BLAZE_BURNER_MIN = 1
const CREATE_STEAM_ENGINE_MIN = 1
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
    quantumComputer: 0,
    matrixAssembler: 0,
    steamBoilerEngine: 0,
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

const isStandaloneQuantumCore = (dims: Dimensions): boolean =>
    dims.width === 1 && dims.height === 1 && dims.length === 1

const createFuelHeatProfile: Record<CreateBoilerFuelType, { heat: 1 | 2; requiresStraw: boolean }> = {
    coal: { heat: 1, requiresStraw: false },
    blazeCake: { heat: 2, requiresStraw: false },
    lava: { heat: 1, requiresStraw: true },
    ethanol: { heat: 1, requiresStraw: true },
    creosote: { heat: 1, requiresStraw: true },
    plantoil: { heat: 1, requiresStraw: true },
    crudeOil: { heat: 1, requiresStraw: true },
    biofuel: { heat: 2, requiresStraw: true },
    biodiesel: { heat: 2, requiresStraw: true },
    diesel: { heat: 2, requiresStraw: true },
    gasoline: { heat: 2, requiresStraw: true },
}

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
    } else if (input.type === 'quantumComputer') {
        if (dims.width > QUANTUM_MAX_SIZE || dims.height > QUANTUM_MAX_SIZE || dims.length > QUANTUM_MAX_SIZE) {
            errors.push(`Quantum Computer dimensions must be <= ${QUANTUM_MAX_SIZE} in each axis.`)
        }
    } else if (input.type === 'matrixAssembler') {
        if (
            dims.width < MATRIX_ASSEMBLER_MIN_SIZE || dims.width > MATRIX_ASSEMBLER_MAX_SIZE ||
            dims.height < MATRIX_ASSEMBLER_MIN_SIZE || dims.height > MATRIX_ASSEMBLER_MAX_SIZE ||
            dims.length < MATRIX_ASSEMBLER_MIN_SIZE || dims.length > MATRIX_ASSEMBLER_MAX_SIZE
        ) {
            errors.push(`Matrix Assembler edge lengths must be between ${MATRIX_ASSEMBLER_MIN_SIZE} and ${MATRIX_ASSEMBLER_MAX_SIZE}.`)
        }
    } else if (input.type === 'steamBoilerEngine') {
        if (
            dims.width < CREATE_BOILER_MIN_EDGE || dims.width > CREATE_BOILER_MAX_EDGE ||
            dims.height < CREATE_BOILER_MIN_EDGE || dims.height > CREATE_BOILER_MAX_HEIGHT ||
            dims.length < CREATE_BOILER_MIN_EDGE || dims.length > CREATE_BOILER_MAX_EDGE
        ) {
            errors.push(
                `Steam Boiler dimensions must be width/length ${CREATE_BOILER_MIN_EDGE}..${CREATE_BOILER_MAX_EDGE} and height ${CREATE_BOILER_MIN_EDGE}..${CREATE_BOILER_MAX_HEIGHT}.`,
            )
        }
        if (dims.width !== dims.length) {
            errors.push('Create Fluid Tank footprint must be square (width must equal length).')
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

        case 'quantumComputer': {
            const standalone = isStandaloneQuantumCore(dims)
            const boundaryBlocks = standalone ? 0 : shellBlocks
            const interiorBlocks = standalone ? 0 : freeInnerVolume
            const optionalSlots = standalone ? 0 : Math.max(interiorBlocks - 1, 0)
            const dataEntanglers = clamp(Math.floor(input.quantumDataEntanglers ?? 0), 0, Math.min(optionalSlots, 1))
            const optionalSlotsAfterEntanglers = Math.max(optionalSlots - dataEntanglers, 0)
            const multiThreaders = clamp(Math.floor(input.quantumMultiThreaders ?? 0), 0, Math.min(optionalSlotsAfterEntanglers, 1))
            const optionalSlotsAfterSpecials = Math.max(optionalSlotsAfterEntanglers - multiThreaders, 0)
            const accelerators = clamp(Math.floor(input.quantumAccelerators ?? 0), 0, optionalSlotsAfterSpecials)
            const storageSlotsMax = Math.max(optionalSlotsAfterSpecials - accelerators, 0)
            const storageTier = input.quantumStorageTier ?? 256
            const storageCells = clamp(Math.floor(input.quantumStorageBlocks ?? storageSlotsMax), 0, storageSlotsMax)
            const quantumCraftingUnits = Math.max(storageSlotsMax - storageCells, 0)
            const baseStorageM = 256 + storageCells * storageTier
            const totalStorageM = baseStorageM * (dataEntanglers > 0 ? QUANTUM_DATA_ENTANGLER_MULTIPLIER : 1)
            const baseCoProcessors = (1 + accelerators) * QUANTUM_ACCELERATOR_THREADS
            const totalCoProcessors = baseCoProcessors * (multiThreaders > 0 ? QUANTUM_MULTI_THREADER_MULTIPLIER : 1)

            addLine(lines, 'quantumCore', 1)
            addLine(lines, 'quantumDataEntangler', dataEntanglers)
            addLine(lines, 'quantumMultiThreader', multiThreaders)
            addLine(lines, 'quantumAccelerator', accelerators)
            addLine(lines, 'quantumComputerStructuralGlass', boundaryBlocks)
            addLine(lines, 'quantumCraftingUnit', quantumCraftingUnits)
            addLine(lines, storageTier === 128 ? 'quantumStorage128' : 'quantumStorage256', storageCells)

            addSpec(specs, 'quantumTotalStorage', totalStorageM, 'M')
            addSpec(specs, 'quantumCoProcessors', totalCoProcessors, 'threads')

            notes.push('quantumStructureBoundaryRule')
            notes.push('quantumStorageTierRule')
            break
        }

        case 'matrixAssembler':
            {
                const edgeFrames = frameBlocks(dims)
                const faceBlocks = Math.max(shellBlocks - edgeFrames, 0)
                const interiorSlots = freeInnerVolume
                const patternCores = Math.max(0, Math.floor(input.matrixPatternCores ?? 1))
                const craftCores = Math.max(0, Math.floor(input.matrixCraftCores ?? 1))
                const speedCores = Math.max(0, Math.floor(input.matrixSpeedCores ?? 0))
                const filledInterior = patternCores + craftCores + speedCores

                if (patternCores < 1) {
                    errors.push('Matrix Assembler requires at least one Pattern Core.')
                }
                if (craftCores < 1) {
                    errors.push('Matrix Assembler requires at least one Craft Core.')
                }
                if (filledInterior !== interiorSlots) {
                    errors.push(`Matrix Assembler interior must be fully filled with Pattern/Craft/Speed cores (${interiorSlots} total).`)
                }

                addLine(lines, 'assemblerMatrixFrame', edgeFrames)
                addLine(lines, 'assemblerMatrixWall', faceBlocks)
                addLine(lines, 'assemblerMatrixPatternCore', patternCores)
                addLine(lines, 'assemblerMatrixCraftCore', craftCores)
                addLine(lines, 'assemblerMatrixSpeedCore', speedCores)

                const effectiveSpeedCores = Math.min(speedCores, MATRIX_EFFECTIVE_SPEED_CORE_CAP)
                const speedCoreEffectiveness = round((effectiveSpeedCores / MATRIX_EFFECTIVE_SPEED_CORE_CAP) * 100)
                addSpec(specs, 'matrixAssemblerPatternSlots', patternCores * MATRIX_PATTERN_SLOTS_PER_CORE, 'slots')
                addSpec(specs, 'matrixAssemblerMaxConcurrentJobs', craftCores * MATRIX_CRAFT_THREADS_PER_CORE, 'jobs')
                addSpec(specs, 'matrixAssemblerSpeedCoreEffectiveness', speedCoreEffectiveness, '%')

                notes.push('matrixAssemblerRules')
                if (speedCores > MATRIX_EFFECTIVE_SPEED_CORE_CAP) {
                    notes.push('matrixAssemblerSpeedCoreCap')
                }
                break
            }

        case 'steamBoilerEngine': {
            const tankWidth = Math.min(dims.width, dims.length)
            const tankSize = Math.max(tankWidth * tankWidth * dims.height, 0)
            const blazeBurners = Math.max(CREATE_BLAZE_BURNER_MIN, Math.floor(input.createBlazeBurners ?? CREATE_BLAZE_BURNER_MIN))
            const steamEngines = Math.max(CREATE_STEAM_ENGINE_MIN, Math.floor(input.createSteamEngines ?? CREATE_STEAM_ENGINE_MIN))
            const burnerFootprint = Math.max(tankWidth * tankWidth, 0)
            const fuelType = input.createFuelType ?? 'coal'
            const fuelProfile = createFuelHeatProfile[fuelType]
            const blazeBurnerHeat = fuelProfile.heat === 2 ? CREATE_BLAZE_BURNER_HEAT_LIQUID : CREATE_BLAZE_BURNER_HEAT_SOLID

            if (blazeBurners > burnerFootprint) {
                errors.push(`Blaze Burners must be <= tank footprint (${burnerFootprint}).`)
            }
            if (tankSize < 4) {
                errors.push('Steam Boiler requires at least 4 Fluid Tank blocks.')
            }

            const maxHeatForSize = Math.min(CREATE_BOILER_MAX_LEVEL, Math.floor(tankSize / 4))
            const activeHeat = blazeBurners * blazeBurnerHeat
            const boilerLevel = Math.max(0, Math.floor(Math.min(activeHeat, maxHeatForSize)))
            const engineEfficiency = boilerLevel === 0 ? 0 : steamEngines <= boilerLevel ? 1 : boilerLevel / steamEngines
            const totalSu = Math.floor(engineEfficiency * 16 * steamEngines * CREATE_STEAM_ENGINE_BASE_SU)
            const requiredWaterFlow = boilerLevel * CREATE_BOILER_WATER_PER_LEVEL

            addLine(lines, 'createFluidTank', tankSize)
            addLine(lines, 'createBlazeBurner', blazeBurners)
            addLine(lines, 'createSteamEngine', steamEngines)
            if (fuelProfile.requiresStraw) {
                addLine(lines, 'createStraw', blazeBurners)
            }

            addSpec(specs, 'createBoilerLevel', boilerLevel, 'lvl')
            addSpec(specs, 'createSteamEngineSu', totalSu, 'SU')
            addSpec(specs, 'createBoilerRequiredWaterFlow', requiredWaterFlow, 'mB/t')

            notes.push('createBoilerRules')
            if (fuelProfile.requiresStraw) {
                notes.push('createLiquidFuelNeedsStraw')
            }
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
