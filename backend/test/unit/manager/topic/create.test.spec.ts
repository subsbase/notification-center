import { SubscriberManager } from '../../../../src/managers/subscriber/subscriber.manager';
import { SubscriberService } from '../../../../src/services/subscriber/subscriber.service';
import { Subscriber } from '../../../../src/repositories/subscriber/schema';
import { createMock } from '@golevelup/ts-jest';
import { MongooseError } from 'mongoose';
import { CreatedModel } from '../../../../src/repositories/helper-types';

describe('SubscriberManager', () => {
  describe('create', () => {
    it('should return the created subscriber model when subscriberService.create is successful', async () => {
      // Arrange
      const subscriberService = createMock<SubscriberService>({ create: jest.fn() });
      const subscriberManager = new SubscriberManager(subscriberService);

      const realm = 'test-realm';
      const subscriber: Subscriber = new Subscriber();
      subscriber.id = '60b26d50abbc6a3b3e00c6f7';

      const createdSubscriber: CreatedModel = {
        id: '60b26d50abbc6a3b3e00c6f7',
        created: true,
      };
      jest.spyOn(subscriberService, 'create').mockResolvedValue(createdSubscriber);

      // Act
      const result = await subscriberManager.create(realm, subscriber);

      // Assert
      expect(result).toEqual(createdSubscriber);
    });

    it('should throw an error if subscriberService.create throws an error', async () => {
      // Arrange
      const realm = 'test-realm';
      const subscriberService = createMock<SubscriberService>({ create: jest.fn() });
      const subscriberManager = new SubscriberManager(subscriberService);

      const subscriber: Subscriber = new Subscriber();

      jest.spyOn(subscriberService, 'create').mockImplementation((realm, subscriber) => {
        throw new MongooseError('Error');
      });

      // Act //Assert
      expect(subscriberManager.create(realm, subscriber)).rejects.toThrowError(MongooseError);
      expect(subscriberService.create).toHaveBeenCalledWith(realm, subscriber);
    });
  });
});
