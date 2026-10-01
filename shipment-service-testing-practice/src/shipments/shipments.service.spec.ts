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
  
  it('returns a shipment when the id exists', async () => {
    // Arrange
    const shipment: ShipmentEntity = {
      id: 7,
      trackingCode: 'SHIP-7',
      destination: 'Medellín',
      status: ShipmentStatus.CREATED,
    };
    repositoryMock.findOneBy.mockResolvedValue(shipment);

    // Act
    const result = await service.findOne(7);

    // Assert
    expect(result).toEqual(shipment);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 7 });
  });

  it('throws NotFoundException when the id does not exist', async () => {
    // Arrange
    repositoryMock.findOneBy.mockResolvedValue(null);

    // Act & Assert
    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

    it('returns a shipment when the id exists', async () => {
    // Arrange
    const shipment: ShipmentEntity = {
      id: 7,
      trackingCode: 'SHIP-7',
      destination: 'Medellín',
      status: ShipmentStatus.CREATED,
    };
    repositoryMock.findOneBy.mockResolvedValue(shipment);

    // Act
    const result = await service.findOne(7);

    // Assert
    expect(result).toEqual(shipment);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 7 });
  });

  it('throws NotFoundException when the id does not exist', async () => {
    // Arrange
    repositoryMock.findOneBy.mockResolvedValue(null);

    // Act & Assert
    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

    it('creates and saves a shipment', async () => {
    // Arrange
    const data = {
      trackingCode: 'SHIP-100',
      destination: 'Cali',
    };
    const builtShipment = {
      ...data,
      status: ShipmentStatus.CREATED,
    } as ShipmentEntity;
    const savedShipment: ShipmentEntity = {
      id: 1,
      ...data,
      status: ShipmentStatus.CREATED,
    };
    repositoryMock.create.mockReturnValue(builtShipment);
    repositoryMock.save.mockResolvedValue(savedShipment);

    // Act
    const result = await service.create(data);

    // Assert
    expect(repositoryMock.create).toHaveBeenCalledWith({
      ...data,
      status: ShipmentStatus.CREATED,
    });
    expect(repositoryMock.save).toHaveBeenCalledWith(builtShipment);
    expect(result).toEqual(savedShipment);
  });
});