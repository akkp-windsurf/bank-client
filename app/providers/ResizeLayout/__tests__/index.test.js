import { onResize } from '../index';

describe('ResizeLayout utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.dispatchEvent = jest.fn();
    window.document.createEvent = jest.fn();
  });

  describe('onResize', () => {
    it('should dispatch resize event on modern browsers', () => {
      global.Event = jest.fn();

      onResize();

      expect(global.Event).toHaveBeenCalledWith('resize');
      expect(window.dispatchEvent).toHaveBeenCalled();
    });

    it('should dispatch resize event on old browsers', () => {
      const originalEvent = global.Event;
      global.Event = undefined;

      const mockEvent = {
        initUIEvent: jest.fn(),
      };
      window.document.createEvent = jest.fn().mockReturnValue(mockEvent);

      onResize();

      expect(window.document.createEvent).toHaveBeenCalledWith('UIEvents');
      expect(mockEvent.initUIEvent).toHaveBeenCalledWith(
        'resize',
        true,
        false,
        window,
        0,
      );
      expect(window.dispatchEvent).toHaveBeenCalledWith(mockEvent);

      global.Event = originalEvent;
    });
  });
});
