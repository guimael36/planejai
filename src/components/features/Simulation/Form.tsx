import { StepProgress } from './Progress'
import { FormStep } from './FormStep'
import { simulationFormSteps } from '@/data/simulation'

export const SimulationForm = () => {
  const currentStep = simulationFormSteps[0]

  return (
    <>
      <StepProgress currentStep={1} totalSteps={6} />
      <FormStep key={currentStep.id} {...currentStep}/>
    </>
  )
}
