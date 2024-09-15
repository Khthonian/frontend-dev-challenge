import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import Select from "react-select";
import { UnitType } from "@prisma/client";

interface CreateVoyageSheetProps {
  onSubmit: (data: any) => void;
  unitTypes: UnitType[];
}

const voyageSchema = z
  .object({
    scheduledDeparture: z.string().nonempty("Missing input"),
    scheduledArrival: z.string().nonempty("Missing input"),
    portOfLoading: z.string().nonempty("Missing input"),
    portOfDischarge: z.string().nonempty("Missing input"),
    vessel: z.string().nonempty("Missing input"),
    unitTypes: z
      .array(z.string())
      .min(5, "At least 5 UnitTypes must be selected"),
  })
  .refine(
    (data) =>
      new Date(data.scheduledDeparture) < new Date(data.scheduledArrival),
    {
      message: "Departure must be before arrival",
      path: ["scheduledDeparture"],
    },
  );

const CreateVoyageSheet: React.FC<CreateVoyageSheetProps> = ({
  onSubmit,
  unitTypes,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voyageSchema),
    defaultValues: {
      unitTypes: [],
    },
  });

  const handleFormErrors = (errors: any) => {
    const flattenErrors = (errorObject: any, visited = new Set()) => {
      if (visited.has(errorObject)) {
        return [];
      }
      visited.add(errorObject);

      let messages: string[] = [];

      for (const key in errorObject) {
        const error = errorObject[key];

        if (error?.message) {
          messages.push(error.message);
        }

        if (error?.types) {
          messages = messages.concat(Object.values(error.types));
        }

        if (error && typeof error === "object" && !Array.isArray(error)) {
          messages = messages.concat(flattenErrors(error, visited));
        }
      }

      return messages;
    };

    const errorMessages = flattenErrors(errors);

    errorMessages.forEach((message) => {
      toast({
        title: "Validation Error",
        description: message || "Missing input",
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

          {/* UnitTypes Field */}
          <div className="mt-4">
            <label>Unit Types</label>
            <Controller
              name="unitTypes"
              control={control}
              defaultValue={[]}
              render={({ field }) => {
                const selectedOptions = unitTypes
                  .filter((type) => field.value.includes(type.id))
                  .map((type) => ({
                    value: type.id,
                    label: type.name,
                  }));

                return (
                  <Select
                    isMulti
                    options={unitTypes.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))}
                    placeholder="Select Unit Types"
                    onChange={(selected) => {
                      field.onChange(
                        selected ? selected.map((option) => option.value) : [],
                      );
                    }}
                    value={selectedOptions}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        marginTop: "0.25rem",
                        width: "100%",
                        borderRadius: "0.5rem",
                        borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
                        padding: "0.5rem",
                        boxShadow: state.isFocused
                          ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                          : "none",
                        "&:hover": {
                          borderColor: "#9CA3AF",
                        },
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? "#E5E7EB" : "white",
                        color: "#111827",
                        "&:active": {
                          backgroundColor: "#D1D5DB",
                        },
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: "#E5E7EB",
                        borderRadius: "0.375rem",
                        padding: "0.25rem",
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: "#111827",
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        color: "#6B7280",
                        ":hover": {
                          backgroundColor: "#D1D5DB",
                          color: "#374151",
                        },
                      }),
                    }}
                  />
                );
              }}
            />
          </div>

          <Button variant="outline" type="submit" className="mt-6">
            Submit
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateVoyageSheet;
