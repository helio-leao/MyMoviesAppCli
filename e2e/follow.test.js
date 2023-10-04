import {device, element, by} from 'detox';


describe('Follow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should follow a person', async () => {
    // go to search screen
    await element(by.id('tab-search')).tap();

    // search for Ari Aster
    await element(by.id('search-input')).replaceText('Ari Aster');
    await element(by.id('search-input')).typeText('\n');  // submit (closes keyboard)

    // wait 5 seconds for api return
    await waitFor(element(by.id('follow-1145520'))).toBeVisible().withTimeout(5000);

    // follow Ari Aster, id 1145520
    await element(by.id('follow-1145520')).tap();

    // go to following screen
    await element(by.id('tab-following')).tap();

    // verify if Ari Aster present
    await expect(element(by.id('1145520'))).toBeVisible();
  });
});
