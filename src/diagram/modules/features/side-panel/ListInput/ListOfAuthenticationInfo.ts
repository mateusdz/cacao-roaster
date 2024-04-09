import { AuthenticationInfoInput } from '../AuthenticationInfoInput';
import { BasicInput } from '../BasicInput';
import { AuthenticationInfoElement } from '../BasicInputs/AuthenticationInfoElement';
import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';

/**
 * A ListOfAuthenticationInfo is a AuthenticationInfo containing a AuthenticationInfoDefinition.
 */
export class ListOfAuthenticationInfo extends AuthenticationInfoInput {
  _authInfoInput!: AuthenticationInfoElement;
  _ValueList: any;

  constructor(
    propertyName: string,
    propertyType: string,
    possibleValues: any,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
  ) {
    super(propertyName, propertyType, possibleValues, container);
    this._playbookHandler = playbookHandler;
  }

  createBasicInput(name: string, value: string): BasicInput {
    let isDefaultValue =
      this._defaultValues && Object.keys(this._defaultValues).length != 0
        ? this._defaultValues.includes(Object.keys(value)[0])
        : false;
    this._authInfoInput = new AuthenticationInfoElement(
      name,
      value,
      isDefaultValue,
      this._playbookHandler,
    );
    this._authInfoInput.setReloadCallback(() => {
      this._reloadCallback();
    });
    this._authInfoInput.setClearFunction(() => {
      this._clearFunction();
    });
    return this._authInfoInput;
  }

  submit(): string {
    let temp = '';
    this._elements.forEach(element => {
      let selectedElement = element.submit();
      if (selectedElement != undefined) {
        temp = selectedElement;
        return;
      }
    });
    return temp;
  }
}
