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

// Home component
export default function Home() {
  const {
    data: voyages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["voyages"],
    queryFn: () => fetchData("voyage/getAll"),
  });

  // Initialise the QueryClient for refreshing data after a mutation
  const queryClient = useQueryClient();

  // Define the mutation for creating a new voyage
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
      // Invalidate and refetch voyages to reflect the new data
      await queryClient.invalidateQueries("voyages");
      // Show success toast message
      toast({ title: "Success", description: "Voyage created successfully!" });
    },
    onError: (error) => {
      // Show error toast message on failure
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler for CreateVoyageSheet
  const handleCreateVoyage = (data) => {
    mutation.mutate(data);
  };

  // Handle loading or error states
  if (isLoading) {
    return <div>Loading voyages...</div>;
  }

  if (isError) {
    return <div>Failed to load voyages.</div>;
  }

  return (
    <Layout>
      {/* Create button and form sheet */}
      <CreateVoyageSheet onSubmit={handleCreateVoyage} />

      {/* Table displaying voyages */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Departure</TableHead>
            <TableHead>Arrival</TableHead>
            <TableHead>Port of loading</TableHead>
            <TableHead>Port of discharge</TableHead>
            <TableHead>Vessel</TableHead>
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
                <Button variant="outline">X</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
