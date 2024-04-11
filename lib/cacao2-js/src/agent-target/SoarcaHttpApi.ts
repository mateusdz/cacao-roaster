import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface SoarcaHttpApiProps extends AgentTargetProps {}

export interface SoarcaHttpApi extends SoarcaHttpApiProps {}
export class SoarcaHttpApi extends AgentTarget {
  constructor(partialprops: Partial<SoarcaHttpApiProps> = {}) {
    const props: SoarcaHttpApiProps = partialprops as SoarcaHttpApiProps;
    super(props);
    this.type = 'soarca-http-api';
  }
}
