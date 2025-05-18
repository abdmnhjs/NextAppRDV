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
import { useRouter } from "next/navigation";
import { Appointment, Availability } from "@/app/types/types";

const FormSchema = z.object({
  doa: z.date({
    required_error: "A date of appointment is required",
  }),
  duration: z.string({
    required_error: "A duration is required",
  }),
});

type Props = {
  days: string[];
  durations: Availability[];
  clientUsername: string;
  consultantUsername: string;
  appointments: Appointment[];
};

export function CalendarClientForm({
  days,
  durations,
  clientUsername,
  consultantUsername,
  appointments,
}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const getFilteredDurations = () => {
    const selectedDate = form.watch("doa");
    if (!selectedDate) return durations;

    const selectedDay = format(selectedDate, "EEEE");
    return durations.filter((duration) => duration.day === selectedDay);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const selectedDuration = durations[parseInt(data.duration)];

      if (!selectedDuration) {
        throw new Error("Invalid duration selected");
      }

      if (selectedDuration.includePayment) {
        // Format the date
        const formattedDate = format(data.doa, "yyyy-MM-dd");

        // Store complete data
        const pendingData = {
          selectedDuration: {
            ...selectedDuration,
            availabilityId: selectedDuration.id,
          },
          date: formattedDate,
        };

        sessionStorage.setItem("pendingData", JSON.stringify(pendingData));

        router.push(`/client/${consultantUsername}/${selectedDuration.price}`);
        return;
      }

      const formattedDate = format(data.doa, "yyyy-MM-dd");

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultantUsername,
          clientUsername,
          availabilityId: selectedDuration.id,
          date: formattedDate,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            responseData.error ||
            "Failed to create appointment"
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }

  const isDateAllowed = (date: Date) => {
    const weekday = format(date, "EEEE");
    const selectedDuration = form.watch("duration");

    if (!days.includes(weekday)) {
      return false;
    }

    const dateStr = format(date, "yyyy-MM-dd");
    const isDateBooked = appointments.some((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return format(appointmentDate, "yyyy-MM-dd") === dateStr;
    });

    if (isDateBooked) {
      return false;
    }

    if (selectedDuration) {
      const duration = durations[parseInt(selectedDuration)];
      return durations.some(
        (d) =>
          d.day === weekday &&
          d.startHour === duration.startHour &&
          d.startMinutes === duration.startMinutes &&
          d.endHour === duration.endHour &&
          d.endMinutes === duration.endMinutes
      );
    }

    return true;
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
                        format(field.value, "dd/MM/yyyy")
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.watch("doa")}
              >
                <FormControl>
                  <SelectTrigger className="w-[180px] text-white">
                    <SelectValue
                      placeholder={
                        form.watch("doa")
                          ? "Select a time slot"
                          : "Select a date first"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#1A1A1A]">
                  {getFilteredDurations().map((duration, index) => (
                    <SelectItem
                      className="text-white"
                      key={index}
                      value={String(durations.indexOf(duration))}
                    >
                      {String(duration.startHour).padStart(2, "0")}h
                      {String(duration.startMinutes).padStart(2, "0")} -{" "}
                      {String(duration.endHour).padStart(2, "0")}h
                      {String(duration.endMinutes).padStart(2, "0")}{" "}
                      {duration.includePayment
                        ? " " + "(" + String(duration.price) + " €)"
                        : " (Free)"}
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
          disabled={!form.watch("doa") || !form.watch("duration")}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
