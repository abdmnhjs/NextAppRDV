"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  doa: z.date({
    required_error: "A date of appointment is required",
  }),
  duration: z.string({
    required_error: "A duration is required",
  }),
});

type ConsultancyDuration = {
  startHour: number;
  startMinutes: number;
  endHour: number;
  endMinutes: number;
  availabilityId: number;
};

type Props = {
  days: string[];
  durations: ConsultancyDuration[];
  clientUsername: string;
  consultantUsername: string;
};

export function CalendarClientForm({
  days,
  durations,
  clientUsername,
  consultantUsername,
}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const selectedDuration = durations[parseInt(data.duration)];

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultantUsername,
          clientUsername,
          availabilityId: selectedDuration.availabilityId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create appointment: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      console.log("Appointment created:", result);
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  }

  const isDateAllowed = (date: Date) => {
    const weekday = format(date, "EEEE");
    return days.includes(weekday);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="doa"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white font-bold">
                Date of your future appointment
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      !isDateAllowed(date) || date < new Date()
                    }
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-bold">
                Choose a time that works for you
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px] text-white">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#1A1A1A]">
                  {durations.map((duration, index) => (
                    <SelectItem
                      className="text-white"
                      key={index}
                      value={String(index)}
                    >
                      {String(duration.startHour).padStart(2, "0")}h
                      {String(duration.startMinutes).padStart(2, "0")} -{" "}
                      {String(duration.endHour).padStart(2, "0")}h
                      {String(duration.endMinutes).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="cursor-pointer bg-white text-black hover:bg-gray-200/90"
          size="lg"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
