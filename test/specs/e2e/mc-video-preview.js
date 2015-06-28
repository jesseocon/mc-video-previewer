describe('mc-video-preview', function() {

  beforeEach(function() {
    browser.get('http://127.0.0.1:8080/demo/index.html');
  });

  it('should initialize properly', function() {
    var moduleElement = element.all(by.className('mc-video-preview'));
    expect(moduleElement.count()).toEqual(1);
  });
});
