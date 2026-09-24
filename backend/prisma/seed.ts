import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting API Sentinel database seeding...');

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.alertConfig.deleteMany();
  await prisma.incidentEvent.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.sslCertificate.deleteMany();
  await prisma.monitoringResult.deleteMany();
  await prisma.statusPageService.deleteMany();
  await prisma.statusPage.deleteMany();
  await prisma.apiMonitor.deleteMany();
  await prisma.environmentVariable.deleteMany();
  await prisma.environment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const owner = await prisma.user.create({
    data: {
      email: 'admin@sentinel.io',
      name: 'Alex Rivera (Owner)',
      passwordHash,
      role: 'OWNER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'dev1@sentinel.io',
      name: 'Sarah Chen (Admin)',
      passwordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
  });

  const developer = await prisma.user.create({
    data: {
      email: 'dev2@sentinel.io',
      name: 'Marcus Vance (Dev)',
      passwordHash,
      role: 'DEVELOPER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  console.log('✅ Users created');

  // Create Team
  const team = await prisma.team.create({
    data: {
      name: 'Core Platform Team',
      slug: 'core-platform',
    },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: team.id, userId: owner.id, role: 'OWNER' },
      { teamId: team.id, userId: admin.id, role: 'ADMIN' },
      { teamId: team.id, userId: developer.id, role: 'DEVELOPER' },
    ],
  });

  // Create Projects
  const projectEcom = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform',
      description: 'Main customer facing store APIs',
      teamId: team.id,
    },
  });

  const projectPay = await prisma.project.create({
    data: {
      name: 'Payment Infrastructure',
      description: 'Stripe, PayPal and crypto payment gateway services',
      teamId: team.id,
    },
  });

  // Create Environments & Variables
  const envProd = await prisma.environment.create({
    data: {
      name: 'Production',
      projectId: projectEcom.id,
      variables: {
        create: [
          { key: 'BASE_URL', value: 'https://httpbin.org' },
          { key: 'API_KEY', value: 'sk_live_992183918239', isSecret: true },
        ],
      },
    },
  });

  // Create 10 APIs
  const apiData = [
    {
      name: 'Authentication API',
      description: 'Handles OAuth2 tokens and session validation',
      url: 'https://httpbin.org/get',
      method: 'GET',
      status: 'HEALTHY',
      projectId: projectEcom.id,
      intervalSeconds: 30,
      expectedStatusCode: 200,
      expectedResponseMs: 500,
      consecutiveFailures: 0,
      validationRules: JSON.stringify([{ field: 'status', operator: 'equals', value: 200 }]),
    },
    {
      name: 'User Gateway API',
      description: 'User profile queries and management',
      url: 'https://jsonplaceholder.typicode.com/users',
      method: 'GET',
      status: 'HEALTHY',
      projectId: projectEcom.id,
      intervalSeconds: 60,
      expectedStatusCode: 200,
      expectedResponseMs: 800,
      consecutiveFailures: 0,
    },
    {
      name: 'Stripe Payment Webhook',
      description: 'Processes credit card checkout notifications',
      url: 'https://httpbin.org/status/200',
      method: 'POST',
      status: 'HEALTHY',
      projectId: projectPay.id,
      intervalSeconds: 60,
      expectedStatusCode: 200,
      expectedResponseMs: 1000,
      consecutiveFailures: 0,
    },
    {
      name: 'Order Processing Engine',
      description: 'Order placement and queue dispatcher',
      url: 'https://httpbin.org/status/500', // Down simulator endpoint
      method: 'GET',
      status: 'DOWN',
      projectId: projectEcom.id,
      intervalSeconds: 30,
      expectedStatusCode: 200,
      expectedResponseMs: 500,
      consecutiveFailures: 5,
    },
    {
      name: 'Inventory Sync Service',
      description: 'Warehouse inventory updates',
      url: 'https://httpbin.org/delay/2', // Slow endpoint simulator
      method: 'GET',
      status: 'DEGRADED',
      projectId: projectEcom.id,
      intervalSeconds: 120,
      expectedStatusCode: 200,
      expectedResponseMs: 1000,
      consecutiveFailures: 1,
    },
    {
      name: 'Product Catalog Indexer',
      description: 'Elasticsearch product catalog search',
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      status: 'HEALTHY',
      projectId: projectEcom.id,
      intervalSeconds: 60,
      expectedStatusCode: 200,
      expectedResponseMs: 600,
    },
    {
      name: 'Notification Dispatcher',
      description: 'Email and SMS outbound gateway',
      url: 'https://httpbin.org/post',
      method: 'POST',
      status: 'HEALTHY',
      projectId: projectPay.id,
      intervalSeconds: 60,
      expectedStatusCode: 200,
      expectedResponseMs: 500,
    },
    {
      name: 'Analytics Event Collector',
      description: 'User activity tracking endpoint',
      url: 'https://httpbin.org/status/204',
      method: 'POST',
      status: 'HEALTHY',
      projectId: projectEcom.id,
      intervalSeconds: 300,
      expectedStatusCode: 204,
      expectedResponseMs: 400,
    },
    {
      name: 'GeoIP Resolver',
      description: 'Location and IP lookup service',
      url: 'https://httpbin.org/headers',
      method: 'GET',
      status: 'HEALTHY',
      projectId: projectEcom.id,
      intervalSeconds: 120,
      expectedStatusCode: 200,
      expectedResponseMs: 500,
    },
    {
      name: 'Weather Sync API',
      description: 'External partner weather feed',
      url: 'https://httpbin.org/uuid',
      method: 'GET',
      status: 'HEALTHY',
      projectId: projectEcom.id,
      intervalSeconds: 300,
      expectedStatusCode: 200,
      expectedResponseMs: 700,
    },
  ];

  const createdApis = [];
  for (const api of apiData) {
    const created = await prisma.apiMonitor.create({
      data: {
        ...api,
        lastCheckedAt: new Date(),
      },
    });
    createdApis.push(created);

    // Create SSL Cert info
    await prisma.sslCertificate.create({
      data: {
        apiId: created.id,
        issuer: 'Let\'s Encrypt Authority X3',
        validFrom: new Date(Date.now() - 30 * 86400000),
        validTo: new Date(Date.now() + (api.status === 'DEGRADED' ? 5 : 60) * 86400000),
        daysRemaining: api.status === 'DEGRADED' ? 5 : 60,
        status: api.status === 'DEGRADED' ? 'EXPIRING_SOON' : 'HEALTHY',
      },
    });

    // Create Alert Config
    await prisma.alertConfig.create({
      data: {
        apiId: created.id,
        type: 'API_DOWN',
        consecutiveThreshold: 3,
        cooldownMinutes: 15,
        channelType: 'EMAIL',
        destination: 'alerts@sentinel.io',
        isEnabled: true,
      },
    });
  }

  console.log('✅ 10 APIs and SSL Certs seeded');

  // Generate 200 historical MonitoringResults across last 24 hours
  const now = Date.now();
  const checksToCreate = [];

  for (const api of createdApis) {
    const isDown = api.status === 'DOWN';
    const isDegraded = api.status === 'DEGRADED';

    for (let i = 0; i < 20; i++) {
      const timeOffset = i * 60 * 60 * 1000; // 1 check per hour for 20 hours
      const timestamp = new Date(now - timeOffset);
      const isSuccess = isDown ? (i > 3 ? false : true) : true;
      const statusCode = isSuccess ? api.expectedStatusCode : 500;
      const baseResponseMs = isDegraded ? 1850 : isDown && !isSuccess ? 5000 : 90 + Math.floor(Math.random() * 80);

      checksToCreate.push({
        apiId: api.id,
        timestamp,
        isSuccess,
        statusCode,
        responseTimeMs: baseResponseMs,
        dnsLookupTimeMs: 12,
        tcpConnectTimeMs: 18,
        tlsHandshakeTimeMs: 25,
        serverProcessTimeMs: baseResponseMs - 70,
        downloadTimeMs: 15,
        responseSizeByte: 1024 + Math.floor(Math.random() * 500),
        errorMessage: isSuccess ? null : 'HTTP 500 Internal Server Error: Server Refused Connection',
      });
    }
  }

  await prisma.monitoringResult.createMany({
    data: checksToCreate,
  });

  console.log('✅ 200 Historical Monitoring Checks seeded');

  // Create Active Incident for Order Processing Engine (DOWN)
  const downApi = createdApis.find((a) => a.name.includes('Order'));
  if (downApi) {
    const incident = await prisma.incident.create({
      data: {
        apiId: downApi.id,
        title: 'Order Processing Engine HTTP 500 Internal Server Error',
        status: 'INVESTIGATING',
        startedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
        failedCheckCount: 5,
        rootCause: 'Upstream database connection pool exhausted during high load',
      },
    });

    await prisma.incidentEvent.createMany({
      data: [
        {
          incidentId: incident.id,
          status: 'INVESTIGATING',
          message: 'Monitoring engine detected 5 consecutive check failures. Incident opened.',
          createdAt: new Date(Date.now() - 45 * 60 * 1000),
        },
        {
          incidentId: incident.id,
          status: 'IDENTIFIED',
          message: 'Engineering team identified database deadlock in order dispatch queue.',
          createdAt: new Date(Date.now() - 25 * 60 * 1000),
        },
      ],
    });
  }

  // Create Resolved Incident
  const authApi = createdApis.find((a) => a.name.includes('Auth'));
  if (authApi) {
    const resolvedIncident = await prisma.incident.create({
      data: {
        apiId: authApi.id,
        title: 'High Response Time Latency Spike (>1200ms)',
        status: 'RESOLVED',
        startedAt: new Date(Date.now() - 4 * 3600 * 1000),
        resolvedAt: new Date(Date.now() - 3 * 3600 * 1000),
        durationSeconds: 3600,
        failedCheckCount: 2,
        rootCause: 'Transient DNS resolution delay on primary ISP node.',
      },
    });

    await prisma.incidentEvent.create({
      data: {
        incidentId: resolvedIncident.id,
        status: 'RESOLVED',
        message: 'Latency returned to baseline (90ms). Automated check passed.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
    });
  }

  // Create Public Status Page
  const statusPage = await prisma.statusPage.create({
    data: {
      name: 'API Sentinel Systems Status',
      slug: 'sentinel-status',
      description: 'Official real-time health & status dashboard for API Sentinel customer services.',
      isPublic: true,
    },
  });

  await prisma.statusPageService.createMany({
    data: createdApis.slice(0, 5).map((api) => ({
      statusPageId: statusPage.id,
      apiId: api.id,
      displayName: api.name,
    })),
  });

  // Create Notifications for Owner
  await prisma.notification.createMany({
    data: [
      {
        userId: owner.id,
        title: '🔴 API Failure Alert',
        message: 'Order Processing Engine has failed 5 consecutive health checks (HTTP 500).',
        type: 'INCIDENT',
        isRead: false,
      },
      {
        userId: owner.id,
        title: '⚠️ SSL Expiration Warning',
        message: 'Inventory Sync Service HTTPS certificate expires in 5 days.',
        type: 'ALERT',
        isRead: false,
      },
      {
        userId: owner.id,
        title: '🟢 Incident Resolved',
        message: 'Authentication API latency spike resolved automatically.',
        type: 'RECOVERY',
        isRead: true,
      },
    ],
  });

  // Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: owner.id,
        action: 'API_CREATED',
        resource: 'Authentication API',
        details: 'Configured 30s monitoring probe for https://httpbin.org/get',
        ipAddress: '127.0.0.1',
      },
      {
        userId: admin.id,
        action: 'ENVIRONMENT_UPDATED',
        resource: 'Production',
        details: 'Added API_KEY variable to Production environment',
        ipAddress: '127.0.0.1',
      },
    ],
  });

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
