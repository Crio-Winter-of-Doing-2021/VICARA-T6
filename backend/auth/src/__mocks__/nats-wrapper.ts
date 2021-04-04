export const NatsWrapper = {
    client: () => mockClientInstance
};

const mockClientInstance = {
    publish: jest.fn().mockImplementation(
        (subject: string, data: string, callback: () => void) => {
            callback();
        })
};
