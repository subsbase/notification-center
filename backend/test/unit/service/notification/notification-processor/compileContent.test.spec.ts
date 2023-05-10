import { Payload } from 'src/types/global-types';
import { NotificationProcessor } from '../../../../../src/services/notification/notification.processor';

describe('notification processor compileContent', () => {
  let notificationProcessor: NotificationProcessor;

  beforeEach(() => {
    notificationProcessor = new NotificationProcessor();
  });

  it('should compile a template with valid payload', () => {
    const template = 'Hello {{name}}!';
    const payload: Payload = {
      name: 'Moe',
    };
    const compiledContent = 'Hello Moe!';
    const content = notificationProcessor.compileContent(template, payload);

    expect(content).toEqual(compiledContent);
  });

  it('should not compile if payload was a string', () => {
    const template = 'Hello {{name}}!';
    const payload: Payload = 'Not Hello';
    const compileContent = 'Not Hello';
    const content = notificationProcessor.compileContent(template, payload);

    expect(content).toEqual(compileContent);
  });

  it('should return the original template string without placeholder when undefined payload', () => {
    const template = 'Hello {{name}}!';
    const payload: Payload = undefined as unknown as Payload;
    const content = notificationProcessor.compileContent(template, payload);

    expect(content).toEqual('Hello !');
  });

  it('should return the original template string without placeholder when null payload', () => {
    const template = 'Hello {{name}}!';
    const payload: Payload = null as unknown as Payload;

    const content = notificationProcessor.compileContent(template, payload);

    expect(content).toEqual('Hello !');
  });
});
