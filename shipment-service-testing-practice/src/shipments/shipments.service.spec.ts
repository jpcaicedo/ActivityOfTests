import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShipmentEntity } from './entities/shipment.entity';
import { ShipmentRulesService } from './shipment-rules.service';
import { ShipmentStatus } from './shipment-status.enum';
import { ShipmentsService } from './shipments.service';

describe('ShipmentsService', () => {
  let service: ShipmentsService;

  const repositoryMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const rulesMock = {
    ensureCanBeDispatched: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipmentsService,
        {
          provide: getRepositoryToken(ShipmentEntity),
          useValue: repositoryMock,
        },
        {
          provide: ShipmentRulesService,
          useValue: rulesMock,
        },
      ],
    }).compile();

    service = module.get<ShipmentsService>(ShipmentsService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });
   it('returns all shipments', async () => {
    // Arrange
    const shipments: ShipmentEntity[] = [
      {
        id: 1,
        trackingCode: 'SHIP-1',
        destination: 'Cali',
        status: ShipmentStatus.CREATED,
      },
      {
        id: 2,
        trackingCode: 'SHIP-2',
        destination: 'Bogotá',
        status: ShipmentStatus.CREATED,
      },
    ];
    repositoryMock.find.mockResolvedValue(shipments);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual(shipments);
    expect(repositoryMock.find).toHaveBeenCalledTimes(1);
  });
});