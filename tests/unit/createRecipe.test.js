// tests/unit/createRecipe.test.js

import { createIngredients, createInstructions, createRecipe } from '../../pages/api/createRecipe';

jest.mock('@datocms/cma-client-node', () => ({
  buildClient: jest.fn(() => ({
    items: {
      create: jest.fn(),
    },
  })),
}));

describe('createIngredients', () => {
  it('should create ingredients with valid input', async () => {
    // Arrange
    const ingredients = [
      { name: 'Ingredient 1', amount: 1, unit: 'unit' },
      { name: 'Ingredient 2', amount: 2, unit: 'unit' },
      { name: 'Ingredient 3', amount: 3, unit: 'unit' },
    ];

    const createdIngredients = [
      { id: '1', name: 'Ingredient 1', amount: 1, unit: 'unit' },
      { id: '2', name: 'Ingredient 2', amount: 2, unit: 'unit' },
      { id: '3', name: 'Ingredient 3', amount: 3, unit: 'unit' },
    ];

    const client = {
      items: {
        create: jest.fn().mockImplementation((data) => {
          return Promise.resolve({
            id: data.name === 'Ingredient 1' ? '1' : data.name === 'Ingredient 2' ? '2' : '3',
            ...data,
          });
        }),
      },
    };

    jest.mock('@datocms/cma-client-node', () => ({
      buildClient: jest.fn().mockReturnValue(client),
    }));

    // Act
    const result = await createIngredients(ingredients);

    // Assert
    expect(result).toEqual(createdIngredients);
    expect(client.items.create).toHaveBeenCalledTimes(3);
    expect(client.items.create).toHaveBeenCalledWith({
      item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
      name: 'Ingredient 1',
      amount: 1,
      unit: 'unit',
    });
    expect(client.items.create).toHaveBeenCalledWith({
      item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
      name: 'Ingredient 2',
      amount: 2,
      unit: 'unit',
    });
    expect(client.items.create).toHaveBeenCalledWith({
      item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
      name: 'Ingredient 3',
      amount: 3,
      unit: 'unit',
    });
  });

  it('should throw error with missing name property', async () => {
    // Arrange
    const ingredients = [
      { amount: 1, unit: 'unit' },
      { name: 'Ingredient 2', amount: 2, unit: 'unit' },
      { name: 'Ingredient 3', amount: 3, unit: 'unit' },
    ];

    const client = {
      items: {
        create: jest.fn().mockImplementation((data) => {
          return Promise.resolve({
            id: data.name === 'Ingredient 2' ? '2' : '3',
            ...data,
          });
        }),
      },
    };

    jest.mock('@datocms/cma-client-node', () => ({
      buildClient: jest.fn().mockReturnValue(client),
    }));

    // Act and Assert
    await expect(createIngredients(ingredients)).rejects.toThrow('Error creating ingredients');
    expect(client.items.create).toHaveBeenCalledTimes(2);
    expect(client.items.create).toHaveBeenCalledWith({
      item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
      name: 'Ingredient 2',
      amount: 2,
      unit: 'unit',
    });
    expect(client.items.create).toHaveBeenCalledWith({
      item_type: { type: 'item_type', id: 'KzctSfFlRaqAAJRJYezRzA' },
      name: 'Ingredient 3',
      amount: 3,
      unit: 'unit',
    });
  });
});

describe('createInstructions', () => {
  it('should create a new instruction when given a single instruction', async () => {
    const instructions = ['Mix the ingredients'];
    const createdInstruction = { id: '1', instruction: 'Mix the ingredients' };
    const createItemsMock = jest.fn().mockResolvedValue(createdInstruction);
    const client = { items: { create: createItemsMock } };
    buildClient.mockReturnValue(client);

    const result = await createInstructions(instructions);

    expect(buildClient).toHaveBeenCalledWith({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
    expect(createItemsMock).toHaveBeenCalledWith({
      item_type: { type: 'item_type', id: 'cYA4fVw2QOq8FY766ObmqA' },
      instruction: 'Mix the ingredients',
    });
    expect(result).toEqual([createdInstruction]);
  });

  t('should throw an error when instructions is null', async () => {
    const instructions = null;
    const errorMessage = 'Error creating instructions';
    const createItemsMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    const client = { items: { create: createItemsMock } };
    buildClient.mockReturnValue(client);

    await expect(createInstructions(instructions)).rejects.toThrow(errorMessage);
    expect(buildClient).toHaveBeenCalledWith({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
    expect(createItemsMock).not.toHaveBeenCalled();
  });

  it('should create new instructions when given multiple instructions', async () => {
    const instructions = ['Mix the ingredients', 'Bake in the oven'];
    const createdInstructions = [
      { id: '1', instruction: 'Mix the ingredients' },
      { id: '2', instruction: 'Bake in the oven' },
    ];
    const createItemsMock = jest.fn().mockResolvedValue(createdInstructions);
    const client = { items: { create: createItemsMock } };
    buildClient.mockReturnValue(client);

    const result = await createInstructions(instructions);

    expect(buildClient).toHaveBeenCalledWith({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
    expect(createItemsMock).toHaveBeenCalledTimes(2);
    expect(createItemsMock).toHaveBeenNthCalledWith(1, {
      item_type: { type: 'item_type', id: 'cYA4fVw2QOq8FY766ObmqA' },
      instruction: 'Mix the ingredients',
    });
    expect(createItemsMock).toHaveBeenNthCalledWith(2, {
      item_type: { type: 'item_type', id: 'cYA4fVw2QOq8FY766ObmqA' },
      instruction: 'Bake in the oven',
    });
    expect(result).toEqual(createdInstructions);
  });
});

describe('createRecipe', () => {
  it('should create a new recipe when all input parameters are valid', async () => {
    // Mock the necessary dependencies
    const buildClientMock = jest.fn().mockReturnValue({
      items: {
        create: jest.fn().mockResolvedValue({ id: '123', title: 'Test Recipe' }),
      },
    });
    jest.mock('@datocms/cma-client-node', () => ({
      buildClient: buildClientMock,
    }));

    // Import the function under test
    const { default: createRecipe } = require('../pages/api/createRecipe');

    // Set up the test data
    const title = 'Test Recipe';
    const description = 'This is a test recipe';
    const ingredients = [{ id: '1', name: 'Ingredient 1' }];
    const instructions = [{ id: '1', step: 'Step 1' }];
    const author = 'John Doe';
    const regonly = false;
    const images = [{ upload: { id: '123' } }];

    // Invoke the function under test
    const result = await createRecipe(title, description, ingredients, instructions, author, regonly, images);

    // Assert the result
    expect(result).toEqual({ id: '123', title: 'Test Recipe' });
    expect(buildClientMock).toHaveBeenCalledTimes(1);
    expect(buildClientMock).toHaveBeenCalledWith({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  });

  t('should throw an error if title is missing', async () => {
    // Import the function under test
    const { default: createRecipe } = require('../pages/api/createRecipe');

    // Set up the test data
    const title = '';
    const description = 'This is a test recipe';
    const ingredients = [{ id: '1', name: 'Ingredient 1' }];
    const instructions = [{ id: '1', step: 'Step 1' }];
    const author = 'John Doe';
    const regonly = false;
    const images = [{ upload: { id: '123' } }];

    // Invoke the function under test and expect it to throw an error
    await expect(createRecipe(title, description, ingredients, instructions, author, regonly, images)).rejects.toThrow(
      'Missing key fields',
    );
  });

  it('should create a new recipe with multiple ingredients and instructions', async () => {
    // Mock the necessary dependencies
    const buildClientMock = jest.fn().mockReturnValue({
      items: {
        create: jest.fn().mockResolvedValue({ id: '123', title: 'Test Recipe' }),
      },
    });
    jest.mock('@datocms/cma-client-node', () => ({
      buildClient: buildClientMock,
    }));

    // Import the function under test
    const { default: createRecipe } = require('../pages/api/createRecipe');

    // Set up the test data
    const title = 'Test Recipe';
    const description = 'This is a test recipe';
    const ingredients = [{ id: '1', name: 'Ingredient 1' }];
    const instructions = [{ id: '1', step: 'Step 1' }];
    const author = 'John Doe';
    const regonly = false;
    const images = [{ upload: { id: '123' } }];

    // Invoke the function under test
    const result = await createRecipe(title, description, ingredients, instructions, author, regonly, images);

    // Assert the result
    expect(result).toEqual({ id: '123', title: 'Test Recipe' });
    expect(buildClientMock).toHaveBeenCalledTimes(1);
    expect(buildClientMock).toHaveBeenCalledWith({ apiToken: process.env.DATOCMS_REST_API_TOKEN });
  });
});
