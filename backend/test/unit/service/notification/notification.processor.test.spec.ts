import { NotificationProcessor } from "../../../../src/services/notification/notification.processor"

describe('notification processor', () => {

    test.each([
        { template: 'this is my template name: {{templateName}}', payload: { templateName:'Notification Center Template' } , expectedResult: 'this is my template name: Notification Center Template'},
        { template: 'this is my template Id: {{templateId}}', payload: { templateName:'Notification Center Template' } , expectedResult: 'this is my template Id: '},
        { template: 'This is Template Without placeholders', payload: { templateName: 'Dummy Name' }, expectedResult: 'This is Template Without placeholders' }
    ])
    ('test notification templaye \'$template\' compilation with payload $payload', async ({ template, payload, expectedResult }) => {

        //Arrange
        let notificationProcessor = new NotificationProcessor()

        //Act
        const result = notificationProcessor.compileContent(template, payload)

        //Assert
        expect(result).toBe(expectedResult)
    })
})