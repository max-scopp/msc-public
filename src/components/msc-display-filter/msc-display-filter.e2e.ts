import { newE2EPage } from '@stencil/core/testing';

describe('msc-display-filter', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-display-filter></msc-display-filter>');
    const element = await page.find('msc-display-filter');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
