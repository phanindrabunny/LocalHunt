import { connectToDatabase } from './mongodb';
import { MongoClient } from 'mongodb';

jest.mock('mongodb');

describe('MongoDB Connection', () => {
  let mockConnect: jest.SpyInstance;
  let mockClient: jest.Mocked<MongoClient>;

  beforeAll(() => {
    mockClient = {
      db: jest.fn(),
      connect: jest.fn(),
    } as unknown as jest.Mocked<MongoClient>;
    mockConnect = jest.spyOn(MongoClient, 'connect');
    mockConnect.mockResolvedValue(mockClient);
  });

  afterAll(() => {
    mockConnect.mockRestore();
  });

  it('should connect to MongoDB', async () => {
    const { client, db } = await connectToDatabase();
    
    expect(mockConnect).toHaveBeenCalledWith(expect.stringContaining('mongodb://'));
    expect(client).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should reuse existing connection', async () => {
    const result1 = await connectToDatabase();
    const result2 = await connectToDatabase();

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
  });
});