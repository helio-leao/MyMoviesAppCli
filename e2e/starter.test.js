import {device, element, by} from 'detox';


describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // it('should have welcome screen', async () => {
  //   await expect(element(by.id('welcome'))).toBeVisible();
  // });

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });

  it('should tap besouro azul', async () => {
    await element(by.text('Besouro Azul')).tap();
    await expect(element(by.text('Aventura'))).toBeVisible();
  });
});
