import { newE2EPage } from '@stencil/core/testing';

describe('msc-progress-indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-progress-indicator></msc-progress-indicator>');
    const element = await page.find('msc-progress-indicator');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
