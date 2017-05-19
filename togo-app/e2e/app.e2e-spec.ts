import { TogoAppPage } from './app.po';

describe('togo-app App', function() {
  let page: TogoAppPage;

  beforeEach(() => {
    page = new TogoAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
