import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPatients, createPatient, Patient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, UserPlus, AlertCircle, Users, Loader2 } from "lucide-react";

export const Route = createFileRoute("/doctor/patients")({ component: PatientsPage });

function PatientsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const { data: patients, isLoading, error } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  const createPatientMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setName("");
      setAge("");
      setBloodGroup("");
      setIsDialogOpen(false);
      toast.success("Patient created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create patient");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age || !bloodGroup.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      toast.error("Please enter a valid age");
      return;
    }
    createPatientMutation.mutate({
      name: name.trim(),
      age: parsedAge,
      blood_group: bloodGroup.trim().toUpperCase(),
    });
  };

  const filteredPatients = patients?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Patients
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage clinic records, track history, and review health metrics.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Patient Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age (Years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  placeholder="e.g. O+, A-, AB+"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createPatientMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createPatientMutation.isPending}>
                  {createPatientMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Record"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name..."
          className="pl-9 w-full sm:max-w-md bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] font-semibold text-muted-foreground">ID</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Age</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Blood Group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="space-y-3 py-6 px-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {error && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-destructive">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-lg">Error connecting to server</span>
                      <span className="text-sm text-muted-foreground max-w-sm">
                        Please verify that the backend FastAPI service is running locally on port 8000.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !error && filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                    <span className="font-medium text-lg">No patient records found</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm ? "Try modifying your search filter." : "Click 'Add Patient' to create the first record."}
                    </p>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !error && filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-xs text-primary font-bold">
                    #{String(patient.id).padStart(4, "0")}
                  </TableCell>
                  <TableCell className="font-medium text-card-foreground">
                    {patient.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{patient.age} yrs</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {patient.blood_group}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}