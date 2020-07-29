import { newE2EPage } from '@stencil/core/testing';

describe('msc-collapsible', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-collapsible></msc-collapsible>');
    const element = await page.find('msc-collapsible');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
