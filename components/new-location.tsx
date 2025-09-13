"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { addLocation } from "@/lib/add-location";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransiton] = useTransition();
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 ">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            Add New Location
          </h1>
          <form
            action={(formData: FormData) =>
              startTransiton(() => addLocation(formData, tripId))
            }
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                name="address"
                type="text"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-6 hover:cursor-pointer"
            >
              {isPending ? "Adding..." : "Add Location"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
