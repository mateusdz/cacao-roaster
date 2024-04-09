import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { BasicInput } from '../BasicInput';
import { PanelButton } from '../PanelButton';
import PropertyPanel from '../PropertyPanel';
import { UneditableInput } from './UneditableInput';
import { valueToDisplay } from '../../../model/SchemaTypes';

/**
 * The input to display and edit authInfo.
 */
export class AuthInfoInput extends BasicInput {
  _variableUneditableField!: UneditableInput;
  _propertyPanel!: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _displayDefDialog!: HTMLDialogElement;
  _refreshFunction: any;
  _listType: string;
  _authInfoPanel!: PropertyPanel;
  _propertyType: string;
  _tempValue!: any;
  _displayedValue: string = '';
  _authInfoButton?: PanelButton;

  constructor(
    inputName: string,
    initialValue: any,
    playbookHandler: PlaybookHandler,
    propertyType: string,
    refreshFunction: any,
  ) {
    super(inputName, initialValue);
    this._propertyType = propertyType;
    this._playbookHandler = playbookHandler;
    this._refreshFunction = refreshFunction;
    this._listType = 'authentication-info-display';
  }

  addToContainer(): void {
    this.changeDisplayedValue(this._initialValue);
    this._authInfoButton = new PanelButton(this._displayedValue, this._container, () => {
      this.showPanel();
    });
    this._authInfoButton.addClass('property__container');
    this._authInfoButton.addClass('container--simple');
    this._authInfoButton.addClass('container--disabled');
    this._authInfoButton.addToContainer();

    this._displayDefDialog = document.createElement('dialog');
    this._displayDefDialog.classList.add('authentication-info-display');

    this._container.appendChild(this._displayDefDialog);
    this._authInfoPanel = new PropertyPanel(
      this._playbookHandler,
      this._listType,
      this._initialValue,
      this._displayDefDialog,
    );
    this._authInfoPanel.setIsAgentTarget(false);
    this._authInfoPanel.setIsSubPanel(true);

    //Creates the "cancel" button to go back
    this._authInfoPanel.addButton('Cancel', () => {
      this._authInfoPanel.reloadClearedDifferentProperties(this._listType, this._tempValue);
      this.changeDisplayedValue(this._tempValue);
      this._authInfoButton?.updateText(this._displayedValue);
      this._displayDefDialog.close();
      this._refreshFunction();
    });

    //Creates the "ok" button to submit selected values
    this._authInfoPanel.addButton('Confirm', () => {
      let submitedValue = this._authInfoPanel.submit();
      this._tempValue =
        Object.keys(submitedValue).length != 0 ? Object.values(submitedValue)[0] : undefined;
      this.changeDisplayedValue(this._tempValue);
      this._displayDefDialog.close();
      this._authInfoButton?.updateText(this._displayedValue);
      this._refreshFunction();
    });

    this._authInfoPanel.addDifferentProperties();
  }

  /**
   * update the value to display after modifications
   * @param submitedValue
   */
  private changeDisplayedValue(submitedValue: string) {
    if (Object.keys(valueToDisplay).includes(this._propertyType)) {
      let authInfo = this._playbookHandler.getAuthInfo(submitedValue)
        ? this._playbookHandler.getAuthInfo(submitedValue)
        : {};
      valueToDisplay[this._propertyType].some(field => {
        this._displayedValue = '';
        if ((authInfo as any)[field] != undefined && (authInfo as any)[field] != '') {
          this._displayedValue = (authInfo as any)[field];
          return true;
        }
      });
      if (this._displayedValue == '') {
        this._displayedValue = 'Add Authentication Info';
      }
    }
    this._authInfoButton?.updateText(this._displayedValue);
  }

  //show the definition object panel.
  showPanel() {
    this._displayDefDialog.showModal();
  }

  submit(): any {
    return Object.values(this._authInfoPanel.submit())[0];
  }
}
