"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );
  const data: NominatimResult[] = await response.json();

  if (data.length === 0) {
    throw new Error("Address not found");
  }
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const address = formData.get("address")?.toString();

  if (!address) throw new Error("Enter an Address");

  const { lat, lng }: { lat: number; lng: number } = await geocodeAddress(
    address
  );

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}
