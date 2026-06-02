import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log("📊 Database Status Check\n");

  const [incidents, resources, provinces, incidentCount, resourceCount] = await Promise.all([
    prisma.incident.findMany({
      include: {
        updates: true,
        resources: true,
      },
      take: 3,
    }),
    prisma.resource.findMany({
      include: {
        incident: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
    prisma.province.findMany(),
    prisma.incident.count(),
    prisma.resource.count(),
  ]);

  console.log(`✅ Total Incidents: ${incidentCount}`);
  console.log(`✅ Total Resources: ${resourceCount}`);
  console.log(`✅ Total Provinces: ${provinces.length}\n`);

  console.log("📋 Sample Incidents:");
  incidents.forEach((inc) => {
    console.log(
      `  - [${inc.severity}] ${inc.title} (${inc.updates.length} updates, ${inc.resources.length} resources)`
    );
  });

  console.log("\n🚓 Resources:");
  resources.forEach((res) => {
    const assignment = res.incident
      ? `assigned to: ${res.incident.title}`
      : "not assigned";
    console.log(`  - ${res.name} [${res.status}] (${assignment})`);
  });

  console.log("\n🗺️  Provinces:");
  provinces.forEach((prov) => {
    console.log(`  - ${prov.name}: ${prov.status} (${prov.count} incidents)`);
  });

  console.log("\n✨ Database is properly seeded and connected!");
}

checkDatabase()
  .catch((e) => {
    console.error("❌ Error checking database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
