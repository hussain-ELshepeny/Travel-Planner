import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TripDetailClient from // TripWithLocation,
"@/components/ui/trip-detail";
export default async function TripDetail({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const session = await auth();

  if (!session) return <div>Please Sign in.</div>;

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user?.id },
    include: { locations: true },
  });

  if (!trip) {
    return <div>Trip not Found</div>;
  }
  return <TripDetailClient trip={trip} />;
}
