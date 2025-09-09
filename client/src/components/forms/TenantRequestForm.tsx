import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tenantRequestSchema, type TenantRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "./FileUpload";

export default function TenantRequestForm() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<TenantRequest>({
    resolver: zodResolver(tenantRequestSchema),
    defaultValues: {
      type: "tenant",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      unit: "",
      requestType: "maintenance",
      entryPermission: "yes-scheduled",
      description: "",
      files: [],
      consent: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: TenantRequest & { files: File[] }) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'files' && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Add files
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/requests/tenant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Submission failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Request Submitted Successfully!",
        description: `Your ticket ID is: ${data.ticketId}. You will receive a confirmation email shortly.`,
      });
      form.reset();
      setFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TenantRequest) => {
    submitMutation.mutate({ ...data, files } as TenantRequest & { files: File[] });
  };

  return (
    <div className="bg-card rounded-xl p-8 form-shadow">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Tenant Request Form</h2>
        <p className="text-muted-foreground">Report maintenance issues for your unit</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      {...field} 
                      data-testid="input-tenant-fullname"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      {...field} 
                      data-testid="input-tenant-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(204) 123-4567" 
                      {...field} 
                      data-testid="input-tenant-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit/Apartment # *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Unit or apartment number" 
                      {...field} 
                      data-testid="input-tenant-unit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Address *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Full property address" 
                    {...field} 
                    data-testid="input-tenant-address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-tenant-request-type">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Repair</SelectItem>
                      <SelectItem value="plumbing">Plumbing Issue</SelectItem>
                      <SelectItem value="electrical">Electrical Issue</SelectItem>
                      <SelectItem value="heating">Heating/Cooling</SelectItem>
                      <SelectItem value="appliance">Appliance Repair</SelectItem>
                      <SelectItem value="maintenance">General Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="entryPermission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission to Enter *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-tenant-entry-permission">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes-anytime">Yes, anytime during business hours</SelectItem>
                      <SelectItem value="yes-scheduled">Yes, with scheduled appointment</SelectItem>
                      <SelectItem value="emergency-only">Emergency access only</SelectItem>
                      <SelectItem value="no">No, I will be present</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the issue in detail..." 
                    rows={4} 
                    maxLength={1000} 
                    {...field} 
                    data-testid="textarea-tenant-description"
                  />
                </FormControl>
                <FormDescription>Maximum 1000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              File Uploads
            </Label>
            <FileUpload 
              onFilesChange={setFiles} 
              maxFiles={3} 
              maxSizeMB={10}
            />
          </div>

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-tenant-consent"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-muted-foreground">
                    I confirm this request is accurate and authorize contact regarding this issue. *
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90" 
            size="lg"
            disabled={submitMutation.isPending}
            data-testid="button-submit-tenant"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Tenant Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
