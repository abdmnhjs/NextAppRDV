"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Liste des jours de la semaine
const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const formSchema = z.object({
  startHour: z.coerce.number().min(0).max(23),
  startMinutes: z.coerce.number().min(0).max(59),
  endHour: z.coerce.number().min(0).max(23),
  endMinutes: z.coerce.number().min(0).max(59),
  day: z.enum(weekDays),
  includePayment: z.boolean(),
  price: z.coerce.number().min(0).optional(),
});

type Availability = z.infer<typeof formSchema>;

export function AvailabilityPicker({
  onSubmit,
}: {
  onSubmit: (data: Availability) => void;
}) {
  const form = useForm<Availability>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startHour: 9,
      startMinutes: 0,
      endHour: 10,
      endMinutes: 0,
      day: "Monday",
      includePayment: false,
      price: 0,
    },
  });

  function handleSubmit(values: Availability) {
    onSubmit(values);
  }

  const includePayment = form.watch("includePayment");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Start Hour */}
        <FormField
          control={form.control}
          name="startHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Hour</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={23}
                  placeholder="9"
                  value={field.value || 0}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormDescription>Between 0 and 23</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Minutes */}
        <FormField
          control={form.control}
          name="startMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Minutes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="0"
                  value={field.value || 0}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormDescription>Between 0 and 59</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Hour */}
        <FormField
          control={form.control}
          name="endHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Hour</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={23}
                  placeholder="10"
                  value={field.value || 0}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormDescription>Between 0 and 23</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Minutes */}
        <FormField
          control={form.control}
          name="endMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Minutes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="0"
                  value={field.value || 0}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormDescription>Between 0 and 59</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Day Selection */}
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {weekDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="includePayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Include payment</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {includePayment && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseFloat(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="cursor-pointer bg-white text-black hover:bg-gray-200/90"
            size="lg"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
