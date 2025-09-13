import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function TripsPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-800 text-xl">
        Please Sign In
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/trips/new">
          <Button> New Trip </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {session.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {trips.length == 0
              ? "Start Planning your First Trip By Clicking The Button Above"
              : `You Have ${trips.length} ${
                  trips.length == 1 ? "Trip " : "Trips"
                } Planned  ${
                  upcomingTrips.length > 0
                    ? `${upcomingTrips.length} upcoming.`
                    : ""
                } `}
          </p>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-xl">Your Recent Tips</h2>
        {trips.length == 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl font-medium mb-2">No Trips Yet.</h3>
              <p className="text-center mb-4 max-w-md">
                Start Planning Your Adventure By Creating Your First Trip.
              </p>
              <Link href="/trips/new">
                <Button> Create Trip </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {sortedTrips.slice(0, 6).map((trip, key) => (
              <Link key={key} href={`/trips/${trip.id}`}>
                <Card className="h-full hover:shadow-md transition:shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">{trip.description}</p>
                    <div className="text-sm">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
