import { newE2EPage } from '@stencil/core/testing';

describe('msc-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-menu></msc-menu>');
    const element = await page.find('msc-menu');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
