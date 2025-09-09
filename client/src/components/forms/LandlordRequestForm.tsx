import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { landlordRequestSchema, type LandlordRequest } from "@shared/schema";
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

export default function LandlordRequestForm() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<LandlordRequest>({
    resolver: zodResolver(landlordRequestSchema),
    defaultValues: {
      type: "landlord",
      fullName: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      requestType: "maintenance",
      preferredDateTime: "",
      accessInstructions: "",
      budgetRange: undefined,
      description: "",
      files: [],
      consent: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: LandlordRequest & { files: File[] }) => {
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

      const response = await fetch('/api/requests/landlord', {
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

  const onSubmit = (data: LandlordRequest) => {
    submitMutation.mutate({ ...data, files } as LandlordRequest & { files: File[] });
  };

  return (
    <div className="bg-card rounded-xl p-8 form-shadow">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Landlord Request Form</h2>
        <p className="text-muted-foreground">Submit your property maintenance request online</p>
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
                      data-testid="input-landlord-fullname"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Company name (optional)" 
                      {...field} 
                      data-testid="input-landlord-company"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      {...field} 
                      data-testid="input-landlord-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      data-testid="input-landlord-phone"
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
                    data-testid="input-landlord-address"
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
                  <FormLabel>Request Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-landlord-request-type">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Repair</SelectItem>
                      <SelectItem value="maintenance">General Maintenance</SelectItem>
                      <SelectItem value="turnover">Turnover</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger data-testid="select-landlord-budget">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="under-500">Under $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="over-5000">Over $5,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="preferredDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Date/Time</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                    data-testid="input-landlord-datetime"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accessInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Instructions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="How can our team access the property? (keys, lockbox, etc.)" 
                    rows={3} 
                    {...field} 
                    data-testid="textarea-landlord-access"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the work needed in detail..." 
                    rows={4} 
                    maxLength={1000} 
                    {...field} 
                    data-testid="textarea-landlord-description"
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
                    data-testid="checkbox-landlord-consent"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-muted-foreground">
                    I confirm I am authorized to request service at this property. *
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={submitMutation.isPending}
            data-testid="button-submit-landlord"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Landlord Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
