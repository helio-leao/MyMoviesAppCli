import {device, element, by} from 'detox';


describe('Verify User Data', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should verify user data', async () => {
    // go to add user screen
    await element(by.id('tab-create-user')).tap();

    // fill the fields with user data
    await element(by.id('name-input')).replaceText('John Doe');
    await element(by.id('phone-input')).replaceText('88888888888');
    await element(by.id('email-input')).replaceText('johndoe@email.com');
    await element(by.id('pass-input')).replaceText('12345678');
    await element(by.id('confirm-pass-input')).replaceText('12345678');
    await element(by.id('save-button')).tap();

    // verify if the data passes the verifications
    await expect(element(by.text('Verificado com sucesso'))).toBeVisible();
  });
});
