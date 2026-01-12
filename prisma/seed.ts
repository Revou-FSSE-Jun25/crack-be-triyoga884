import { UserRole, RoomType } from '../src/generated/prisma/enums.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaService();

async function main() {
  console.log('🌱 Start seeding...');

  /**
   * CLEAN DATABASE (ORDER MATTERS)
   */
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.blockedTime.deleteMany();
  await prisma.coworkingSpace.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  /**
   * USERS
   */
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      phone: '0800000001',
      role: UserRole.ADMIN,
    },
  });

  const provider1 = await prisma.user.create({
    data: {
      name: 'Provider One',
      email: 'provider1@example.com',
      password: passwordHash,
      phone: '0800000002',
      role: UserRole.PROVIDER,
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      name: 'Provider Two',
      email: 'provider2@example.com',
      password: passwordHash,
      phone: '0800000003',
      role: UserRole.PROVIDER,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'User One',
      email: 'user1@example.com',
      password: passwordHash,
      phone: '0800000004',
      role: UserRole.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'User Two',
      email: 'user2@example.com',
      password: passwordHash,
      phone: '0800000005',
      role: UserRole.USER,
    },
  });

  /**
   * COWORKING SPACES (ONLY PROVIDERS)
   */
  /**
   * COWORKING SPACES (15 TOTAL)
   * 12 VERIFIED
   * 3 NOT VERIFIED
   */
  await prisma.coworkingSpace.createMany({
    data: [
      // ===== PROVIDER 1 =====
      {
        ownerId: provider1.id,
        name: 'Downtown Meeting Room',
        address: 'Jl. Sudirman No. 1',
        description: 'Perfect for business meetings',
        amenities: ['WiFi', 'Projector', 'Whiteboard'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 50,
        capacity: 10,
        type: RoomType.MEETING_ROOM,
        isVerified: true,
      },
      {
        ownerId: provider1.id,
        name: 'Private Office Elite',
        address: 'Jl. Thamrin No. 10',
        description: 'Private office for professionals',
        amenities: ['WiFi', 'AC', 'Printer'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 80,
        capacity: 2,
        type: RoomType.PRIVATE_OFFICE,
        isVerified: true,
      },
      {
        ownerId: provider1.id,
        name: 'Startup Hub Room',
        address: 'Jl. HR Rasuna Said',
        description: 'Affordable meeting room for startups',
        amenities: ['WiFi', 'TV'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 40,
        capacity: 6,
        type: RoomType.MEETING_ROOM,
        isVerified: true,
      },
      {
        ownerId: provider1.id,
        name: 'Creative Office Space',
        address: 'Jl. Kemang Raya',
        description: 'Creative private office',
        amenities: ['WiFi', 'AC', 'Coffee'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 70,
        capacity: 3,
        type: RoomType.PRIVATE_OFFICE,
        isVerified: true,
      },
      {
        ownerId: provider1.id,
        name: 'Podcast Studio Mini',
        address: 'Jl. Tebet',
        description: 'Compact podcast studio',
        amenities: ['Mic', 'Soundproof'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 90,
        capacity: 3,
        type: RoomType.PODCAST_STUDIO,
        isVerified: true,
      },
      {
        ownerId: provider1.id,
        name: 'Boardroom Premium',
        address: 'Jl. Mega Kuningan',
        description: 'Executive boardroom',
        amenities: ['WiFi', 'Projector', 'Conference Phone'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 110,
        capacity: 16,
        type: RoomType.MEETING_ROOM,
        isVerified: true,
      },
      {
        ownerId: provider1.id,
        name: 'Office Alpha',
        address: 'Jl. BSD Green Office',
        description: 'Quiet private office',
        amenities: ['WiFi', 'AC'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 65,
        capacity: 2,
        type: RoomType.PRIVATE_OFFICE,
        isVerified: false,
      },
      {
        ownerId: provider1.id,
        name: 'Meeting Room Beta',
        address: 'Jl. Gading Serpong',
        description: 'Simple meeting room',
        amenities: ['WiFi'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 45,
        capacity: 8,
        type: RoomType.MEETING_ROOM,
        isVerified: false,
      },

      // ===== PROVIDER 2 =====
      {
        ownerId: provider2.id,
        name: 'Podcast Studio Pro',
        address: 'Jl. Gatot Subroto No. 5',
        description: 'Professional podcast studio',
        amenities: ['Microphone', 'Soundproof', 'Mixer'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 120,
        capacity: 5,
        type: RoomType.PODCAST_STUDIO,
        isVerified: true,
      },
      {
        ownerId: provider2.id,
        name: 'Startup Meeting Space',
        address: 'Jl. Kuningan No. 20',
        description: 'Ideal for startups',
        amenities: ['WiFi', 'TV', 'Coffee'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 60,
        capacity: 10,
        type: RoomType.MEETING_ROOM,
        isVerified: true,
      },
      {
        ownerId: provider2.id,
        name: 'Executive Private Office',
        address: 'Jl. SCBD No. 8',
        description: 'Premium private office',
        amenities: ['WiFi', 'AC', 'Parking'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 100,
        capacity: 2,
        type: RoomType.PRIVATE_OFFICE,
        isVerified: true,
      },
      {
        ownerId: provider2.id,
        name: 'Creative Podcast Room',
        address: 'Jl. Senopati',
        description: 'For content creators',
        amenities: ['Mic', 'Camera', 'Lighting'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 95,
        capacity: 4,
        type: RoomType.PODCAST_STUDIO,
        isVerified: true,
      },
      {
        ownerId: provider2.id,
        name: 'Office Gamma',
        address: 'Jl. Cipete',
        description: 'Daily rental office',
        amenities: ['WiFi', 'AC'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 55,
        capacity: 3,
        type: RoomType.PRIVATE_OFFICE,
        isVerified: true,
      },
      {
        ownerId: provider2.id,
        name: 'Meeting Room Delta',
        address: 'Jl. Pondok Indah',
        description: 'Comfortable meeting space',
        amenities: ['WiFi', 'TV'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 70,
        capacity: 12,
        type: RoomType.MEETING_ROOM,
        isVerified: true,
      },
      {
        ownerId: provider2.id,
        name: 'Unverified Office Zeta',
        address: 'Jl. Depok',
        description: 'Pending verification',
        amenities: ['WiFi'],
        images: ['https://placehold.co/600x400'],
        pricePerDay: 50,
        capacity: 2,
        type: RoomType.PRIVATE_OFFICE,
        isVerified: false,
      },
    ],
  });

  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
