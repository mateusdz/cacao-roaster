import { BasicInput } from '../BasicInput';
import { RadioBoxInput } from './RadioBoxInput';
import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { schemaDictWithoutCommands } from '../../../model/SchemaTypes';
import PropertyPanel from '../PropertyPanel';
import { v4 as uuidv4 } from 'uuid';
import { PanelButton } from '../PanelButton';

/**
 * AuthenticationInfoElement display inside a table all elements from one definition property.
 * RadioBoxInput or CheckboxInput are used to select the value(s).
 */
export class AuthenticationInfoElement extends BasicInput {
  _box!: BasicInput;
  _boxConstructor: typeof RadioBoxInput;
  _authInfo: any;
  _key: string;
  _val: any;
  _playbookHandler: PlaybookHandler;
  //Function to reload the panel after the submit.
  _reloadCallback: () => void = () => {};
  _clearFunction: () => void = () => {};

  constructor(
    inputName: string,
    authInfo: any,
    initialValue: any,
    playbookHandler: PlaybookHandler,
  ) {
    super(inputName, initialValue);
    this._authInfo = authInfo;
    this._playbookHandler = playbookHandler;
    [[this._key, this._val]] = Object.entries(this._authInfo) as [[string, any]];
    this._boxConstructor = RadioBoxInput;
  }

  addToContainer(): void {
    let boxContainer = document.createElement('td');
    this._box = new this._boxConstructor(this._inputName, this._initialValue);
    this._box.setContainer(boxContainer);

    let typeContainer = document.createElement('td');
    let type = this._val.type ? this._val.type : '';
    typeContainer.textContent = type;

    let nameContainer = document.createElement('td');
    let name = this._val.name ? this._val.name : '';
    nameContainer.textContent = name;

    let descContainer = document.createElement('td');
    let desc = this._val.description ? this._val.description : '';
    descContainer.textContent = desc;
    descContainer.setAttribute('title', desc);

    this._box.addToContainer();

    let editButtonContainer = document.createElement('td');
    let authInfo = this._val.type;
    if (!(this._val.type in schemaDictWithoutCommands)) {
      authInfo = 'authentication-info';
    }

    let authInfoDialog = document.createElement('dialog');
    authInfoDialog.classList.add('list-dialog');
    editButtonContainer.appendChild(authInfoDialog);
    let authInfoPanel: PropertyPanel;
    authInfoPanel = new PropertyPanel(
      this._playbookHandler,
      authInfo,
      this._playbookHandler.getAuthInfo(this._key),
      authInfoDialog,
    );
    authInfoPanel.setIsAgentTarget(false);
    authInfoPanel.setIsSubPanel(true);
    authInfoPanel.addButton('Cancel', () => {
      authInfoDialog.close();
      this._reloadCallback();
    });
    authInfoPanel.addButton('Confirm', () => {
      let authInfoValue = authInfoPanel.confirm();
      let typeValue = authInfoValue.type;
      let oldKey = this._key;
      if (typeValue && typeValue != authInfoPanel._propertyType) {
        this._key = typeValue + '--' + uuidv4();
      }
      this._playbookHandler.setAuthInfo(oldKey, [this._key, authInfoValue]);
      this._reloadCallback();
    });

    authInfoPanel.addAllProperties();

    this._container.addEventListener('click', () => {
      authInfoDialog.showModal();
    });

    let removeButton = new PanelButton('x', editButtonContainer, () => {
      this._container?.remove();
      this._playbookHandler.removeAgent(this._key);
    });
    removeButton.addClass('remove-item');
    removeButton.addToContainer();

    this._container.appendChild(boxContainer);
    this._container.appendChild(typeContainer);
    this._container.appendChild(nameContainer);
    this._container.appendChild(descContainer);
    this._container.appendChild(editButtonContainer);
  }

  setReloadCallback(callback: () => void) {
    this._reloadCallback = callback;
  }

  setClearFunction(callback: () => void) {
    this._clearFunction = callback;
  }

  submit(): any {
    if (this._box.submit()) {
      return this._key;
    }
  }
}
