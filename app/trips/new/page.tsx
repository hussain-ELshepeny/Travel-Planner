"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { createTrip } from "@/lib/create-trip";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
export default function NewTrip() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>NewTrip</CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(FormData: FormData) => {
              if (imageUrl) {
                FormData.append("imageUrl", imageUrl);
              }
              startTransition(() => {
                createTrip(FormData);
              });
            }}
          >
            <div>
              <label className="block txt-sm font-medium text-grey-700">
                Title
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="Japan trip..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2 ",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              />
            </div>
            <div>
              <label className="block txt-sm font-medium text-grey-700">
                Description
              </label>
              <textarea
                required
                name="description"
                placeholder="Trip description..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2 ",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block txt-sm font-medium text-grey-700">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  name="startDate"
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2 ",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
              </div>
              <div>
                <label className="block txt-sm font-medium text-grey-700">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  name="endDate"
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2 ",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
              </div>
            </div>
            <div>
              <label> Trip Image </label>
              {imageUrl && (
                <Image
                  width={300}
                  height={100}
                  src={imageUrl}
                  alt="Trip Preview"
                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                />
              )}
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0].ufsUrl) {
                    setImageUrl(res[0].ufsUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.log("Upload Error: ", error);
                }}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating... " : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
