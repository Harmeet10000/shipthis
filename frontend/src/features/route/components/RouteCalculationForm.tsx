import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouteStore } from "../store/routeStore";
import { routeApi } from "../services/routeApi";
import { geocodePlace } from "../services/geocodingService";
import type { RouteCalculationRequest } from "../types/route.types";

/**
 * Validation schema for route calculation form
 * Ensures origin and destination are non-empty strings
 */
const routeCalculationSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  transport_mode: z.enum(["land", "sea", "air"], {
    errorMap: () => ({ message: "Please select a transport mode" }),
  }),
  cargo_weight_kg: z
    .number({ invalid_type_error: "Cargo weight must be a number" })
    .positive("Cargo weight must be greater than 0"),
});

type RouteCalculationFormData = z.infer<typeof routeCalculationSchema>;


export function RouteCalculationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RouteCalculationFormData>({
    resolver: zodResolver(routeCalculationSchema),
    defaultValues: {
      origin: "",
      destination: "",
      transport_mode: "land",
      cargo_weight_kg: 100,
    },
  });

  const { isLoading, error, setLoading, setError, setRoutes } = useRouteStore();

  /**
   * Handle form submission
   * Validates inputs, geocodes locations, and calls route calculation API
   */
  const onSubmit = async (data: RouteCalculationFormData) => {
    try {
      // Set loading state
      setLoading(true);
      setError(null);

      // Geocode origin and destination to get coordinates
      const [originPoint, destinationPoint] = await Promise.all([
        geocodePlace(data.origin.trim()),
        geocodePlace(data.destination.trim()),
      ]);

      // Prepare request data with geocoded coordinates
      const requestData: RouteCalculationRequest = {
        origin: originPoint,
        destination: destinationPoint,
        cargo_weight_kg: data.cargo_weight_kg,
        transport_mode: data.transport_mode,
      };

      // Call API
      const response = await routeApi.calculateRoutes(requestData);

      // Update store with route data
      setRoutes(response);
    } catch (err: any) {
      // Set error state with specific geocoding error messages
      let errorMessage = "Failed to calculate routes. Please try again.";

      if (err.message) {
        if (err.message.includes("Place not found")) {
          errorMessage =
            err.message + ". Please check the location name and try again.";
        } else if (err.message.includes("Geocoding API error")) {
          errorMessage =
            "Failed to find location coordinates. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    }
  };

  /**
   * Handle retry button click
   * Clears error state to allow form resubmission
   */
  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Calculate Route</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Origin Input */}
        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            type="text"
            placeholder="Enter origin location"
            {...register("origin")}
            disabled={isLoading}
            aria-invalid={errors.origin ? "true" : "false"}
          />
          {errors.origin && (
            <p className="text-sm text-destructive" role="alert">
              {errors.origin.message}
            </p>
          )}
        </div>

        {/* Destination Input */}
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            type="text"
            placeholder="Enter destination location"
            {...register("destination")}
            disabled={isLoading}
            aria-invalid={errors.destination ? "true" : "false"}
          />
          {errors.destination && (
            <p className="text-sm text-destructive" role="alert">
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Transport Mode Select */}
        <div className="space-y-2">
          <Label htmlFor="transport_mode">Transport Mode</Label>
          <Select
            onValueChange={(value: string) =>
              setValue("transport_mode", value as "land" | "sea" | "air")
            }
            defaultValue="land"
            disabled={isLoading}
          >
            <SelectTrigger id="transport_mode">
              <SelectValue placeholder="Select transport mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="sea">Sea</SelectItem>
              <SelectItem value="air">Air</SelectItem>
            </SelectContent>
          </Select>
          {errors.transport_mode && (
            <p className="text-sm text-destructive" role="alert">
              {errors.transport_mode.message}
            </p>
          )}
        </div>

        {/* Cargo Weight Input (Required) */}
        <div className="space-y-2">
          <Label htmlFor="cargo_weight_kg">Cargo Weight (kg)</Label>
          <Input
            id="cargo_weight_kg"
            type="number"
            placeholder="Enter cargo weight"
            {...register("cargo_weight_kg", { valueAsNumber: true })}
            disabled={isLoading}
            min="0.1"
            step="0.1"
            aria-invalid={errors.cargo_weight_kg ? "true" : "false"}
          />
          {errors.cargo_weight_kg && (
            <p className="text-sm text-destructive" role="alert">
              {errors.cargo_weight_kg.message}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate Routes"
            )}
          </Button>

          {/* Retry Button (shown after error) */}
          {error && !isLoading && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRetry}
              className="flex-shrink-0"
            >
              Retry
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
