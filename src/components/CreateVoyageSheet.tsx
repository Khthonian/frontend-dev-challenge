import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";

// Zod schema for form validation
const voyageSchema = z
  .object({
    scheduledDeparture: z.string().nonempty("Missing input"), // Generic error message for all fields
    scheduledArrival: z.string().nonempty("Missing input"),
    portOfLoading: z.string().nonempty("Missing input"),
    portOfDischarge: z.string().nonempty("Missing input"),
    vessel: z.string().nonempty("Missing input"),
  })
  .refine(
    (data) =>
      new Date(data.scheduledDeparture) < new Date(data.scheduledArrival),
    {
      message: "Departure must be before arrival",
      path: ["scheduledDeparture"],
    },
  );

interface CreateVoyageSheetProps {
  onSubmit: (data: any) => void;
}

const CreateVoyageSheet: React.FC<CreateVoyageSheetProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voyageSchema),
  });

  // Error handler for form submission
  const handleFormErrors = (errors: any) => {
    // Iterate over all validation errors and show a generic "Missing input" toast for each one
    Object.values(errors).forEach(() => {
      toast({
        title: "Validation Error",
        description: "Missing input",
        variant: "destructive",
      });
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="creation">Create</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create a Voyage</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit, handleFormErrors)}>
          <div>
            <label>Scheduled Departure</label>
            <input
              type="datetime-local"
              {...register("scheduledDeparture")}
              className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label>Scheduled Arrival</label>
            <input
              type="datetime-local"
              {...register("scheduledArrival")}
              className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label>Port of Loading</label>
            <input
              {...register("portOfLoading")}
              className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label>Port of Discharge</label>
            <input
              {...register("portOfDischarge")}
              className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label>Vessel</label>
            <input
              {...register("vessel")}
              className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" className="mt-6">
            Submit
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateVoyageSheet;
