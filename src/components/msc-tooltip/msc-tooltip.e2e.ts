import { newE2EPage } from '@stencil/core/testing';

describe('msc-tooltip', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-tooltip></msc-tooltip>');
    const element = await page.find('msc-tooltip');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
