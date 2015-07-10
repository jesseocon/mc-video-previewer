var MCVideoPage = function() {
  this.get = function() {
    browser.get('http://127.0.0.1:8080/demo/index.html');
  };

};

describe('mc-video-preview', function() {

  beforeEach(function() {
    browser.get('http://127.0.0.1:8080/demo/index.html');
  });

  it('should initialize properly', function() {
    var moduleElement = element.all(by.className('mc-video-previewer'));
    expect(moduleElement.count()).toEqual(4);
  });

  describe('the mc-video for mp4', function() {
 //$('#mp4').# find the vide and make sure its visible
  });


});
