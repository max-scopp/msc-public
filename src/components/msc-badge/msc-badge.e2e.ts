import { newE2EPage } from '@stencil/core/testing';

describe('msc-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-badge></msc-badge>');
    const element = await page.find('msc-badge');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
