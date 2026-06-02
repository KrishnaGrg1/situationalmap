import "dotenv/config";

import { incidents, resources, provinces } from "../src/lib/data";
import { prisma } from "#/lib/prisma";


async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  await prisma.incidentUpdate.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.incident.deleteMany({});
  await prisma.province.deleteMany({});

  console.log("Cleared existing data");

  // Seed provinces
  for (const province of provinces) {
    await prisma.province.create({
      data: {
        name: province.name,
        status: province.status.toUpperCase() as "ACTIVE" | "MONITORING" | "NORMAL",
        count: province.count,
      },
    });
  }
  console.log(`Seeded ${provinces.length} provinces`);

  // Seed incidents with updates (but without resources first)
  // Create a mapping from old IDs to new IDs
  const incidentIdMap = new Map<number, number>();
  for (const incident of incidents) {
    const created = await prisma.incident.create({
      data: {
        title: incident.title,
        severity: incident.severity.toUpperCase() as any,
        category: incident.category.toUpperCase() as any,
        district: incident.district,
        time: incident.time,
        description: incident.desc,
        officers: incident.officers,
        peopleAffected: incident.peopleAffected,
        latitude: incident.coordinates.lat,
        longitude: incident.coordinates.lng,
        status: incident.status.toUpperCase() as any,
        updates: {
          create: incident.updates.map((update) => ({
            user: update.user,
            text: update.text,
            time: update.time,
          })),
        },
      },
    });
    incidentIdMap.set(incident.id, created.id);
  }
  console.log(`Seeded ${incidents.length} incidents with updates`);

  // Seed resources - map old incident IDs to new ones
  for (const resource of resources) {
    const newIncidentId = resource.assignedTo ? incidentIdMap.get(resource.assignedTo) : null;

    await prisma.resource.create({
      data: {
        name: resource.name,
        type: resource.type.toUpperCase() as any,
        officers: resource.officers,
        vehicle: resource.vehicle,
        status: resource.status.toUpperCase() as any,
        assignedTo: newIncidentId ?? null,
      },
    });
  }
  console.log(`Seeded ${resources.length} resources`);

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
