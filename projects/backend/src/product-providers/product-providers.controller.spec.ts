import { Test, TestingModule } from '@nestjs/testing';
import { ProductProvidersController } from './product-providers.controller';

describe('ProductProvidersController', () => {
  let controller: ProductProvidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductProvidersController],
    }).compile();

    controller = module.get<ProductProvidersController>(ProductProvidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
