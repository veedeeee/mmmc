import { useMemo, useState, type KeyboardEvent } from 'react'
import {
  calculateRequirements,
  type CreateBoilerFuelType,
  estimateFissionMaxBurnRate,
  FISSION_CRITICAL_TEMPERATURE_K,
  FISSION_DANGER_TEMPERATURE_K,
  minimumPortsByType,
  type CalculationNoteKey,
  type CoolantType,
  type MultiblockKey,
  type ResourceKey,
  type SpecKey,
} from './domain/multiblocks'
import './App.css'

type Language = 'en' | 'ja'

type DimensionProfile = {
  width: { min: number; max: number; fixed?: number }
  height: { min: number; max: number; fixed?: number }
  length: { min: number; max: number; fixed?: number }
}

type FusionCoolingMode = 'waterCooled' | 'airCooled'

type SliderStateDefaults = {
  ports: number
  evaporationTemperatureKk: number
  matrixCells: number
  matrixProviders: number
  spsCoils: number
  boilerSteamHeight: number
  boilerSuperheatingElements: number
  turbineRotorHeight: number
  turbineBladesPerRotor: number
  turbineCoils: number
  turbineCondensers: number
  turbineUseTopVents: boolean
  turbineVentSideLayers: number
  fissionAssemblies: number
  fissionAssemblyHeight: number
  fissionLogicAdapters: number
  fusionLogicAdapters: number
  fusionInjectionRate: number
  quantumDataEntanglers: number
  quantumMultiThreaders: number
  quantumAccelerators: number
  quantumStorageBlocks: number
  matrixPatternCores: number
  matrixCraftCores: number
  matrixSpeedCores: number
  createBlazeBurners: number
  createSteamEngines: number
  createFuelType: CreateBoilerFuelType
}

type QuantumStorageTier = 128 | 256

const TURBINE_MAX_BLADES_PER_ROTOR = 2
const TURBINE_BLADES_PER_COIL = 4
const FUSION_MAX_INJECTION = 98
const MATRIX_SPEED_CORE_MAX = 5
const CREATE_BOILER_MAX_LEVEL = 18
const FUSION_BURN_TEMPERATURE_K = 100_000_000
const FUSION_BURN_RATIO = 1
const FUSION_PLASMA_CASE_CONDUCTIVITY = 0.2
const FUSION_CASING_THERMAL_CONDUCTIVITY = 0.1
const FUSION_WATER_HEATING_RATIO = 0.3
const FUSION_ENERGY_PER_FUEL = 10_000_000

const profiles: Record<MultiblockKey, DimensionProfile> = {
  dynamicTank: {
    width: { min: 3, max: 18 },
    height: { min: 3, max: 18 },
    length: { min: 3, max: 18 },
  },
  thermalEvaporationPlant: {
    width: { min: 4, max: 4, fixed: 4 },
    height: { min: 3, max: 18 },
    length: { min: 4, max: 4, fixed: 4 },
  },
  sps: {
    width: { min: 7, max: 7, fixed: 7 },
    height: { min: 7, max: 7, fixed: 7 },
    length: { min: 7, max: 7, fixed: 7 },
  },
  thermoelectricBoiler: {
    width: { min: 3, max: 18 },
    height: { min: 3, max: 18 },
    length: { min: 3, max: 18 },
  },
  inductionMatrix: {
    width: { min: 3, max: 18 },
    height: { min: 3, max: 18 },
    length: { min: 3, max: 18 },
  },
  industrialTurbine: {
    width: { min: 5, max: 17 },
    height: { min: 5, max: 18 },
    length: { min: 5, max: 17 },
  },
  fissionReactor: {
    width: { min: 3, max: 18 },
    height: { min: 3, max: 18 },
    length: { min: 3, max: 18 },
  },
  fusionReactor: {
    width: { min: 5, max: 5, fixed: 5 },
    height: { min: 5, max: 5, fixed: 5 },
    length: { min: 5, max: 5, fixed: 5 },
  },
  quantumComputer: {
    width: { min: 1, max: 7 },
    height: { min: 1, max: 7 },
    length: { min: 1, max: 7 },
  },
  matrixAssembler: {
    width: { min: 3, max: 7 },
    height: { min: 3, max: 7 },
    length: { min: 3, max: 7 },
  },
  steamBoilerEngine: {
    width: { min: 1, max: 3 },
    height: { min: 1, max: 8 },
    length: { min: 1, max: 3 },
  },
}

const structureGroups = {
  mekanism: [
    'dynamicTank',
    'thermalEvaporationPlant',
    'sps',
    'thermoelectricBoiler',
    'inductionMatrix',
  ] as MultiblockKey[],
  mekanismGenerators: ['industrialTurbine', 'fissionReactor', 'fusionReactor'] as MultiblockKey[],
  advancedAe: ['quantumComputer'] as MultiblockKey[],
  extendedAe: ['matrixAssembler'] as MultiblockKey[],
  create: ['steamBoilerEngine'] as MultiblockKey[],
}

const getDefaultDimensions = (type: MultiblockKey): { width: number; height: number; length: number } => {
  const profile = profiles[type]
  return {
    width: profile.width.fixed ?? profile.width.max,
    height: profile.height.fixed ?? profile.height.max,
    length: profile.length.fixed ?? profile.length.max,
  }
}

const getDefaultSliderState = (
  type: MultiblockKey,
  dimensions: { width: number; height: number; length: number },
): SliderStateDefaults => {
  const turbineRotorHeight = Math.max(dimensions.height - 4, 1)
  const turbineBladesPerRotor = TURBINE_MAX_BLADES_PER_ROTOR
  const turbinePracticalCoilsMax = Math.max(
    Math.ceil((turbineRotorHeight * TURBINE_MAX_BLADES_PER_ROTOR) / TURBINE_BLADES_PER_COIL),
    1,
  )
  const turbineCondensersMax = Math.max((dimensions.width - 2) * (dimensions.length - 2), 1)
  const fissionAssemblyHeight = Math.max(dimensions.height - 3, 1)
  const fissionAssemblySlots = Math.max(Math.ceil(Math.max((dimensions.width - 2) * (dimensions.length - 2), 0) / 2), 0)
  const defaults: SliderStateDefaults = {
    ports: minimumPortsByType[type],
    evaporationTemperatureKk: 3,
    matrixCells: 0,
    matrixProviders: 0,
    spsCoils: 1,
    boilerSteamHeight: 1,
    boilerSuperheatingElements: 1,
    turbineRotorHeight: 1,
    turbineBladesPerRotor,
    turbineCoils: turbinePracticalCoilsMax,
    turbineCondensers: turbineCondensersMax,
    turbineUseTopVents: true,
    turbineVentSideLayers: 0,
    fissionAssemblies: fissionAssemblySlots,
    fissionAssemblyHeight: 1,
    fissionLogicAdapters: 0,
    fusionLogicAdapters: 0,
    fusionInjectionRate: 2,
    quantumDataEntanglers: 0,
    quantumMultiThreaders: 0,
    quantumAccelerators: 0,
    quantumStorageBlocks: 0,
    matrixPatternCores: 1,
    matrixCraftCores: 1,
    matrixSpeedCores: 0,
    createBlazeBurners: 1,
    createSteamEngines: 4,
    createFuelType: 'coal',
  }

  if (type === 'steamBoilerEngine') {
    const boilerFootprint = Math.max(dimensions.width * dimensions.length, 1)
    defaults.createBlazeBurners = boilerFootprint
    defaults.createSteamEngines = CREATE_BOILER_MAX_LEVEL
    defaults.createFuelType = 'coal'
  }

  if (type === 'industrialTurbine') {
    defaults.turbineRotorHeight = turbineRotorHeight
  }

  if (type === 'thermalEvaporationPlant') {
    defaults.ports = 3
  }

  if (type === 'fissionReactor') {
    defaults.fissionAssemblyHeight = fissionAssemblyHeight
  }

  if (type === 'sps') {
    defaults.spsCoils = 1
  }

  if (type === 'quantumComputer') {
    const quantumOptionalSlots = Math.max((dimensions.width - 2) * (dimensions.height - 2) * (dimensions.length - 2) - 1, 0)
    const quantumDataEntanglers = Math.min(1, quantumOptionalSlots)
    const optionalAfterEntangler = Math.max(quantumOptionalSlots - quantumDataEntanglers, 0)
    const quantumMultiThreaders = Math.min(1, optionalAfterEntangler)
    const optionalAfterSpecials = Math.max(optionalAfterEntangler - quantumMultiThreaders, 0)
    const quantumStorageBlocks = Math.min(1, optionalAfterSpecials)
    const quantumAccelerators = Math.max(optionalAfterSpecials - quantumStorageBlocks, 0)

    defaults.quantumDataEntanglers = quantumDataEntanglers
    defaults.quantumMultiThreaders = quantumMultiThreaders
    defaults.quantumStorageBlocks = quantumStorageBlocks
    defaults.quantumAccelerators = quantumAccelerators
  }

  if (type === 'matrixAssembler') {
    const matrixInterior = Math.max((dimensions.width - 2) * (dimensions.height - 2) * (dimensions.length - 2), 0)
    const patternCores = Math.min(1, matrixInterior)
    const matrixAfterPattern = Math.max(matrixInterior - patternCores, 0)
    const speedCores = Math.min(5, Math.max(matrixAfterPattern - 1, 0))
    const craftCores = Math.max(matrixAfterPattern - speedCores, 0)
    defaults.matrixPatternCores = patternCores
    defaults.matrixSpeedCores = speedCores
    defaults.matrixCraftCores = craftCores
  }

  return defaults
}

const outerShellBlocks = (width: number, height: number, length: number): number =>
  2 * (width * height + width * length + height * length) - 4 * (width + height + length) + 8

const innerVolume = (width: number, height: number, length: number): number => {
  const insideWidth = Math.max(width - 2, 0)
  const insideHeight = Math.max(height - 2, 0)
  const insideLength = Math.max(length - 2, 0)
  return insideWidth * insideHeight * insideLength
}

const clampValue = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)

const copy = {
  en: {
    title: 'Modded Minecraft Multiblock Calculator',
    subtitle: 'Plan block requirements with size and port settings for every supported multiblock.',
    languageLabel: 'Language',
    languageButton: '日本語',
    structure: 'Structure',
    structureType: {
      dynamicTank: 'Dynamic Tank',
      thermalEvaporationPlant: 'Thermal Evaporation Plant',
      sps: 'SPS',
      thermoelectricBoiler: 'Thermoelectric Boiler',
      inductionMatrix: 'Induction Matrix',
      industrialTurbine: 'Industrial Turbine',
      fissionReactor: 'Fission Reactor',
      fusionReactor: 'Fusion Reactor',
      quantumComputer: 'Quantum Computer',
      matrixAssembler: 'Matrix Assembler',
      steamBoilerEngine: 'Steam Boiler & Steam Engine',
    } as Record<MultiblockKey, string>,
    groupMekanism: 'Mekanism',
    groupMekanismGenerators: 'Mekanism Generators',
    groupAdvancedAe: 'AdvancedAE',
    groupExtendedAe: 'ExtendedAE',
    groupCreate: 'Create / Create Crafts & Additions',
    useStructuralGlass: 'Use Structural Glass',
    useReactorGlass: 'Use Reactor Glass',
    evaporationSolarTop: 'Use top solar generator layout',
    coolantType: 'Coolant',
    coolantWater: 'Water',
    coolantSodium: 'Sodium',
    fusionCoolingType: 'Cooling',
    fusionCoolingWater: 'Water-cooled',
    fusionCoolingAir: 'Air-cooled',
    quantumStorageTier: 'Quantum storage tier',
    quantumUseDataEntangler: 'Use Quantum Data Entangler',
    quantumUseMultiThreader: 'Use Quantum Multi-threader',
    quantumStorage128: '128M',
    quantumStorage256: '256M',
    toggleOn: 'ON',
    toggleOff: 'OFF',
    numberInputSuffix: 'number input',
    width: 'Width',
    edge: 'Edge',
    height: 'Height',
    length: 'Length',
    ports: 'Ports / Valves',
    evaporationTemperature: 'Assumed evaporation temperature (kK)',
    matrixCells: 'Induction Cells',
    matrixProviders: 'Induction Providers',
    spsCoils: 'Supercharged Coils',
    boilerSteamHeight: 'Boiler steam height (inner layers)',
    boilerSuperheatingElements: 'Superheating elements',
    turbineRotorHeight: 'Rotor height (blocks)',
    turbineBladesPerRotor: 'Blades per rotor',
    turbineCoils: 'Electromagnetic coils',
    turbineCondensers: 'Saturating condensers',
    turbineUseTopVents: 'Use Turbine Vent for upper surface',
    turbineVentSideLayers: 'Turbine vent side layers',
    fissionAssemblies: 'Fuel assemblies',
    fissionAssemblyHeight: 'Fuel assembly height',
    fissionBurnRate: 'Burn rate',
    fissionLogicAdapters: 'Logic adapters',
    fusionLogicAdapters: 'Logic adapters',
    fusionInjectionRate: 'Injection rate',
    quantumDataEntanglers: 'Quantum Data Entanglers',
    quantumMultiThreaders: 'Quantum Multi-threaders',
    quantumAccelerators: 'Quantum Accelerators',
    quantumStorageBlocks: 'Quantum Storage blocks',
    matrixPatternCores: 'Assembler Matrix Pattern Cores',
    matrixCraftCores: 'Assembler Matrix Craft Cores',
    matrixSpeedCores: 'Assembler Matrix Speed Cores',
    createBlazeBurners: 'Blaze Burners',
    createFuelType: 'Boiler fuel type',
    createShowOptionalFuels: 'Show optional external fuels',
    createFuelGroupNonSuperheated: 'Non-superheated',
    createFuelGroupSuperheated: 'Superheated',
    createFuelGroupOptional: 'Optional (external mod fluids)',
    createFuelCoal: 'Coal',
    createFuelBlazeCake: 'Blaze Cake',
    createFuelLava: 'Lava',
    createFuelEthanol: 'Ethanol',
    createFuelCreosote: 'Creosote',
    createFuelPlantOil: 'Plant Oil',
    createFuelCrudeOil: 'Crude Oil',
    createFuelBiofuel: 'Biofuel',
    createFuelBiodiesel: 'Biodiesel',
    createFuelDiesel: 'Diesel',
    createFuelGasoline: 'Gasoline',
    createSteamEngines: 'Steam Engines',
    specsTitle: 'Functional specs',
    noSpecs: 'No functional spec line for this setup.',
    requirements: 'Required resources',
    noResources: 'No resource line to show for this setup.',
    errorsTitle: 'Validation',
    warningsTitle: 'Safety warnings',
    notesTitle: 'Model notes',
    fissionDangerTemperatureWarning: 'Estimated fission temperature reached the damage-risk threshold (1,200 K).',
    fissionCriticalTemperatureWarning:
      'Estimated fission temperature reached the severe danger threshold (1,800 K). Explosion risk can increase as reactor damage accumulates.',
    fusionLowInjectionWarning:
      'Injection rate may be below sustained-burn threshold for the selected cooling mode. Additional heating/laser input may be required to keep ignition.',
    fusionTemperatureWarning:
      'Fusion ignition requires plasma temperature around 100,000,000 K. Casing temperature alone does not guarantee sustained fusion burn.',
    notes: {
      spsFixedShape:
        'SPS is validated as a fixed 7x7x7 shape. Port count is limited to valid port-compatible shell positions.',
      boilerLayerModel:
        'Boiler water and steam sections are calculated from steam-layer input with one reserved pressure disperser layer, full-footprint capacity approximation, and occupied superheating blocks reducing water-side capacity.',
      fissionAssemblyPattern:
        'Fission assembly slots use the checkerboard pattern from official structure builder logic.',
      turbineApproximation:
        'Turbine internals vary with layout. Rotor, blade, condenser, vent, and coil inputs are treated as planner values.',
      specModelAssumption:
        'Spec values are planner estimates based on default Mekanism server configs and simplified formulas.',
      pendingImplementation:
        'This multiblock has been listed, but calculation formulas are not implemented yet. Official source validation is required before enabling spec/resource output.',
      quantumStructureBoundaryRule:
        'Official Quantum Computer validator requires Quantum Computer Structural Glass on all outside faces for multiblock formation.',
      quantumStorageTierRule:
        'Quantum Core contributes 256M storage. Each selected Quantum Storage block adds its listed storage tier. Quantum Data Entangler multiplies total storage by 4 when included. Quantum Multi-threader uses one inside slot and affects co-processing, not storage capacity.',
      evaporationSolarPatternModel:
        'Evaporation solar layout mode only changes required top-layer blocks. Production is determined by the assumed temperature input.',
      coilSoftCap:
        'SPS requires one supercharged coil connected behind a port.',
      turbineBladeSoftCap:
        'Extra turbine blades beyond coil-supported generation are counted as build cost, but do not increase calculated generation.',
      turbineVentSoftCap:
        'Extra turbine vents beyond disperser-limited flow are counted as build cost, but do not increase calculated throughput.',
      turbineCondenserSoftCap:
        'Extra saturating condensers beyond steam-flow limit are counted as build cost, but do not increase calculated water output.',
      matrixAssemblerRules:
        'Assembler Matrix uses frames on all edges, walls/glass on faces, and a fully filled interior of Pattern/Craft/Speed cores with at least one Pattern Core and one Craft Core.',
      matrixAssemblerSpeedCoreCap:
        'Assembler Matrix Speed Core acceleration effect is capped at 5 cores; additional speed cores are counted as resources only.',
      createBoilerRules:
        'Create Fluid Tank is modeled as a square footprint up to 3x3 with planner max height 8. Boiler level is calculated from the minimum of heat level and tank-size level. Steam output stress is based on Create Steam Engine baseline stress capacity.',
      createLiquidFuelNeedsStraw:
        'When liquid fuel is selected, each Blaze Burner requires one Straw for feeding.',
    } as Record<CalculationNoteKey, string>,
    specs: {
      dynamicTankFluidCapacity: 'Fluid capacity',
      dynamicTankChemicalCapacity: 'Chemical capacity',
      evaporationInputCapacity: 'Input tank capacity',
      evaporationOutputCapacity: 'Output tank capacity',
      evaporationWaterToBrineProduction: 'Water -> Brine production rate (estimated)',
      evaporationBrineToLithiumProduction: 'Brine -> Liquid Lithium production rate (estimated)',
      spsEnergyInput: 'Energy input requirement',
      spsPoloniumConsumption: 'Polonium consumption',
      spsCoilEfficiency: 'Coil efficiency',
      boilerWaterCapacity: 'Water capacity',
      boilerSteamCapacity: 'Steam capacity',
      boilerHeatedCoolantCapacity: 'Heated coolant capacity',
      boilerMaxBoilRate: 'Max boil rate (estimated)',
      boilerCoolingEfficiency: 'Cooling efficiency (estimated)',
      boilerCoolantHeatingRate: 'Coolant heating rate (estimated)',
      boilerCoolantTemperature: 'Coolant temperature (estimated)',
      inductionEnergyCapacity: 'Energy capacity',
      inductionInputOutputRate: 'I/O rate',
      turbineSteamCapacity: 'Steam capacity',
      turbineMaxFlowRate: 'Max steam flow',
      turbineMaxPowerGeneration: 'Max generation (estimated)',
      turbineMaxWaterOutput: 'Max water output',
      fissionFuelCapacity: 'Fuel capacity',
      fissionHeatedCoolantCapacity: 'Heated coolant capacity',
      fissionWasteCapacity: 'Waste capacity',
      fissionMaxBurnRate: 'Max burn rate (estimated)',
      fissionSelectedBurnRate: 'Selected burn rate',
      fissionCoolingEfficiency: 'Cooling efficiency (estimated)',
      fissionCoolantHeatingRate: 'Coolant heating rate (estimated)',
      fissionCoolantTemperature: 'Coolant temperature (estimated)',
      fusionFuelCapacity: 'Fuel capacity',
      fusionEnergyCapacity: 'Internal energy capacity',
      fusionPassiveGeneration: 'Passive generation (estimated)',
      fusionSteamProduction: 'Steam production (estimated)',
      fusionCoolingTransferRate: 'Cooling-side transfer rate (estimated)',
      fusionCasingTemperature: 'Casing temperature (estimated)',
      quantumTotalStorage: 'Total crafting storage',
      quantumCoProcessors: 'Co-Processor count',
      matrixAssemblerPatternSlots: 'Pattern slot capacity',
      matrixAssemblerMaxConcurrentJobs: 'Max concurrent crafting jobs',
      matrixAssemblerSpeedCoreEffectiveness: 'Speed core effectiveness',
      createBoilerLevel: 'Boiler level',
      createSteamEngineSu: 'Generated stress capacity',
      createBoilerRequiredWaterFlow: 'Required water flow for max boiler level',
    } as Record<SpecKey, string>,
    resources: {
      dynamicTankCasing: 'Dynamic Tank',
      dynamicValve: 'Dynamic Valve',
      structuralGlass: 'Structural Glass',
      inductionCasing: 'Induction Casing',
      inductionPort: 'Induction Port',
      inductionCell: 'Induction Cell',
      inductionProvider: 'Induction Provider',
      thermalEvaporationBlock: 'Thermal Evaporation Block',
      thermalEvaporationValve: 'Thermal Evaporation Valve',
      thermalEvaporationController: 'Thermal Evaporation Controller',
      advancedSolarGenerator: 'Advanced Solar Generator',
      spsCasing: 'SPS Casing',
      spsPort: 'SPS Port',
      superchargedCoil: 'Supercharged Coil',
      boilerCasing: 'Boiler Casing',
      boilerValve: 'Boiler Valve',
      pressureDisperser: 'Pressure Disperser',
      superheatingElement: 'Superheating Element',
      turbineCasing: 'Turbine Casing',
      turbineValve: 'Turbine Valve',
      turbineVent: 'Turbine Vent',
      rotationalComplex: 'Rotational Complex',
      turbineRotor: 'Turbine Rotor',
      turbineBlade: 'Turbine Blade',
      electromagneticCoil: 'Electromagnetic Coil',
      saturatingCondenser: 'Saturating Condenser',
      reactorGlass: 'Reactor Glass',
      fissionReactorCasing: 'Fission Reactor Casing',
      fissionReactorPort: 'Fission Reactor Port',
      fissionReactorLogicAdapter: 'Fission Reactor Logic Adapter',
      fissionFuelAssembly: 'Fission Fuel Assembly',
      controlRodAssembly: 'Control Rod Assembly',
      fusionReactorFrame: 'Fusion Reactor Frame',
      fusionReactorPort: 'Fusion Reactor Port',
      fusionReactorController: 'Fusion Reactor Controller',
      fusionReactorLogicAdapter: 'Fusion Reactor Logic Adapter',
      laserFocusMatrix: 'Laser Focus Matrix',
      quantumCore: 'Quantum Computer Core',
      quantumDataEntangler: 'Quantum Data Entangler',
      quantumMultiThreader: 'Quantum Multi-threader',
      quantumAccelerator: 'Quantum Accelerator',
      quantumComputerStructuralGlass: 'Quantum Computer Structural Glass',
      quantumCraftingUnit: 'Quantum Crafting Unit',
      quantumStorage128: '128M Quantum Computer Storage',
      quantumStorage256: '256M Quantum Computer Storage',
      assemblerMatrixFrame: 'Assembler Matrix Frame',
      assemblerMatrixWall: 'Assembler Matrix Wall/Glass',
      assemblerMatrixPatternCore: 'Assembler Matrix Pattern Core',
      assemblerMatrixCraftCore: 'Assembler Matrix Craft Core',
      assemblerMatrixSpeedCore: 'Assembler Matrix Speed Core',
      createFluidTank: 'Fluid Tank',
      createBlazeBurner: 'Blaze Burner',
      createSteamEngine: 'Steam Engine',
      createStraw: 'Straw',
    } as Record<ResourceKey, string>,
    footer: 'Data source policy: official Mekanism sources only.',
  },
  ja: {
    title: 'Modded Minecraft Multiblock Calculator',
    subtitle: '対応している全マルチブロックについて、サイズとポート数から必要ブロックを見積もります。',
    languageLabel: '表示言語',
    languageButton: 'English',
    structure: '構造タイプ',
    structureType: {
      dynamicTank: 'ダイナミックタンク',
      thermalEvaporationPlant: '加温蒸発濃縮プラント',
      sps: '超臨界相転移装置',
      thermoelectricBoiler: '熱電ボイラー',
      inductionMatrix: 'インダクションマトリックス',
      industrialTurbine: '工業用タービン',
      fissionReactor: '核分裂炉',
      fusionReactor: '核融合炉',
      quantumComputer: '量子コンピューター',
      matrixAssembler: 'マトリックスアセンブラー',
      steamBoilerEngine: '蒸気ボイラー & 蒸気エンジン',
    } as Record<MultiblockKey, string>,
    groupMekanism: 'Mekanism',
    groupMekanismGenerators: 'Mekanism Generators',
    groupAdvancedAe: 'AdvancedAE',
    groupExtendedAe: 'ExtendedAE',
    groupCreate: 'Create / Create Crafts & Additions',
    useStructuralGlass: 'Structural Glass を使用',
    useReactorGlass: 'Reactor Glass を使用',
    evaporationSolarTop: '最上層ソーラー発電機配置を使用',
    coolantType: 'クーラント',
    coolantWater: '水',
    coolantSodium: 'ナトリウム',
    fusionCoolingType: '冷却方式',
    fusionCoolingWater: '水冷',
    fusionCoolingAir: '空冷',
    quantumStorageTier: 'Quantum ストレージ種別',
    quantumUseDataEntangler: 'Quantum Data Entangler を使用',
    quantumUseMultiThreader: 'Quantum Multi-threader を使用',
    quantumStorage128: '128M',
    quantumStorage256: '256M',
    toggleOn: 'ON',
    toggleOff: 'OFF',
    numberInputSuffix: '数値入力',
    width: '幅',
    edge: '辺',
    height: '高さ',
    length: '奥行き',
    ports: 'ポート / バルブ数',
    evaporationTemperature: '蒸発想定温度 (kK)',
    matrixCells: 'Induction Cell 数',
    matrixProviders: 'Induction Provider 数',
    spsCoils: 'Supercharged Coil 数',
    boilerSteamHeight: 'Boiler 蒸気層の高さ (内側層)',
    boilerSuperheatingElements: 'Superheating 要素数',
    turbineRotorHeight: 'Rotor 高さ (ブロック)',
    turbineBladesPerRotor: 'Rotor あたり Blade 数',
    turbineCoils: 'Electromagnetic Coil 数',
    turbineCondensers: 'Saturating Condenser 数',
    turbineUseTopVents: '天面を Turbine Vent にする',
    turbineVentSideLayers: '側面 Turbine Vent 層数',
    fissionAssemblies: 'Fuel Assembly 数',
    fissionAssemblyHeight: 'Fuel Assembly 高さ',
    fissionBurnRate: 'Burn Rate',
    fissionLogicAdapters: 'Logic Adapter 数',
    fusionLogicAdapters: 'Logic Adapter 数',
    fusionInjectionRate: '注入レート',
    quantumDataEntanglers: 'Quantum Data Entangler 数',
    quantumMultiThreaders: 'Quantum Multi-threader 数',
    quantumAccelerators: 'Quantum Accelerator 数',
    quantumStorageBlocks: 'Quantum Storage ブロック数',
    matrixPatternCores: 'Assembler Matrix Pattern Core 数',
    matrixCraftCores: 'Assembler Matrix Craft Core 数',
    matrixSpeedCores: 'Assembler Matrix Speed Core 数',
    createBlazeBurners: 'Blaze Burner 数',
    createFuelType: 'ボイラー燃料タイプ',
    createShowOptionalFuels: '外部MOD燃料を表示',
    createFuelGroupNonSuperheated: '通常加熱',
    createFuelGroupSuperheated: '過熱',
    createFuelGroupOptional: 'オプション (外部MOD流体)',
    createFuelCoal: '石炭',
    createFuelBlazeCake: 'Blaze Cake',
    createFuelLava: '溶岩',
    createFuelEthanol: 'エタノール',
    createFuelCreosote: 'クレオソート',
    createFuelPlantOil: '植物油',
    createFuelCrudeOil: '原油',
    createFuelBiofuel: 'バイオ燃料',
    createFuelBiodiesel: 'バイオディーゼル',
    createFuelDiesel: 'ディーゼル',
    createFuelGasoline: 'ガソリン',
    createSteamEngines: 'Steam Engine 数',
    specsTitle: '機能スペック',
    noSpecs: 'この構成で表示できるスペック項目がありません。',
    requirements: '必要リソース',
    noResources: '表示できるリソース項目がありません。',
    errorsTitle: '入力チェック',
    warningsTitle: '安全警告',
    notesTitle: '計算モデル注記',
    fissionDangerTemperatureWarning: '核分裂炉の推定温度が損傷リスク閾値 (1,200 K) に達しています。',
    fissionCriticalTemperatureWarning:
      '核分裂炉の推定温度が重大危険閾値 (1,800 K) に達しています。損傷が蓄積すると爆発リスクが高まります。',
    fusionLowInjectionWarning:
      '選択した冷却モードでは、注入レートが自己維持燃焼の下限を下回る可能性があります。点火維持には追加加熱/レーザー入力が必要になる場合があります。',
    fusionTemperatureWarning:
      '核融合の点火にはおよそ 100,000,000 K のプラズマ温度が必要です。ケーシング温度のみでは持続燃焼を保証できません。',
    notes: {
      spsFixedShape:
        'SPS は 7x7x7 の固定形状で判定されます。ポート数はポート配置可能な外殻位置の範囲内に制限されます。',
      boilerLayerModel:
        'Boiler は蒸気層入力で水層と蒸気層を分割し、Pressure Disperser 1層を確保した上で、容量は全断面レイヤー近似、Superheating は要素数入力で算出し、配置した要素分だけ水側容量を減算します。',
      fissionAssemblyPattern:
        'Fission の Assembly 配置上限は、公式ビルダーのチェッカーボード配置を基準にしています。',
      turbineApproximation:
        'Turbine 内部は配置自由度があるため、Rotor/Blade/Condenser/Vent/Coil は計画値として扱います。',
      specModelAssumption:
        'スペック値は Mekanism の標準サーバー設定を基準にした簡易モデルの推定値です。',
      pendingImplementation:
        'このマルチブロックは一覧に追加済みですが、計算式は未実装です。スペック/必要リソースの出力有効化には公式ソース検証が必要です。',
      quantumStructureBoundaryRule:
        'Quantum Computer の公式判定では、マルチブロック外層はすべて Quantum Computer Structural Glass である必要があります。',
      quantumStorageTierRule:
        'Quantum Core は 256M を持ち、選択した Quantum Storage ブロックが表記どおりの容量を加算します。Quantum Data Entangler を含めると総容量が 4 倍になります。Quantum Multi-threader は内部スロットを1つ使用し、容量ではなく並列処理側に影響します。',
      evaporationSolarPatternModel:
        '蒸発プラントのソーラー配置モードは必要ブロック数のみを変更します。生産量は想定温度入力で決まります。',
      coilSoftCap:
        'SPS ではポートの内側に接続された Supercharged Coil が 1 つ必要です。',
      turbineBladeSoftCap:
        'タービンの羽は、コイルが支えられる発電上限を超えた分は建材としては数えますが、発電量には寄与しません。',
      turbineVentSoftCap:
        'タービンのベントは、圧力分散器側の流量上限を超えた分は建材としては数えますが、性能には寄与しません。',
      turbineCondenserSoftCap:
        '飽和凝縮器は、蒸気流量上限を超えた分は建材としては数えますが、排水量は増えません。',
      matrixAssemblerRules:
        'Assembler Matrix はエッジを Frame、面を Wall/Glass、内部を Pattern/Craft/Speed Core で完全充填し、Pattern Core と Craft Core を最低1つずつ必要とします。',
      matrixAssemblerSpeedCoreCap:
        'Assembler Matrix の Speed Core による加速効果は 5 個までが上限で、それ以上は資材数としてのみカウントされます。',
      createBoilerRules:
        'Create の Fluid Tank は最大 3x3 の正方フットプリント、プランナー上の最大高さ 8 として扱います。ボイラーレベルは熱レベルとタンクサイズ由来レベルの最小値で決まり、出力SUは Create の Steam Engine 基準ストレス容量に基づいて算出されます。',
      createLiquidFuelNeedsStraw:
        '液体燃料を選択した場合、各 Blaze Burner に Straw が1つ必要です。',
    } as Record<CalculationNoteKey, string>,
    specs: {
      dynamicTankFluidCapacity: '流体容量',
      dynamicTankChemicalCapacity: '化学物質容量',
      evaporationInputCapacity: '入力タンク容量',
      evaporationOutputCapacity: '出力タンク容量',
      evaporationWaterToBrineProduction: '水 -> 塩水 生成量 (推定)',
      evaporationBrineToLithiumProduction: '塩水 -> 液体リチウム 生成量 (推定)',
      spsEnergyInput: '必要エネルギー入力',
      spsPoloniumConsumption: 'ポロニウム消費量',
      spsCoilEfficiency: 'コイル効率',
      boilerWaterCapacity: '水容量',
      boilerSteamCapacity: '蒸気容量',
      boilerHeatedCoolantCapacity: '加熱冷媒容量',
      boilerMaxBoilRate: '最大沸騰量 (推定)',
      boilerCoolingEfficiency: '冷却効率 (推定)',
      boilerCoolantHeatingRate: 'クーラント加熱レート (推定)',
      boilerCoolantTemperature: 'クーラント温度 (推定)',
      inductionEnergyCapacity: '蓄電容量',
      inductionInputOutputRate: '入出力レート',
      turbineSteamCapacity: '蒸気容量',
      turbineMaxFlowRate: '最大流入量',
      turbineMaxPowerGeneration: '最大発電量 (推定)',
      turbineMaxWaterOutput: '最大排水量',
      fissionFuelCapacity: '燃料容量',
      fissionHeatedCoolantCapacity: '加熱冷媒容量',
      fissionWasteCapacity: '廃棄物容量',
      fissionMaxBurnRate: '最大燃焼レート (推定)',
      fissionSelectedBurnRate: '指定 Burn Rate',
      fissionCoolingEfficiency: '冷却効率 (推定)',
      fissionCoolantHeatingRate: 'クーラント加熱レート (推定)',
      fissionCoolantTemperature: 'クーラント温度 (推定)',
      fusionFuelCapacity: '燃料容量',
      fusionEnergyCapacity: 'エネルギー容量',
      fusionPassiveGeneration: '空冷発電量 (推定)',
      fusionSteamProduction: '蒸気生成量 (推定)',
      fusionCoolingTransferRate: '冷却側移送レート (推定)',
      fusionCasingTemperature: 'ケーシング温度 (推定)',
      quantumTotalStorage: '総クラフトストレージ',
      quantumCoProcessors: 'Co-Processor 数',
      matrixAssemblerPatternSlots: 'パターンスロット容量',
      matrixAssemblerMaxConcurrentJobs: '最大同時クラフトジョブ数',
      matrixAssemblerSpeedCoreEffectiveness: 'Speed Core 効果率',
      createBoilerLevel: 'ボイラーレベル',
      createSteamEngineSu: '生成ストレス容量',
      createBoilerRequiredWaterFlow: '最大ボイラーレベルで必要な水流量',
    } as Record<SpecKey, string>,
    resources: {
      dynamicTankCasing: 'ダイナミックタンク',
      dynamicValve: 'ダイナミックバルブ',
      structuralGlass: '構造用ガラス',
      inductionCasing: 'インダクションケーシング',
      inductionPort: 'インダクションポート',
      inductionCell: 'インダクションセル',
      inductionProvider: 'インダクションプロバイダ',
      thermalEvaporationBlock: '加温蒸発濃縮ブロック',
      thermalEvaporationValve: '加温蒸発濃縮バルブ',
      thermalEvaporationController: '加温蒸発濃縮コントローラー',
      advancedSolarGenerator: '高性能ソーラー発電機',
      spsCasing: 'SPS筐体',
      spsPort: 'SPSポート',
      superchargedCoil: '過充電コイル',
      boilerCasing: 'ボイラーケーシング',
      boilerValve: 'ボイラーバルブ',
      pressureDisperser: '圧力分散器',
      superheatingElement: '過熱素子',
      turbineCasing: 'タービンケース',
      turbineValve: 'タービンバルブ',
      turbineVent: '蒸気排出口',
      rotationalComplex: '回転機構',
      turbineRotor: 'タービンローター',
      turbineBlade: 'タービンの羽',
      electromagneticCoil: '電磁コイル',
      saturatingCondenser: '飽和凝縮器',
      reactorGlass: '反応炉窓',
      fissionReactorCasing: '核分裂炉筐体',
      fissionReactorPort: '核分裂炉ポート',
      fissionReactorLogicAdapter: '核分裂炉論理アダプター',
      fissionFuelAssembly: '核分裂炉燃料の部品',
      controlRodAssembly: '制御棒の部品',
      fusionReactorFrame: '核融合炉フレーム',
      fusionReactorPort: '核融合炉ポート',
      fusionReactorController: '核融合炉制御装置',
      fusionReactorLogicAdapter: '核融合炉論理アダプター',
      laserFocusMatrix: 'レーザーフォーカスマトリックス',
      quantumCore: 'Quantum Computer Core',
      quantumDataEntangler: 'Quantum Data Entangler',
      quantumMultiThreader: 'Quantum Multi-threader',
      quantumAccelerator: 'Quantum Accelerator',
      quantumComputerStructuralGlass: 'Quantum Computer Structural Glass',
      quantumCraftingUnit: 'Quantum Crafting Unit',
      quantumStorage128: '128M Quantum Computer Storage',
      quantumStorage256: '256M Quantum Computer Storage',
      assemblerMatrixFrame: 'Assembler Matrix Frame',
      assemblerMatrixWall: 'Assembler Matrix Wall/Glass',
      assemblerMatrixPatternCore: 'Assembler Matrix Pattern Core',
      assemblerMatrixCraftCore: 'Assembler Matrix Craft Core',
      assemblerMatrixSpeedCore: 'Assembler Matrix Speed Core',
      createFluidTank: 'Fluid Tank',
      createBlazeBurner: 'Blaze Burner',
      createSteamEngine: 'Steam Engine',
      createStraw: 'Straw',
    } as Record<ResourceKey, string>,
    footer: 'データソース方針: Mekanism公式情報のみを使用します。',
  },
} as const

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [multiblockType, setMultiblockType] = useState<MultiblockKey>('dynamicTank')

  const initialDimensions = getDefaultDimensions('dynamicTank')
  const initialDefaults = getDefaultSliderState('dynamicTank', initialDimensions)

  const [widthInput, setWidthInput] = useState(initialDimensions.width)
  const [heightInput, setHeightInput] = useState(initialDimensions.height)
  const [lengthInput, setLengthInput] = useState(initialDimensions.length)
  const [portsInput, setPortsInput] = useState(initialDefaults.ports)
  const [evaporationTemperatureKkInput, setEvaporationTemperatureKkInput] = useState(initialDefaults.evaporationTemperatureKk)
  const [matrixCellsInput, setMatrixCellsInput] = useState(initialDefaults.matrixCells)
  const [matrixProvidersInput, setMatrixProvidersInput] = useState(initialDefaults.matrixProviders)
  const [spsCoilsInput, setSpsCoilsInput] = useState(initialDefaults.spsCoils)
  const [boilerSteamHeightInput, setBoilerSteamHeightInput] = useState(initialDefaults.boilerSteamHeight)
  const [boilerSuperheatingElementsInput, setBoilerSuperheatingElementsInput] = useState(
    initialDefaults.boilerSuperheatingElements,
  )
  const [turbineRotorHeightInput, setTurbineRotorHeightInput] = useState(initialDefaults.turbineRotorHeight)
  const [turbineBladesPerRotorInput, setTurbineBladesPerRotorInput] = useState(
    initialDefaults.turbineBladesPerRotor,
  )
  const [turbineCoilsInput, setTurbineCoilsInput] = useState(initialDefaults.turbineCoils)
  const [turbineCondensersInput, setTurbineCondensersInput] = useState(initialDefaults.turbineCondensers)
  const [turbineUseTopVents, setTurbineUseTopVents] = useState(initialDefaults.turbineUseTopVents)
  const [turbineVentSideLayersInput, setTurbineVentSideLayersInput] = useState(initialDefaults.turbineVentSideLayers)
  const [fissionAssembliesInput, setFissionAssembliesInput] = useState(initialDefaults.fissionAssemblies)
  const [fissionAssemblyHeightInput, setFissionAssemblyHeightInput] = useState(
    initialDefaults.fissionAssemblyHeight,
  )
  const [fissionLogicAdaptersInput, setFissionLogicAdaptersInput] = useState(initialDefaults.fissionLogicAdapters)
  const [fusionLogicAdaptersInput, setFusionLogicAdaptersInput] = useState(initialDefaults.fusionLogicAdapters)
  const [fusionInjectionRateInput, setFusionInjectionRateInput] = useState(
    initialDefaults.fusionInjectionRate,
  )
  const [quantumStorageTier, setQuantumStorageTier] = useState<QuantumStorageTier>(256)
  const [quantumDataEntanglersInput, setQuantumDataEntanglersInput] = useState(initialDefaults.quantumDataEntanglers)
  const [quantumMultiThreadersInput, setQuantumMultiThreadersInput] = useState(initialDefaults.quantumMultiThreaders)
  const [quantumAcceleratorsInput, setQuantumAcceleratorsInput] = useState(initialDefaults.quantumAccelerators)
  const [quantumStorageBlocksInput, setQuantumStorageBlocksInput] = useState(initialDefaults.quantumStorageBlocks)
  const [matrixPatternCoresInput, setMatrixPatternCoresInput] = useState(initialDefaults.matrixPatternCores)
  const [matrixCraftCoresInput, setMatrixCraftCoresInput] = useState(initialDefaults.matrixCraftCores)
  const [matrixSpeedCoresInput, setMatrixSpeedCoresInput] = useState(initialDefaults.matrixSpeedCores)
  const [createBlazeBurnersInput, setCreateBlazeBurnersInput] = useState(initialDefaults.createBlazeBurners)
  const [createSteamEnginesInput, setCreateSteamEnginesInput] = useState(initialDefaults.createSteamEngines)
  const [createFuelType, setCreateFuelType] = useState<CreateBoilerFuelType>(initialDefaults.createFuelType)
  const [createShowOptionalFuels, setCreateShowOptionalFuels] = useState(false)
  const [useStructuralGlass, setUseStructuralGlass] = useState(false)
  const [useReactorGlass, setUseReactorGlass] = useState(false)
  const [evaporationUseSolarGenerators, setEvaporationUseSolarGenerators] = useState(false)
  const [coolantType, setCoolantType] = useState<CoolantType>('water')
  const [fissionBurnRateInput, setFissionBurnRateInput] = useState(0)

  const profile = profiles[multiblockType]
  const width = profile.width.fixed ?? widthInput
  const height = profile.height.fixed ?? heightInput
  const length = profile.length.fixed ?? lengthInput
  const steamTankEdge = multiblockType === 'steamBoilerEngine' ? width : 0
  const effectiveLength = multiblockType === 'steamBoilerEngine' ? steamTankEdge : length

  const shellBlocksByDimensions = outerShellBlocks(width, height, effectiveLength)
  const innerVolumeByDimensions = innerVolume(width, height, effectiveLength)
  const turbineRotorHeightMax = Math.max(height - 4, 1)
  const turbineBladesPerRotorMax = TURBINE_MAX_BLADES_PER_ROTOR
  const turbinePlaneMax = Math.max((width - 2) * (length - 2), 1)
  const turbineVentSideLayersMax = Math.max(height - 2, 0)
  const fissionAssembliesMax = Math.max(Math.ceil(Math.max((width - 2) * (length - 2), 0) / 2), 0)
  const fissionAssemblyHeightMax = Math.max(height - 3, 1)
  const fissionAttachmentMax = Math.max(shellBlocksByDimensions, 0)
  const boilerSteamHeightMax = Math.max(height - 3, 1)
  const fusionAttachmentMax = Math.max(shellBlocksByDimensions - 1, 0)
  const minimumPorts =
    multiblockType === 'thermalEvaporationPlant' && !evaporationUseSolarGenerators
      ? 3
      : minimumPortsByType[multiblockType]
  const evaporationTotalStructureBlocks = 16 + 12 * Math.max(height - 1, 0)
  const evaporationReservedBlocks = 1 + (evaporationUseSolarGenerators ? 4 : 0)
  const evaporationPortsMax = Math.max(evaporationTotalStructureBlocks - evaporationReservedBlocks, minimumPorts)
  const structuralGlassApplicable =
    multiblockType === 'dynamicTank' ||
    multiblockType === 'thermalEvaporationPlant' ||
    multiblockType === 'sps' ||
    multiblockType === 'thermoelectricBoiler' ||
    multiblockType === 'inductionMatrix'
  const reactorGlassApplicable =
    multiblockType === 'industrialTurbine' ||
    multiblockType === 'fissionReactor' ||
    multiblockType === 'fusionReactor'
  const coolantApplicable =
    multiblockType === 'thermoelectricBoiler' ||
    multiblockType === 'fissionReactor' ||
    multiblockType === 'fusionReactor'
  const portsApplicable = minimumPortsByType[multiblockType] > 0

  const boilerSteamHeight = Math.min(Math.max(boilerSteamHeightInput, 1), boilerSteamHeightMax)
  const boilerWaterHeight = Math.max(height - boilerSteamHeight - 2, 0)
  const boilerSuperheatingElementsMax = Math.max((width - 2) * (length - 2) * boilerWaterHeight, 0)
  const boilerSuperheatingElements = Math.min(
    Math.max(boilerSuperheatingElementsInput, 0),
    boilerSuperheatingElementsMax,
  )
  const turbineRotorHeight = Math.min(Math.max(turbineRotorHeightInput, 1), turbineRotorHeightMax)
  const turbinePracticalCoilsMax = Math.max(
    Math.ceil((turbineRotorHeight * TURBINE_MAX_BLADES_PER_ROTOR) / TURBINE_BLADES_PER_COIL),
    1,
  )
  const turbineCoils = Math.min(Math.max(turbineCoilsInput, 1), turbinePracticalCoilsMax)
  const turbineVentSideLayers = Math.min(Math.max(turbineVentSideLayersInput, 0), turbineVentSideLayersMax)
  const turbineTopVentCount = turbineUseTopVents ? Math.max((width - 2) * (length - 2), 0) : 0
  const turbineSideVentCountPerLayer = Math.max(2 * (width + length) - 8, 0)
  const turbineVents = turbineTopVentCount + turbineSideVentCountPerLayer * turbineVentSideLayers
  const portsMax =
    multiblockType === 'sps'
      ? 126
      : multiblockType === 'thermalEvaporationPlant'
        ? evaporationPortsMax
        : shellBlocksByDimensions
  const ports = Math.min(Math.max(portsInput, minimumPorts), portsMax)
  const fissionAssemblies = Math.min(Math.max(fissionAssembliesInput, 0), fissionAssembliesMax)
  const fissionAssemblyHeight = Math.min(Math.max(fissionAssemblyHeightInput, 1), fissionAssemblyHeightMax)
  const fissionLogicAdapters = Math.min(Math.max(fissionLogicAdaptersInput, 0), fissionAttachmentMax)
  const fissionMaxBurnRateBySetup = estimateFissionMaxBurnRate(fissionAssemblies * fissionAssemblyHeight)
  const fissionBurnRate = Math.min(Math.max(fissionBurnRateInput, 0), fissionMaxBurnRateBySetup)
  const fusionInjectionRate = clampValue(Math.floor(fusionInjectionRateInput / 2) * 2, 0, FUSION_MAX_INJECTION)
  const quantumOptionalSlots = multiblockType === 'quantumComputer' ? Math.max(innerVolumeByDimensions - 1, 0) : 0
  const quantumDataEntanglers = Math.min(Math.max(quantumDataEntanglersInput, 0), Math.min(quantumOptionalSlots, 1))
  const quantumMultiThreaderMax = Math.min(Math.max(quantumOptionalSlots - quantumDataEntanglers, 0), 1)
  const quantumMultiThreaders = Math.min(Math.max(quantumMultiThreadersInput, 0), quantumMultiThreaderMax)
  const quantumAcceleratorsMax = Math.max(quantumOptionalSlots - quantumDataEntanglers - quantumMultiThreaders, 0)
  const quantumAccelerators = Math.min(Math.max(quantumAcceleratorsInput, 0), quantumAcceleratorsMax)
  const quantumStorageBlocksMax = Math.max(quantumAcceleratorsMax - quantumAccelerators, 0)
  const quantumStorageBlocks = Math.min(Math.max(quantumStorageBlocksInput, 0), quantumStorageBlocksMax)
  const matrixInteriorSlots = multiblockType === 'matrixAssembler' ? innerVolumeByDimensions : 0
  const matrixPatternCraftMin = matrixInteriorSlots >= 2 ? 1 : 0
  const matrixPatternInput = Math.max(Math.floor(matrixPatternCoresInput), matrixPatternCraftMin)
  const matrixCraftInput = Math.max(Math.floor(matrixCraftCoresInput), matrixPatternCraftMin)
  const matrixSpeedInput = Math.max(Math.floor(matrixSpeedCoresInput), 0)
  const matrixSpeedHardMax = Math.min(MATRIX_SPEED_CORE_MAX, Math.max(matrixInteriorSlots - matrixPatternCraftMin * 2, 0))
  const matrixSpeedBase = Math.min(matrixSpeedInput, matrixSpeedHardMax)
  const matrixCraftBase = Math.min(
    matrixCraftInput,
    Math.max(matrixInteriorSlots - matrixSpeedBase - matrixPatternCraftMin, 0),
  )

  const matrixPatternPreMax = Math.max(matrixInteriorSlots - matrixCraftBase - matrixSpeedBase, 0)
  const matrixPatternCores = Math.min(matrixPatternInput, matrixPatternPreMax)
  const matrixCraftPreMax = Math.max(matrixInteriorSlots - matrixPatternCores - matrixSpeedBase, 0)
  const matrixCraftCores = Math.min(matrixCraftBase, matrixCraftPreMax)
  const matrixSpeedPreMax = Math.min(MATRIX_SPEED_CORE_MAX, Math.max(matrixInteriorSlots - matrixPatternCores - matrixCraftCores, 0))
  const matrixSpeedCores = Math.min(matrixSpeedBase, matrixSpeedPreMax)

  const matrixPatternCoresMax = Math.max(matrixInteriorSlots - matrixCraftCores - matrixSpeedCores, 0)
  const matrixCraftCoresMax = Math.max(matrixInteriorSlots - matrixPatternCores - matrixSpeedCores, 0)
  const matrixSpeedCoresMax = Math.min(MATRIX_SPEED_CORE_MAX, Math.max(matrixInteriorSlots - matrixPatternCores - matrixCraftCores, 0))
  const matrixPatternCoresMin = matrixPatternCoresMax >= 1 ? 1 : 0
  const matrixCraftCoresMin = matrixCraftCoresMax >= 1 ? 1 : 0
  const createBlazeBurnersMax = Math.max(steamTankEdge * steamTankEdge, 1)
  const createBlazeBurners = clampValue(createBlazeBurnersInput, 1, createBlazeBurnersMax)
  const createSteamEngines = clampValue(createSteamEnginesInput, 1, CREATE_BOILER_MAX_LEVEL)
  const isOptionalCreateFuel = (fuelType: CreateBoilerFuelType): boolean =>
    fuelType === 'biodiesel' || fuelType === 'diesel' || fuelType === 'gasoline'
  const fusionCoolingMode: FusionCoolingMode = coolantType === 'water' ? 'waterCooled' : 'airCooled'
  const fusionIsWaterCooled = fusionCoolingMode === 'waterCooled'

  const result = useMemo(
    () =>
      calculateRequirements({
        type: multiblockType,
        dimensions: { width, height, length: effectiveLength },
        ports,
        useStructuralGlass,
        useReactorGlass,
        evaporationUseSolarGenerators,
        evaporationTemperatureKk: evaporationTemperatureKkInput,
        coolantType,
        matrixCells: matrixCellsInput,
        matrixProviders: matrixProvidersInput,
        matrixPatternCores,
        matrixCraftCores,
        matrixSpeedCores,
        createBlazeBurners,
        createFuelType,
        createSteamEngines,
        spsCoils: spsCoilsInput,
        boilerSteamHeight,
        boilerSuperheatingElements,
        turbineRotorHeight,
        turbineBladesPerRotor: turbineBladesPerRotorInput,
        turbineCoils,
        turbineCondensers: turbineCondensersInput,
        turbineVents,
        fissionAssemblies,
        fissionAssemblyHeight,
        fissionBurnRate,
        fissionLogicAdapters,
        fusionLogicAdapters: fusionLogicAdaptersInput,
        fusionInjectionRate,
        quantumStorageTier,
        quantumDataEntanglers,
        quantumMultiThreaders,
        quantumAccelerators,
        quantumStorageBlocks,
      }),
    [
      multiblockType,
      width,
      height,
      effectiveLength,
      ports,
      useStructuralGlass,
      useReactorGlass,
      evaporationUseSolarGenerators,
      evaporationTemperatureKkInput,
      coolantType,
      matrixCellsInput,
      matrixProvidersInput,
      matrixPatternCores,
      matrixCraftCores,
      matrixSpeedCores,
      createBlazeBurners,
      createFuelType,
      createSteamEngines,
      spsCoilsInput,
      boilerSteamHeight,
      boilerSuperheatingElements,
      turbineRotorHeight,
      turbineBladesPerRotorInput,
      turbineCoils,
      turbineCondensersInput,
      turbineVents,
      fissionAssemblies,
      fissionAssemblyHeight,
      fissionBurnRate,
      fissionLogicAdapters,
      fusionLogicAdaptersInput,
      fusionInjectionRate,
      quantumStorageTier,
      quantumDataEntanglers,
      quantumMultiThreaders,
      quantumAccelerators,
      quantumStorageBlocks,
    ],
  )

  const t = copy[language]
  const fissionTemperature = result.specs.find((line) => line.key === 'fissionCoolantTemperature')?.value
  const fusionTemperature = result.specs.find((line) => line.key === 'fusionCasingTemperature')?.value
  let fissionSafetyLevel: 'warning' | 'critical' | null = null
  const fissionSafetyWarnings: string[] = []
  if (multiblockType === 'fissionReactor' && typeof fissionTemperature === 'number') {
    if (fissionTemperature >= FISSION_CRITICAL_TEMPERATURE_K) {
      fissionSafetyLevel = 'critical'
      fissionSafetyWarnings.push(t.fissionCriticalTemperatureWarning)
    } else if (fissionTemperature >= FISSION_DANGER_TEMPERATURE_K) {
      fissionSafetyLevel = 'warning'
      fissionSafetyWarnings.push(t.fissionDangerTemperatureWarning)
    }
  }
  const fissionSafetyClassName = fissionSafetyLevel === 'critical' ? 'critical-block' : 'warning-block'
  const fusionSafetyWarnings: string[] = []
  if (multiblockType === 'fusionReactor') {
    const k = fusionIsWaterCooled ? FUSION_WATER_HEATING_RATIO : 0
    const denominator = FUSION_ENERGY_PER_FUEL * FUSION_BURN_RATIO *
      (FUSION_PLASMA_CASE_CONDUCTIVITY + k + FUSION_CASING_THERMAL_CONDUCTIVITY) -
      FUSION_PLASMA_CASE_CONDUCTIVITY * (k + FUSION_CASING_THERMAL_CONDUCTIVITY)
    const minInjection = denominator <= 0
      ? FUSION_MAX_INJECTION
      : 2 * Math.ceil(
        (
          FUSION_BURN_TEMPERATURE_K *
          FUSION_BURN_RATIO *
          FUSION_PLASMA_CASE_CONDUCTIVITY *
          (k + FUSION_CASING_THERMAL_CONDUCTIVITY)
        ) /
        denominator /
        2,
      )
    if (fusionInjectionRate < minInjection) {
      fusionSafetyWarnings.push(t.fusionLowInjectionWarning)
    }
    if (typeof fusionTemperature === 'number' && fusionTemperature > 0) {
      fusionSafetyWarnings.push(t.fusionTemperatureWarning)
    }
  }

  const getResourceImagePath = (key: ResourceKey): string => `/blocks/${key}.png`
  const isFusionSelected = multiblockType === 'fusionReactor'
  const coolantToggleLabel = isFusionSelected ? t.fusionCoolingType : t.coolantType
  const coolantOnLabel = isFusionSelected ? t.fusionCoolingAir : t.coolantSodium
  const coolantOffLabel = isFusionSelected ? t.fusionCoolingWater : t.coolantWater

  const handleNumericFieldTab = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) {
      return
    }

    const numericFields = Array.from(
      document.querySelectorAll<HTMLInputElement>('input[data-number-nav="true"]:not(:disabled)'),
    )
    const currentIndex = numericFields.indexOf(event.currentTarget)
    if (currentIndex === -1 || numericFields.length < 2) {
      return
    }

    const direction = event.shiftKey ? -1 : 1
    const nextIndex = (currentIndex + direction + numericFields.length) % numericFields.length
    const nextField = numericFields[nextIndex]
    if (!nextField || nextField === event.currentTarget) {
      return
    }

    event.preventDefault()
    nextField.focus()
    nextField.select()
  }

  const renderRangeControl = ({
    id,
    label,
    min,
    max,
    value,
    onChange,
    disabled = false,
  }: {
    id: string
    label: string
    min: number
    max: number
    value: number
    onChange: (next: number) => void
    disabled?: boolean
  }) => {
    const setNextValue = (next: number) => onChange(clampValue(Math.floor(next), min, max))
    const numericLabel = `${label} ${t.numberInputSuffix}`
    return (
      <div className="field-control" key={id}>
        <div className="field-control-heading">
          <span>{label}</span>
          <output>{value}</output>
        </div>
        <input
          id={`${id}-slider`}
          type="range"
          min={min}
          max={max}
          disabled={disabled}
          value={value}
          aria-label={label}
          onChange={(event) => setNextValue(Number(event.target.value))}
        />
        <div className="field-control-tools">
          <div className="step-buttons">
            {[-5, -1, 1, 5].map((step) => (
              <button
                key={step}
                type="button"
                className="step-button"
                disabled={disabled}
                aria-label={`${label} ${step > 0 ? `+${step}` : step}`}
                onClick={() => setNextValue(value + step)}
              >
                {step > 0 ? `+${step}` : step}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={min}
            max={max}
            data-number-nav="true"
            disabled={disabled}
            value={value}
            aria-label={numericLabel}
            onKeyDown={handleNumericFieldTab}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (!Number.isFinite(next)) {
                return
              }
              setNextValue(next)
            }}
          />
        </div>
      </div>
    )
  }

  const renderDecimalControl = ({
    id,
    label,
    min,
    max,
    step,
    value,
    onChange,
    disabled = false,
  }: {
    id: string
    label: string
    min: number
    max: number
    step: number
    value: number
    onChange: (next: number) => void
    disabled?: boolean
  }) => {
    const setNextValue = (next: number) => {
      if (!Number.isFinite(next)) {
        return
      }
      onChange(clampValue(next, min, max))
    }

    return (
      <div className="field-control" key={id}>
        <div className="field-control-heading">
          <span>{label}</span>
          <output>{value.toFixed(1)}</output>
        </div>
        <input
          id={`${id}-slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={value}
          aria-label={label}
          onChange={(event) => setNextValue(Number(event.target.value))}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          data-number-nav="true"
          disabled={disabled}
          value={value}
          aria-label={`${label} ${t.numberInputSuffix}`}
          onKeyDown={handleNumericFieldTab}
          onChange={(event) => setNextValue(Number(event.target.value))}
        />
      </div>
    )
  }

  const setType = (nextType: MultiblockKey) => {
    const nextDimensions = getDefaultDimensions(nextType)
    const nextDefaults = getDefaultSliderState(nextType, nextDimensions)
    setMultiblockType(nextType)
    setWidthInput(nextDimensions.width)
    setHeightInput(nextDimensions.height)
    setLengthInput(nextDimensions.length)
    setPortsInput(nextDefaults.ports)
    setEvaporationTemperatureKkInput(nextDefaults.evaporationTemperatureKk)
    setMatrixCellsInput(nextDefaults.matrixCells)
    setMatrixProvidersInput(nextDefaults.matrixProviders)
    setSpsCoilsInput(nextDefaults.spsCoils)
    setBoilerSteamHeightInput(nextDefaults.boilerSteamHeight)
    setBoilerSuperheatingElementsInput(nextDefaults.boilerSuperheatingElements)
    setTurbineRotorHeightInput(nextDefaults.turbineRotorHeight)
    setTurbineBladesPerRotorInput(nextDefaults.turbineBladesPerRotor)
    setTurbineCoilsInput(nextDefaults.turbineCoils)
    setTurbineCondensersInput(nextDefaults.turbineCondensers)
    setTurbineUseTopVents(nextDefaults.turbineUseTopVents)
    setTurbineVentSideLayersInput(nextDefaults.turbineVentSideLayers)
    setFissionAssembliesInput(nextDefaults.fissionAssemblies)
    setFissionAssemblyHeightInput(nextDefaults.fissionAssemblyHeight)
    setFissionLogicAdaptersInput(nextDefaults.fissionLogicAdapters)
    setFusionLogicAdaptersInput(nextDefaults.fusionLogicAdapters)
    setFusionInjectionRateInput(nextDefaults.fusionInjectionRate)
    setQuantumStorageTier(256)
    setQuantumDataEntanglersInput(nextDefaults.quantumDataEntanglers)
    setQuantumMultiThreadersInput(nextDefaults.quantumMultiThreaders)
    setQuantumAcceleratorsInput(nextDefaults.quantumAccelerators)
    setQuantumStorageBlocksInput(nextDefaults.quantumStorageBlocks)
    setMatrixPatternCoresInput(nextDefaults.matrixPatternCores)
    setMatrixCraftCoresInput(nextDefaults.matrixCraftCores)
    setMatrixSpeedCoresInput(nextDefaults.matrixSpeedCores)
    setCreateBlazeBurnersInput(nextDefaults.createBlazeBurners)
    setCreateSteamEnginesInput(nextDefaults.createSteamEngines)
    setCreateFuelType(nextDefaults.createFuelType)
    setCreateShowOptionalFuels(false)
    setUseStructuralGlass(false)
    setUseReactorGlass(false)
    setEvaporationUseSolarGenerators(false)
    setCoolantType('water')
    setFissionBurnRateInput(0)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Mekanism Tooling</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <section className="panel controls-panel">
        <div className="language-row">
          <span>{t.languageLabel}</span>
          <button
            type="button"
            className="switch-button"
            onClick={() => setLanguage((current) => (current === 'en' ? 'ja' : 'en'))}
          >
            {t.languageButton}
          </button>
        </div>

        <label className="select-field">
          <span>{t.structure}</span>
          <select value={multiblockType} onChange={(event) => setType(event.target.value as MultiblockKey)}>
            <optgroup label={t.groupMekanism}>
              {structureGroups.mekanism.map((key) => (
                <option key={key} value={key}>
                  {t.structureType[key]}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.groupMekanismGenerators}>
              {structureGroups.mekanismGenerators.map((key) => (
                <option key={key} value={key}>
                  {t.structureType[key]}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.groupAdvancedAe}>
              {structureGroups.advancedAe.map((key) => (
                <option key={key} value={key}>
                  {t.structureType[key]}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.groupExtendedAe}>
              {structureGroups.extendedAe.map((key) => (
                <option key={key} value={key}>
                  {t.structureType[key]}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.groupCreate}>
              {structureGroups.create.map((key) => (
                <option key={key} value={key}>
                  {t.structureType[key]}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        {(structuralGlassApplicable || reactorGlassApplicable) && (
          <div className="toggle-row">
            {structuralGlassApplicable && (
              <button
                type="button"
                className={`switch-button toggle-button ${useStructuralGlass ? 'is-on' : 'is-off'}`}
                aria-pressed={useStructuralGlass}
                onClick={() => setUseStructuralGlass((current) => !current)}
              >
                {t.useStructuralGlass}: {useStructuralGlass ? t.toggleOn : t.toggleOff}
              </button>
            )}
            {reactorGlassApplicable && (
              <button
                type="button"
                className={`switch-button toggle-button ${useReactorGlass ? 'is-on' : 'is-off'}`}
                aria-pressed={useReactorGlass}
                onClick={() => setUseReactorGlass((current) => !current)}
              >
                {t.useReactorGlass}: {useReactorGlass ? t.toggleOn : t.toggleOff}
              </button>
            )}
          </div>
        )}

        {coolantApplicable && (
          <div className="toggle-row">
            <button
              type="button"
              className={`switch-button toggle-button ${coolantType === 'sodium' ? 'is-on' : 'is-off'}`}
              aria-pressed={coolantType === 'sodium'}
              onClick={() =>
                setCoolantType((current) => (current === 'water' ? 'sodium' : 'water'))
              }
            >
              {coolantToggleLabel}: {coolantType === 'water' ? coolantOffLabel : coolantOnLabel}
            </button>
          </div>
        )}

        {multiblockType === 'thermalEvaporationPlant' && (
          <div className="toggle-row">
            <button
              type="button"
              className={`switch-button toggle-button ${evaporationUseSolarGenerators ? 'is-on' : 'is-off'}`}
              aria-pressed={evaporationUseSolarGenerators}
              onClick={() => setEvaporationUseSolarGenerators((current) => !current)}
            >
              {t.evaporationSolarTop}: {evaporationUseSolarGenerators ? t.toggleOn : t.toggleOff}
            </button>
          </div>
        )}

        {multiblockType === 'quantumComputer' && (
          <div className="toggle-row">
            <button
              type="button"
              className={`switch-button toggle-button ${quantumStorageTier === 256 ? 'is-on' : 'is-off'}`}
              aria-pressed={quantumStorageTier === 256}
              onClick={() => setQuantumStorageTier((current) => (current === 128 ? 256 : 128))}
            >
              {t.quantumStorageTier}: {quantumStorageTier === 256 ? t.quantumStorage256 : t.quantumStorage128}
            </button>
          </div>
        )}

        {multiblockType === 'steamBoilerEngine' && (
          <>
            <div className="toggle-row">
              <button
                type="button"
                className={`switch-button toggle-button ${createShowOptionalFuels ? 'is-on' : 'is-off'}`}
                aria-pressed={createShowOptionalFuels}
                onClick={() => {
                  const next = !createShowOptionalFuels
                  if (!next && isOptionalCreateFuel(createFuelType)) {
                    setCreateFuelType('coal')
                  }
                  setCreateShowOptionalFuels(next)
                }}
              >
                {t.createShowOptionalFuels}: {createShowOptionalFuels ? t.toggleOn : t.toggleOff}
              </button>
            </div>

            <label className="select-field">
              <span>{t.createFuelType}</span>
              <select value={createFuelType} onChange={(event) => setCreateFuelType(event.target.value as CreateBoilerFuelType)}>
                <optgroup label={t.createFuelGroupNonSuperheated}>
                  <option value="coal">{t.createFuelCoal}</option>
                  <option value="lava">{t.createFuelLava}</option>
                  <option value="ethanol">{t.createFuelEthanol}</option>
                  <option value="creosote">{t.createFuelCreosote}</option>
                  <option value="plantoil">{t.createFuelPlantOil}</option>
                  <option value="crudeOil">{t.createFuelCrudeOil}</option>
                </optgroup>
                <optgroup label={t.createFuelGroupSuperheated}>
                  <option value="blazeCake">{t.createFuelBlazeCake}</option>
                  <option value="biofuel">{t.createFuelBiofuel}</option>
                </optgroup>
                {createShowOptionalFuels && (
                  <optgroup label={t.createFuelGroupOptional}>
                    <option value="biodiesel">{t.createFuelBiodiesel}</option>
                    <option value="diesel">{t.createFuelDiesel}</option>
                    <option value="gasoline">{t.createFuelGasoline}</option>
                  </optgroup>
                )}
              </select>
            </label>
          </>
        )}

        {multiblockType === 'industrialTurbine' && (
          <div className="toggle-row">
            <button
              type="button"
              className={`switch-button toggle-button ${turbineUseTopVents ? 'is-on' : 'is-off'}`}
              aria-pressed={turbineUseTopVents}
              onClick={() => setTurbineUseTopVents((current) => !current)}
            >
              {t.turbineUseTopVents}: {turbineUseTopVents ? 'Yes' : 'No'}
            </button>
          </div>
        )}

        <div className="field-grid">
          {renderRangeControl({
            id: 'width',
            label: multiblockType === 'steamBoilerEngine' ? t.edge : t.width,
            min: profile.width.min,
            max: profile.width.max,
            value: width,
            disabled: profile.width.fixed !== undefined,
            onChange: setWidthInput,
          })}

          {renderRangeControl({
            id: 'height',
            label: t.height,
            min: profile.height.min,
            max: profile.height.max,
            value: height,
            disabled: profile.height.fixed !== undefined,
            onChange: setHeightInput,
          })}

          {multiblockType !== 'steamBoilerEngine' &&
            renderRangeControl({
              id: 'length',
              label: t.length,
              min: profile.length.min,
              max: profile.length.max,
              value: length,
              disabled: profile.length.fixed !== undefined,
              onChange: setLengthInput,
            })}

          {portsApplicable &&
            renderRangeControl({
              id: 'ports',
              label: t.ports,
              min: minimumPorts,
              max: portsMax,
              value: ports,
              onChange: setPortsInput,
            })}

          {multiblockType === 'inductionMatrix' && (
            <>
              {renderRangeControl({
                id: 'matrix-cells',
                label: t.matrixCells,
                min: 0,
                max: innerVolumeByDimensions,
                value: matrixCellsInput,
                onChange: setMatrixCellsInput,
              })}
              {renderRangeControl({
                id: 'matrix-providers',
                label: t.matrixProviders,
                min: 0,
                max: innerVolumeByDimensions,
                value: matrixProvidersInput,
                onChange: setMatrixProvidersInput,
              })}
            </>
          )}

          {multiblockType === 'matrixAssembler' && (
            <>
              {renderRangeControl({
                id: 'matrix-pattern-cores',
                label: t.matrixPatternCores,
                min: matrixPatternCoresMin,
                max: matrixPatternCoresMax,
                value: matrixPatternCores,
                onChange: setMatrixPatternCoresInput,
              })}
              {renderRangeControl({
                id: 'matrix-craft-cores',
                label: t.matrixCraftCores,
                min: matrixCraftCoresMin,
                max: matrixCraftCoresMax,
                value: matrixCraftCores,
                onChange: setMatrixCraftCoresInput,
              })}
              {renderRangeControl({
                id: 'matrix-speed-cores',
                label: t.matrixSpeedCores,
                min: 0,
                max: matrixSpeedCoresMax,
                value: matrixSpeedCores,
                onChange: setMatrixSpeedCoresInput,
              })}
            </>
          )}

          {multiblockType === 'sps' && (
            renderRangeControl({
              id: 'sps-coils',
              label: t.spsCoils,
              min: 1,
              max: 1,
              value: spsCoilsInput,
              onChange: setSpsCoilsInput,
            })
          )}

          {multiblockType === 'thermalEvaporationPlant' &&
            renderDecimalControl({
              id: 'evaporation-temperature-kk',
              label: t.evaporationTemperature,
              min: 0,
              max: 3,
              step: 0.1,
              value: evaporationTemperatureKkInput,
              onChange: setEvaporationTemperatureKkInput,
            })}

          {multiblockType === 'thermoelectricBoiler' && (
            <>
              {renderRangeControl({
                id: 'boiler-steam-height',
                label: t.boilerSteamHeight,
                min: 1,
                max: boilerSteamHeightMax,
                value: boilerSteamHeight,
                onChange: setBoilerSteamHeightInput,
              })}
              {renderRangeControl({
                id: 'boiler-superheating-elements',
                label: t.boilerSuperheatingElements,
                min: 0,
                max: boilerSuperheatingElementsMax,
                value: boilerSuperheatingElements,
                onChange: setBoilerSuperheatingElementsInput,
              })}
            </>
          )}

          {multiblockType === 'industrialTurbine' && (
            <>
              {renderRangeControl({
                id: 'turbine-rotor-height',
                label: t.turbineRotorHeight,
                min: 1,
                max: turbineRotorHeightMax,
                value: turbineRotorHeight,
                onChange: setTurbineRotorHeightInput,
              })}
              {renderRangeControl({
                id: 'turbine-blades-per-rotor',
                label: t.turbineBladesPerRotor,
                min: 0,
                max: turbineBladesPerRotorMax,
                value: turbineBladesPerRotorInput,
                onChange: setTurbineBladesPerRotorInput,
              })}
              {renderRangeControl({
                id: 'turbine-coils',
                label: t.turbineCoils,
                min: 1,
                max: turbinePracticalCoilsMax,
                value: turbineCoils,
                onChange: setTurbineCoilsInput,
              })}
              {renderRangeControl({
                id: 'turbine-condensers',
                label: t.turbineCondensers,
                min: 0,
                max: turbinePlaneMax,
                value: turbineCondensersInput,
                onChange: setTurbineCondensersInput,
              })}
              {renderRangeControl({
                id: 'turbine-vent-side-layers',
                label: t.turbineVentSideLayers,
                min: 0,
                max: turbineVentSideLayersMax,
                value: turbineVentSideLayers,
                onChange: setTurbineVentSideLayersInput,
              })}
            </>
          )}

          {multiblockType === 'fissionReactor' && (
            <>
              {renderRangeControl({
                id: 'fission-assemblies',
                label: t.fissionAssemblies,
                min: 0,
                max: fissionAssembliesMax,
                value: fissionAssemblies,
                onChange: setFissionAssembliesInput,
              })}
              {renderRangeControl({
                id: 'fission-assembly-height',
                label: t.fissionAssemblyHeight,
                min: 1,
                max: fissionAssemblyHeightMax,
                value: fissionAssemblyHeight,
                onChange: setFissionAssemblyHeightInput,
              })}
              {renderRangeControl({
                id: 'fission-burn-rate',
                label: t.fissionBurnRate,
                min: 0,
                max: Math.max(fissionMaxBurnRateBySetup, 0),
                value: fissionBurnRate,
                onChange: setFissionBurnRateInput,
              })}
              {renderRangeControl({
                id: 'fission-logic-adapters',
                label: t.fissionLogicAdapters,
                min: 0,
                max: fissionAttachmentMax,
                value: fissionLogicAdapters,
                onChange: setFissionLogicAdaptersInput,
              })}
            </>
          )}

          {multiblockType === 'fusionReactor' && (
            <>
              {renderRangeControl({
                id: 'fusion-logic-adapters',
                label: t.fusionLogicAdapters,
                min: 0,
                max: fusionAttachmentMax,
                value: fusionLogicAdaptersInput,
                onChange: setFusionLogicAdaptersInput,
              })}
              {renderRangeControl({
                id: 'fusion-injection-rate',
                label: t.fusionInjectionRate,
                min: 0,
                max: FUSION_MAX_INJECTION,
                value: fusionInjectionRate,
                onChange: setFusionInjectionRateInput,
              })}
            </>
          )}

          {multiblockType === 'quantumComputer' && (
            <>
              {renderRangeControl({
                id: 'quantum-data-entanglers',
                label: t.quantumDataEntanglers,
                min: 0,
                max: 1,
                value: quantumDataEntanglers,
                onChange: setQuantumDataEntanglersInput,
              })}
              {renderRangeControl({
                id: 'quantum-multi-threaders',
                label: t.quantumMultiThreaders,
                min: 0,
                max: quantumMultiThreaderMax,
                value: quantumMultiThreaders,
                onChange: setQuantumMultiThreadersInput,
              })}
              {renderRangeControl({
                id: 'quantum-accelerators',
                label: t.quantumAccelerators,
                min: 0,
                max: quantumAcceleratorsMax,
                value: quantumAccelerators,
                onChange: setQuantumAcceleratorsInput,
              })}
              {renderRangeControl({
                id: 'quantum-storage-blocks',
                label: t.quantumStorageBlocks,
                min: 0,
                max: quantumStorageBlocksMax,
                value: quantumStorageBlocks,
                onChange: setQuantumStorageBlocksInput,
              })}
            </>
          )}

          {multiblockType === 'steamBoilerEngine' && (
            <>
              {renderRangeControl({
                id: 'create-blaze-burners',
                label: t.createBlazeBurners,
                min: 1,
                max: createBlazeBurnersMax,
                value: createBlazeBurners,
                onChange: setCreateBlazeBurnersInput,
              })}
              {renderRangeControl({
                id: 'create-steam-engines',
                label: t.createSteamEngines,
                min: 1,
                max: CREATE_BOILER_MAX_LEVEL,
                value: createSteamEngines,
                onChange: setCreateSteamEnginesInput,
              })}
            </>
          )}
        </div>
      </section>

      <section className="panel result-panel" aria-live="polite">
        <h2>{t.specsTitle}</h2>

        {result.specs.length === 0 ? (
          <p className="muted-text">{t.noSpecs}</p>
        ) : (
          <dl className="result-grid resource-grid">
            {result.specs
              .filter((line) => multiblockType !== 'fusionReactor' || line.key !== 'fusionSteamProduction' || fusionIsWaterCooled)
              .map((line) => (
                <div key={line.key}>
                  <dt>{t.specs[line.key]}</dt>
                  <dd>
                    {line.value.toLocaleString()} {line.unit}
                  </dd>
                </div>
              ))}
          </dl>
        )}

        {result.errors.length > 0 && (
          <div className="message-block error-block">
            <h3>{t.errorsTitle}</h3>
            <ul>
              {result.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {fissionSafetyWarnings.length > 0 && (
          <div className={`message-block ${fissionSafetyClassName}`}>
            <h3>{t.warningsTitle}</h3>
            <ul>
              {fissionSafetyWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {fusionSafetyWarnings.length > 0 && (
          <div className="message-block warning-block">
            <h3>{t.warningsTitle}</h3>
            <ul>
              {fusionSafetyWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <h3 className="section-title">{t.requirements}</h3>
        {result.lines.length === 0 ? (
          <p className="muted-text">{t.noResources}</p>
        ) : (
          <dl className="result-grid resource-grid">
            {result.lines.map((line) => (
              <div key={line.key}>
                <dt>
                  <span className="resource-label">
                    <img
                      className="resource-icon"
                      src={getResourceImagePath(line.key)}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                    <span>{t.resources[line.key]}</span>
                  </span>
                </dt>
                <dd>{line.count}</dd>
              </div>
            ))}
          </dl>
        )}

        {result.notes.length > 0 && (
          <div className="message-block note-block">
            <h3>{t.notesTitle}</h3>
            <ul>
              {result.notes.map((note) => (
                <li key={note}>{t.notes[note]}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <footer className="app-footer">
        <small>{t.footer}</small>
      </footer>
    </main>
  )
}

export default App
