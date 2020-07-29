import { newE2EPage } from '@stencil/core/testing';

describe('msc-sidebar', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-sidebar></msc-sidebar>');
    const element = await page.find('msc-sidebar');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
