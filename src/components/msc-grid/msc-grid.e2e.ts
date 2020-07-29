import { newE2EPage } from '@stencil/core/testing';

describe('msc-grid', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-grid></msc-grid>');
    const element = await page.find('msc-grid');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
