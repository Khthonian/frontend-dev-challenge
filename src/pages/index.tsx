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

export default function Home() {
  const {
    data: voyages,
    isLoading: isVoyagesLoading,
    isError: isVoyagesError,
  } = useQuery({
    queryKey: ["voyages"],
    queryFn: () => fetchData("voyage/getAll"),
  });

  const {
    data: unitTypes,
    isLoading: isUnitTypesLoading,
    isError: isUnitTypesError,
  } = useQuery({
    queryKey: ["unitTypes"],
    queryFn: () => fetchData("unitType/getAll"),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newVoyage) => {
      const response = await fetch(`/api/voyage/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoyage),
      });

      if (!response.ok) {
        throw new Error("Failed to create voyage");
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries("voyages");
      toast({ title: "Success", description: "Voyage created successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateVoyage = (data) => {
    mutation.mutate(data);
  };

  if (isVoyagesLoading || isUnitTypesLoading) {
    return <div>Loading data...</div>;
  }

  if (isVoyagesError || isUnitTypesError) {
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
            <TableHead>Port of loading</TableHead>
            <TableHead>Port of discharge</TableHead>
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
                <Button variant="outline">X</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
