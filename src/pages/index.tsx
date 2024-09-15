// pages/index.tsx

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "~/utils";
import { toast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Layout from "~/components/layout";
import CreateVoyageSheet from "~/components/CreateVoyageSheet";
import UnitTypesPopover from "~/components/UnitTypesPopover";
import { Voyage, Vessel, UnitType } from "@prisma/client";

type VoyageWithDetails = Voyage & {
  vessel: Vessel;
  unitTypes: UnitType[];
};

export default function Home() {
  const queryClient = useQueryClient();

  const {
    data: voyages,
    isLoading: isVoyagesLoading,
    isError: isVoyagesError,
    error: voyagesError,
  } = useQuery<VoyageWithDetails[]>({
    queryKey: ["voyages"],
    queryFn: () => fetchData<VoyageWithDetails[]>("voyage/getAll"),
  });

  const {
    data: unitTypes,
    isLoading: isUnitTypesLoading,
    isError: isUnitTypesError,
    error: unitTypesError,
  } = useQuery<UnitType[]>({
    queryKey: ["unitTypes"],
    queryFn: () => fetchData<UnitType[]>("unitType/getAll"),
  });

  const createMutation = useMutation({
    mutationFn: async (newVoyage: any) => {
      const response = await fetch(`/api/voyage/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoyage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create voyage");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["voyages"]);
      toast({ title: "Success", description: "Voyage created successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create voyage",
        variant: "destructive",
      });
    },
  });

  const handleCreateVoyage = (data: any) => {
    createMutation.mutate(data);
  };

  const deleteMutation = useMutation({
    mutationFn: async (voyageId: string) => {
      const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete voyage`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["voyages"]);
      toast({ title: "Success", description: "Voyage deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete voyage",
        variant: "destructive",
      });
    },
  });

  const handleDeleteVoyage = (voyageId: string) => {
    deleteMutation.mutate(voyageId);
  };

  if (isVoyagesLoading || isUnitTypesLoading) {
    return <div>Loading data...</div>;
  }

  if (isVoyagesError || isUnitTypesError) {
    console.error("Error fetching data:", voyagesError || unitTypesError);
    return <div>Failed to load data.</div>;
  }

  return (
    <Layout>
      {/* Pass unitTypes as props to CreateVoyageSheet */}
      <CreateVoyageSheet onSubmit={handleCreateVoyage} unitTypes={unitTypes} />

      {/* Table displaying voyages */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Departure</TableHead>
            <TableHead>Arrival</TableHead>
            <TableHead>Port of Loading</TableHead>
            <TableHead>Port of Discharge</TableHead>
            <TableHead>Vessel</TableHead>
            <TableHead>Unit Types</TableHead>
            <TableHead>&nbsp;</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {voyages?.map((voyage) => (
            <TableRow key={voyage.id}>
              <TableCell>
                {new Date(voyage.scheduledDeparture).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(voyage.scheduledArrival).toLocaleString()}
              </TableCell>
              <TableCell>{voyage.portOfLoading}</TableCell>
              <TableCell>{voyage.portOfDischarge}</TableCell>
              <TableCell>{voyage.vessel.name}</TableCell>
              <TableCell>
                <UnitTypesPopover unitTypes={voyage.unitTypes} />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteVoyage(voyage.id)}
                  disabled={deleteMutation.isLoading}
                >
                  X
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
