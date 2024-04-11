import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface SoarcaSshProps extends AgentTargetProps {}

export interface SoarcaSsh extends SoarcaSshProps {}
export class SoarcaSsh extends AgentTarget {
  constructor(partialprops: Partial<SoarcaSshProps> = {}) {
    const props: SoarcaSshProps = partialprops as SoarcaSshProps;
    super(props);
    this.type = 'soarca-ssh';
  }
}
