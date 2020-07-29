import { newE2EPage } from '@stencil/core/testing';

describe('msc-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-card></msc-card>');
    const element = await page.find('msc-card');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
