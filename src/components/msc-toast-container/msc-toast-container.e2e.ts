import { newE2EPage } from '@stencil/core/testing';

describe('msc-toast-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-toast-container></msc-toast-container>');
    const element = await page.find('msc-toast-container');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
