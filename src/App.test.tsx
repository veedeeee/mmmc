import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows functional specs and hides legacy summary metrics', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Functional specs' })).toBeInTheDocument()
    expect(screen.queryByText('Total cuboid volume')).not.toBeInTheDocument()
    expect(screen.getByText('Fluid capacity', { selector: 'dt' })).toBeInTheDocument()
    expect(screen.getByText('Dynamic Tank', { selector: 'dt *' })).toBeInTheDocument()
  })

  it('switches to Japanese labels', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '日本語' }))

    expect(screen.getByRole('heading', { name: 'Modded Minecraft Multiblock Calculator' })).toBeInTheDocument()
    expect(screen.getByText('表示言語')).toBeInTheDocument()
    expect(screen.getByText('必要リソース')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'ダイナミックタンク' })).toBeInTheDocument()
    expect(screen.getByText('流体容量', { selector: 'dt' })).toBeInTheDocument()
  })

  it('localizes Japanese input labels and resource names for Mekanism, Matrix, Quantum, and Steam Boiler', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '日本語' }))

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'inductionMatrix' } })
    expect(screen.getByLabelText('インダクションセル数')).toBeInTheDocument()
    expect(screen.getByLabelText('インダクションプロバイダー数')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'matrixAssembler' } })
    expect(screen.getByLabelText('アセンブラーマトリックス・パターンコア数')).toBeInTheDocument()
    expect(screen.getByText('アセンブラーマトリックスフレーム', { selector: 'dt *' })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'quantumComputer' } })
    expect(screen.getByLabelText('量子データエンタングラー数')).toBeInTheDocument()
    expect(screen.getByText('量子コンピューターコア', { selector: 'dt *' })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'steamBoilerEngine' } })
    expect(screen.getByLabelText('ブレイズバーナー数')).toBeInTheDocument()
    expect(screen.getByLabelText('スチームエンジン数')).toBeInTheDocument()
    expect(screen.getByText('流体タンク', { selector: 'dt *' })).toBeInTheDocument()
    expect(screen.getByText('ブレイズバーナー', { selector: 'dt *' })).toBeInTheDocument()
    expect(screen.getByText('スチームエンジン', { selector: 'dt *' })).toBeInTheDocument()
  })

  it('shows fixed fusion dimensions and fusion specs/resources', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fusionReactor' } })

    const widthInput = screen.getByLabelText('Width')
    expect(widthInput).toBeDisabled()
    expect(screen.getByText('Fuel capacity', { selector: 'dt' })).toBeInTheDocument()
    expect(screen.getByText('Fusion Reactor Controller')).toBeInTheDocument()
  })

  it('shows newly listed modded multiblocks and implements create steam boiler calculations', () => {
    render(<App />)

    expect(screen.getByRole('group', { name: 'AdvancedAE' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'ExtendedAE' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Create / Create Crafts & Additions' })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'steamBoilerEngine' } })

    expect(screen.getByLabelText('Edge')).toHaveValue('3')
    expect(screen.getByLabelText('Height')).toHaveValue('8')
    expect(screen.queryByLabelText('Length')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Boiler fuel type')).toHaveValue('coal')
    expect(screen.getByRole('group', { name: 'Non-superheated' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Superheated' })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Optional (external mod fluids)' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Coal' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Blaze Cake' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Lava' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Biofuel' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Diesel' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Gasoline' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Blaze Burners number input')).toHaveValue(9)
    expect(screen.getByLabelText('Steam Engines number input')).toHaveValue(18)
    expect(screen.getByLabelText('Blaze Burners number input')).toHaveAttribute('max', '9')

    const boilerLevelRow = screen.getByText('Boiler level', { selector: 'dt' }).closest('div')
    const suRow = screen.getByText('Generated stress capacity', { selector: 'dt' }).closest('div')
    const waterRow = screen.getByText('Required water flow for max boiler level', { selector: 'dt' }).closest('div')
    const tankRow = screen.getByText('Fluid Tank', { selector: 'dt *' }).closest('div')
    const burnerRow = screen.getByText('Blaze Burner', { selector: 'dt *' }).closest('div')
    const engineRow = screen.getByText('Steam Engine', { selector: 'dt *' }).closest('div')

    expect(boilerLevelRow?.querySelector('dd')).toHaveTextContent('9 lvl')
    expect(suRow?.querySelector('dd')).toHaveTextContent('147,456 SU')
    expect(waterRow?.querySelector('dd')).toHaveTextContent('90 mB/t')
    expect(tankRow?.querySelector('dd')).toHaveTextContent('72')
    expect(burnerRow?.querySelector('dd')).toHaveTextContent('9')
    expect(engineRow?.querySelector('dd')).toHaveTextContent('18')

    expect(screen.queryByText('Straw', { selector: 'dt *' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Boiler fuel type'), { target: { value: 'lava' } })
    const strawRow = screen.getByText('Straw', { selector: 'dt *' }).closest('div')
    expect(strawRow?.querySelector('dd')).toHaveTextContent('9')
    expect(screen.getByText('Boiler level', { selector: 'dt' }).closest('div')?.querySelector('dd')).toHaveTextContent('9 lvl')
    expect(screen.getByText('Required water flow for max boiler level', { selector: 'dt' }).closest('div')?.querySelector('dd')).toHaveTextContent('90 mB/t')

    fireEvent.change(screen.getByLabelText('Boiler fuel type'), { target: { value: 'blazeCake' } })
    expect(screen.getByText('Boiler level', { selector: 'dt' }).closest('div')?.querySelector('dd')).toHaveTextContent('18 lvl (Max)')
    expect(screen.getByText('Required water flow for max boiler level', { selector: 'dt' }).closest('div')?.querySelector('dd')).toHaveTextContent('180 mB/t')

    fireEvent.click(screen.getByRole('button', { name: 'Show optional external fuels: OFF' }))
    expect(screen.getByRole('group', { name: 'Optional (external mod fluids)' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Diesel' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Gasoline' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Steam Engines number input'), { target: { value: '1' } })
    expect(screen.getByText('Generated stress capacity', { selector: 'dt' }).closest('div')?.querySelector('dd')).toHaveTextContent('16,384 SU')

    fireEvent.change(screen.getByLabelText('Edge number input'), { target: { value: '1' } })
    expect(screen.getByLabelText('Blaze Burners number input')).toHaveAttribute('max', '1')
    expect(screen.getByLabelText('Blaze Burners number input')).toHaveValue(1)
  })

  it('implements matrix assembler structure rules and specs', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'matrixAssembler' } })

    expect(screen.queryByLabelText('Ports / Valves')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Width')).toHaveValue('7')
    expect(screen.getByLabelText('Height')).toHaveValue('7')
    expect(screen.getByLabelText('Length')).toHaveValue('7')
    expect(screen.getByLabelText('Assembler Matrix Speed Cores number input')).toHaveAttribute('max', '5')
    expect(screen.getByLabelText('Assembler Matrix Pattern Cores number input')).toHaveAttribute('min', '1')
    expect(screen.getByLabelText('Assembler Matrix Craft Cores number input')).toHaveAttribute('min', '1')
    expect(screen.getByLabelText('Assembler Matrix Pattern Cores number input')).toHaveAttribute('max', '1')
    expect(screen.getByLabelText('Assembler Matrix Craft Cores number input')).toHaveAttribute('max', '119')
    expect(screen.getByLabelText('Assembler Matrix Speed Cores number input')).toHaveAttribute('max', '5')
    expect(screen.getByLabelText('Assembler Matrix Pattern Cores number input')).toHaveValue(1)
    expect(screen.getByLabelText('Assembler Matrix Craft Cores number input')).toHaveValue(119)
    expect(screen.getByLabelText('Assembler Matrix Speed Cores number input')).toHaveValue(5)

    const jobsRow = screen.getByText('Max concurrent crafting jobs', { selector: 'dt' }).closest('div')
    const slotRow = screen.getByText('Pattern slot capacity', { selector: 'dt' }).closest('div')
    const speedEffectRow = screen.getByText('Speed core effectiveness', { selector: 'dt' }).closest('div')
    const frameRow = screen.getByText('Assembler Matrix Frame', { selector: 'dt *' }).closest('div')
    const wallRow = screen.getByText('Assembler Matrix Wall/Glass', { selector: 'dt *' }).closest('div')

    expect(jobsRow?.querySelector('dd')).toHaveTextContent('952 jobs')
    expect(slotRow?.querySelector('dd')).toHaveTextContent('36 slots')
    expect(speedEffectRow?.querySelector('dd')).toHaveTextContent('100 %')
    expect(frameRow?.querySelector('dd')).toHaveTextContent('68')
    expect(wallRow?.querySelector('dd')).toHaveTextContent('150')

    fireEvent.change(screen.getByLabelText('Assembler Matrix Craft Cores number input'), { target: { value: '0' } })
    expect(screen.getByLabelText('Assembler Matrix Craft Cores number input')).toHaveValue(1)
    expect(screen.getByLabelText('Assembler Matrix Pattern Cores number input')).toHaveAttribute('max', '119')
    fireEvent.change(screen.getByLabelText('Assembler Matrix Pattern Cores number input'), { target: { value: '121' } })
    expect(screen.getByLabelText('Assembler Matrix Pattern Cores number input')).toHaveValue(119)
    expect(screen.getByLabelText('Assembler Matrix Craft Cores number input')).toHaveAttribute('max', '1')
    expect(screen.getByLabelText('Assembler Matrix Speed Cores number input')).toHaveAttribute('max', '5')

    fireEvent.change(screen.getByLabelText('Assembler Matrix Speed Cores number input'), { target: { value: '10' } })
    expect(screen.getByLabelText('Assembler Matrix Speed Cores number input')).toHaveValue(5)

    fireEvent.change(screen.getByLabelText('Height number input'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Width number input'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Length number input'), { target: { value: '3' } })
    expect(screen.getByLabelText('Assembler Matrix Pattern Cores number input')).toHaveAttribute('min', '0')
    expect(screen.getByLabelText('Assembler Matrix Craft Cores number input')).toHaveAttribute('min', '0')
  })

  it('implements quantum computer controls and resource/spec calculation', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'quantumComputer' } })

    expect(screen.queryByLabelText('Ports / Valves')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quantum storage tier: 256M' })).toBeInTheDocument()
    expect(screen.getByLabelText('Quantum Data Entanglers')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantum Multi-threaders')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantum Accelerators')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantum Storage blocks')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantum Data Entanglers number input')).toHaveAttribute('min', '0')
    expect(screen.getByLabelText('Quantum Data Entanglers number input')).toHaveAttribute('max', '1')
    expect(screen.getByLabelText('Quantum Multi-threaders number input')).toHaveAttribute('min', '0')
    expect(screen.getByLabelText('Quantum Multi-threaders number input')).toHaveAttribute('max', '1')
    expect(screen.getByLabelText('Quantum Data Entanglers number input')).toHaveValue(1)
    expect(screen.getByLabelText('Quantum Multi-threaders number input')).toHaveValue(1)
    expect(screen.getByLabelText('Quantum Storage blocks number input')).toHaveValue(1)
    expect(screen.getByLabelText('Quantum Accelerators number input')).toHaveValue(121)

    fireEvent.change(screen.getByLabelText('Width number input'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Height number input'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Length number input'), { target: { value: '4' } })

    fireEvent.change(screen.getByLabelText('Quantum Data Entanglers number input'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Quantum Multi-threaders number input'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Quantum Accelerators number input'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Quantum Storage blocks number input'), { target: { value: '1' } })

    const totalStorageRow = screen.getByText('Total crafting storage', { selector: 'dt' }).closest('div')
    const coProcessorsRow = screen.getByText('Co-Processor count', { selector: 'dt' }).closest('div')
    const shellGlassRow = screen.getByText('Quantum Computer Structural Glass', { selector: 'dt *' }).closest('div')
    const storage256Row = screen.getByText('256M Quantum Computer Storage', { selector: 'dt *' }).closest('div')
    const entanglerRow = screen.getByText('Quantum Data Entangler', { selector: 'dt *' }).closest('div')
    const threaderRow = screen.getByText('Quantum Multi-threader', { selector: 'dt *' }).closest('div')
    const acceleratorRow = screen.getByText('Quantum Accelerator', { selector: 'dt *' }).closest('div')
    const craftingUnitRow = screen.getByText('Quantum Crafting Unit', { selector: 'dt *' }).closest('div')

    expect(totalStorageRow?.querySelector('dd')).toHaveTextContent('2,048 M')
    expect(coProcessorsRow?.querySelector('dd')).toHaveTextContent('96 threads')
    expect(shellGlassRow?.querySelector('dd')).toHaveTextContent('56')
    expect(storage256Row?.querySelector('dd')).toHaveTextContent('1')
    expect(entanglerRow?.querySelector('dd')).toHaveTextContent('1')
    expect(threaderRow?.querySelector('dd')).toHaveTextContent('1')
    expect(acceleratorRow?.querySelector('dd')).toHaveTextContent('2')
    expect(craftingUnitRow?.querySelector('dd')).toHaveTextContent('2')

    fireEvent.click(screen.getByRole('button', { name: 'Quantum storage tier: 256M' }))
    const totalStorageRow128 = screen.getByText('Total crafting storage', { selector: 'dt' }).closest('div')
    const storage128Row = screen.getByText('128M Quantum Computer Storage', { selector: 'dt *' }).closest('div')
    expect(totalStorageRow128?.querySelector('dd')).toHaveTextContent('1,536 M')
    expect(storage128Row?.querySelector('dd')).toHaveTextContent('1')

    expect(
      screen.getByText(
        'Official Quantum Computer validator requires Quantum Computer Structural Glass on all outside faces for multiblock formation.',
      ),
    ).toBeInTheDocument()
    const shellGlassRowAfterToggle = screen.getByText('Quantum Computer Structural Glass', { selector: 'dt *' }).closest('div')
    expect(shellGlassRowAfterToggle?.querySelector('dd')).toHaveTextContent('56')
  })

  it('uses optgroup sections and sets turbine performance controls to max by default', () => {
    render(<App />)

    expect(screen.getByRole('group', { name: 'Mekanism' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Mekanism Generators' })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'industrialTurbine' } })

    const rotorSlider = screen.getByLabelText('Rotor height (blocks)')
    expect(rotorSlider).toHaveValue('14')

    const portsSlider = screen.getByLabelText('Ports / Valves')
    expect(portsSlider).toHaveValue('1')

    const coilsInput = screen.getByLabelText('Electromagnetic coils number input')
    expect(coilsInput).toHaveAttribute('max', '7')
    expect(coilsInput).toHaveValue(7)

    const bladesSlider = screen.getByLabelText('Blades per rotor')
    expect(bladesSlider).toHaveValue('2')

    const condensersSlider = screen.getByLabelText('Saturating condensers')
    expect(condensersSlider).toHaveValue('225')
  })

  it('keeps slider while allowing number input and step buttons', () => {
    render(<App />)

    const portsSlider = screen.getByLabelText('Ports / Valves')
    const portsNumberInput = screen.getByLabelText('Ports / Valves number input')

    fireEvent.change(portsNumberInput, { target: { value: '12' } })
    expect(portsSlider).toHaveValue('12')

    fireEvent.click(screen.getByRole('button', { name: 'Ports / Valves +5' }))
    expect(portsSlider).toHaveValue('17')

    fireEvent.click(screen.getByRole('button', { name: 'Ports / Valves -5' }))
    expect(portsSlider).toHaveValue('12')
  })

  it('moves focus to next numeric field when pressing Tab inside numeric input', () => {
    render(<App />)

    const widthNumberInput = screen.getByLabelText('Width number input')
    const heightNumberInput = screen.getByLabelText('Height number input')

    widthNumberInput.focus()
    expect(widthNumberInput).toHaveFocus()

    fireEvent.keyDown(widthNumberInput, { key: 'Tab' })
    expect(heightNumberInput).toHaveFocus()

    fireEvent.keyDown(heightNumberInput, { key: 'Tab', shiftKey: true })
    expect(widthNumberInput).toHaveFocus()
  })

  it('recalculates shell resources when structural glass is enabled', () => {
    render(<App />)

    const dynamicTankRowBefore = screen.getByText('Dynamic Tank', { selector: 'dt *' }).closest('div')
    expect(dynamicTankRowBefore?.querySelector('dd')).toHaveTextContent('1735')

    fireEvent.click(screen.getByRole('button', { name: 'Use Structural Glass: OFF' }))

    const dynamicTankRowAfter = screen.getByText('Dynamic Tank', { selector: 'dt *' }).closest('div')
    const glassRow = screen.getByText('Structural Glass', { selector: 'dt *' }).closest('div')
    expect(dynamicTankRowAfter?.querySelector('dd')).toHaveTextContent('200')
    expect(glassRow?.querySelector('dd')).toHaveTextContent('1535')
  })

  it('hides unrelated toggles and only shows applicable ones', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Use Structural Glass: OFF' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Use Reactor Glass: OFF' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Coolant: Water' })).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })

    expect(screen.getByRole('button', { name: 'Use Reactor Glass: OFF' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coolant: Water' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Use Structural Glass: OFF' })).not.toBeInTheDocument()
  })

  it('locks SPS coil count to exactly one', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sps' } })
    const coilInput = screen.getByLabelText('Supercharged Coils number input')
    expect(coilInput).toHaveAttribute('min', '1')
    expect(coilInput).toHaveAttribute('max', '1')
    fireEvent.change(coilInput, { target: { value: '5' } })

    const coilResourceRow = screen.getByText('Supercharged Coil', { selector: 'dt *' }).closest('div')
    const efficiencyRow = screen.getByText('Coil efficiency', { selector: 'dt' }).closest('div')
    expect(coilResourceRow?.querySelector('dd')).toHaveTextContent('1')
    expect(efficiencyRow?.querySelector('dd')).toHaveTextContent('100 %')
  })

  it('uses fixed SPS shell count instead of cuboid shell count', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sps' } })

    const spsCasingRow = screen.getByText('SPS Casing', { selector: 'dt *' }).closest('div')
    expect(spsCasingRow?.querySelector('dd')).toHaveTextContent('183')

    fireEvent.click(screen.getByRole('button', { name: 'Use Structural Glass: OFF' }))

    const spsCasingGlassRow = screen.getByText('SPS Casing', { selector: 'dt *' }).closest('div')
    const structuralGlassRow = screen.getByText('Structural Glass', { selector: 'dt *' }).closest('div')
    expect(spsCasingGlassRow?.querySelector('dd')).toHaveTextContent('60')
    expect(structuralGlassRow?.querySelector('dd')).toHaveTextContent('123')
  })

  it('uses SPS port bounds of 3 to 126', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sps' } })
    const portsInput = screen.getByLabelText('Ports / Valves number input')
    expect(portsInput).toHaveAttribute('min', '3')
    expect(portsInput).toHaveAttribute('max', '126')

    fireEvent.change(portsInput, { target: { value: '2' } })
    expect(screen.getByLabelText('Ports / Valves')).toHaveValue('3')

    fireEvent.change(portsInput, { target: { value: '999' } })
    expect(screen.getByLabelText('Ports / Valves')).toHaveValue('126')
  })

  it('applies turbine blade soft cap', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'industrialTurbine' } })
    fireEvent.change(screen.getByLabelText('Electromagnetic coils number input'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Use Turbine Vent for upper surface: Yes' }))
    fireEvent.change(screen.getByLabelText('Blades per rotor number input'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Saturating condensers number input'), { target: { value: '200' } })

    expect(
      screen.getByText(
        'Extra turbine blades beyond coil-supported generation are counted as build cost, but do not increase calculated generation.',
      ),
    ).toBeInTheDocument()
  })

  it('caps turbine blades per rotor at two', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'industrialTurbine' } })
    const bladesInput = screen.getByLabelText('Blades per rotor number input')

    expect(bladesInput).toHaveAttribute('max', '2')
    fireEvent.change(bladesInput, { target: { value: '56' } })
    expect(screen.getByLabelText('Blades per rotor')).toHaveValue('2')
  })

  it('applies turbine vent and condenser soft caps', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'industrialTurbine' } })
    fireEvent.change(screen.getByLabelText('Width number input'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Height number input'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Length number input'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Blades per rotor number input'), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText('Turbine vent side layers number input'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Saturating condensers number input'), { target: { value: '200' } })

    expect(
      screen.getByText(
        'Extra turbine vents beyond disperser-limited flow are counted as build cost, but do not increase calculated throughput.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Extra saturating condensers beyond steam-flow limit are counted as build cost, but do not increase calculated water output.',
      ),
    ).toBeInTheDocument()
  })

  it('derives turbine vent count from top toggle and side vent layers', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'industrialTurbine' } })
    fireEvent.change(screen.getByLabelText('Width number input'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Height number input'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Length number input'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Turbine vent side layers number input'), { target: { value: '2' } })

    const ventsRow = screen.getByText('Turbine Vent', { selector: 'dt *' }).closest('div')
    expect(ventsRow?.querySelector('dd')).toHaveTextContent('33')

    fireEvent.click(screen.getByRole('button', { name: 'Use Turbine Vent for upper surface: Yes' }))

    const ventsRowAfterTopOff = screen.getByText('Turbine Vent', { selector: 'dt *' }).closest('div')
    expect(ventsRowAfterTopOff?.querySelector('dd')).toHaveTextContent('24')
  })

  it('uses explicit fusion injection rate and enforces even-number steps', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fusionReactor' } })
    fireEvent.change(screen.getByLabelText('Injection rate number input'), { target: { value: '7' } })

    expect(screen.getByLabelText('Injection rate')).toHaveValue('6')
  })

  it('shows fusion steam generation only when cooling mode is water-cooled', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fusionReactor' } })
    const passiveLabel = screen.getByText('Passive generation (estimated)', { selector: 'dt' })
    const steamLabel = screen.getByText('Steam production (estimated)', { selector: 'dt' })
    expect(steamLabel).toBeInTheDocument()
    expect(passiveLabel.compareDocumentPosition(steamLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Cooling: Water-cooled' }))
    expect(screen.queryByText('Steam production (estimated)', { selector: 'dt' })).not.toBeInTheDocument()
  })

  it('shows fusion temperature cautions', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fusionReactor' } })

    expect(screen.getByText('Safety warnings')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Fusion ignition requires plasma temperature around 100,000,000 K. Casing temperature alone does not guarantee sustained fusion burn.',
      ),
    ).toBeInTheDocument()
  })

  it('shows both evaporation recipe production rates', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    expect(screen.getByText('Water -> Brine production rate (estimated)', { selector: 'dt' })).toBeInTheDocument()
    expect(screen.getByText('Brine -> Liquid Lithium production rate (estimated)', { selector: 'dt' })).toBeInTheDocument()
  })

  it('switches boiler coolant mode and recalculates heating specs', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermoelectricBoiler' } })
    fireEvent.change(screen.getByLabelText('Superheating elements number input'), { target: { value: '1' } })

    const heatingRateRowBefore = screen.getByText('Coolant heating rate (estimated)', { selector: 'dt' }).closest('div')
    const heatingRateBefore = heatingRateRowBefore?.querySelector('dd')?.textContent

    fireEvent.click(screen.getByRole('button', { name: 'Coolant: Water' }))

    const heatingRateRowAfter = screen.getByText('Coolant heating rate (estimated)', { selector: 'dt' }).closest('div')
    const heatingRateAfter = heatingRateRowAfter?.querySelector('dd')?.textContent

    expect(heatingRateBefore).not.toEqual(heatingRateAfter)
  })

  it('shows structural glass toggle for thermoelectric boiler', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermoelectricBoiler' } })

    expect(screen.getByRole('button', { name: 'Use Structural Glass: OFF' })).toBeInTheDocument()
  })

  it('caps boiler superheating element input by practical max from steam split', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermoelectricBoiler' } })
    fireEvent.change(screen.getByLabelText('Boiler steam height (inner layers) number input'), { target: { value: '15' } })

    const superheatingInput = screen.getByLabelText('Superheating elements number input')
    expect(superheatingInput).toHaveAttribute('max', '256')

    fireEvent.change(superheatingInput, { target: { value: '9999' } })
    expect(screen.getByLabelText('Superheating elements')).toHaveValue('256')
  })

  it('uses full structure footprint for boiler water and steam capacities', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermoelectricBoiler' } })
    fireEvent.change(screen.getByLabelText('Boiler steam height (inner layers) number input'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Superheating elements number input'), { target: { value: '0' } })

    const waterCapacityRow = screen.getByText('Water capacity', { selector: 'dt' }).closest('div')
    const steamCapacityRow = screen.getByText('Steam capacity', { selector: 'dt' }).closest('div')

    expect(waterCapacityRow?.querySelector('dd')).toHaveTextContent('77,760,000 mB')
    expect(steamCapacityRow?.querySelector('dd')).toHaveTextContent('103,680,000 mB')
  })

  it('reduces boiler water capacity by occupied superheating element count', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermoelectricBoiler' } })
    fireEvent.change(screen.getByLabelText('Boiler steam height (inner layers) number input'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Superheating elements number input'), { target: { value: '100' } })

    const waterCapacityRow = screen.getByText('Water capacity', { selector: 'dt' }).closest('div')
    expect(waterCapacityRow?.querySelector('dd')).toHaveTextContent('76,160,000 mB')
  })

  it('treats boiler steam height as pure steam layers with a separate pressure disperser layer', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermoelectricBoiler' } })
    fireEvent.change(screen.getByLabelText('Height number input'), { target: { value: '18' } })
    fireEvent.change(screen.getByLabelText('Boiler steam height (inner layers) number input'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Superheating elements number input'), { target: { value: '120' } })

    const steamCapacityRow = screen.getByText('Steam capacity', { selector: 'dt' }).closest('div')
    const waterCapacityRow = screen.getByText('Water capacity', { selector: 'dt' }).closest('div')
    const pressureDisperserRow = screen.getByText('Pressure Disperser', { selector: 'dt *' }).closest('div')

    expect(steamCapacityRow?.querySelector('dd')).toHaveTextContent('259,200,000 mB')
    expect(waterCapacityRow?.querySelector('dd')).toHaveTextContent('60,288,000 mB')
    expect(pressureDisperserRow?.querySelector('dd')).toHaveTextContent('256')
  })

  it('calculates fission max burn rate and selected burn rate from assembly structure cap', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })
    fireEvent.change(screen.getByLabelText('Fuel assemblies number input'), { target: { value: '128' } })
    fireEvent.change(screen.getByLabelText('Fuel assembly height number input'), { target: { value: '15' } })
    fireEvent.change(screen.getByLabelText('Burn rate number input'), { target: { value: '1920' } })

    const maxBurnRow = screen.getByText('Max burn rate (estimated)', { selector: 'dt' }).closest('div')
    const selectedBurnRow = screen.getByText('Selected burn rate', { selector: 'dt' }).closest('div')
    expect(maxBurnRow?.querySelector('dd')).toHaveTextContent('1,920 mB/t')
    expect(selectedBurnRow?.querySelector('dd')).toHaveTextContent('1,920 mB/t')

    fireEvent.click(screen.getByRole('button', { name: 'Coolant: Water' }))

    const maxBurnRowAfterToggle = screen.getByText('Max burn rate (estimated)', { selector: 'dt' }).closest('div')
    const selectedBurnRowAfterToggle = screen.getByText('Selected burn rate', { selector: 'dt' }).closest('div')
    expect(maxBurnRowAfterToggle?.querySelector('dd')).toHaveTextContent('1,920 mB/t')
    expect(selectedBurnRowAfterToggle?.querySelector('dd')).toHaveTextContent('1,920 mB/t')
  })

  it('uses fission boil and coolant conductivities for cooling efficiency calculation', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })
    fireEvent.change(screen.getByLabelText('Fuel assemblies number input'), { target: { value: '128' } })
    fireEvent.change(screen.getByLabelText('Fuel assembly height number input'), { target: { value: '15' } })
    fireEvent.change(screen.getByLabelText('Burn rate number input'), { target: { value: '0' } })

    const efficiencyRow = screen.getByText('Cooling efficiency (estimated)', { selector: 'dt' }).closest('div')
    expect(efficiencyRow?.querySelector('dd')).toHaveTextContent('50 %')

    fireEvent.click(screen.getByRole('button', { name: 'Coolant: Water' }))

    const efficiencyRowSodium = screen.getByText('Cooling efficiency (estimated)', { selector: 'dt' }).closest('div')
    expect(efficiencyRowSodium?.querySelector('dd')).toHaveTextContent('100 %')
  })

  it('shows fission safety warning when estimated temperature reaches dangerous threshold', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })
    fireEvent.change(screen.getByLabelText('Fuel assemblies number input'), { target: { value: '128' } })
    fireEvent.change(screen.getByLabelText('Fuel assembly height number input'), { target: { value: '15' } })
    fireEvent.change(screen.getByLabelText('Burn rate number input'), { target: { value: '1920' } })

    expect(screen.getByText('Safety warnings')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Estimated fission temperature reached the severe danger threshold (1,800 K). Explosion risk can increase as reactor damage accumulates.',
      ),
    ).toBeInTheDocument()
  })

  it('uses recipe-oriented minimum ports for fission reactor by default', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })

    const portsSlider = screen.getByLabelText('Ports / Valves')
    const portsInput = screen.getByLabelText('Ports / Valves number input')
    expect(portsSlider).toHaveValue('4')
    expect(portsInput).toHaveAttribute('min', '4')

    fireEvent.change(portsInput, { target: { value: '2' } })
    expect(portsSlider).toHaveValue('4')
  })

  it('uses minimum 2 ports for fusion reactor by default', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fusionReactor' } })

    const portsSlider = screen.getByLabelText('Ports / Valves')
    const portsInput = screen.getByLabelText('Ports / Valves number input')
    expect(portsSlider).toHaveValue('2')
    expect(portsInput).toHaveAttribute('min', '2')

    fireEvent.change(portsInput, { target: { value: '1' } })
    expect(portsSlider).toHaveValue('2')
  })

  it('allows configuring fission logic adapters as shell components', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })
    fireEvent.change(screen.getByLabelText('Logic adapters number input'), { target: { value: '5' } })

    const logicAdapterRow = screen.getByText('Fission Reactor Logic Adapter', { selector: 'dt *' }).closest('div')
    expect(logicAdapterRow?.querySelector('dd')).toHaveTextContent('5')
  })

  it('shows fission validation when shell component allocation exceeds shell size', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })
    fireEvent.change(screen.getByLabelText('Width number input'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Height number input'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Length number input'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Ports / Valves number input'), { target: { value: '26' } })
    fireEvent.change(screen.getByLabelText('Logic adapters number input'), { target: { value: '1' } })

    expect(
      screen.getByText('Fission shell components exceed available outer shell blocks (ports + logic adapters).'),
    ).toBeInTheDocument()
  })

  it('uses practical minimum ports for evaporation plant by default', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const portsSlider = screen.getByLabelText('Ports / Valves')
    expect(portsSlider).toHaveValue('3')
  })

  it('uses max fission assemblies by default for selected dimensions', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fissionReactor' } })

    const assembliesSlider = screen.getByLabelText('Fuel assemblies')
    expect(assembliesSlider).toHaveValue('128')
  })

  it('adds advanced solar generators for evaporation solar layout mode', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })
    fireEvent.click(screen.getByRole('button', { name: 'Use top solar generator layout: OFF' }))

    const thermalRow = screen.getByText('Thermal Evaporation Block', { selector: 'dt *' }).closest('div')
    const solarResourceRow = screen.getByText('Advanced Solar Generator', { selector: 'dt *' }).closest('div')
    expect(thermalRow?.querySelector('dd')).toHaveTextContent('212')
    expect(solarResourceRow?.querySelector('dd')).toHaveTextContent('4')
  })

  it('uses full structure volume for evaporation input tank capacity', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const capacityRow = screen.getByText('Input tank capacity', { selector: 'dt' }).closest('div')
    expect(capacityRow?.querySelector('dd')).toHaveTextContent('4,608,000 mB')
  })

  it('changes evaporation minimum ports based on solar mode', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const portsSlider = screen.getByLabelText('Ports / Valves')
    const portsNumberInput = screen.getByLabelText('Ports / Valves number input')
    fireEvent.change(portsNumberInput, { target: { value: '2' } })
    expect(portsSlider).toHaveValue('3')

    fireEvent.click(screen.getByRole('button', { name: 'Use top solar generator layout: OFF' }))
    fireEvent.change(portsNumberInput, { target: { value: '2' } })
    expect(portsSlider).toHaveValue('2')
  })

  it('limits evaporation max ports by selected solar layout', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const portsInput = screen.getByLabelText('Ports / Valves number input')
    expect(portsInput).toHaveAttribute('max', '219')

    fireEvent.click(screen.getByRole('button', { name: 'Use top solar generator layout: OFF' }))
    expect(portsInput).toHaveAttribute('max', '215')
  })

  it('replaces four top-corner thermal blocks with advanced solar generators', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const thermalBefore = screen.getByText('Thermal Evaporation Block', { selector: 'dt *' }).closest('div')
    expect(thermalBefore?.querySelector('dd')).toHaveTextContent('216')

    fireEvent.click(screen.getByRole('button', { name: 'Use top solar generator layout: OFF' }))
    fireEvent.change(screen.getByLabelText('Ports / Valves number input'), { target: { value: '2' } })

    const thermalAfter = screen.getByText('Thermal Evaporation Block', { selector: 'dt *' }).closest('div')
    const solarAfter = screen.getByText('Advanced Solar Generator', { selector: 'dt *' }).closest('div')
    expect(thermalAfter?.querySelector('dd')).toHaveTextContent('213')
    expect(solarAfter?.querySelector('dd')).toHaveTextContent('4')
  })

  it('keeps evaporation block sum consistent with 16 + 12*(height-1)', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const thermalOffRow = screen.getByText('Thermal Evaporation Block', { selector: 'dt *' }).closest('div')
    const valveOffRow = screen.getByText('Thermal Evaporation Valve', { selector: 'dt *' }).closest('div')
    const thermalOff = Number(thermalOffRow?.querySelector('dd')?.textContent)
    const valvesOff = Number(valveOffRow?.querySelector('dd')?.textContent)
    const controller = 1
    expect(thermalOff + valvesOff + controller).toBe(220)

    fireEvent.click(screen.getByRole('button', { name: 'Use top solar generator layout: OFF' }))
    fireEvent.change(screen.getByLabelText('Ports / Valves number input'), { target: { value: '2' } })

    const thermalOnRow = screen.getByText('Thermal Evaporation Block', { selector: 'dt *' }).closest('div')
    const solarOnRow = screen.getByText('Advanced Solar Generator', { selector: 'dt *' }).closest('div')
    const valveOnRow = screen.getByText('Thermal Evaporation Valve', { selector: 'dt *' }).closest('div')
    const thermalOn = Number(thermalOnRow?.querySelector('dd')?.textContent)
    const solarOn = Number(solarOnRow?.querySelector('dd')?.textContent)
    const valvesOn = Number(valveOnRow?.querySelector('dd')?.textContent)
    expect(thermalOn + solarOn + valvesOn + controller).toBe(220)
  })

  it('does not change evaporation production by toggling solar layout when temperature is unchanged', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const productionBeforeRow = screen
      .getByText('Water -> Brine production rate (estimated)', { selector: 'dt' })
      .closest('div')
    const productionBefore = productionBeforeRow?.querySelector('dd')?.textContent

    fireEvent.click(screen.getByRole('button', { name: 'Use top solar generator layout: OFF' }))

    const productionAfterRow = screen
      .getByText('Water -> Brine production rate (estimated)', { selector: 'dt' })
      .closest('div')
    const productionAfter = productionAfterRow?.querySelector('dd')?.textContent

    expect(productionAfter).toEqual(productionBefore)
  })

  it('updates evaporation production rates from assumed temperature input', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'thermalEvaporationPlant' } })

    const temperatureInput = screen.getByLabelText('Assumed evaporation temperature (kK) number input')
    expect(temperatureInput).toHaveAttribute('max', '3')

    const waterToBrineRow = screen
      .getByText('Water -> Brine production rate (estimated)', { selector: 'dt' })
      .closest('div')
    expect(waterToBrineRow?.querySelector('dd')).toHaveTextContent('1,080 mB/t')

    fireEvent.change(temperatureInput, {
      target: { value: '1.5' },
    })

    const waterToBrineRowCooler = screen
      .getByText('Water -> Brine production rate (estimated)', { selector: 'dt' })
      .closest('div')
    expect(waterToBrineRowCooler?.querySelector('dd')).toHaveTextContent('480 mB/t')

    fireEvent.change(temperatureInput, {
      target: { value: '6' },
    })

    const waterToBrineRowHot = screen
      .getByText('Water -> Brine production rate (estimated)', { selector: 'dt' })
      .closest('div')
    expect(waterToBrineRowHot?.querySelector('dd')).toHaveTextContent('1,080 mB/t')
  })

  it('shows fusion validation when shell component allocation exceeds shell size', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fusionReactor' } })
    fireEvent.change(screen.getByLabelText('Ports / Valves number input'), { target: { value: '98' } })

    expect(
      screen.getByText(
        'Fusion shell components exceed available outer shell blocks (ports + controller + logic adapters + laser matrices).',
      ),
    ).toBeInTheDocument()
  })
})
