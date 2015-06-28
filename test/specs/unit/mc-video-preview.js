'use strict';

describe('mcVideoPreview', function() {
  beforeEach(module('mcVideoPreview'));
  var VideoPreviewer, vmc, detections;

  describe('mcVideoPreview.VideoPreviewer', function() {
    beforeEach(function(){
      inject(function(_VideoPreviewer_) {
        VideoPreviewer = _VideoPreviewer_;
        detections = { h264: 'probably', ogg: 'probably', webm: 'probably' };
        vmc = new VideoPreviewer({
          path: '/assets/newfile.ogv'
        }, detections);
      });
    });

    describe('#extension', function() {

      describe('with ogv', function() {
        it('should return the correct file extension', function() {
          expect(vmc.extension()).toEqual('ogv');
        });
      });

      describe('with multiple dots', function() {
        it('should return the correct file extension', function() {
          vmc.path = '/assets/newfile.awesome.ogv'
          expect(vmc.extension()).toEqual('ogv')
        });
      });


      describe('when starting with a dot', function() {
        it('should return the correct file extension after the last dot', function() {
          vmc.path = '/assets/.newfile.awesome.ogv';
          expect(vmc.extension()).toEqual('ogv');
        });
      });

      describe('when there are no dots', function() {
        it('should return the path', function() {
          vmc.path = '/assets/newfile';
          expect(vmc.extension()).toEqual(vmc.path)
        });
      });

      describe('when it is an empty string', function() {
        it('should return the empty string', function() {
          vmc.path = '';
          expect(vmc.extension()).toEqual(vmc.path)
        });
      });

    }); // End #extension

    describe('#mimeType', function() {
      describe('when ogv', function() {
        it('should return the correct mimetype', function() {
          vmc.path = '/assets/video.ogv';
          expect(vmc.mimeType()).toEqual('video/ogg');
        });
      });

      describe('when webm', function() {
        it('should return the correct mimetype', function() {
          vmc.path = '/assets/video.webm';
          expect(vmc.mimeType()).toEqual('video/webm');
        });
      });

      describe('when mp4', function() {
        it('should return the correct mimetype', function() {
          vmc.path = '/assets/video.mp4';
          expect(vmc.mimeType()).toEqual('video/mp4');
        });
      });

      describe('when m4v', function() {
        it('should return the correct mimetype', function() {
          vmc.path = '/assets/video.m4v';
          expect(vmc.mimeType()).toEqual('video/mp4');
        });
      });

      describe('when 3gp', function() {
        it('should return the correct mimetype', function() {
          vmc.path = '/assets/video.3gp';
          expect(vmc.mimeType()).toEqual('video/3gpp');
        });
      });

      describe('when the filename has no extension', function() {
        it('should return NaV', function() {
          vmc.path = '/assets/videovideo';
          expect(vmc.mimeType()).toEqual('NaV');
        });
      });

      describe('when the filename is an empty string', function() {
        it('should return NaV', function() {
          vmc.path = '';
          expect(vmc.mimeType()).toEqual('NaV');
        });
      });
    }); // End #mimeType

    describe('#isSupportedVideoType', function() {
      describe('with supported type', function() {

        describe('m4v', function() {
          it('should return true', function() {
            vmc.path = '/assets/video.m4v';
            expect(vmc.isSupportedVideoType()).toEqual(true)
          });
        });

        describe('mp4', function() {
          it('should return true', function() {
            vmc.path = '/assets/video.mp4';
            expect(vmc.isSupportedVideoType()).toEqual(true)
          });
        });

        describe('ogv', function() {
          it('should return true', function() {
            vmc.path = '/assets/video.ogv';
            expect(vmc.isSupportedVideoType()).toEqual(true)
          });
        });

        describe('webm', function() {
          it('should return true', function() {
            vmc.path = '/assets/video.webm';
            expect(vmc.isSupportedVideoType()).toEqual(true)
          });
        });
      });// End with supported type

      describe('with unsupported type', function() {
        it('should  return false', function() {
          vmc.path = '/assets/video.avi';
          expect(vmc.isSupportedVideoType()).toEqual(false);
        });
      });

      describe('with a null value for path', function() {
        it('should return an error', function() {
          vmc.path = undefined;
          expect(function(){
            vmc.isSupportedVideoType();
          }).toThrow();

        });
      });

      describe('with an empty string', function() {
        it('should return NaV', function() {
          vmc.path = '';
          expect(vmc.isSupportedVideoType()).toEqual(false);
        });
      });
    }); // End #isSupportedVideoType
  });
});
